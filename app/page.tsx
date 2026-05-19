"use client";

import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import TechIcon from "@/components/TechIcon";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <header className="relative overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold" style={{ color: "var(--fg)" }}>
            <span style={{ color: "var(--primary)" }}>Tool</span>Box
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
            {tools.length} 个工具 &middot; 纯浏览器端运行 &middot; 无需上传
          </p>
        </div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "var(--primary)", opacity: .08 }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "#8b5cf6", opacity: .06 }} />
      </header>

      {/* Tools grid */}
      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {categories.map((category) => (
          <section key={category} className="mb-12 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-5 px-1" style={{ color: "var(--fg-muted)" }}>
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tools
                .filter((t) => t.category === category)
                .map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group block rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 30%, var(--border))";
                      e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="flex items-center gap-3.5 p-4">
                      <TechIcon name={tool.name} size={40} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[13px] leading-tight group-hover:text-[var(--primary)] transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                          {tool.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t py-10 text-center" style={{ borderColor: "var(--border)" }}>
        <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>
          ToolBox &middot; 所有工具均在浏览器端运行
        </p>
      </footer>
    </div>
  );
}
