"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function SignatureTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(3);
  const [hasContent, setHasContent] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    setHasContent(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing || !canvasRef.current || !lastPos.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  }, []);

  const download = (bg: "white" | "transparent") => {
    if (!canvasRef.current) return;
    let url: string;
    if (bg === "transparent") {
      const src = canvasRef.current;
      const tmp = document.createElement("canvas");
      tmp.width = src.width;
      tmp.height = src.height;
      const ctx = tmp.getContext("2d")!;
      ctx.drawImage(src, 0, 0);
      const imgData = ctx.getImageData(0, 0, tmp.width, tmp.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 240 && imgData.data[i + 1] > 240 && imgData.data[i + 2] > 240) {
          imgData.data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      url = tmp.toDataURL("image/png");
    } else {
      url = canvasRef.current.toDataURL("image/png");
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.png";
    a.click();
  };

  return (
    <ToolLayout title="电子签名" description="在线手写签名导出图片">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">笔颜色</label>
            <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border-0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">笔粗细: {penSize}px</label>
            <input type="range" min={1} max={10} value={penSize} onChange={(e) => setPenSize(Number(e.target.value))} className="w-24" />
          </div>
        </div>

        <div className="border-2 rounded-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <canvas ref={canvasRef}
            className="w-full cursor-crosshair touch-none"
            style={{ height: "300px", background: "#ffffff" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw} />
        </div>

        <div className="flex gap-2">
          <button onClick={clear}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--border)" }}>清除</button>
          <button onClick={() => download("white")} disabled={!hasContent}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--primary)" }}>下载 (白底)</button>
          <button onClick={() => download("transparent")} disabled={!hasContent}
            className="px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}>下载 (透明底)</button>
        </div>
      </div>
    </ToolLayout>
  );
}
