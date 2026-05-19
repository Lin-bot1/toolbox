"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || obj.includes("'") || obj === "")
      return JSON.stringify(obj);
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => {
      if (typeof item === "object" && item !== null) {
        const inner = jsonToYaml(item, indent + 1);
        const lines = inner.split("\n");
        return `${pad}- ${lines[0].trim()}\n${lines.slice(1).map((l) => `${pad}  ${l.trim()}`).join("\n")}`;
      }
      return `${pad}- ${jsonToYaml(item, indent + 1)}`;
    }).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries.map(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        return `${pad}${key}:\n${jsonToYaml(val, indent + 1)}`;
      }
      return `${pad}${key}: ${jsonToYaml(val, indent + 1)}`;
    }).join("\n");
  }
  return String(obj);
}

function yamlToJson(yaml: string): unknown {
  const lines = yaml.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));

  function parse(startIndent: number, startIndex: number): { value: unknown; endIndex: number } {
    let i = startIndex;
    const firstLine = lines[i];
    if (!firstLine) return { value: null, endIndex: i };
    const trimmed = firstLine.trim();

    if (trimmed.startsWith("- ")) {
      const arr: unknown[] = [];
      while (i < lines.length) {
        const line = lines[i];
        const indent = line.length - line.trimStart().length;
        if (indent < startIndent) break;
        if (indent === startIndent && line.trim().startsWith("- ")) {
          const content = line.trim().slice(2);
          if (content.includes(": ")) {
            const obj: Record<string, unknown> = {};
            const [k, ...vParts] = content.split(": ");
            obj[k.trim()] = parseSimpleValue(vParts.join(": "));
            arr.push(obj);
          } else {
            arr.push(parseSimpleValue(content));
          }
        } else if (indent > startIndent) {
          break;
        }
        i++;
      }
      return { value: arr, endIndex: i };
    }

    const obj: Record<string, unknown> = {};
    while (i < lines.length) {
      const line = lines[i];
      const indent = line.length - line.trimStart().length;
      if (indent < startIndent) break;
      if (indent === startIndent) {
        const trimmed2 = line.trim();
        if (trimmed2.includes(":")) {
          const colonIdx = trimmed2.indexOf(":");
          const key = trimmed2.slice(0, colonIdx).trim();
          const val = trimmed2.slice(colonIdx + 1).trim();
          if (val === "" || val === "|" || val === ">") {
            i++;
            if (i < lines.length && lines[i].length - lines[i].trimStart().length > startIndent) {
              const sub = parse(startIndent + 1, i);
              obj[key] = sub.value;
              i = sub.endIndex;
              continue;
            } else {
              obj[key] = val === "|" || val === ">" ? "" : null;
            }
          } else {
            obj[key] = parseSimpleValue(val);
          }
        }
      }
      i++;
    }
    return { value: Object.keys(obj).length > 0 ? obj : parseSimpleValue(trimmed), endIndex: i };
  }

  return parse(0, 0).value;
}

function parseSimpleValue(val: string): unknown {
  if (val === "null" || val === "~") return null;
  if (val === "true") return true;
  if (val === "false") return false;
  if (/^-?\d+$/.test(val)) return parseInt(val);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    return val.slice(1, -1);
  if (val.startsWith("[") && val.endsWith("]")) {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

const sampleJson = `{
  "name": "工具箱",
  "version": "1.0.0",
  "tools": ["图片压缩", "PDF合并", "JSON格式化"],
  "config": {
    "free": true,
    "clientSide": true
  }
}`;

export default function YamlJsonTool() {
  const [input, setInput] = useState(sampleJson);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"j2y" | "y2j">("j2y");

  const convert = () => {
    try {
      setError("");
      if (mode === "j2y") {
        const obj = JSON.parse(input);
        setOutput(jsonToYaml(obj));
      } else {
        const obj = yamlToJson(input);
        setOutput(JSON.stringify(obj, null, 2));
      }
    } catch (e) {
      setError("转换失败: " + (e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="YAML / JSON 互转" description="JSON 和 YAML 格式互相转换">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["j2y", "y2j"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{
                borderColor: mode === m ? "var(--primary)" : "var(--border)",
                background: mode === m ? "var(--primary)" : "var(--card)",
                color: mode === m ? "white" : "var(--foreground)",
              }}>
              {m === "j2y" ? "JSON → YAML" : "YAML → JSON"}
            </button>
          ))}
          <button onClick={convert}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>转换</button>
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--border)" }}>复制</button>
          )}
        </div>

        {error && <div className="p-3 rounded-lg text-red-600 text-sm" style={{ background: "rgba(239,68,68,0.1)" }}>{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{mode === "j2y" ? "JSON 输入" : "YAML 输入"}</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{mode === "j2y" ? "YAML 输出" : "JSON 输出"}</label>
            <textarea value={output} readOnly placeholder="转换结果"
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
