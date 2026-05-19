"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TextTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const stats = useMemo(() => {
    const text = input.trim();
    if (!text) return { chars: 0, words: 0, lines: 0, chineseChars: 0 };
    return { chars: text.length, words: text.split(/\s+/).filter(Boolean).length, lines: text.split(/\n/).length, chineseChars: (text.match(/[一-鿿]/g) || []).length };
  }, [input]);

  const actions = [
    { label: "去重", fn: () => setOutput([...new Set(input.split("\n"))].join("\n")) },
    { label: "排序 A-Z", fn: () => setOutput(input.split("\n").sort().join("\n")) },
    { label: "排序数字", fn: () => setOutput(input.split("\n").sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n")) },
    { label: "删空行", fn: () => setOutput(input.split("\n").filter((l) => l.trim()).join("\n")) },
    { label: "去空格", fn: () => setOutput(input.split("\n").map((l) => l.trim()).join("\n")) },
    { label: "大写", fn: () => setOutput(input.toUpperCase()) },
    { label: "小写", fn: () => setOutput(input.toLowerCase()) },
  ];

  return (
    <ToolLayout title="文本处理" description="去重、排序、大小写转换、字数统计">
      <div className="space-y-5">
        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "字符", val: stats.chars },
            { label: "单词", val: stats.words },
            { label: "中文", val: stats.chineseChars },
            { label: "行数", val: stats.lines },
          ].map((s) => (
            <div key={s.label} className="px-3 py-2 rounded-[var(--radius-xs)] border text-center min-w-[72px]"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-lg font-bold" style={{ color: "var(--primary)" }}>{s.val}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {actions.map(({ label, fn }) => (
            <button key={label} onClick={fn}
              className="px-3 py-1.5 rounded-[var(--radius-xs)] text-sm font-medium border transition-all active:scale-95"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              {label}
            </button>
          ))}
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-3 py-1.5 rounded-[var(--radius-xs)] text-sm font-medium text-white transition-all active:scale-95"
              style={{ background: "var(--primary)" }}>
              复制结果
            </button>
          )}
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>输入</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴文本..." className="w-full h-80 font-mono text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>输出</label>
            <textarea value={output} readOnly placeholder="结果将显示在这里"
              className="w-full h-80 font-mono text-sm resize-none" style={{ background: "var(--bg-muted)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
