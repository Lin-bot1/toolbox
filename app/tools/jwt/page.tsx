"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  headerObj: Record<string, unknown> | null;
  payloadObj: Record<string, unknown> | null;
  error: string;
}

function decodeJwtPart(part: string): Record<string, unknown> | null {
  try {
    const decoded = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { header: "", payload: "", signature: "", headerObj: null, payloadObj: null, error: "无效的 JWT 格式，需要三个部分（用 . 分隔）" };
  }
  const headerObj = decodeJwtPart(parts[0]);
  const payloadObj = decodeJwtPart(parts[1]);
  return {
    header: parts[0],
    payload: parts[1],
    signature: parts[2],
    headerObj,
    payloadObj,
    error: !headerObj || !payloadObj ? "部分解码失败，可能不是有效的 JWT" : "",
  };
}

export default function JwtTool() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtParts | null>(null);

  const decode = () => {
    if (!token.trim()) return;
    setResult(decodeJwt(token.trim()));
  };

  return (
    <ToolLayout title="JWT 解码" description="解析 JSON Web Token，查看 Header 和 Payload">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">JWT Token</label>
          <textarea value={token} onChange={(e) => setToken(e.target.value)}
            placeholder="粘贴 JWT token..."
            className="w-full h-28 p-3 rounded-lg border font-mono text-xs resize-none"
            style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          <button onClick={decode}
            className="mt-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>解码</button>
        </div>

        {result && result.error && (
          <div className="p-3 rounded-lg text-red-600 text-sm" style={{ background: "rgba(239,68,68,0.1)" }}>
            {result.error}
          </div>
        )}

        {result && result.headerObj && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Header</label>
              <pre className="p-3 rounded-lg border font-mono text-xs overflow-auto"
                style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                {JSON.stringify(result.headerObj, null, 2)}
              </pre>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payload</label>
              <pre className="p-3 rounded-lg border font-mono text-xs overflow-auto"
                style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                {JSON.stringify(result.payloadObj, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {result && result.payloadObj && (
          <div>
            <label className="block text-sm font-medium mb-2">Payload 详情</label>
            <div className="space-y-1">
              {Object.entries(result.payloadObj).map(([key, val]) => {
                let display = String(val);
                if (key === "exp" || key === "iat" || key === "nbf") {
                  display = `${val} (${new Date(Number(val) * 1000).toLocaleString()})`;
                }
                return (
                  <div key={key} className="flex gap-2 p-2 rounded text-sm"
                    style={{ background: "var(--muted)" }}>
                    <span className="font-medium shrink-0 w-24">{key}</span>
                    <code className="font-mono text-xs break-all">{display}</code>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result && result.signature && (
          <div>
            <label className="block text-sm font-medium mb-2">Signature (Base64)</label>
            <code className="block p-3 rounded-lg border font-mono text-xs break-all"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              {result.signature}
            </code>
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              签名需要密钥才能验证，此处仅展示原始编码
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
