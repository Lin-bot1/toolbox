"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function UnicodeTool() {
  const [input, setInput] = useState("你好世界 Hello!");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encode = () => {
    setOutput([...input].map((c) => {
      const cp = c.codePointAt(0)!;
      if (cp <= 0xFFFF) return "\\u" + cp.toString(16).toUpperCase().padStart(4, "0");
      return "\\u{" + cp.toString(16).toUpperCase() + "}";
    }).join(""));
  };

  const decode = () => {
    try {
      const result = input.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      setOutput(result);
    } catch {
      setOutput("解码失败");
    }
  };

  const encodeHtml = () => {
    setOutput([...input].map((c) => "&#" + c.codePointAt(0)! + ";").join(""));
  };

  const encodeCss = () => {
    setOutput([...input].map((c) => "\\" + c.codePointAt(0)!.toString(16).toUpperCase()).join(" "));
  };

  return (
    <ToolLayout title="文字转 Unicode" description="文字与 Unicode / HTML实体 / CSS编码 互转">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setMode("encode")} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{
              borderColor: mode === "encode" ? "var(--primary)" : "var(--border)",
              background: mode === "encode" ? "var(--primary)" : "var(--card)",
              color: mode === "encode" ? "white" : "var(--foreground)",
            }}>编码</button>
          <button onClick={() => setMode("decode")} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{
              borderColor: mode === "decode" ? "var(--primary)" : "var(--border)",
              background: mode === "decode" ? "var(--primary)" : "var(--card)",
              color: mode === "decode" ? "white" : "var(--foreground)",
            }}>解码</button>
          <div className="w-px h-6 self-center" style={{ background: "var(--border)" }} />
          <button onClick={encode} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>Unicode 编码</button>
          <button onClick={encodeHtml} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>HTML 实体</button>
          <button onClick={encodeCss} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>CSS 编码</button>
          {mode === "decode" && <button onClick={decode} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>解码</button>}
          {output && <button onClick={() => navigator.clipboard.writeText(output)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">结果</label>
            <textarea value={output} readOnly
              className="w-full h-48 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
