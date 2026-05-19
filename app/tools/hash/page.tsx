"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

async function hash(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [fileResults, setFileResults] = useState<Record<string, string>>({});

  const compute = async () => {
    const r: Record<string, string> = {};
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) r[algo] = await hash(algo, input);
    r["MD5"] = "浏览器不支持 MD5，请使用 SHA-256";
    setResults(r);
  };

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const r: Record<string, string> = {};
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) {
      const h = await crypto.subtle.digest(algo, buf);
      r[algo] = Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    setFileResults(r);
  };

  const HashList = ({ data, title }: { data: Record<string, string>; title: string }) => (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>{title}</h3>
      {Object.entries(data).map(([algo, val]) => (
        <div key={algo} className="flex items-center gap-2 p-3 rounded-[var(--radius)] border"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <span className="w-16 sm:w-20 text-xs font-semibold shrink-0" style={{ color: "var(--primary)" }}>{algo}</span>
          <code className="flex-1 font-mono text-[11px] break-all leading-relaxed" style={{ color: "var(--fg-muted)" }}>{val}</code>
          <button onClick={() => navigator.clipboard.writeText(val)}
            className="px-2 py-1 rounded-[var(--radius-xs)] text-xs border shrink-0 transition-colors hover:border-[var(--primary)]"
            style={{ borderColor: "var(--border)" }}>复制</button>
        </div>
      ))}
    </div>
  );

  return (
    <ToolLayout title="哈希计算" description="计算 SHA-1/SHA-256/SHA-512 哈希值">
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>输入文本</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="输入要计算哈希的文本..."
            className="w-full h-28 font-mono text-sm resize-none" />
          <button onClick={compute}
            className="mt-3 px-5 py-2 rounded-[var(--radius)] text-white text-sm font-semibold transition-all active:scale-95"
            style={{ background: "var(--primary)" }}>计算哈希</button>
        </div>

        {Object.keys(results).length > 0 && <HashList data={results} title="文本哈希" />}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>文件哈希</label>
          <div className="border-2 border-dashed rounded-[var(--radius)] p-8 text-center cursor-pointer transition-colors hover:border-[var(--primary)]"
            style={{ borderColor: "var(--border)" }}
            onClick={() => document.getElementById("hash-file")?.click()}>
            <input id="hash-file" type="file" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="text-3xl mb-2 opacity-40">📁</div>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>点击选择文件</p>
          </div>
        </div>

        {Object.keys(fileResults).length > 0 && <HashList data={fileResults} title="文件哈希" />}
      </div>
    </ToolLayout>
  );
}
