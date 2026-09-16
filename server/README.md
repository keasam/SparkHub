# SparkHub AI service

This small Node service keeps model credentials off the mobile client.

## Run

```bash
cd server
export OPENAI_API_KEY=your_key
npm start
```

Optional: set `OPENAI_MODEL` and `PORT`.

## Endpoints

- `GET /health`
- `POST /assessment/questions` — generates exactly 9 personalized questions from the submitted idea/context and document text.
- `POST /assessment/evaluate` — evaluates the nine answers and returns dimensions, teaser lines, locked findings, risks, opportunities, blueprint items, and market-evidence slots.

The service falls back to clearly labeled prototype scoring when the model is unavailable. Do not use prototype results as an investment, funding, or selection decision.

## Production work still required

- authenticated persistence
- secure document upload and extraction
- market-research provider with source capture
- payment provider/webhook for the ₹199 unlock
- rate limits, logging, audit trail, retries, and monitoring
- production prompt/version management and evaluation tests
