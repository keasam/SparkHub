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
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`SparkHub API error: ${response.status}`);
  return response.json() as Promise<T>;
}

export function requestQuestions(context: IdeaContext) {
  return post<{ questions: GeneratedQuestion[]; mode?: 'prototype'; warning?: string }>('/assessment/questions', context);
}

export function requestEvaluation(input: { context: IdeaContext; questions: GeneratedQuestion[]; answers: { questionId: string; answer: string; secondsUsed: number }[] }) {
  return post<EvaluationResult>('/assessment/evaluate', input);
}
