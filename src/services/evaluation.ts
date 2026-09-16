import { appConfig, EvaluationDimension } from '../config';

export type IdeaContext = {
  idea: string;
  problem: string;
  customer?: string;
  documents?: string[];
};

export type GeneratedQuestion = {
  id: string;
  prompt: string;
  dimension: EvaluationDimension;
};

/**
 * Temporary deterministic provider used by the mobile prototype.
 * Replace this implementation with the server-side AI orchestrator.
 */
export function generateAssessmentQuestions(context: IdeaContext): GeneratedQuestion[] {
  const seed = `${context.idea} ${context.problem} ${context.customer ?? ''}`.toLowerCase();
  const questions: GeneratedQuestion[] = [
    { id: 'q1', prompt: `What specific customer pain makes ${shorten(context.idea)} worth paying for today?`, dimension: 'problem' },
    { id: 'q2', prompt: 'What evidence do you have that your target customer will actually adopt this solution?', dimension: 'customer' },
    { id: 'q3', prompt: 'Which existing alternative would your customer use instead, and why would they switch?', dimension: 'differentiation' },
    { id: 'q4', prompt: 'What is the strongest assumption in your business model right now?', dimension: 'business' },
    { id: 'q5', prompt: 'Why is your proposed solution meaningfully different from what already exists?', dimension: 'differentiation' },
    { id: 'q6', prompt: 'How will you acquire your first 10 customers without relying on broad advertising?', dimension: 'market' },
    { id: 'q7', prompt: 'What part of your plan is hardest to execute with your current team or resources?', dimension: 'execution' },
    { id: 'q8', prompt: 'What would make this market much smaller than you currently expect?', dimension: 'risk' },
    { id: 'q9', prompt: 'What is the single experiment you would run next to prove or disprove your idea?', dimension: 'execution' },
  ];

  if (seed.includes('b2b') || seed.includes('enterprise')) {
    questions[1] = { id: 'q2', prompt: 'Who inside the target company feels this pain most strongly, and who actually approves the purchase?', dimension: 'customer' };
  }

  return questions.slice(0, appConfig.evaluation.questionCount);
}

export type AnswerEvaluation = {
  questionId: string;
  score: number;
  rationale: string;
};

/** Placeholder scoring adapter. Production scoring belongs on the backend. */
export function scoreAnswer(questionId: string, answer: string): AnswerEvaluation {
  const normalizedLength = Math.min(answer.trim().length, 500);
  const score = Math.max(35, Math.min(92, 45 + Math.round(normalizedLength / 12)));
  return {
    questionId,
    score,
    rationale: 'Prototype score only. Production evaluation should use the idea profile, evidence, answer quality, consistency, and market research.',
  };
}

function shorten(value: string): string {
  const text = value.trim().replace(/\s+/g, ' ');
  return text.length > 50 ? `${text.slice(0, 50)}…` : text || 'your idea';
}
