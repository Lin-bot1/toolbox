"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function BmiTool() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const bmi = useMemo(() => {
    const h = unit === "metric" ? height / 100 : height * 0.0254;
    const w = unit === "metric" ? weight : weight * 0.453592;
    if (h <= 0) return 0;
    return w / (h * h);
  }, [height, weight, unit]);

  const category = useMemo(() => {
    if (bmi < 18.5) return { label: "偏瘦", color: "#3b82f6", range: "< 18.5" };
    if (bmi < 24) return { label: "正常", color: "#22c55e", range: "18.5 - 23.9" };
    if (bmi < 28) return { label: "偏胖", color: "#f59e0b", range: "24 - 27.9" };
    return { label: "肥胖", color: "#ef4444", range: ">= 28" };
  }, [bmi]);

  const idealWeight = useMemo(() => {
    const h = unit === "metric" ? height / 100 : height * 0.0254;
    const minW = 18.5 * h * h;
    const maxW = 23.9 * h * h;
    if (unit === "metric") return minW.toFixed(1) + " - " + maxW.toFixed(1) + " kg";
    return (minW / 0.453592).toFixed(1) + " - " + (maxW / 0.453592).toFixed(1) + " lb";
  }, [height, unit]);

  const barPosition = Math.min(Math.max((bmi - 14) / (35 - 14) * 100, 0), 100);

  return (
    <ToolLayout title="BMI 计算器" description="身体质量指数计算">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{
                borderColor: unit === u ? "var(--primary)" : "var(--border)",
                background: unit === u ? "var(--primary)" : "var(--card)",
                color: unit === u ? "white" : "var(--foreground)",
              }}>
              {u === "metric" ? "公制 (cm/kg)" : "英制 (in/lb)"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            身高: {height} {unit === "metric" ? "cm" : "in"}
          </label>
          <input type="range" min={unit === "metric" ? 100 : 40} max={unit === "metric" ? 220 : 87}
            value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            体重: {weight} {unit === "metric" ? "kg" : "lb"}
          </label>
          <input type="range" min={unit === "metric" ? 30 : 66} max={unit === "metric" ? 200 : 440}
            value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </div>

        <div className="p-6 rounded-xl text-center" style={{ background: "var(--muted)" }}>
          <p className="text-4xl md:text-5xl font-bold" style={{ color: category.color }}>{bmi.toFixed(1)}</p>
          <p className="text-xl font-semibold mt-2" style={{ color: category.color }}>{category.label}</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>BMI 范围: {category.range}</p>
        </div>

        <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="absolute inset-0 flex">
            <div className="flex-1" style={{ background: "#3b82f6" }} />
            <div className="flex-[2]" style={{ background: "#22c55e" }} />
            <div className="flex-1" style={{ background: "#f59e0b" }} />
            <div className="flex-1" style={{ background: "#ef4444" }} />
          </div>
          <div className="absolute top-0 w-1 h-full bg-black shadow" style={{ left: barPosition + "%" }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>14 偏瘦</span><span>18.5 正常</span><span>24 偏胖</span><span>28 肥胖</span><span>35</span>
        </div>

        <div className="p-3 rounded-lg text-sm" style={{ background: "var(--muted)" }}>
          <p>理想体重范围: <strong>{idealWeight}</strong></p>
        </div>
      </div>
    </ToolLayout>
  );
}
