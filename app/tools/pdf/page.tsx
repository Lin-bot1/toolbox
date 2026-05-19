"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";

type Mode = "merge" | "split";

export default function PdfTool() {
  const [mode, setMode] = useState<Mode>("merge");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleMerge = useCallback(async (files: FileList) => {
    setProcessing(true);
    setMessage("");
    try {
      const merged = await PDFDocument.create();
      for (const file of Array.from(files)) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      setMessage("合并完成！已自动下载");
    } catch (e) {
      setMessage("处理失败: " + (e as Error).message);
    }
    setProcessing(false);
  }, []);

  const handleSplit = useCallback(async (files: FileList) => {
    if (files.length !== 1) {
      setMessage("拆分模式请只选择一个 PDF 文件");
      return;
    }
    setProcessing(true);
    setMessage("");
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const single = await PDFDocument.create();
        const [page] = await single.copyPages(doc, [i]);
        single.addPage(page);
        const singleBytes = await single.save();
        const blob = new Blob([singleBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `page-${i + 1}.pdf`;
        a.click();
        await new Promise((r) => setTimeout(r, 200));
      }
      setMessage(`拆分完成！共 ${pageCount} 页已下载`);
    } catch (e) {
      setMessage("处理失败: " + (e as Error).message);
    }
    setProcessing(false);
  }, []);

  return (
    <ToolLayout title="PDF 合并/拆分" description="合并多个 PDF 或拆分为单独页面">
      <div className="space-y-6">
        <div className="flex gap-2">
          {(["merge", "split"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{
                borderColor: mode === m ? "var(--primary)" : "var(--border)",
                background: mode === m ? "var(--primary)" : "var(--card)",
                color: mode === m ? "white" : "var(--foreground)",
              }}>
              {m === "merge" ? "合并 PDF" : "拆分 PDF"}
            </button>
          ))}
        </div>

        <div
          onDrop={(e) => {
            e.preventDefault();
            mode === "merge" ? handleMerge(e.dataTransfer.files) : handleSplit(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400"
          style={{ borderColor: "var(--border)" }}
          onClick={() => document.getElementById("pdf-input")?.click()}
        >
          <input id="pdf-input" type="file" accept=".pdf,application/pdf" multiple={mode === "merge"}
            className="hidden"
            onChange={(e) => {
              if (!e.target.files) return;
              mode === "merge" ? handleMerge(e.target.files) : handleSplit(e.target.files);
            }} />
          <div className="text-4xl mb-3">📄</div>
          <p className="font-medium">
            {mode === "merge" ? "拖拽多个 PDF 文件到这里合并" : "拖拽一个 PDF 文件到这里拆分"}
          </p>
        </div>

        {processing && <div className="text-center py-4"><div className="inline-block animate-spin text-2xl">⏳</div><p className="mt-2">正在处理...</p></div>}
        {message && <div className="p-4 rounded-lg" style={{ background: "var(--muted)" }}>{message}</div>}
      </div>
    </ToolLayout>
  );
}
