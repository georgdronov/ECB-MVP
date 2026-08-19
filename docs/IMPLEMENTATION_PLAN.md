# Embeddable Chatbot Builder — Implementation Plan

> Living document. Completed items are marked with `- [x]`.
> Product copy, UI, and documentation are in English.

## Product

An application that turns company documents and knowledge into a chatbot.
The bot is available inside the app as a ChatGPT-like interface and as an
embeddable widget for third-party websites.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- SQLite (`better-sqlite3`) for local storage
- OpenRouter for chat completions and embeddings
- `pdf-parse` for PDF, `mammoth` for DOCX, native TXT/MD support
- Local email/password authentication with httpOnly cookie sessions

## MVP Scope

Included:

- Registration/login with per-user data isolation
- One chatbot per user
- PDF, DOCX, TXT, MD uploads and manually added knowledge
- Text extraction, chunking, and embedding indexing
- Grounded RAG answers with sources
- ChatGPT-like playground
- Real embed script and iframe widget
- Demo website for widget verification
- Free/Pro pricing, mock billing, and server-side limits
- Responsive landing page
- Presentation deliverable

Out of scope:

- Teams, roles, multiple bots, analytics dashboard
- CRM integrations and website scraping
- Real Stripe, OAuth, and password recovery
- Advanced prompt editor and model training

## Pricing

- Free ($0): 3 documents, 50 messages/month, 5 MB/file, one bot, widget, and
  "Powered by" branding
- Pro ($29/month): 50 documents, 2,000 messages/month, 15 MB/file, no branding,
  and expanded customization

Billing is mocked but follows a realistic SaaS checkout flow.

---

# Implementation Steps

## Step 0. Project Initialization

- [x] Next.js + TypeScript + Tailwind project created
- [x] Project structure (`app`, `lib`, `components`, `docs`)
- [x] `.env.example` with `OPENROUTER_API_KEY` and `SESSION_SECRET`
- [x] `.gitignore` for dependencies, env files, and SQLite data
- [x] README with setup and scripts
- [x] `npm run dev` starts successfully
- [x] `npm run lint` and `npm run typecheck` pass
- **Done when:** the dev server runs and Tailwind is applied

## Step 1. Design System

- [x] Color, typography, and spacing tokens
- [x] Button, Input, Card, Badge, Modal, and Toast components
- [x] Hover, focus, disabled, and loading states
- **Done when:** components are reusable and responsive

## Step 2. SQLite Database

- [x] Tables for users, chatbot settings, documents, chunks, conversations,
  messages, subscriptions, usage, and onboarding progress
- [x] Automatic initialization and migrations
- [x] Database access helpers
- **Done when:** tables are created and CRUD operations work

## Step 3. Authentication

- [x] Registration with password hashing
- [x] Login and logout
- [x] httpOnly cookie sessions
- [x] Server-side protection for `/app/*`
- [x] Per-user data isolation
- **Done when:** guests cannot access the app and users cannot see other data

## Step 4. Landing Page

- [x] Hero, value proposition, and CTA
- [x] How it works
- [x] Feature overview
- [x] Embed code example
- [x] Free/Pro pricing
- [x] Footer and responsive layout
- **Done when:** the page is clear and responsive on desktop and mobile

## Step 5. App Shell and Dashboard

- [x] Sidebar navigation for Dashboard, Knowledge, Playground, Embed, and Billing
- [x] Dashboard metrics, usage, plan, and quick actions
- [x] Responsive mobile navigation
- [x] Collapsible desktop sidebar
- [x] Live assistant preview
- [x] Onboarding checklist
- **Done when:** navigation works and metrics come from the database

## Step 6. Knowledge Ingestion

- [x] Drag-and-drop upload and file picker
- [x] Server-side type and size validation
- [x] PDF, DOCX, TXT, and MD text extraction
- [x] Cleaning and overlapping chunking
- [x] Processing, Ready, and Failed states
- [x] Delete confirmation
- [x] Manual text knowledge
- [x] Plan limit popup with Billing link
- **Done when:** supported formats and manual text are processed with clear errors

## Step 7. Embeddings and Indexing

- [x] OpenRouter embeddings client
- [x] Batch embeddings
- [x] Vector persistence in SQLite
- [x] API error handling
- [x] Real smoke test with a free embedding model
- **Done when:** documents become Ready with chunks and vectors

## Step 8. RAG Search and Chat

- [x] Query embeddings
- [x] Cosine similarity search
- [x] Top-K relevant chunks
- [x] Context, history, and question prompt
- [x] Sources in responses
- [x] Grounded fallback when context is missing
- **Done when:** document questions return sourced answers

## Step 9. Playground

- [x] ChatGPT-like interface and conversation history
- [x] Loading and error states
- [x] Sources below answers
- [x] Example questions and empty state
- [x] Conversation/message persistence
- [x] Shared widget customization: colors and font
- **Done when:** a complete conversation works and is persisted

## Step 10. Embed Widget

- [x] Name, welcome message, colors, position, and font settings
- [x] Live preview and generated snippet
- [x] Copy confirmation
- [x] `public/widget.js` launcher and iframe
- [x] Public widget route
- [x] Public chat API
- [x] Demo website
- [x] Free-plan branding
- **Done when:** the widget works on the demo website

## Step 11. Pricing and Mock Billing

- [x] Billing page with plans and usage
- [x] Mock upgrade/downgrade
- [x] Plan persistence
- [x] Server-side document, message, file-size, and branding gates
- **Done when:** limits block correctly and upgrade changes access

## Step 12. Public Bot Security

- [x] Public chatbot ID contains no secrets
- [x] Message length limit
- [x] Basic rate limiting
- [x] Safe text rendering without HTML execution
- **Done when:** the public endpoint handles basic abuse safely

## Step 13. Polish and States

- [x] Loading, empty, and error states
- [x] Delete confirmations and server error messages
- [x] Responsive mobile-to-desktop layouts
- [x] Product copy and microcopy
- **Done when:** the product feels complete

## Step 14. Quality Checks

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Manual end-to-end flow with free OpenRouter models
- **Done when:** all checks pass

## Step 15. Presentation

- [x] `docs/DEMO_SCRIPT.md`
- [x] Test knowledge content
- [x] README with setup, env, and demo instructions
- **Done when:** the demo can be presented without improvisation

## Definition of Done

- [x] Project starts with one command after setup
- [x] PDF, DOCX, TXT, MD, and manual text are supported
- [x] Questions return grounded answers with sources
- [x] Unknown questions do not produce invented facts
- [x] Widget works on the demo website
- [x] Free limits and mock upgrade work
- [x] Authentication isolates user data
- [x] Pages are responsive
- [x] Lint, typecheck, and build pass
- [x] Presentation script is ready
