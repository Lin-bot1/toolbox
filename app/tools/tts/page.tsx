"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TTSTool() {
  const [text, setText] = useState("你好，欢迎使用文字转语音工具。");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadVoices = useCallback(() => {
    const v = speechSynthesis.getVoices();
    if (v.length > 0) setVoices(v);
  }, []);

  useState(() => {
    if (typeof window !== "undefined") {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  });

  const speak = () => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    if (voices[voiceIndex]) utter.voice = voices[voiceIndex];
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    speechSynthesis.speak(utter);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  const zhVoices = voices.filter((v) => v.lang.startsWith("zh"));
  const enVoices = voices.filter((v) => v.lang.startsWith("en"));
  const otherVoices = voices.filter((v) => !v.lang.startsWith("zh") && !v.lang.startsWith("en"));

  return (
    <ToolLayout title="文字转语音" description="浏览器朗读文字">
      <div className="space-y-6">
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="输入要朗读的文字..."
          className="w-full h-40 p-3 rounded-lg border text-sm resize-none"
          style={{ background: "var(--card)", borderColor: "var(--border)" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">语速: {rate}x</label>
            <input type="range" min={0.5} max={3} step={0.1} value={rate}
              onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">音调: {pitch}</label>
            <input type="range" min={0} max={2} step={0.1} value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        {voices.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">语音</label>
            <select value={voiceIndex} onChange={(e) => setVoiceIndex(Number(e.target.value))}
              className="w-full p-2 rounded-lg border text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              {zhVoices.length > 0 && <optgroup label="中文">
                {zhVoices.map((v, i) => <option key={i} value={voices.indexOf(v)}>{v.name} ({v.lang})</option>)}
              </optgroup>}
              {enVoices.length > 0 && <optgroup label="English">
                {enVoices.map((v, i) => <option key={i} value={voices.indexOf(v)}>{v.name} ({v.lang})</option>)}
              </optgroup>}
              {otherVoices.length > 0 && <optgroup label="其他">
                {otherVoices.map((v, i) => <option key={i} value={voices.indexOf(v)}>{v.name} ({v.lang})</option>)}
              </optgroup>}
            </select>
          </div>
        )}

        <div className="flex gap-3">
          {!speaking ? (
            <button onClick={speak}
              className="px-6 py-3 rounded-xl text-white text-lg font-medium"
              style={{ background: "#22c55e" }}>播放</button>
          ) : (
            <button onClick={stop}
              className="px-6 py-3 rounded-xl text-white text-lg font-medium"
              style={{ background: "#ef4444" }}>停止</button>
          )}
        </div>

        <div className="p-3 rounded-lg text-sm" style={{ background: "var(--muted)" }}>
          <p style={{ color: "var(--var(--muted-foreground))" }}>
            使用浏览器内置的 Web Speech API，无需联网。语音质量取决于操作系统提供的语音引擎。
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
