"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function GradientTool() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#8b5cf6");
  const [color3, setColor3] = useState("");
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);

  const css = useMemo(() => {
    const colors = [color1, color2];
    if (color3) colors.push(color3);
    const colorStr = colors.join(", ");
    if (type === "linear") {
      return `background: linear-gradient(${angle}deg, ${colorStr});`;
    }
    return `background: radial-gradient(circle at ${posX}% ${posY}%, ${colorStr});`;
  }, [type, angle, color1, color2, color3, posX, posY]);

  const cssValue = useMemo(() => css.replace("background: ", "").replace(";", ""), [css]);

  const copy = () => navigator.clipboard.writeText(css);

  const presets = [
    { name: "日落", c1: "#f97316", c2: "#ec4899" },
    { name: "海洋", c1: "#06b6d4", c2: "#3b82f6" },
    { name: "森林", c1: "#22c55e", c2: "#14b8a6" },
    { name: "紫夜", c1: "#8b5cf6", c2: "#ec4899" },
    { name: "日出", c1: "#f59e0b", c2: "#ef4444" },
    { name: "极光", c1: "#06b6d4", c2: "#8b5cf6", c3: "#ec4899" },
  ];

  return (
    <ToolLayout title="CSS 渐变生成器" description="可视化生成 CSS 渐变代码">
      <div className="space-y-6">
        <div className="h-48 rounded-xl border" style={{ borderColor: "var(--border)", background: cssValue }} />

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setType("linear")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{
              borderColor: type === "linear" ? "var(--primary)" : "var(--border)",
              background: type === "linear" ? "var(--primary)" : "var(--card)",
              color: type === "linear" ? "white" : "var(--foreground)",
            }}>线性渐变</button>
          <button onClick={() => setType("radial")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{
              borderColor: type === "radial" ? "var(--primary)" : "var(--border)",
              background: type === "radial" ? "var(--primary)" : "var(--card)",
              color: type === "radial" ? "white" : "var(--foreground)",
            }}>径向渐变</button>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">颜色 1</label>
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border-0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">颜色 2</label>
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border-0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">颜色 3 (可选)</label>
            <div className="flex gap-1">
              <input type="color" value={color3 || "#ffffff"} onChange={(e) => setColor3(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-0" />
              <button onClick={() => setColor3(color3 ? "" : "#ffffff")}
                className="px-2 rounded text-xs border" style={{ borderColor: "var(--border)" }}>
                {color3 ? "移除" : "添加"}
              </button>
            </div>
          </div>
          {type === "linear" ? (
            <div>
              <label className="block text-sm font-medium mb-1">角度: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))}
                className="w-32" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">X: {posX}%</label>
                <input type="range" min={0} max={100} value={posX} onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Y: {posY}%</label>
                <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-24" />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">预设</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p.name} onClick={() => { setColor1(p.c1); setColor2(p.c2); setColor3(p.c3 || ""); }}
                className="w-16 h-8 rounded-lg border" style={{
                  borderColor: "var(--border)",
                  background: `linear-gradient(90deg, ${p.c1}, ${p.c2}${p.c3 ? `, ${p.c3}` : ""})`,
                }}
                title={p.name} />
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg font-mono text-sm flex justify-between items-center overflow-hidden gap-2"
          style={{ background: "var(--muted)" }}>
          <code className="break-all min-w-0">{css}</code>
          <button onClick={copy} className="px-3 py-1 rounded text-xs border shrink-0 ml-2"
            style={{ borderColor: "var(--border)" }}>复制</button>
        </div>
      </div>
    </ToolLayout>
  );
}
