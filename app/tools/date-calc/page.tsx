"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "add" | "diff";

export default function DateCalcTool() {
  const [mode, setMode] = useState<Mode>("add");
  const [date1, setDate1] = useState(() => new Date().toISOString().slice(0, 10));
  const [date2, setDate2] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(7);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  const addResult = useMemo(() => {
    const d = new Date(date1);
    if (isNaN(d.getTime())) return "无效日期";
    switch (unit) {
      case "days": d.setDate(d.getDate() + amount); break;
      case "weeks": d.setDate(d.getDate() + amount * 7); break;
      case "months": d.setMonth(d.getMonth() + amount); break;
      case "years": d.setFullYear(d.getFullYear() + amount); break;
    }
    return d.toISOString().slice(0, 10);
  }, [date1, amount, unit]);

  const diffResult = useMemo(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(days / 7);
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor(diffMs / 60000);
    return { days, weeks, hours, minutes };
  }, [date1, date2]);

  const today = () => new Date().toISOString().slice(0, 10);

  return (
    <ToolLayout title="日期计算" description="日期加减天数、计算两日期差">
      <div className="space-y-6">
        <div className="flex gap-2">
          {(["add", "diff"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{
                borderColor: mode === m ? "var(--primary)" : "var(--border)",
                background: mode === m ? "var(--primary)" : "var(--card)",
                color: mode === m ? "white" : "var(--foreground)",
              }}>
              {m === "add" ? "日期加减" : "计算日期差"}
            </button>
          ))}
        </div>

        {mode === "add" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">起始日期</label>
                <div className="flex gap-1">
                  <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)}
                    className="p-2 rounded-lg border text-sm"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }} />
                  <button onClick={() => setDate1(today())}
                    className="px-2 rounded-lg text-xs border" style={{ borderColor: "var(--border)" }}>今天</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">数量</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-20 p-2 rounded-lg border text-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">单位</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}
                  className="p-2 rounded-lg border text-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <option value="days">天</option>
                  <option value="weeks">周</option>
                  <option value="months">月</option>
                  <option value="years">年</option>
                </select>
              </div>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: "var(--muted)" }}>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {date1} + {amount} {unit === "days" ? "天" : unit === "weeks" ? "周" : unit === "months" ? "月" : "年"} =
              </p>
              <p className="text-3xl font-bold mt-1">{addResult}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">日期 1</label>
                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)}
                  className="p-2 rounded-lg border text-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">日期 2</label>
                <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)}
                  className="p-2 rounded-lg border text-sm"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }} />
              </div>
            </div>
            {diffResult && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "天数", value: diffResult.days },
                  { label: "周数", value: diffResult.weeks },
                  { label: "小时", value: diffResult.hours },
                  { label: "分钟", value: diffResult.minutes },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 rounded-lg text-center" style={{ background: "var(--muted)" }}>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                    <p className="text-2xl font-bold">{value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
