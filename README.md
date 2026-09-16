# SparkHub — Idea → IPO

Mobile-first Idea Evaluation Platform.

## Current MVP

- Expo / React Native mobile client
- Idea and problem intake
- Supporting document selection
- AI-generated exactly 9-question assessment
- 60-second question timer with pause/resume
- AI answer evaluation with structured Idea DNA dimensions
- Preliminary teaser before the paid report
- ₹199 unlock flow with server-side Razorpay verification endpoints
- Full evaluation dossier UI
- PDF/DOCX/PPTX/TXT/MD/CSV/JSON document extraction endpoint
- Live market-research adapter using Tavily when configured
- Separate Node AI service so model/payment credentials stay server-side

## Run the mobile app

```bash
npm install
npm start
```

Set `EXPO_PUBLIC_API_URL` to the reachable backend URL for a device/simulator.

## Run the AI service

```bash
cd server
npm install
export OPENAI_API_KEY=your_key
export OPENAI_MODEL=your_available_model
npm start
```

Optional production integrations:

- `TAVILY_API_KEY` enables live competitor/market search during evaluation.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` enable the ₹199 order, payment-signature verification, and webhook endpoints.

Razorpay payment secrets must never be placed in the Expo app. Configure the `order.paid` webhook against the deployed backend and use HTTPS in production.

## Product rule

The assessment is exactly **9 questions × 60 seconds**. The detailed evaluation is intended to be unlocked for **₹199** after the free two-line teaser.

Prototype fallbacks are explicitly labeled and must not be used for funding or selection decisions.

## Production hardening still required

- Persist users, evaluations, payment records, and unlock state in a durable database.
- Add authenticated sessions and authorization around report access.
- Move document bytes through authenticated upload storage rather than embedding large base64 payloads in JSON.
- Add rate limits, abuse controls, retention/deletion policies, observability, and automated tests.
