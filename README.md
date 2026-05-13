# Chat Simulator

Chat Simulator is a Next.js App Router chat application that streams OpenRouter responses through the Vercel AI SDK, stores conversations in PostgreSQL with Prisma, and includes installable PWA support with an offline fallback screen.

## Tech Stack

- Next.js 16 with the App Router and `src/` directory
- TypeScript and Tailwind CSS v4
- Prisma with PostgreSQL
- TanStack Query for client-side mutations and cache invalidation
- Vercel AI SDK for streaming chat responses
- Service worker + manifest for PWA install and offline behavior

## Local Setup

1. Copy `.env.example` to `.env`.
2. Copy `.env.local.example` to `.env.local`.
3. Start the local database:

```bash
docker compose up -d
```

4. Install dependencies:

```bash
npm install
```

5. Generate Prisma client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

6. Start the development server:

```bash
npm run dev
```

## Environment Variables

`.env`

```bash
DATABASE_URL="postgresql://chat_user:chat_password@localhost:5432/chat_simulator?schema=public"
```

`.env.local`

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openrouter/auto
```

The OpenRouter key is only read on the server inside the streaming route handler.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run check
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Deployment Notes

- The build script runs `prisma generate`, `prisma migrate deploy`, and `next build`.
- In Vercel, set `DATABASE_URL`, `OPENROUTER_API_KEY`, and optionally `OPENROUTER_MODEL`.
- Connect the repository to Vercel so each pull request gets a preview deployment.

## Assignment 9 Manual Verification

The codebase includes the manifest, generated app icons, service worker registration, and offline fallback page. The remaining manual tasks still need to be done on your side:

- deploy to Vercel
- install the PWA from the deployed URL on your phone
- turn on airplane mode and test the offline page
- add screenshots of the installed offline experience to the pull request description

## Legacy Folder

The earlier plain HTML/CSS/JavaScript assignment version is still preserved in `legacy/plain-chat/`.
