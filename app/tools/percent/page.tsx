"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PercentTool() {
  const [pct, setPct] = useState(15);
  const [num, setNum] = useState(200);
  const [part, setPart] = useState(30);
  const [total, setTotal] = useState(150);
  const [oldVal, setOldVal] = useState(100);
  const [newVal, setNewVal] = useState(120);

  return (
    <ToolLayout title="百分比计算" description="各种百分比运算">
      <div className="space-y-6">
        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="font-semibold">X% 的 Y 是多少？</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <input type="number" value={pct} onChange={(e) => setPct(Number(e.target.value))}
              className="w-20 p-2 rounded-lg border text-sm text-center"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span>% 的</span>
            <input type="number" value={num} onChange={(e) => setNum(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border text-sm text-center"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span>= <strong className="text-lg">{(pct / 100 * num).toFixed(4).replace(/\.?0+$/, "")}</strong></span>
          </div>
        </div>

        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="font-semibold">X 占 Y 的百分之多少？</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <input type="number" value={part} onChange={(e) => setPart(Number(e.target.value))}
              className="w-20 p-2 rounded-lg border text-sm text-center"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span>占</span>
            <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border text-sm text-center"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span>= <strong className="text-lg">{total !== 0 ? (part / total * 100).toFixed(2) : "∞"}%</strong></span>
          </div>
        </div>

        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="font-semibold">从 X 到 Y 增减了百分之多少？</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <span>从</span>
            <input type="number" value={oldVal} onChange={(e) => setOldVal(Number(e.target.value))}
              className="w-20 p-2 rounded-lg border text-sm text-center"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span>到</span>
            <input type="number" value={newVal} onChange={(e) => setNewVal(Number(e.target.value))}
              className="w-20 p-2 rounded-lg border text-sm text-center"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span>= <strong className={`text-lg ${newVal >= oldVal ? "text-green-600" : "text-red-500"}`}>
              {oldVal !== 0 ? ((newVal - oldVal) / oldVal * 100).toFixed(2) : "∞"}%
              {newVal >= oldVal ? " ↑" : " ↓"}
            </strong></span>
          </div>
        </div>

        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="font-semibold">常用百分比</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            {[1, 5, 10, 15, 20, 25, 30, 50, 75, 100].map((p) => (
              <div key={p} className="p-2 rounded text-center" style={{ background: "var(--muted)" }}>
                {p}% of {num} = <strong>{(p / 100 * num).toFixed(2).replace(/\.?0+$/, "")}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
