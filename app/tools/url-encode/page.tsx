"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function UrlEncodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try { setOutput(decodeURIComponent(input)); }
    catch { setOutput("解码失败: 无效的 URL 编码"); }
  };
  const encodeAll = () => setOutput(encodeURI(input));
  const decodeAll = () => {
    try { setOutput(decodeURI(input)); }
    catch { setOutput("解码失败: 无效的 URL 编码"); }
  };

  return (
    <ToolLayout title="URL 编解码" description="URL 与编码互转">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={encode} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>
            编码 (encodeURIComponent)
          </button>
          <button onClick={decode} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            解码 (decodeURIComponent)
          </button>
          <button onClick={encodeAll} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            编码 (encodeURI)
          </button>
          <button onClick={decodeAll} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            解码 (decodeURI)
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
              placeholder="输入文本或 URL..."
              className="w-full h-60 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">结果</label>
            <textarea value={output} readOnly placeholder="结果将显示在这里"
              className="w-full h-60 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>

        <div className="p-3 rounded-lg text-sm" style={{ background: "var(--muted)" }}>
          <p className="font-medium mb-1">区别说明</p>
          <p style={{ color: "var(--muted-foreground)" }}>
            <strong>encodeURIComponent</strong> 编码所有特殊字符，适用于查询参数值。<br />
            <strong>encodeURI</strong> 保留 URL 结构字符（: / ? # 等），适用于完整 URL。
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
