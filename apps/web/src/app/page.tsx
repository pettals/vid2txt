"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="space-y-12">
      <section className="rounded-3xl p-6 md:p-10 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white shadow-xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Turn any video into instant, shareable insights
            </h1>
            <p className="text-gray-300">
              Paste a link or upload a file. Get a TL;DR, key quotes with timestamps, action items,
              and a publish-ready summary in seconds.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1">Fast, accurate transcription</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Blog-ready summaries</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Export to Docs / Notion</span>
            </div>
            <div className="bg-white text-gray-900 shadow rounded-2xl p-4 md:p-5 max-w-xl">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const url = new FormData(e.currentTarget).get("url")?.toString() ?? "";
                  setError(null);
                  if (!url) {
                    setError("Please paste a valid video link.");
                    return;
                  }
                  setLoading(true);
                  setTimeout(() => {
                    router.push(`/processing?url=${encodeURIComponent(url)}`);
                  }, 300);
                }}
              >
                <label className="block text-sm text-gray-700">Paste a video link</label>
                <div className="flex gap-2">
                  <input
                    name="url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 rounded-lg border px-3 py-2"
                    required
                  />
                  <button type="submit" className="rounded-lg bg-black text-white px-4 py-2" disabled={loading}>
                    {loading ? "Starting…" : "Summarize"}
                  </button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="text-xs text-gray-500">Works with YouTube, Vimeo, TikTok. Upload coming soon.</div>
              </form>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>Trusted by creators</span>
              <div className="flex gap-3 opacity-80">
                <div className="h-6 w-16 rounded bg-white/10" />
                <div className="h-6 w-16 rounded bg-white/10" />
                <div className="h-6 w-16 rounded bg-white/10" />
              </div>
            </div>
          </div>
          <div>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 h-72 md:h-[22rem] shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="h-16 w-16 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-2 w-full rounded-full bg-white/20">
                  <div className="h-2 rounded-full bg-white/80" style={{ width: "35%" }} />
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="h-6 w-12 rounded bg-white/20" />
                  <span className="h-6 w-12 rounded bg-white/20" />
                  <span className="h-6 w-12 rounded bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <Feature title="Beyond transcription" desc="Transforms content into publish-ready text." />
        <Feature title="Multiple styles" desc="TL;DR, key points, blog draft, and more." />
        <Feature title="Direct sharing" desc="Post to LinkedIn/X or export to Docs/Notion." />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <StepCard index={1} title="Import video" desc="Paste a link or upload your file." />
        <StepCard index={2} title="AI transcribes" desc="Accurate speech-to-text with Whisper." />
        <StepCard index={3} title="Get insights" desc="Summaries, quotes, tags, and exports." />
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function StepCard({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow space-y-3">
      <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
        {index}
      </div>
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}



