"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

function mdToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul style="padding-left:1.5em">${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:var(--primary)">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--border);padding-left:1em;margin:0.5em 0;color:var(--muted-foreground)">$1</blockquote>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}

const sample = `# 欢迎使用 Markdown 编辑器

## 基本语法

这是一个 **粗体** 和 *斜体* 的示例。

### 列表
- 第一项
- 第二项
- 第三项

### 链接
[访问 GitHub](https://github.com)

### 代码
\`const x = 42;\`

### 引用
> 这是一段引用文字

---

*开始编辑左侧内容，右侧实时预览...*`;

export default function MarkdownTool() {
  const [input, setInput] = useState(sample);

  const html = useMemo(() => mdToHtml(input), [input]);

  const copyHtml = () => navigator.clipboard.writeText(html);
  const copyMd = () => navigator.clipboard.writeText(input);

  return (
    <ToolLayout title="Markdown 编辑器" description="实时预览 Markdown，支持导出 HTML">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={copyMd} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制 Markdown</button>
          <button onClick={copyHtml} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制 HTML</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Markdown</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-[500px] p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">预览</label>
            <div className="w-full h-[500px] p-4 rounded-lg border overflow-auto prose max-w-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
              dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
