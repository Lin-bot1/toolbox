"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function jsonToTs(obj: unknown, name = "Root"): string {
  const interfaces: string[] = [];

  function getType(value: unknown, parentName: string): string {
    if (value === null) return "null";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]";
      const types = new Set(value.map((v) => getType(v, parentName + "Item")));
      return `Array<${[...types].join(" | ")}>`;
    }
    if (typeof value === "object") {
      const typeName = parentName.charAt(0).toUpperCase() + parentName.slice(1);
      const fields = Object.entries(value as Record<string, unknown>).map(([k, v]) => {
        const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `  ${safeName}: ${getType(v, k)};`;
      });
      interfaces.push(`interface ${typeName} {\n${fields.join("\n")}\n}`);
      return typeName;
    }
    return "unknown";
  }

  getType(obj, name);
  return interfaces.reverse().join("\n\n");
}

const sample = `{
  "id": 1,
  "name": "工具箱",
  "version": "1.0.0",
  "free": true,
  "tools": [
    { "name": "图片压缩", "category": "图片" },
    { "name": "JSON格式化", "category": "开发" }
  ],
  "config": {
    "theme": "auto",
    "language": "zh-CN"
  }
}`;

export default function JsonToTsTool() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(jsonToTs(obj));
      setError("");
    } catch (e) {
      setError("JSON 解析失败: " + (e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="JSON 转 TypeScript" description="JSON 自动生成 TypeScript 类型定义">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={convert}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>转换</button>
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--border)" }}>复制类型</button>
          )}
        </div>

        {error && <div className="p-3 rounded-lg text-red-600 text-sm" style={{ background: "rgba(239,68,68,0.1)" }}>{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">JSON 输入</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">TypeScript 输出</label>
            <textarea value={output} readOnly placeholder="生成的类型定义将显示在这里"
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
