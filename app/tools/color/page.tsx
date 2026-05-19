"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorTool() {
  const [color, setColor] = useState("#3b82f6");
  const [bgColor, setBgColor] = useState("#ffffff");

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const bgRgb = useMemo(() => hexToRgb(bgColor), [bgColor]);
  const ratio = useMemo(() => {
    return contrastRatio(luminance(rgb.r, rgb.g, rgb.b), luminance(bgRgb.r, bgRgb.g, bgRgb.b));
  }, [rgb, bgRgb]);

  const [copied, setCopied] = useState("");
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const palette = useMemo(() => {
    const colors = [];
    for (let i = 0; i < 10; i++) {
      const { r, g, b } = rgb;
      const factor = 0.2 + i * 0.08;
      colors.push({
        hex: `#${Math.round(r * factor + 255 * (1 - factor)).toString(16).padStart(2, "0")}${Math.round(g * factor + 255 * (1 - factor)).toString(16).padStart(2, "0")}${Math.round(b * factor + 255 * (1 - factor)).toString(16).padStart(2, "0")}`,
        label: `Tint ${i + 1}`,
      });
    }
    return colors;
  }, [rgb]);

  return (
    <ToolLayout title="颜色工具" description="取色器、颜色格式转换、对比度检查">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <label className="block text-sm font-medium mb-2">选择颜色</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-20 h-20 rounded-lg cursor-pointer border-0" />
          </div>
          <div className="flex-1 space-y-2">
            {[
              { label: "HEX", value: color },
              { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
              { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-10 text-sm font-medium">{label}</span>
                <code className="flex-1 p-1.5 rounded text-sm font-mono" style={{ background: "var(--muted)" }}>
                  {value}
                </code>
                <button onClick={() => copy(value, label)}
                  className="px-2 py-1 rounded text-xs border"
                  style={{ borderColor: "var(--border)" }}>
                  {copied === label ? "已复制" : "复制"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">调色板</h3>
          <div className="flex gap-0 rounded-lg overflow-hidden">
            {palette.map((p, i) => (
              <div key={i} onClick={() => setColor(p.hex)}
                className="flex-1 h-12 cursor-pointer relative group"
                style={{ background: p.hex }}>
                <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                  {p.hex}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">对比度检查</h3>
          <div className="flex gap-4 items-start">
            <div>
              <label className="block text-sm mb-1">前景色</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0" />
            </div>
            <div>
              <label className="block text-sm mb-1">背景色</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0" />
            </div>
            <div className="flex-1">
              <div className="p-4 rounded-lg border" style={{ borderColor: "var(--border)", background: bgColor, color: color }}>
                <p className="text-lg font-bold">示例文字 Aa</p>
                <p className="text-sm">这是一段测试对比度的示例文字</p>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <span>对比度: <strong>{ratio.toFixed(2)}:1</strong></span>
                <span>AA: {ratio >= 4.5 ? "✅ 通过" : "❌ 不通过"}</span>
                <span>AAA: {ratio >= 7 ? "✅ 通过" : "❌ 不通过"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
