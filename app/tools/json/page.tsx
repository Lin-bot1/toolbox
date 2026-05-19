"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = (indent: number) => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, indent));
      setError("");
    } catch (e) {
      setError("JSON 格式错误: " + (e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setError("");
    } catch (e) {
      setError("JSON 格式错误: " + (e as Error).message);
      setOutput("");
    }
  };

  const sortKeys = () => {
    try {
      const sort = (obj: unknown): unknown => {
        if (Array.isArray(obj)) return obj.map(sort);
        if (obj && typeof obj === "object") {
          return Object.keys(obj as Record<string, unknown>)
            .sort()
            .reduce((acc, k) => {
              (acc as Record<string, unknown>)[k] = sort((obj as Record<string, unknown>)[k]);
              return acc;
            }, {} as Record<string, unknown>);
        }
        return obj;
      };
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(sort(obj), null, 2));
      setError("");
    } catch (e) {
      setError("JSON 格式错误: " + (e as Error).message);
    }
  };

  return (
    <ToolLayout title="JSON 格式化" description="美化、压缩、校验 JSON 数据">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "格式化", fn: () => format(2), primary: true },
            { label: "缩进4空格", fn: () => format(4) },
            { label: "压缩", fn: minify },
            { label: "排序键名", fn: sortKeys },
            { label: "复制结果", fn: () => navigator.clipboard.writeText(output), show: !!output },
          ].filter(b => b.show !== false).map((b) => (
            <button key={b.label} onClick={b.fn}
              className="px-4 py-2 rounded-[var(--radius-xs)] text-sm font-medium border transition-all duration-150 active:scale-95"
              style={{
                background: b.primary ? "var(--primary)" : "var(--bg-card)",
                color: b.primary ? "white" : "var(--fg)",
                borderColor: b.primary ? "var(--primary)" : "var(--border)",
              }}>
              {b.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-[var(--radius-xs)] text-sm flex items-center gap-2"
            style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)" }}>
            <span>⚠</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
              输入
            </label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder='粘贴 JSON 数据...'
              className="w-full h-80 font-mono text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
              输出
            </label>
            <textarea value={output} readOnly placeholder="格式化结果将显示在这里"
              className="w-full h-80 font-mono text-sm resize-none"
              style={{ background: "var(--bg-muted)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
