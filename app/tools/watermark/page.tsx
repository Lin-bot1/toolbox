"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function WatermarkTool() {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("水印文字");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#ffffff");
  const [angle, setAngle] = useState(-30);
  const [density, setDensity] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const apply = useCallback(() => {
    const img = imgRef.current;
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.font = fontSize + "px sans-serif";
    ctx.textAlign = "center";
    const step = Math.max(fontSize * 4, 100) / density;
    for (let y = -canvas.height; y < canvas.height * 2; y += step) {
      for (let x = -canvas.width; x < canvas.width * 2; x += step * 2) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }, [text, opacity, fontSize, color, angle, density]);

  // Load image when URL changes, then auto-apply
  useEffect(() => {
    if (!imageUrl) { imgRef.current = null; return; }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      apply();
    };
    img.src = imageUrl;
  }, [imageUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "watermarked.png";
    a.click();
  };

  return (
    <ToolLayout title="图片加水印" description="给图片加文字水印">
      <div className="space-y-6 animate-fade-in">
        {!imageUrl ? (
          <div
            className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors"
            style={{ borderColor: "var(--border)" }}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary)"; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "var(--border)";
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) handleFile(file);
            }}
            onClick={() => document.getElementById("wm-input")?.click()}
          >
            <input id="wm-input" type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>点击或拖拽图片到此处</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--fg-muted)" }}>水印文字</label>
                <input value={text} onChange={(e) => setText(e.target.value)} onBlur={apply}
                  className="w-full p-2 rounded-[var(--radius-xs)] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--fg-muted)" }}>透明度: {opacity}%</label>
                <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} onMouseUp={apply} onTouchEnd={apply} className="w-full mt-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--fg-muted)" }}>字号: {fontSize}px</label>
                <input type="range" min={12} max={128} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} onMouseUp={apply} onTouchEnd={apply} className="w-full mt-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--fg-muted)" }}>角度: {angle}°</label>
                <input type="range" min={-90} max={90} value={angle} onChange={(e) => setAngle(Number(e.target.value))} onMouseUp={apply} onTouchEnd={apply} className="w-full mt-2" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--fg-muted)" }}>颜色</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} onBlur={apply}
                  className="w-12 h-10 rounded cursor-pointer border-0" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--fg-muted)" }}>密度: {density}</label>
                <input type="range" min={1} max={5} value={density} onChange={(e) => setDensity(Number(e.target.value))} onMouseUp={apply} onTouchEnd={apply} className="w-24" />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={apply}
                className="px-4 py-2 rounded-[var(--radius-xs)] text-white text-sm font-medium transition-all active:scale-95"
                style={{ background: "var(--primary)" }}>应用水印</button>
              <button onClick={download}
                className="px-4 py-2 rounded-[var(--radius-xs)] text-sm font-medium border transition-all active:scale-95"
                style={{ borderColor: "var(--border)" }}>下载</button>
              <button onClick={() => setImageUrl("")}
                className="px-4 py-2 rounded-[var(--radius-xs)] text-sm font-medium border transition-all active:scale-95"
                style={{ borderColor: "var(--border)" }}>重新选择</button>
            </div>

            <div className="flex justify-center">
              <canvas ref={canvasRef} className="max-w-full rounded-[var(--radius)] border" style={{ borderColor: "var(--border)" }} />
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
