"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

const fieldNames = ["分钟", "小时", "日", "月", "星期"];
const fieldRanges = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12 },
  { min: 0, max: 6 },
];

const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

function parseField(expr: string, min: number, max: number): number[] {
  if (expr === "*") return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  if (expr.includes(",")) return expr.split(",").flatMap((p) => parseField(p.trim(), min, max));
  if (expr.includes("/")) {
    const [base, step] = expr.split("/");
    const start = base === "*" ? min : parseInt(base);
    const s = parseInt(step);
    const result: number[] = [];
    for (let i = start; i <= max; i += s) result.push(i);
    return result;
  }
  if (expr.includes("-")) {
    const [from, to] = expr.split("-").map(Number);
    return Array.from({ length: to - from + 1 }, (_, i) => i + from);
  }
  return [parseInt(expr)];
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "需要 5 个字段: 分钟 小时 日 月 星期";

  const [min, hour, day, month, dow] = parts;
  let desc = "";

  if (min === "*" && hour === "*" && day === "*" && month === "*" && dow === "*") return "每分钟执行";
  if (min !== "*" && hour === "*" && day === "*" && month === "*" && dow === "*") {
    const mins = parseField(min, 0, 59);
    return mins.length === 1 ? `每小时的第 ${mins[0]} 分钟执行` : `每小时的第 ${mins.join(",")} 分钟执行`;
  }

  const parts_desc: string[] = [];
  if (dow !== "*") {
    const days = parseField(dow, 0, 6);
    parts_desc.push(`星期${days.map((d) => weekdays[d]).join("、")}`);
  }
  if (day !== "*") {
    const days = parseField(day, 1, 31);
    parts_desc.push(`${days.join(",")} 日`);
  }
  if (month !== "*") {
    const months = parseField(month, 1, 12);
    parts_desc.push(`${months.join(",")} 月`);
  }
  if (hour !== "*") {
    const hours = parseField(hour, 0, 23);
    parts_desc.push(`${hours.join(",")} 时`);
  }
  if (min !== "*") {
    const mins = parseField(min, 0, 59);
    parts_desc.push(`${mins.join(",")} 分`);
  }

  return parts_desc.length > 0 ? parts_desc.join("，") + " 执行" : "自定义 cron 表达式";
}

function getNextRuns(expr: string, count = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const mins = parseField(parts[0], 0, 59);
  const hours = parseField(parts[1], 0, 23);
  const days = parseField(parts[2], 1, 31);
  const months = parseField(parts[3], 1, 12);
  const dows = parseField(parts[4], 0, 6);

  const runs: string[] = [];
  const now = new Date();
  let current = new Date(now);

  while (runs.length < count && current.getTime() - now.getTime() < 365 * 24 * 3600 * 1000) {
    current = new Date(current.getTime() + 60000);
    if (
      mins.includes(current.getMinutes()) &&
      hours.includes(current.getHours()) &&
      days.includes(current.getDate()) &&
      months.includes(current.getMonth() + 1) &&
      dows.includes(current.getDay())
    ) {
      runs.push(current.toLocaleString());
    }
  }
  return runs;
}

const presets = [
  { label: "每分钟", cron: "* * * * *" },
  { label: "每小时", cron: "0 * * * *" },
  { label: "每天零点", cron: "0 0 * * *" },
  { label: "每天上午9点", cron: "0 9 * * *" },
  { label: "每周一上午9点", cron: "0 9 * * 1" },
  { label: "每月1号零点", cron: "0 0 1 * *" },
  { label: "每5分钟", cron: "*/5 * * * *" },
  { label: "工作日上午9点", cron: "0 9 * * 1-5" },
];

export default function CronTool() {
  const [expr, setExpr] = useState("0 9 * * 1-5");

  const description = useMemo(() => describeCron(expr), [expr]);
  const nextRuns = useMemo(() => getNextRuns(expr), [expr]);
  const fields = expr.trim().split(/\s+/);

  return (
    <ToolLayout title="Cron 表达式解析" description="解析定时任务表达式，预测下次执行时间">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Cron 表达式</label>
          <input value={expr} onChange={(e) => setExpr(e.target.value)}
            placeholder="* * * * *"
            className="w-full p-3 rounded-lg border font-mono text-lg tracking-widest"
            style={{ background: "var(--card)", borderColor: "var(--border)" }} />
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button key={p.cron} onClick={() => setExpr(p.cron)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{
                borderColor: expr === p.cron ? "var(--primary)" : "var(--border)",
                background: expr === p.cron ? "var(--primary)" : "var(--card)",
                color: expr === p.cron ? "white" : "var(--foreground)",
              }}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-lg" style={{ background: "var(--muted)" }}>
          <p className="text-lg font-semibold">{description}</p>
        </div>

        {fields.length === 5 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">字段解析</h3>
            <div className="grid grid-cols-5 gap-2">
              {fieldNames.map((name, i) => (
                <div key={name} className="text-center p-2 rounded-lg" style={{ background: "var(--muted)" }}>
                  <p className="text-[10px] sm:text-xs" style={{ color: "var(--muted-foreground)" }}>{name}</p>
                  <code className="font-mono text-xs sm:text-sm font-bold">{fields[i]}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextRuns.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">接下来 5 次执行时间</h3>
            <div className="space-y-1">
              {nextRuns.map((run, i) => (
                <div key={i} className="p-2 rounded text-sm font-mono" style={{ background: "var(--muted)" }}>
                  {i + 1}. {run}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
