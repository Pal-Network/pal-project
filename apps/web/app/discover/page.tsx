"use client";

import { useEffect, useState } from "react";
import { type DiscoverUser, fetchDiscoverUsers } from "../../src/lib/api";

export default function DiscoverPage() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [skill, setSkill] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    fetchDiscoverUsers({ skill: skill || undefined })
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [skill]);

  return (
    <main className="min-h-screen px-8 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-ember">
          Discover
        </span>
        <h1 className="text-4xl font-semibold leading-tight">Find a builder</h1>

        <input
          type="text"
          value={skill}
          onChange={(event) => setSkill(event.target.value)}
          placeholder="Filter by skill, e.g. rust"
          className="w-full max-w-sm rounded-full border border-slate-300 px-4 py-2 text-sm"
        />

        {status === "loading" && (
          <p className="text-slate-500">Loading builders…</p>
        )}
        {status === "error" && (
          <p className="text-red-600">
            Couldn&apos;t reach the API. Is the server running at the configured
            URL?
          </p>
        )}
        {status === "ready" && users.length === 0 && (
          <p className="text-slate-500">
            No builders match yet — be the first to sign in.
          </p>
        )}

        <ul className="flex flex-col gap-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <div>
                <p className="font-semibold">
                  {user.name ?? user.githubUsername}
                </p>
                <p className="text-sm text-slate-500">@{user.githubUsername}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {user.techStack.length > 0
                    ? user.techStack.join(", ")
                    : "No skills listed yet"}
                </p>
              </div>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">
                {user.intentStatus.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
