"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const commonEntities: [string, string, string][] = [
  ["&lt;", "<", "小于号"],
  ["&gt;", ">", "大于号"],
  ["&amp;", "&", "和号"],
  ["&quot;", '"', "双引号"],
  ["&apos;", "'", "单引号"],
  ["&nbsp;", " ", "不换行空格"],
  ["&copy;", "©", "版权符号"],
  ["&reg;", "®", "注册商标"],
  ["&trade;", "™", "商标"],
  ["&mdash;", "—", "长破折号"],
  ["&ndash;", "–", "短破折号"],
  ["&hellip;", "…", "省略号"],
  ["&bull;", "•", "项目符号"],
  ["&larr;", "←", "左箭头"],
  ["&rarr;", "→", "右箭头"],
  ["&hearts;", "♥", "心形"],
];

function encodeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtml(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export default function HtmlEntityTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <ToolLayout title="HTML 实体编解码" description="HTML 特殊字符转义与反转义">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setOutput(encodeHtml(input))}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>
            编码 (转义)
          </button>
          <button onClick={() => setOutput(decodeHtml(input))}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            解码 (反转义)
          </button>
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="输入 HTML 或文本..."
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

        <div>
          <h3 className="font-semibold text-sm mb-2">常用 HTML 实体</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {commonEntities.map(([entity, char, name]) => (
              <button key={entity}
                onClick={() => setInput((prev) => prev + entity)}
                className="flex items-center gap-2 p-2 rounded text-xs border text-left hover:border-blue-400"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <span className="font-mono text-lg w-6 text-center">{char}</span>
                <span style={{ color: "var(--muted-foreground)" }}>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
