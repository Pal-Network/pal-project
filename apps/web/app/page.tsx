import Link from "next/link";
import { buildGithubAuthorizeUrl } from "../src/lib/api";

export default function HomePage() {
  return (
    <main className="min-h-screen px-8 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-ember">
          Pal Network
        </span>
        <h1 className="text-4xl font-semibold leading-tight">
          Connect. Collaborate. Build.
        </h1>
        <p className="text-lg text-slate-700">
          Pal is a match-first network for developers. Sign in with GitHub to
          set your intent, then discover builders looking for the same thing you
          are.
        </p>
        <div className="flex gap-4">
          <a
            href={buildGithubAuthorizeUrl()}
            className="inline-flex items-center rounded-full bg-ember px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Continue with GitHub
          </a>
          <Link
            href="/discover"
            className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Browse builders
          </Link>
        </div>
      </div>
    </main>
  );
}
