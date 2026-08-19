# Helply

Helply turns company documentation into an AI support chatbot that works inside
the app and as an embeddable website widget.

## Stack

- Next.js App Router, TypeScript, and Tailwind CSS
- SQLite with `better-sqlite3`
- OpenRouter for chat completions and embeddings
- Local email/password authentication for the demo

The default AI configuration uses OpenRouter free models:

- Chat: `openrouter/free`
- Embeddings: `liquid/lfm-2.5-embedding-350m:free`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure an AI provider:

   The chatbot needs an API key to create embeddings, index knowledge, and
   answer questions. The project is configured for OpenRouter by default, but
   you can replace the server-side AI client if you prefer another provider.

   Create an OpenRouter account, generate an API key at
   [openrouter.ai/keys](https://openrouter.ai/keys), and keep the key private.
   It must only be stored in `.env`, never in client-side code or committed to
   git. OpenRouter's free models used by this project are:

   - Chat: `openrouter/free`
   - Embeddings: `liquid/lfm-2.5-embedding-350m:free`

3. Create a local environment file:

```bash
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env` instead. Then set
`OPENROUTER_API_KEY` in `.env`. The model variables are already configured in
`.env.example`, but can be replaced with other compatible OpenRouter models.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run build` — production build

Local SQLite data is stored in `data/` and is ignored by git.

## Demo

See [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) for the recommended walkthrough.
The implementation plan and completion checklist are in
[`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md).
