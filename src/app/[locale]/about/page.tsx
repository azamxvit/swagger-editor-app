import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

const TEAM = [
  {
    name: 'Azamat Omirtay',
    role: 'Developer',
    github: 'https://github.com/azamxvit',
  },
  {
    name: 'Team Member 2',
    role: 'Developer',
    github: 'https://github.com/',
  },
  {
    name: 'Team Member 3',
    role: 'Developer',
    github: 'https://github.com/',
  },
];

const TECHNOLOGIES = [
  'Next.js (App Router)',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'Monaco Editor',
  'Swagger Parser',
  'next-intl',
  'Vitest',
];

const RESOURCES = [
  { label: 'OpenAPI Initiative', href: 'https://www.openapis.org/' },
  { label: 'RS School', href: 'https://rs.school/' },
  { label: 'Swagger Editor', href: 'https://editor.swagger.io/' },
  { label: 'Next.js Docs', href: 'https://nextjs.org/docs' },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </header>

      <section>
        <h2 className="mb-3 text-xl font-semibold">{t('courseTitle')}</h2>
        <p className="leading-relaxed text-[var(--muted)]">{t('courseDescription')}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">{t('projectTitle')}</h2>
        <p className="leading-relaxed text-[var(--muted)]">{t('projectDescription')}</p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t('teamTitle')}</h2>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-3">
          {TEAM.map((member) => (
            <li
              key={member.name}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-[var(--muted)]">{member.role}</p>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-[var(--primary)] hover:underline"
              >
                GitHub
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">{t('techTitle')}</h2>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {TECHNOLOGIES.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">{t('resourcesTitle')}</h2>
        <ul className="space-y-2">
          {RESOURCES.map((resource) => (
            <li key={resource.href}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline"
              >
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="pt-4" aria-label="Back">
        <Link href="/" className="btn-primary">
          ← Back to Editor
        </Link>
      </nav>
    </article>
  );
}
