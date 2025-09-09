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
          <header className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-bold">V</div>
              <span className="text-lg font-semibold">Vid2Text</span>
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a className="hover:underline" href="/">Home</a>
              <a className="hover:underline" href="/pricing">Pricing</a>
              <a className="hover:underline" href="/dashboard">Dashboard</a>
            </nav>
          </header>
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


