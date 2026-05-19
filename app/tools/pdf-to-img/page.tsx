"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PdfToImgTool() {
  const [processing, setProcessing] = useState(false);
  const [pages, setPages] = useState<{ num: number; url: string }[]>([]);
  const [message, setMessage] = useState("");

  const handleFile = useCallback(async (file: File) => {
    setProcessing(true);
    setMessage("");
    setPages([]);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
      const buf = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const result: { num: number; url: string }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        result.push({ num: i, url: canvas.toDataURL("image/png") });
      }
      setPages(result);
      setMessage("转换完成！共 " + result.length + " 页");
    } catch (e) {
      setMessage("处理失败: " + (e as Error).message);
    }
    setProcessing(false);
  }, []);

  const downloadOne = (url: string, num: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "page-" + num + ".png";
    a.click();
  };

  const downloadAll = () => {
    pages.forEach((p, i) => {
      setTimeout(() => downloadOne(p.url, p.num), i * 300);
    });
  };

  return (
    <ToolLayout title="PDF 转图片" description="PDF 页面导出为 PNG 图片">
      <div className="space-y-6">
        <div className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400"
          style={{ borderColor: "var(--border)" }}
          onClick={() => document.getElementById("pdf2img-input")?.click()}>
          <input id="pdf2img-input" type="file" accept=".pdf" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="text-4xl mb-3">&#x1F4C4;</div>
          <p className="font-medium">点击选择 PDF 文件</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>所有处理在浏览器端完成</p>
        </div>

        {processing && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin text-2xl">&#x23F3;</div>
            <p className="mt-2">正在转换...</p>
          </div>
        )}

        {message && <div className="p-3 rounded-lg text-sm" style={{ background: "var(--muted)" }}>{message}</div>}

        {pages.length > 0 && (
          <>
            <button onClick={downloadAll}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ background: "var(--primary)" }}>下载全部</button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((p) => (
                <div key={p.num} className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <img src={p.url} alt={"Page " + p.num} className="w-full" />
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>第 {p.num} 页</span>
                    <button onClick={() => downloadOne(p.url, p.num)}
                      className="px-2 py-0.5 rounded text-xs border"
                      style={{ borderColor: "var(--border)" }}>下载</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
