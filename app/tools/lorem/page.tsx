"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo"];

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const s = Array.from({ length: len }, () => randomItem(words));
  s[0] = s[0][0].toUpperCase() + s[0].slice(1);
  return s.join(" ") + ".";
}

function generateParagraph(): string {
  const count = 3 + Math.floor(Math.random() * 5);
  return Array.from({ length: count }, generateSentence).join(" ");
}

export default function LoremTool() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    if (unit === "paragraphs") {
      setOutput(Array.from({ length: count }, generateParagraph).join("\n\n"));
    } else if (unit === "sentences") {
      setOutput(Array.from({ length: count }, generateSentence).join(" "));
    } else {
      setOutput(Array.from({ length: count }, () => randomItem(words)).join(" ") + ".");
    }
  }, [count, unit]);

  return (
    <ToolLayout title="Lorem Ipsum 生成器" description="生成随机占位文本用于设计排版">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">数量</label>
            <input type="number" min={1} max={100} value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div className="flex gap-2">
            {(["paragraphs", "sentences", "words"] as const).map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: unit === u ? "var(--primary)" : "var(--border)",
                  background: unit === u ? "var(--primary)" : "var(--card)",
                  color: unit === u ? "white" : "var(--foreground)",
                }}>
                {u === "paragraphs" ? "段落" : u === "sentences" ? "句子" : "单词"}
              </button>
            ))}
          </div>
          <button onClick={generate}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>生成</button>
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--border)" }}>复制</button>
          )}
        </div>

        {output && (
          <div className="p-4 rounded-lg border leading-relaxed" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {output.split("\n\n").map((p, i) => <p key={i} className="mb-3">{p}</p>)}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
