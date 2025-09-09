import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <main className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="text-gray-600">Job ID: {id}</p>
        <div className="text-sm text-gray-500">This page shows dummy insights to illustrate the MVP journey.</div>
      </header>

      <div className="grid md:grid-cols-3 gap-5">
        <Section title="TL;DR">
          <ul className="list-disc pl-5 space-y-1 text-gray-800">
            <li>Guest shares a 3-step framework for audience growth.</li>
            <li>Focus on consistency, storytelling, and community engagement.</li>
            <li>Repurpose content into short clips and carousels for reach.</li>
          </ul>
        </Section>

        <Section title="Key Points">
          <ul className="list-disc pl-5 space-y-1 text-gray-800">
            <li>Define your niche with a simple promise statement.</li>
            <li>Create a weekly system: research → record → repurpose.</li>
            <li>Measure traction via saves, shares, and replies.</li>
          </ul>
        </Section>

        <Section title="Hashtags & SEO Tags">
          <div className="flex flex-wrap gap-2 text-sm">
            {["#contentstrategy", "#audiencegrowth", "#creator", "#storytelling", "#repurpose"].map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-3 py-1">{t}</span>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Section title="Detailed Summary (Blog Draft)">
          <div className="prose max-w-none prose-gray">
            <p>
              In this talk, the speaker outlines a practical approach to building an audience by focusing on
              consistent publishing, clear storytelling, and community engagement. The framework begins with
              defining a crisp promise statement that orients every piece of content around a specific outcome
              for the audience.
            </p>
            <p>
              The weekly operating system includes lightweight research, recording a single long-form session,
              and repurposing highlights into short clips and visual carousels. Performance is tracked using
              qualitative signals like replies and DMs, as well as quantitative saves and shares.
            </p>
          </div>
        </Section>

        <Section title="Quotes & Timestamps">
          <ul className="space-y-2 text-gray-800">
            <li>
              <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">02:13</span> — “Consistency is a moat. Show up before you optimize.”
            </li>
            <li>
              <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">07:48</span> — “Tell one story per post. Clarity beats breadth.”
            </li>
            <li>
              <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">15:22</span> — “Community comments are gold—treat them like briefs.”
            </li>
          </ul>
        </Section>
      </div>

      <Section title="Export & Share">
        <div className="flex flex-wrap gap-3">
          <button className="rounded border px-3 py-2">Copy TL;DR</button>
          <button className="rounded border px-3 py-2">Export Markdown</button>
          <button className="rounded border px-3 py-2">Download PDF</button>
          <button className="rounded bg-black text-white px-3 py-2">Share to LinkedIn</button>
        </div>
      </Section>

      <div className="flex items-center justify-between text-sm">
        <Link className="text-gray-600 hover:underline" href="/">← New video</Link>
        <Link className="text-gray-600 hover:underline" href="/dashboard">Go to dashboard →</Link>
      </div>
    </main>
  );
}


