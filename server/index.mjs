import http from 'node:http';
import crypto from 'node:crypto';
import AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.6';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const dimensions = ['problem', 'market', 'differentiation', 'business', 'execution', 'customer', 'founder', 'risk'];
const MAX_BODY_BYTES = 12 * 1024 * 1024;
const MAX_DOCUMENT_CHARS = 50000;
const payments = new Map();
const processedWebhookEvents = new Set();
const xmlParser = new XMLParser({ ignoreAttributes: true, removeNSPrefix: true });

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, x-razorpay-signature, x-razorpay-event-id', 'access-control-allow-methods': 'GET,POST,OPTIONS' });
  res.end(JSON.stringify(body));
};

const readRaw = async (req) => {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('Request too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const readJson = async (req) => {
  const raw = await readRaw(req);
  return raw.length ? JSON.parse(raw.toString('utf8')) : {};
};

const extractJson = (text) => {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  return JSON.parse(fenced?.[1] || text);
};

async function callModel(instruction, input) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: OPENAI_MODEL, input: `${instruction}\n\nINPUT:\n${JSON.stringify(input)}`, text: { format: { type: 'json_object' } } }),
  });
  if (!response.ok) throw new Error(`Model request failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || '').join('') || '';
  return extractJson(text);
}

function cleanText(text) {
  return String(text || '').replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_DOCUMENT_CHARS);
}

function pptxText(buffer) {
  const zip = new AdmZip(buffer);
  const parts = zip.getEntries().filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName));
  return parts.map((entry) => {
    const parsed = xmlParser.parse(entry.getData().toString('utf8'));
    const texts = [];
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      for (const [key, value] of Object.entries(node)) {
        if (key === 't' && typeof value === 'string') texts.push(value);
        else if (Array.isArray(value)) value.forEach(walk);
        else walk(value);
      }
    };
    walk(parsed);
    return texts.join(' ');
  }).join('\n');
}

async function extractDocument(asset) {
  const { name = 'document', mimeType = '', dataBase64 = '' } = asset || {};
  if (!dataBase64) return { name, text: '', warning: 'No file bytes supplied' };
  const buffer = Buffer.from(dataBase64, 'base64');
  if (buffer.length > 10 * 1024 * 1024) return { name, text: '', warning: 'File exceeds 10 MB limit' };
  const lower = name.toLowerCase();
  try {
    if (mimeType === 'application/pdf' || lower.endsWith('.pdf')) return { name, text: cleanText((await pdfParse(buffer)).text) };
    if (mimeType.includes('wordprocessingml') || lower.endsWith('.docx')) return { name, text: cleanText((await mammoth.extractRawText({ buffer })).value) };
    if (mimeType.includes('presentationml') || lower.endsWith('.pptx')) return { name, text: cleanText(pptxText(buffer)) };
    if (mimeType.startsWith('text/') || /\.(txt|md|csv|json)$/i.test(lower)) return { name, text: cleanText(buffer.toString('utf8')) };
    return { name, text: '', warning: 'Unsupported file type; provide PDF, DOCX, PPTX, TXT, MD, CSV, or JSON' };
  } catch (error) {
    return { name, text: '', warning: `Extraction failed: ${error.message}` };
  }
}

async function marketResearch(query) {
  if (!TAVILY_API_KEY) return { mode: 'not_configured', results: [], note: 'Connect TAVILY_API_KEY to enable live market research.' };
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ api_key: TAVILY_API_KEY, query, search_depth: 'advanced', max_results: 8, include_answer: true, include_raw_content: false }),
  });
  if (!response.ok) throw new Error(`Market search failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  return { mode: 'live', answer: data.answer || '', results: (data.results || []).map((r) => ({ title: r.title, url: r.url, content: String(r.content || '').slice(0, 3000), score: r.score })) };
}

function razorpayAuth() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) throw new Error('Razorpay server credentials are not configured');
  return `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`;
}

async function createRazorpayOrder(amount, receipt) {
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST', headers: { authorization: razorpayAuth(), 'content-type': 'application/json' },
    body: JSON.stringify({ amount, currency: 'INR', receipt, notes: { product: 'SparkHub Idea-to-IPO report' } }),
  });
  if (!response.ok) throw new Error(`Razorpay order failed: ${response.status} ${await response.text()}`);
  return response.json();
}

function verifyPaymentSignature(orderId, paymentId, signature) {
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
}

function verifyWebhook(raw, signature) {
  if (!RAZORPAY_WEBHOOK_SECRET) throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured');
  const expected = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
}

const questionPrompt = `You are the Idea-to-IPO assessment designer. Generate exactly 9 personalized questions from the user's idea, problem, customer context, and uploaded-document text. Challenge assumptions, evidence, contradictions, market understanding, differentiation, business model, execution, and risk. Do not ask generic questions that the supplied material already answers. Each question must be answerable in 60 seconds. Return JSON only: {"questions":[{"id":"q1","prompt":"...","dimension":"problem|market|differentiation|business|execution|customer|founder|risk"}]}.`;
const evaluationPrompt = `You are the Idea-to-IPO evaluation engine. Evaluate the founder's 9 answers in context. Score each answer and the overall idea using evidence, specificity, consistency, reasoning, market awareness, and feasibility. Do not invent market facts. Use the supplied marketResearch results as external evidence and cite URLs in marketEvidence. Return JSON only with overallScore, dimensions (8 scores), answerScores, teaser (exactly 2 lines), lockedFindings, blueprint, risks, opportunities, and marketEvidence. Scores are 0-100.`;

const fallbackQuestions = (idea) => [['problem', `What specific customer pain makes ${idea || 'your idea'} worth paying for today?`], ['customer', 'What evidence do you have that your target customer will actually adopt this solution?'], ['differentiation', 'Which existing alternative would customers use instead, and why would they switch?'], ['business', 'What is the strongest assumption in your business model right now?'], ['differentiation', 'Why is your proposed solution meaningfully different from what already exists?'], ['market', 'How will you acquire your first 10 customers without relying on broad advertising?'], ['execution', 'What part of your plan is hardest to execute with your current team or resources?'], ['risk', 'What would make this market much smaller than you currently expect?'], ['execution', 'What is the single experiment you would run next to prove or disprove your idea?']].map(([dimension, prompt], index) => ({ id: `q${index + 1}`, prompt, dimension }));
const fallbackEvaluation = (answers) => { const scored = answers.map((a) => ({ questionId: a.questionId, score: Math.max(35, Math.min(92, 45 + Math.round((a.answer || '').trim().length / 12))), rationale: 'Prototype score; connect the production evaluator before using this result for decisions.' })); const overallScore = scored.length ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : 0; return { overallScore, dimensions: Object.fromEntries(dimensions.map((d) => [d, overallScore])), answerScores: scored, teaser: ['Your idea has been evaluated across the core Idea-to-IPO dimensions.', 'The full analysis identifies the assumptions and market questions that deserve your attention next.'], lockedFindings: ['Production market research or AI evaluation is not connected yet.'], blueprint: ['Validate the strongest customer assumption with real users.', 'Test the most important commercial assumption before scaling.'], risks: ['Current result uses prototype scoring until the AI evaluator is configured.'], opportunities: [], marketEvidence: [] }; };

const routes = {
  'POST /documents/extract': async (body) => {
    const assets = Array.isArray(body.documents) ? body.documents : [];
    const extracted = [];
    for (const asset of assets.slice(0, 8)) extracted.push(await extractDocument(asset));
    return { status: 200, body: { documents: extracted, combinedText: extracted.map((d) => `DOCUMENT: ${d.name}\n${d.text}`).join('\n\n').slice(0, MAX_DOCUMENT_CHARS * 2) } };
  },
  'POST /market/research': async (body) => ({ status: 200, body: await marketResearch(body.query || '') }),
  'POST /assessment/questions': async (body) => {
    try { const result = await callModel(questionPrompt, body); if (!Array.isArray(result.questions) || result.questions.length !== 9) throw new Error('Invalid question set'); return { status: 200, body: { ...result, questions: result.questions.slice(0, 9).map((q, i) => ({ id: q.id || `q${i + 1}`, prompt: q.prompt, dimension: dimensions.includes(q.dimension) ? q.dimension : 'risk' })) } }; }
    catch (error) { return { status: 200, body: { questions: fallbackQuestions(body.idea), mode: 'prototype', warning: error.message } }; }
  },
  'POST /assessment/evaluate': async (body) => {
    try {
      const marketQuery = body.marketQuery || `${body.context?.idea || ''} competitors market alternatives pricing customer demand`;
      const market = await marketResearch(marketQuery);
      const result = await callModel(evaluationPrompt, { ...body, marketResearch: market });
      return { status: 200, body: { ...result, marketResearch: market } };
    } catch (error) { return { status: 200, body: { ...fallbackEvaluation(body.answers || []), mode: 'prototype', warning: error.message } }; }
  },
  'POST /payments/order': async (body) => {
    if (Number(body.amountInr || 199) !== 199) return { status: 400, body: { error: 'Only the ₹199 report unlock is configured.' } };
    const receipt = `sparkhub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const order = await createRazorpayOrder(19900, receipt);
    payments.set(order.id, { status: 'created', evaluationId: body.evaluationId || null });
    return { status: 200, body: { keyId: RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency, receipt } };
  },
  'POST /payments/verify': async (body) => {
    if (!verifyPaymentSignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)) return { status: 400, body: { error: 'Invalid payment signature' } };
    const record = payments.get(body.razorpay_order_id);
    if (!record) return { status: 404, body: { error: 'Unknown order' } };
    record.status = 'paid'; record.paymentId = body.razorpay_payment_id;
    return { status: 200, body: { verified: true, unlocked: true, evaluationId: record.evaluationId } };
  },
  'POST /payments/webhook': async (body, meta) => {
    const eventId = meta.headers['x-razorpay-event-id'];
    if (eventId && processedWebhookEvents.has(eventId)) return { status: 200, body: { ok: true, duplicate: true } };
    if (!verifyWebhook(meta.rawBody, meta.headers['x-razorpay-signature'])) return { status: 400, body: { error: 'Invalid webhook signature' } };
    if (eventId) processedWebhookEvents.add(eventId);
    if (body.event === 'order.paid') {
      const orderId = body.payload?.order?.entity?.id;
      const record = payments.get(orderId);
      if (record) record.status = 'paid';
    }
    return { status: 200, body: { ok: true } };
  },
  'GET /health': async () => ({ status: 200, body: { ok: true, service: 'sparkhub-server', features: { documents: true, marketResearch: Boolean(TAVILY_API_KEY), payments: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) } } }),
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const key = `${req.method} ${url.pathname}`;
  const handler = routes[key];
  if (!handler) return send(res, 404, { error: 'Not found' });
  try {
    let body = {};
    let rawBody = Buffer.alloc(0);
    if (req.method === 'POST') { rawBody = await readRaw(req); body = rawBody.length ? JSON.parse(rawBody.toString('utf8')) : {}; }
    const result = await handler(body, { rawBody, headers: req.headers });
    return send(res, result.status, result.body);
  } catch (error) { return send(res, 500, { error: error.message }); }
});
server.listen(PORT, () => console.log(`SparkHub server listening on :${PORT}`));
