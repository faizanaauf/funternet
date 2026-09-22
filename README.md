# Funternet Arcade

**Turn dense internet content into interactive AI-assisted learning games.**

Funternet Arcade is a Next.js experiment in gamification: paste text or choose a topic, select a game style, and turn the material into an interactive challenge. The project explores whether playful interaction can make technical documentation, policy text, study material, and other dense content easier to engage with.

## Highlights

- Multiple game formats, including boss battles, trivia, escape-room-style challenges, adventures, and speed challenges.
- Google Gemini integration through the `@google/genai` SDK.
- Structured AI output validation with Zod.
- Web Audio API sound effects without external audio files.
- XP, streaks, achievements, sharing, and local game history.
- Bundled demo experiences so the interface can still be explored without a successful AI request.

## Tech stack

- Next.js 16 / React 19
- TypeScript
- Tailwind CSS
- Google GenAI SDK
- Zod
- Framer Motion
- Web Audio API
- canvas-confetti and Lucide React

## Local setup

```bash
git clone https://github.com/faizanaauf/funternet.git
cd funternet
npm ci
cp .env.example .env.local
npm run dev
```

Add the API credential described in `.env.example` to `.env.local` if you want AI generation. Never commit your real API key.

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
```

CI runs these checks on pushes and pull requests to `main`.

## How it works

The browser collects the source material and game preferences. The server-side `app/api/generate-game` route validates the request and delegates generation to the Gemini integration in `lib/`. The resulting structured game is rendered by the interactive client experience.

## Limitations

AI-generated educational content can contain mistakes. Treat generated explanations as an interactive learning aid rather than an authoritative source, especially for legal, medical, financial, or other high-stakes material.

## Contributing

Issues and focused pull requests are welcome. For code changes, run lint and a production build before opening a PR.

## Author

Built by [Muhammad Faizan](https://github.com/faizanaauf).
