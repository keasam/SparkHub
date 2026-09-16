import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.6';

const dimensions = ['problem', 'market', 'differentiation', 'business', 'execution', 'customer', 'founder', 'risk'];

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' });
  res.end(JSON.stringify(body));
};

const readJson = async (req) => {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
};

const extractJson = (text) => {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] || text;
  return JSON.parse(candidate);
};

async function callModel(instruction, input) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: `${instruction}\n\nINPUT:\n${JSON.stringify(input)}`,
      text: { format: { type: 'json_object' } },
    }),
  });
  if (!response.ok) throw new Error(`Model request failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || '').join('') || '';
  return extractJson(text);
}

const questionPrompt = `You are the Idea-to-IPO assessment designer. Generate exactly 9 personalized questions from the user's idea, problem, customer context, and uploaded-document text. Questions must challenge assumptions, evidence, contradictions, market understanding, differentiation, business model, execution, and risk. Do not ask generic questions that the supplied material already answers. Each question must be answerable in 60 seconds. Return JSON only: {"questions":[{"id":"q1","prompt":"...","dimension":"problem|market|differentiation|business|execution|customer|founder|risk"}]} .`;

const evaluationPrompt = `You are the Idea-to-IPO evaluation engine. Evaluate the founder's 9 answers in the context of their submitted idea and documents. Score each answer and the overall idea using evidence, specificity, consistency, reasoning, market awareness, and feasibility. Do not invent market facts. Clearly separate user-provided claims from external market evidence. Return JSON only with: {"overallScore":0,"dimensions":{"problem":0,"market":0,"differentiation":0,"business":0,"execution":0,"customer":0,"founder":0,"risk":0},"answerScores":[{"questionId":"q1","score":0,"rationale":""}],"teaser":["line 1","line 2"],"lockedFindings":["..."],"blueprint":["..."],"risks":["..."],"opportunities":["..."],"marketEvidence":[{"claim":"","source":"","note":""}]}. Scores are 0-100. The teaser must be useful and intriguing without revealing the full report.`;

const fallbackQuestions = (idea) => [
  ['problem', `What specific customer pain makes ${idea || 'your idea'} worth paying for today?`],
  ['customer', 'What evidence do you have that your target customer will actually adopt this solution?'],
  ['differentiation', 'Which existing alternative would customers use instead, and why would they switch?'],
  ['business', 'What is the strongest assumption in your business model right now?'],
  ['differentiation', 'Why is your proposed solution meaningfully different from what already exists?'],
  ['market', 'How will you acquire your first 10 customers without relying on broad advertising?'],
  ['execution', 'What part of your plan is hardest to execute with your current team or resources?'],
  ['risk', 'What would make this market much smaller than you currently expect?'],
  ['execution', 'What is the single experiment you would run next to prove or disprove your idea?'],
].map(([dimension, prompt], index) => ({ id: `q${index + 1}`, prompt, dimension }));

const fallbackEvaluation = (answers) => {
  const scored = answers.map((answer) => ({ questionId: answer.questionId, score: Math.max(35, Math.min(92, 45 + Math.round((answer.answer || '').trim().length / 12))), rationale: 'Prototype score. Connect the production evaluator before using this result for decisions.' }));
  const overallScore = scored.length ? Math.round(scored.reduce((sum, item) => sum + item.score, 0) / scored.length) : 0;
  return {
    overallScore,
    dimensions: { problem: overallScore, market: overallScore, differentiation: overallScore, business: overallScore, execution: overallScore, customer: overallScore, founder: overallScore, risk: overallScore },
    answerScores: scored,
    teaser: ['Your idea has been evaluated across the core Idea-to-IPO dimensions.', 'The full analysis identifies the assumptions and market questions that deserve your attention next.'],
    lockedFindings: ['Production market research is not connected yet.'],
    blueprint: ['Validate the strongest customer assumption with real users.', 'Test the most important commercial assumption before scaling.'],
    risks: ['Current result uses prototype scoring until the AI evaluator is configured.'],
    opportunities: [],
    marketEvidence: [],
  };
};

const routes = {
  'POST /assessment/questions': async (body) => {
    try {
      const result = await callModel(questionPrompt, body);
      if (!Array.isArray(result.questions) || result.questions.length !== 9) throw new Error('Invalid question set');
      return { status: 200, body: { ...result, questions: result.questions.slice(0, 9).map((q, i) => ({ id: q.id || `q${i + 1}`, prompt: q.prompt, dimension: dimensions.includes(q.dimension) ? q.dimension : 'risk' })) } };
    } catch (error) {
      return { status: 200, body: { questions: fallbackQuestions(body.idea), mode: 'prototype', warning: error.message } };
    }
  },
  'POST /assessment/evaluate': async (body) => {
    try {
      const result = await callModel(evaluationPrompt, body);
      return { status: 200, body: result };
    } catch (error) {
      return { status: 200, body: { ...fallbackEvaluation(body.answers || []), mode: 'prototype', warning: error.message } };
    }
  },
  'GET /health': async () => ({ status: 200, body: { ok: true, service: 'sparkhub-server' } }),
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const key = `${req.method} ${new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname}`;
  const handler = routes[key];
  if (!handler) return send(res, 404, { error: 'Not found' });
  try {
    const body = req.method === 'POST' ? await readJson(req) : {};
    const result = await handler(body);
    return send(res, result.status, result.body);
  } catch (error) {
    return send(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => console.log(`SparkHub server listening on :${PORT}`));
