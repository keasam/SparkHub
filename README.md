# SparkHub — Idea → IPO

Mobile-first Idea Evaluation Platform.

## Current MVP

- Expo / React Native mobile client
- Idea and problem intake
- Supporting document selection
- AI-generated 9-question assessment contract
- 60-second question timer with pause/resume
- AI answer evaluation API contract
- Preliminary Idea DNA result and teaser
- ₹199 unlock UI
- Full evaluation dossier UI
- Separate Node AI service so model credentials never ship in the mobile app

## Run the mobile app

```bash
npm install
npm start
```

Set `EXPO_PUBLIC_API_URL` to the reachable backend URL for a device/simulator.

## Run the AI service

```bash
cd server
export OPENAI_API_KEY=your_key
export OPENAI_MODEL=your_available_model
npm start
```

See `server/README.md` for endpoints and production integration requirements.

## Product rule

The assessment is exactly **9 questions × 60 seconds**. The question generator uses the submitted idea/context and document metadata/text supplied to the backend. The detailed evaluation is intended to be unlocked for **₹199** after the free teaser.

Prototype fallback scores are explicitly labeled and must not be used for funding or selection decisions.
