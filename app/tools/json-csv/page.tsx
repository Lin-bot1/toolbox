"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";

  const keys = [...new Set(arr.flatMap((o: Record<string, unknown>) => Object.keys(o)))];
  const rows = arr.map((obj: Record<string, unknown>) =>
    keys.map((k) => {
      const v = obj[k];
      if (v === undefined || v === null) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  );
  return [keys.join(","), ...rows].join("\n");
}

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "[]";

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (c === "," && !inQuotes) {
        result.push(current); current = "";
      } else {
        current += c;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseRow(lines[0]);
  return JSON.stringify(
    lines.slice(1).filter((l) => l.trim()).map((line) => {
      const vals = parseRow(line);
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        let v: unknown = vals[i] || "";
        if (v === "true") v = true;
        else if (v === "false") v = false;
        else if (v !== "" && !isNaN(Number(v))) v = Number(v);
        obj[h] = v;
      });
      return obj;
    }),
    null, 2
  );
}

const sampleJson = `[
  { "name": "张三", "age": 25, "city": "北京" },
  { "name": "李四", "age": 30, "city": "上海" },
  { "name": "王五", "age": 28, "city": "广州" }
]`;

const sampleCsv = `name,age,city
张三,25,北京
李四,30,上海
王五,28,广州`;

export default function JsonCsvTool() {
  const [mode, setMode] = useState<"j2c" | "c2j">("j2c");
  const [input, setInput] = useState(sampleJson);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      setOutput(mode === "j2c" ? jsonToCsv(input) : csvToJson(input));
    } catch (e) {
      setError("转换失败: " + (e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="JSON/CSV 互转" description="JSON 和 CSV 格式互相转换">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["j2c", "c2j"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(m === "j2c" ? sampleJson : sampleCsv); setOutput(""); }}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{
                borderColor: mode === m ? "var(--primary)" : "var(--border)",
                background: mode === m ? "var(--primary)" : "var(--card)",
                color: mode === m ? "white" : "var(--foreground)",
              }}>
              {m === "j2c" ? "JSON → CSV" : "CSV → JSON"}
            </button>
          ))}
          <button onClick={convert}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>转换</button>
          {output && <button onClick={() => navigator.clipboard.writeText(output)}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--border)" }}>复制</button>}
        </div>

        {error && <div className="p-3 rounded-lg text-red-600 text-sm" style={{ background: "rgba(239,68,68,0.1)" }}>{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{mode === "j2c" ? "JSON 输入" : "CSV 输入"}</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{mode === "j2c" ? "CSV 输出" : "JSON 输出"}</label>
            <textarea value={output} readOnly placeholder="转换结果"
              className="w-full h-64 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
