"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  { id: "queue", label: "Queued" },
  { id: "download", label: "Fetching video" },
  { id: "transcribe", label: "Transcribing audio" },
  { id: "summarize", label: "Generating summaries" },
];

export default function ProcessingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const url = params.get("url") ?? "";
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const videoHost = useMemo(() => {
    try {
      const u = new URL(url);
      return u.hostname.replace("www.", "");
    } catch {
      return "video";
    }
  }, [url]);

  useEffect(() => {
    const totalMs = 4200;
    const interval = 100;
    const steps = Math.ceil(totalMs / interval);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      const p = Math.min(100, Math.round((i / steps) * 100));
      setProgress(p);
      const idx = Math.min(STEPS.length - 1, Math.floor((p / 100) * STEPS.length));
      setStepIndex(idx);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => {
          const jobId = Math.random().toString(36).slice(2, 8);
          router.replace(`/results/${jobId}`);
        }, 300);
      }
    }, interval);
    return () => clearInterval(id);
  }, [router]);

  return (
    <main className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Processing your video</h1>
        <p className="text-gray-600">Source: {url ? url : "(no link provided)"} {url && <span className="text-gray-400">({videoHost})</span>}</p>
      </header>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="w-full bg-gray-100 h-3 rounded">
          <div className="h-3 rounded bg-black transition-all" style={{ width: `${progress}%` }} />
        </div>
        <ol className="grid md:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${i <= stepIndex ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}>
                {i + 1}
              </div>
              <span className={i <= stepIndex ? "font-medium" : "text-gray-500"}>{s.label}</span>
            </li>
          ))}
        </ol>
        <div className="text-sm text-gray-500">This is a simulated flow for the MVP demo.</div>
      </div>

      <div className="text-sm text-gray-500">Tip: Bookmark this page. You’ll be redirected to results when done.</div>
    </main>
  );
}


