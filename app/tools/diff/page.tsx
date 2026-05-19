"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

interface DiffLine {
  type: "equal" | "add" | "remove";
  left?: string;
  right?: string;
  leftNum?: number;
  rightNum?: number;
}

function computeDiff(left: string, right: string): DiffLine[] {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const result: DiffLine[] = [];
  let li = 0, ri = 0;

  while (li < leftLines.length || ri < rightLines.length) {
    if (li >= leftLines.length) {
      result.push({ type: "add", right: rightLines[ri], rightNum: ri + 1 });
      ri++;
    } else if (ri >= rightLines.length) {
      result.push({ type: "remove", left: leftLines[li], leftNum: li + 1 });
      li++;
    } else if (leftLines[li] === rightLines[ri]) {
      result.push({ type: "equal", left: leftLines[li], right: rightLines[ri], leftNum: li + 1, rightNum: ri + 1 });
      li++; ri++;
    } else {
      const nextEqual = (() => {
        for (let i = ri; i < Math.min(ri + 5, rightLines.length); i++) {
          if (leftLines[li] === rightLines[i]) return i;
        }
        return -1;
      })();
      if (nextEqual > ri) {
        while (ri < nextEqual) {
          result.push({ type: "add", right: rightLines[ri], rightNum: ri + 1 });
          ri++;
        }
      } else {
        result.push({ type: "remove", left: leftLines[li], leftNum: li + 1 });
        li++;
      }
    }
  }
  return result;
}

export default function DiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const diff = useMemo(() => computeDiff(left, right), [left, right]);
  const stats = useMemo(() => {
    const add = diff.filter((d) => d.type === "add").length;
    const remove = diff.filter((d) => d.type === "remove").length;
    return { add, remove };
  }, [diff]);

  return (
    <ToolLayout title="文本对比" description="比较两段文本的差异">
      <div className="space-y-4">
        <div className="flex gap-4 text-sm">
          <span style={{ color: "#22c55e" }}>+{stats.add} 新增</span>
          <span style={{ color: "#ef4444" }}>-{stats.remove} 删除</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">原文本</label>
            <textarea value={left} onChange={(e) => setLeft(e.target.value)}
              placeholder="粘贴原始文本..."
              className="w-full h-48 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">新文本</label>
            <textarea value={right} onChange={(e) => setRight(e.target.value)}
              placeholder="粘贴新文本..."
              className="w-full h-48 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
        </div>

        {(left || right) && (
          <div className="rounded-lg border overflow-x-auto" style={{ borderColor: "var(--border)" }}>
            <div className="font-mono text-xs">
              {diff.map((line, i) => (
                <div key={i} className="flex" style={{
                  background: line.type === "add" ? "rgba(34,197,94,0.1)"
                    : line.type === "remove" ? "rgba(239,68,68,0.1)" : "transparent",
                }}>
                  <span className="w-8 text-right pr-2 shrink-0 select-none"
                    style={{ color: "var(--muted-foreground)" }}>{line.leftNum || ""}</span>
                  <span className="w-8 text-right pr-2 shrink-0 select-none border-r"
                    style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}>
                    {line.rightNum || ""}
                  </span>
                  <span className="w-5 text-center shrink-0" style={{
                    color: line.type === "add" ? "#22c55e" : line.type === "remove" ? "#ef4444" : "var(--muted-foreground)",
                  }}>
                    {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                  </span>
                  <pre className="flex-1 px-2 py-0.5 whitespace-pre-wrap break-all">{line.left || line.right}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
