export const appConfig = {
  name: 'SparkHub',
  brand: 'Idea → IPO',
  evaluation: {
    questionCount: 9,
    secondsPerQuestion: 60,
    unlockPriceInr: 199,
  },
};

export type EvaluationDimension =
  | 'problem'
  | 'market'
  | 'differentiation'
  | 'business'
  | 'execution'
  | 'customer'
  | 'founder'
  | 'risk';
