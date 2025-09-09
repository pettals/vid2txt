export default function PricingPage() {
  return (
    <main className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Simple, transparent pricing</h1>
        <p className="text-gray-600">Start free. Upgrade when you’re ready.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-5">
        <Plan
          name="Free"
          price="$0"
          tagline="Get started with core features"
          features={[
            "3 videos/month",
            "Up to 10 minutes each",
            "Watermark on exports",
          ]}
          cta="Get Started"
        />

        <Plan
          name="Pro"
          price="$15/mo"
          tagline="For creators and professionals"
          features={[
            "Unlimited videos up to 60 min",
            "No watermark",
            "Multi-language export",
            "Integrations: Notion, Google Docs",
          ]}
          highlighted
          cta="Start Pro"
        />

        <Plan
          name="Agency"
          price="$39/mo"
          tagline="For teams and agencies"
          features={[
            "Multiple brand profiles",
            "Batch processing",
            "Analytics",
            "Team accounts",
          ]}
          cta="Contact Sales"
        />
      </div>
    </main>
  );
}

function Plan({
  name,
  price,
  tagline,
  features,
  cta,
  highlighted,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`${highlighted ? "ring-2 ring-black" : ""} bg-white rounded-lg shadow p-6 space-y-4`}>
      <div>
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-3xl font-extrabold">{price}</div>
        <div className="text-sm text-gray-600">{tagline}</div>
      </div>
      <ul className="space-y-1 text-sm text-gray-800">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-black" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`${highlighted ? "bg-black text-white" : "border"} rounded px-4 py-2 w-full`}>
        {cta}
      </button>
    </div>
  );
}


