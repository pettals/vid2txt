import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div className="prose prose-gray max-w-none">{children}</div>;
}



