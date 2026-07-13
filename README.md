# Swagger Editor App

An OpenAPI/Swagger editor with a built-in REST client, made with Next.js. You write a spec in JSON or YAML, the app validates it and shows the endpoints. Any endpoint can be tested right from the browser: requests go through the Next.js server, so CORS is not a problem. Signed-in users also get request history with stats.

## Live Demo

<!-- Replace with your deployed URL after deployment -->
**[Deployed App](https://your-app.vercel.app)**

## What it does

- **Editor**: Monaco editor, understands both JSON and YAML, detects the format on paste and can convert between them. Shows validation errors as you type.
- **Viewer**: list of endpoints from the spec, with parameters, request/response schemas and status codes.
- **Try It Out**: fill in the parameters, hit Execute and see the response. There is also a "Generate cURL" button.
- **Auth**: sign up / sign in with email and password (Supabase).
- **Saved schemas**: if you are signed in, your schema is saved and loaded back on next login.
- **History**: every request you run is recorded — method, URL, status, duration, sizes, errors.
- **Two languages**: English and Russian, switcher in the header.

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
| Azamat Omirtay | Developer | [@azamxvit](https://github.com/azamxvit) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/azamxvit/swagger-editor-app.git
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

Project for the [RS School](https://rs.school/) React course.
