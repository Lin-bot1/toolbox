"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

type ConversionType = "pdf-to-word" | "word-to-pdf" | "img-to-pdf";

interface ConversionOption {
  id: ConversionType;
  label: string;
  accept: string;
  description: string;
  multiple: boolean;
}

const options: ConversionOption[] = [
  { id: "pdf-to-word", label: "PDF 转 Word", accept: ".pdf", description: "提取 PDF 文本生成 Word 文档", multiple: false },
  { id: "word-to-pdf", label: "Word 转 PDF", accept: ".doc,.docx", description: "Word 文档转为 PDF", multiple: false },
  { id: "img-to-pdf", label: "图片转 PDF", accept: ".png,.jpg,.jpeg,.webp", description: "多张图片合并为一个 PDF", multiple: true },
];

export default function FileConvertTool() {
  const [conversionType, setConversionType] = useState<ConversionType>("pdf-to-word");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const currentOption = options.find((o) => o.id === conversionType)!;

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    setFiles(Array.from(fileList));
    setMessage("");
  }, []);

  const convert = async () => {
    if (files.length === 0) {
      setMessage("请先选择文件");
      return;
    }
    setProcessing(true);
    setMessage("正在转换...");

    try {
      const formData = new FormData();
      const endpoint = `/api/convert/${conversionType}`;

      if (conversionType === "img-to-pdf") {
        files.forEach((f) => formData.append("files", f));
      } else {
        formData.append("file", files[0]);
      }

      const res = await fetch(endpoint, { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "转换失败");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      const ext: Record<ConversionType, string> = {
        "pdf-to-word": ".docx",
        "word-to-pdf": ".pdf",
        "img-to-pdf": ".pdf",
      };

      a.href = url;
      a.download = conversionType === "img-to-pdf"
        ? "images.pdf"
        : files[0].name.replace(/\.[^.]+$/, "") + ext[conversionType];
      a.click();
      URL.revokeObjectURL(url);
      setMessage("转换完成！");
    } catch (e) {
      setMessage("转换失败: " + (e as Error).message);
    }
    setProcessing(false);
  };

  return (
    <ToolLayout title="文件格式转换" description="PDF/Word/图片 互转">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button key={opt.id} onClick={() => { setConversionType(opt.id); setFiles([]); setMessage(""); }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
              style={{
                borderColor: conversionType === opt.id ? "var(--primary)" : "var(--border)",
                background: conversionType === opt.id ? "var(--primary)" : "var(--card)",
                color: conversionType === opt.id ? "white" : "var(--foreground)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{currentOption.description}</p>

        <div className="border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
          style={{ borderColor: "var(--border)" }}
          onClick={() => document.getElementById("file-convert-input")?.click()}>
          <input id="file-convert-input" type="file" accept={currentOption.accept}
            multiple={currentOption.multiple} className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
          <div className="text-4xl mb-3">&#x1F4C1;</div>
          <p className="font-medium">点击选择文件</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            {currentOption.multiple ? "可选择多张图片" : `支持 ${currentOption.accept} 格式`}
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-lg text-sm"
                style={{ background: "var(--muted)" }}>
                <span className="truncate min-w-0">{f.name}</span>
                <span style={{ color: "var(--muted-foreground)" }}>
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        )}

        <button onClick={convert} disabled={processing || files.length === 0}
          className="w-full md:w-auto px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ background: "var(--primary)" }}>
          {processing ? "转换中..." : "开始转换"}
        </button>

        {message && (
          <div className="p-3 rounded-lg text-sm" style={{ background: "var(--muted)" }}>{message}</div>
        )}
      </div>
    </ToolLayout>
  );
}
