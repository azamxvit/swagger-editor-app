# Swagger Editor App

A full-stack OpenAPI/Swagger editor and REST client built with Next.js. Edit specifications in JSON or YAML, validate schemas, explore endpoints, execute requests through a server-side proxy (CORS-free), and track request history with analytics.

## Live Demo

<!-- Replace with your deployed URL after deployment -->
**[Deployed App](https://your-app.vercel.app)**

## Features

- **Swagger Editor** — Monaco-based editor with JSON/YAML auto-detection, format conversion, and validation
- **Swagger Viewer** — Browse endpoints, view parameters/schemas/responses, Try-It-Out, generate cURL
- **Authentication** — Email/password sign up and sign in via Supabase
- **Schema Persistence** — Authenticated users can save and restore OpenAPI schemas
- **History & Analytics** — Server-rendered request history with duration, status, sizes, and error details
- **i18n** — English and Russian language support
- **CORS Proxy** — API requests routed through Next.js server

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Swagger Parser](https://github.com/APIDevTools/swagger-parser)
- [next-intl](https://next-intl.dev/)
- [Vitest](https://vitest.dev/)

## Team

| Name | Role | GitHub |
|------|------|--------|
| Azamat Omirtaj | Team Lead | [@azamatomirtaj](https://github.com/azamatomirtaj) |
| Team Member 2 | Developer | [GitHub]() |
| Team Member 3 | Developer | [GitHub]() |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/your-org/swagger-editor-app.git
cd swagger-editor-app
git checkout develop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration SQL from `supabase/migrations/001_initial.sql` in the SQL Editor
3. Enable Email auth in Authentication → Providers
4. Copy your project URL and anon key

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── page.tsx       # Main editor/viewer
│   │   ├── about/         # About page
│   │   ├── sign-in/       # Sign in
│   │   ├── sign-up/       # Sign up
│   │   └── history/       # History & analytics (private)
│   └── api/
│       ├── proxy/         # CORS proxy for API requests
│       ├── schema/        # Schema save/load
│       └── history/       # Request history API
├── components/            # React components
├── lib/                   # Utilities (OpenAPI, auth, Supabase)
└── i18n/                  # Internationalization
```

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push `develop` branch to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## RS School

This project was developed as part of the [RS School](https://rs.school/) JavaScript/Front-end course.
