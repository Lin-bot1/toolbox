"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h2 = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h2 = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h2 = ((b - r) / d + 2) / 6; break;
      case b: h2 = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h2 * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateScheme(h: number, s: number, l: number, type: string): string[] {
  const wrap = (v: number) => ((v % 360) + 360) % 360;
  switch (type) {
    case "complementary": return [hslToHex(h, s, l), hslToHex(wrap(h + 180), s, l)];
    case "analogous": return [hslToHex(wrap(h - 30), s, l), hslToHex(h, s, l), hslToHex(wrap(h + 30), s, l)];
    case "triadic": return [hslToHex(h, s, l), hslToHex(wrap(h + 120), s, l), hslToHex(wrap(h + 240), s, l)];
    case "split": return [hslToHex(h, s, l), hslToHex(wrap(h + 150), s, l), hslToHex(wrap(h + 210), s, l)];
    case "tetradic": return [hslToHex(h, s, l), hslToHex(wrap(h + 90), s, l), hslToHex(wrap(h + 180), s, l), hslToHex(wrap(h + 270), s, l)];
    case "monochromatic": return [
      hslToHex(h, s, Math.max(l - 30, 10)),
      hslToHex(h, s, Math.max(l - 15, 15)),
      hslToHex(h, s, l),
      hslToHex(h, s, Math.min(l + 15, 90)),
      hslToHex(h, s, Math.min(l + 30, 95)),
    ];
    default: return [hslToHex(h, s, l)];
  }
}

const schemeLabels: Record<string, string> = {
  complementary: "互补色",
  analogous: "类似色",
  triadic: "三色",
  split: "分裂互补",
  tetradic: "四色",
  monochromatic: "单色",
};

export default function ColorSchemeTool() {
  const [color, setColor] = useState("#3b82f6");
  const [scheme, setScheme] = useState("complementary");
  const [copied, setCopied] = useState("");

  const [h, s, l] = useMemo(() => hexToHsl(color), [color]);
  const colors = useMemo(() => generateScheme(h, s, l, scheme), [h, s, l, scheme]);

  const copy = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopied(c);
    setTimeout(() => setCopied(""), 1000);
  };

  const copyAll = () => navigator.clipboard.writeText(colors.join(", "));

  return (
    <ToolLayout title="配色方案生成" description="互补色、三色、类似色等配色方案">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">基础颜色</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-16 h-12 rounded cursor-pointer border-0" />
          </div>
          <code className="text-sm p-2 rounded" style={{ background: "var(--muted)" }}>{color}</code>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(schemeLabels).map(([k, l]) => (
            <button key={k} onClick={() => setScheme(k)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{
                borderColor: scheme === k ? "var(--primary)" : "var(--border)",
                background: scheme === k ? "var(--primary)" : "var(--card)",
                color: scheme === k ? "white" : "var(--foreground)",
              }}>{l}</button>
          ))}
        </div>

        <div className="flex rounded-xl overflow-hidden h-32">
          {colors.map((c, i) => (
            <div key={i} className="flex-1 flex items-end justify-center pb-3 cursor-pointer group relative"
              style={{ background: c }} onClick={() => copy(c)}>
              <span className="text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
                {copied === c ? "已复制" : c}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg border"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="w-8 h-8 rounded" style={{ background: c }} />
              <code className="font-mono text-sm">{c}</code>
              <button onClick={() => copy(c)}
                className="px-2 py-0.5 rounded text-xs border"
                style={{ borderColor: "var(--border)" }}>
                {copied === c ? "✓" : "复制"}
              </button>
            </div>
          ))}
        </div>

        <button onClick={copyAll}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "var(--primary)" }}>复制全部颜色</button>
      </div>
    </ToolLayout>
  );
}
