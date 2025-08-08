export default function PrivacyPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p>
        We minimize PII and only store necessary data to operate the service. You can request
        deletion of your data at any time.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>We store email, auth provider, and usage metrics.</li>
        <li>Media and transcripts are stored securely and can be deleted on request.</li>
        <li>We use third-party processors (OpenAI, hosting, storage) under their terms.</li>
      </ul>
      <p>Contact: privacy@vid2text.local</p>
    </main>
  );
}



