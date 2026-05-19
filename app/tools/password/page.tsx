"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PasswordTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (digits) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    const arr = new Uint32Array(length * count);
    crypto.getRandomValues(arr);
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      let pw = "";
      for (let j = 0; j < length; j++) pw += chars[arr[i * length + j] % chars.length];
      result.push(pw);
    }
    setPasswords(result);
  }, [length, upper, lower, digits, symbols, count]);

  const strength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (pw.length >= 16) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^a-zA-Z0-9]/.test(pw)) s++;
    if (s <= 2) return { label: "弱", color: "#ef4444", pct: 25 };
    if (s <= 4) return { label: "中", color: "#f59e0b", pct: 60 };
    return { label: "强", color: "#22c55e", pct: 100 };
  };

  return (
    <ToolLayout title="密码生成器" description="生成随机安全密码">
      <div className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
              长度: <span style={{ color: "var(--primary)" }}>{length}</span>
            </label>
            <input type="range" min={4} max={128} value={length}
              onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
              数量: <span style={{ color: "var(--primary)" }}>{count}</span>
            </label>
            <input type="range" min={1} max={20} value={count}
              onChange={(e) => setCount(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "大写 A-Z", checked: upper, fn: setUpper },
            { label: "小写 a-z", checked: lower, fn: setLower },
            { label: "数字 0-9", checked: digits, fn: setDigits },
            { label: "符号 !@#", checked: symbols, fn: setSymbols },
          ].map((c) => (
            <label key={c.label}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-xs)] text-sm cursor-pointer border transition-colors"
              style={{
                background: c.checked ? "var(--primary-soft)" : "var(--bg-card)",
                borderColor: c.checked ? "var(--primary)" : "var(--border)",
                color: c.checked ? "var(--primary)" : "var(--fg-muted)",
              }}>
              <input type="checkbox" checked={c.checked} onChange={(e) => c.fn(e.target.checked)} />
              {c.label}
            </label>
          ))}
        </div>

        <button onClick={generate}
          className="w-full sm:w-auto px-6 py-2.5 rounded-[var(--radius)] text-white text-sm font-semibold transition-all duration-150 active:scale-95"
          style={{ background: "var(--primary)" }}>
          生成密码
        </button>

        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pw, i) => {
              const s = strength(pw);
              return (
                <div key={i} className="p-3 rounded-[var(--radius)] border"
                  style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 font-mono text-sm break-all select-all">{pw}</code>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: s.color }}>{s.label}</span>
                      <button onClick={() => navigator.clipboard.writeText(pw)}
                        className="px-2.5 py-1 rounded-[var(--radius-xs)] text-xs border transition-colors hover:border-[var(--primary)]"
                        style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>
                        复制
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
