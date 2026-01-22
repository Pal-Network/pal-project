import { Button } from "@pal/ui";

export default function HomePage() {
  return (
    <main className="min-h-screen px-8 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-ember">
          Pal Network
        </span>
        <h1 className="text-4xl font-semibold leading-tight">
          Pal Network API - Web Client
        </h1>
        <p className="text-lg text-slate-700">
          This is the baseline Next.js shell. UI components are shared from
          @pal/ui.
        </p>
        <div>
          <Button>Shared UI Button</Button>
        </div>
      </div>
    </main>
  );
}
