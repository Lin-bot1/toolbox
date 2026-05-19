"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

const categories: Record<string, { units: Record<string, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }> }> = {
  length: {
    units: {
      mm: { label: "毫米 (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      cm: { label: "厘米 (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      m: { label: "米 (m)", toBase: (v) => v, fromBase: (v) => v },
      km: { label: "千米 (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      in: { label: "英寸 (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      ft: { label: "英尺 (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      mi: { label: "英里 (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    },
  },
  weight: {
    units: {
      mg: { label: "毫克 (mg)", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      g: { label: "克 (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      kg: { label: "千克 (kg)", toBase: (v) => v, fromBase: (v) => v },
      t: { label: "吨 (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      lb: { label: "磅 (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      oz: { label: "盎司 (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    },
  },
  temperature: {
    units: {
      c: { label: "摄氏度 (°C)", toBase: (v) => v, fromBase: (v) => v },
      f: { label: "华氏度 (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      k: { label: "开尔文 (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
  },
  area: {
    units: {
      mm2: { label: "平方毫米", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      cm2: { label: "平方厘米", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
      m2: { label: "平方米", toBase: (v) => v, fromBase: (v) => v },
      km2: { label: "平方千米", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      acre: { label: "英亩", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    },
  },
  speed: {
    units: {
      ms: { label: "米/秒", toBase: (v) => v, fromBase: (v) => v },
      kmh: { label: "千米/时", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      mph: { label: "英里/时", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      kn: { label: "节", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    },
  },
  data: {
    units: {
      b: { label: "字节 (B)", toBase: (v) => v, fromBase: (v) => v },
      kb: { label: "千字节 (KB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mb: { label: "兆字节 (MB)", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      gb: { label: "吉字节 (GB)", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      tb: { label: "太字节 (TB)", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
    },
  },
};

const categoryLabels: Record<string, string> = {
  length: "长度", weight: "重量", temperature: "温度", area: "面积", speed: "速度", data: "数据存储",
};

export default function UnitConvertTool() {
  const [cat, setCat] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    const units = categories[cat].units;
    const base = units[fromUnit].toBase(v);
    return units[toUnit].fromBase(base).toFixed(6).replace(/\.?0+$/, "");
  }, [cat, fromUnit, toUnit, value]);

  const units = categories[cat].units;
  const unitKeys = Object.keys(units);

  return (
    <ToolLayout title="单位换算" description="长度、重量、温度、面积、速度、数据存储等单位换算">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(categories).map((c) => (
            <button key={c} onClick={() => { setCat(c); setFromUnit(Object.keys(categories[c].units)[0]); setToUnit(Object.keys(categories[c].units)[1]); }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{
                borderColor: cat === c ? "var(--primary)" : "var(--border)",
                background: cat === c ? "var(--primary)" : "var(--card)",
                color: cat === c ? "white" : "var(--foreground)",
              }}>
              {categoryLabels[c]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">从</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2.5 rounded-lg border text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              {unitKeys.map((k) => <option key={k} value={k}>{units[k].label}</option>)}
            </select>
            <input value={value} onChange={(e) => setValue(e.target.value)}
              className="w-full p-2.5 rounded-lg border text-sm mt-2 font-mono"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div className="text-center text-2xl">→</div>
          <div>
            <label className="block text-sm font-medium mb-1">到</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2.5 rounded-lg border text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              {unitKeys.map((k) => <option key={k} value={k}>{units[k].label}</option>)}
            </select>
            <div className="w-full p-2.5 rounded-lg border text-sm mt-2 font-mono font-bold"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              {result}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
