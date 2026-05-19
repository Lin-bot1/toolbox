"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function BoxShadowTool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);

  const css = useMemo(() => {
    const hex = Math.round(opacity * 2.55).toString(16).padStart(2, "0");
    const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}${hex}`;
    return `box-shadow: ${shadow};`;
  }, [x, y, blur, spread, color, opacity, inset]);

  const presets = [
    { name: "柔和", x: 0, y: 2, b: 8, s: 0, o: 15 },
    { name: "中等", x: 0, y: 4, b: 12, s: 0, o: 20 },
    { name: "深邃", x: 0, y: 8, b: 24, s: -4, o: 30 },
    { name: "扩散", x: 0, y: 4, b: 16, s: 4, o: 15 },
    { name: "内阴影", x: 0, y: 2, b: 8, s: 0, o: 20, inset: true },
  ];

  return (
    <ToolLayout title="CSS 阴影生成器" description="可视化生成 box-shadow 代码">
      <div className="space-y-6">
        <div className="flex justify-center p-8 rounded-xl" style={{ background: "var(--muted)" }}>
          <div className="w-40 h-40 rounded-xl bg-white" style={{
            boxShadow: `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}${Math.round(opacity * 2.55).toString(16).padStart(2, "0")}`,
          }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: `X 偏移: ${x}px`, v: x, fn: setX, min: -50, max: 50 },
            { label: `Y 偏移: ${y}px`, v: y, fn: setY, min: -50, max: 50 },
            { label: `模糊: ${blur}px`, v: blur, fn: setBlur, min: 0, max: 100 },
            { label: `扩展: ${spread}px`, v: spread, fn: setSpread, min: -20, max: 50 },
          ].map(({ label, v, fn, min, max }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input type="range" min={min} max={max} value={v} onChange={(e) => fn(Number(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">颜色</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border-0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">透明度: {opacity}%</label>
            <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-32" />
          </div>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
            内阴影 (inset)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">预设</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p.name}
                onClick={() => { setX(p.x); setY(p.y); setBlur(p.b); setSpread(p.s); setOpacity(p.o); setInset(!!p.inset); }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg font-mono text-sm flex justify-between items-center overflow-hidden gap-2"
          style={{ background: "var(--muted)" }}>
          <code className="break-all min-w-0">{css}</code>
          <button onClick={() => navigator.clipboard.writeText(css)}
            className="px-3 py-1 rounded text-xs border shrink-0 ml-2"
            style={{ borderColor: "var(--border)" }}>复制</button>
        </div>
      </div>
    </ToolLayout>
  );
}
