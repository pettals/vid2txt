"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [apiHealth, setApiHealth] = useState<string>("checking...");
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
    fetch(`${apiBase}/health`).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      setApiHealth(data?.status ?? "ok");
    }).catch(() => setApiHealth("unreachable"));
  }, []);

  return (
    <main className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Vid2Text</h1>
        <p className="text-gray-600">Turn any video into instant, shareable insights.</p>
        <div className="text-sm text-gray-500">API health: {apiHealth}</div>
      </section>

      <section className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Import video</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              const url = new FormData(e.currentTarget).get("url")?.toString() ?? "";
              alert(`Link submitted: ${url}`);
            }}
          >
            <label className="block text-sm text-gray-700">Paste a link (YouTube, Vimeo, TikTok)</label>
            <div className="flex gap-2">
              <input
                name="url"
                type="url"
                required
                placeholder="https://..."
                className="flex-1 rounded border px-3 py-2"
              />
              <button type="submit" className="rounded bg-black text-white px-3 py-2">Import</button>
            </div>
          </form>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files?.[0]) alert(`File dropped: ${files[0].name}`);
            }}
            className="rounded border-dashed border-2 border-gray-300 p-6 text-center text-gray-600"
          >
            Drag and drop a video file (MP4/MOV)
          </div>
        </div>
      </section>
    </main>
  );
}



