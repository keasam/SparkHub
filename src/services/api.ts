import { GeneratedQuestion, IdeaContext, AnswerEvaluation } from './evaluation';

export type EvaluationResult = {
  overallScore: number;
  dimensions: Record<string, number>;
  answerScores: AnswerEvaluation[];
  teaser: string[];
  lockedFindings: string[];
  blueprint: string[];
  risks: string[];
  opportunities: string[];
  marketEvidence: { claim: string; source: string; note: string }[];
  mode?: 'prototype';
  warning?: string;
  marketResearch?: { mode: string; answer?: string; results: { title: string; url: string; content: string }[] };
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`SparkHub API error: ${response.status}`);
  return response.json() as Promise<T>;
}

export function requestQuestions(context: IdeaContext) {
  return post<{ questions: GeneratedQuestion[]; mode?: 'prototype'; warning?: string }>('/assessment/questions', context);
}

export function requestEvaluation(input: { context: IdeaContext; questions: GeneratedQuestion[]; answers: { questionId: string; answer: string; secondsUsed: number }[]; marketQuery?: string }) {
  return post<EvaluationResult>('/assessment/evaluate', input);
}

export function extractDocuments(documents: { name: string; mimeType?: string; dataBase64: string }[]) {
  return post<{ documents: { name: string; text: string; warning?: string }[]; combinedText: string }>('/documents/extract', { documents });
}

export function createReportPayment(evaluationId?: string) {
  return post<{ keyId: string; orderId: string; amount: number; currency: string; receipt: string }>('/payments/order', { amountInr: 199, evaluationId });
}

export function verifyReportPayment(input: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
  return post<{ verified: boolean; unlocked: boolean; evaluationId?: string }>('/payments/verify', input);
}
