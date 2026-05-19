"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ListRandomTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [pickCount, setPickCount] = useState(1);

  const shuffle = useCallback(() => {
    const lines = input.split("\n").filter((l) => l.trim());
    const arr = [...lines];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOutput(arr);
  }, [input]);

  const pick = useCallback(() => {
    const lines = input.split("\n").filter((l) => l.trim());
    const arr = [...lines];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOutput(arr.slice(0, Math.min(pickCount, arr.length)));
  }, [input, pickCount]);

  const sort = useCallback(() => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput([...lines].sort());
  }, [input]);

  const sortReverse = useCallback(() => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput([...lines].sort().reverse());
  }, [input]);

  const sortNum = useCallback(() => {
    const lines = input.split("\n").filter((l) => l.trim());
    setOutput([...lines].sort((a, b) => parseFloat(a) - parseFloat(b)));
  }, [input]);

  return (
    <ToolLayout title="列表随机排序" description="打乱列表顺序、随机抽签、排序">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-end">
          <button onClick={shuffle} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>随机打乱</button>
          <div className="flex items-center gap-1">
            <button onClick={pick} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>随机抽取</button>
            <input type="number" min={1} max={100} value={pickCount}
              onChange={(e) => setPickCount(Number(e.target.value))}
              className="w-16 p-1.5 rounded-lg border text-sm text-center"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
            <span className="text-sm">个</span>
          </div>
          <button onClick={sort} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>正序</button>
          <button onClick={sortReverse} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>倒序</button>
          <button onClick={sortNum} className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>数字排序</button>
          {output.length > 0 && (
            <button onClick={() => navigator.clipboard.writeText(output.join("\n"))}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入列表（每行一项）</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={"苹果\n香蕉\n橘子\n葡萄\n西瓜"}
              className="w-full h-64 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">结果 ({output.length} 项)</label>
            <div className="w-full h-64 p-3 rounded-lg border overflow-auto"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              {output.map((line, i) => (
                <div key={i} className="flex gap-2 py-0.5 text-sm">
                  <span className="w-6 text-right shrink-0" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
