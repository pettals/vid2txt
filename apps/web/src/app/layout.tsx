import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Vid2Text",
  description: "Turn any video into instant, shareable insights.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="max-w-5xl mx-auto p-6 space-y-10">
          {children}
          <footer className="border-t pt-6 text-sm text-gray-500 flex gap-4">
            <a className="hover:underline" href="/terms">Terms</a>
            <a className="hover:underline" href="/privacy">Privacy</a>
          </footer>
        </div>
      </body>
    </html>
  );
}


