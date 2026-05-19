"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const formatDate = (d: Date) => {
    const p = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  };

  const tsToDate = () => { const ts = parseInt(timestamp); if (isNaN(ts)) return; setDateStr(formatDate(new Date(unit === "s" ? ts * 1000 : ts))); };
  const dateToTs = () => { const d = new Date(dateStr); if (isNaN(d.getTime())) return; setTimestamp(unit === "s" ? Math.floor(d.getTime() / 1000).toString() : d.getTime().toString()); };
  const useNow = () => setTimestamp(unit === "s" ? Math.floor(now / 1000).toString() : now.toString());

  const nowDate = new Date(now);
  const timezones = [
    { name: "UTC", offset: -nowDate.getTimezoneOffset() },
    { name: "纽约 EST", offset: -300 },
    { name: "伦敦 GMT", offset: 0 },
    { name: "东京 JST", offset: 540 },
  ];

  return (
    <ToolLayout title="时间戳转换" description="时间戳与日期互转，支持多时区">
      <div className="space-y-6 animate-fade-in">
        {/* Live clock */}
        <div className="p-5 rounded-[var(--radius)] border relative overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>当前时间</p>
          <p className="font-mono text-2xl font-bold">{formatDate(nowDate)}</p>
          <div className="flex gap-4 mt-2">
            <span className="font-mono text-sm" style={{ color: "var(--fg-muted)" }}>{Math.floor(now / 1000)} <span className="text-xs">秒</span></span>
            <span className="font-mono text-sm" style={{ color: "var(--fg-muted)" }}>{now} <span className="text-xs">毫秒</span></span>
          </div>
        </div>

        {/* Unit toggle */}
        <div className="inline-flex rounded-[var(--radius)] p-1 border" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
          {(["s", "ms"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className="px-4 py-1.5 rounded-[var(--radius-xs)] text-sm font-medium transition-all"
              style={{ background: unit === u ? "var(--primary)" : "transparent", color: unit === u ? "white" : "var(--fg-muted)" }}>
              {u === "s" ? "秒" : "毫秒"}
            </button>
          ))}
        </div>

        {/* Convert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>时间戳</label>
            <div className="flex gap-2">
              <input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="输入时间戳..."
                className="flex-1 p-2.5 rounded-[var(--radius-xs)] font-mono text-sm" />
              <button onClick={useNow}
                className="px-3 py-2 rounded-[var(--radius-xs)] text-sm border transition-colors hover:border-[var(--primary)]"
                style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>当前</button>
            </div>
            <button onClick={tsToDate}
              className="px-4 py-2 rounded-[var(--radius-xs)] text-sm text-white font-medium transition-all active:scale-95"
              style={{ background: "var(--primary)" }}>转为日期 →</button>
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>日期时间</label>
            <input value={dateStr} onChange={(e) => setDateStr(e.target.value)} placeholder="2024-01-01 12:00:00"
              className="w-full p-2.5 rounded-[var(--radius-xs)] font-mono text-sm" />
            <button onClick={dateToTs}
              className="px-4 py-2 rounded-[var(--radius-xs)] text-sm text-white font-medium transition-all active:scale-95"
              style={{ background: "var(--primary)" }}>← 转为时间戳</button>
          </div>
        </div>

        {/* Timezones */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--fg-muted)" }}>各时区当前时间</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {timezones.map((tz) => {
              const offsetMs = (tz.offset - nowDate.getTimezoneOffset()) * 60000;
              return (
                <div key={tz.name} className="p-3 rounded-[var(--radius)] border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>{tz.name}</p>
                  <p className="font-mono text-sm mt-1">{formatDate(new Date(now + offsetMs))}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
