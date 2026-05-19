"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function formatCss(css: string): string {
  return css
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/\s*;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n\n")
    .replace(/\n\s*\n/g, "\n")
    .replace(/,\s*/g, ", ")
    .trim();
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*,\s*/g, ",")
    .replace(/;\}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

const sample = `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #ffffff;
  color: #171717;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

h1, h2, h3 {
  font-weight: bold;
  margin-bottom: 8px;
}`;

export default function CssMinifyTool() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");

  const format = () => setOutput(formatCss(input));
  const minify = () => setOutput(minifyCss(input));
  const copy = () => navigator.clipboard.writeText(output);

  const originalSize = new TextEncoder().encode(input).length;
  const outputSize = output ? new TextEncoder().encode(output).length : 0;

  return (
    <ToolLayout title="CSS 压缩/格式化" description="CSS 美化格式化与压缩">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={format} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>格式化</button>
          <button onClick={minify} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>压缩</button>
          {output && <button onClick={copy} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制</button>}
          {output && (
            <span className="text-sm py-1.5" style={{ color: "var(--muted-foreground)" }}>
              {originalSize} → {outputSize} 字节 ({outputSize < originalSize ? "减少" : "增加"} {Math.abs(originalSize - outputSize)} 字节)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入 CSS</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">输出结果</label>
            <textarea value={output} readOnly placeholder="结果将显示在这里"
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
