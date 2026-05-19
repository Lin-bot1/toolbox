"use client";

import Link from "next/link";

export default function ToolLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Sticky glass header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"
            className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-xs)] text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "var(--primary-soft)",
              color: "var(--primary)",
              border: "1px solid var(--border)",
            }}>
            ←
          </Link>
          <div className="min-w-0">
            <h1 className="text-base font-bold truncate">{title}</h1>
            <p className="text-xs truncate" style={{ color: "var(--fg-muted)" }}>
              {description}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
