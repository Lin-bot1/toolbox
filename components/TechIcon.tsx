"use client";

/* 所有图标统一 24x24 viewBox，stroke=1.5，坐标严格在 0~24 内 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const P: any = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

const icons: Record<string, React.ReactNode> = {
  "图片压缩": <><rect x="3" y="3" width="18" height="18" rx="3" {...P}/><circle cx="9" cy="9" r="2" fill="currentColor" opacity=".2"/><path d="M3 16l4-5 3 3 3-4 8 8" {...P}/><path d="M15 3v4M15 17v4M3 15h4M17 15h4" {...P} strokeWidth="1"/></>,

  "图片格式转换": <><rect x="3" y="3" width="18" height="18" rx="3" {...P}/><circle cx="9" cy="9" r="2" fill="currentColor" opacity=".2"/><path d="M3 16l4-5 3 3 3-4 8 8" {...P}/><path d="M17 4l2 2-2 2" {...P} strokeWidth="1.2"/><path d="M19 6h-5" {...P} strokeWidth="1.2"/></>,

  "PDF 合并拆分": <><path d="M7 2h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" {...P}/><path d="M14 2v5h5" {...P}/><path d="M9 12h6M9 16h4" {...P} strokeWidth="1.2"/></>,

  "JSON 格式化": <><path d="M8 5c-2 0-3 1-3 3v2c0 1.2-1 1.8-1.5 2s1.5 .8 1.5 2v2c0 2 1 3 3 3" {...P}/><path d="M16 5c2 0 3 1 3 3v2c0 1.2 1 1.8 1.5 2s-1.5 .8-1.5 2v2c0 2-1 3-3 3" {...P}/></>,

  "文本处理": <><path d="M4 7h16" {...P}/><path d="M4 12h10" {...P}/><path d="M4 17h13" {...P}/><circle cx="19" cy="12" r="1.5" fill="currentColor" opacity=".2"/></>,

  "Base64 编解码": <><rect x="4" y="11" width="16" height="10" rx="2" {...P}/><path d="M8 11V8a4 4 0 018 0v3" {...P}/><circle cx="12" cy="16" r="1.5" fill="currentColor" opacity=".3"/></>,

  "正则测试器": <><circle cx="10" cy="10" r="6.5" {...P}/><path d="M15 15l5 5" {...P} strokeWidth="2"/><path d="M7.5 10h5" {...P} strokeWidth="1.2"/></>,

  "二维码生成": <><rect x="3" y="3" width="8" height="8" rx="1" {...P}/><rect x="13" y="3" width="8" height="8" rx="1" {...P}/><rect x="3" y="13" width="8" height="8" rx="1" {...P}/><rect x="5" y="5" width="4" height="4" fill="currentColor" opacity=".7" rx=".5"/><rect x="15" y="5" width="4" height="4" fill="currentColor" opacity=".7" rx=".5"/><rect x="5" y="15" width="4" height="4" fill="currentColor" opacity=".7" rx=".5"/><rect x="13" y="13" width="3" height="3" fill="currentColor" opacity=".7" rx=".5"/><rect x="18" y="18" width="3" height="3" fill="currentColor" opacity=".7" rx=".5"/></>,

  "颜色工具": <><circle cx="12" cy="12" r="9" {...P}/><circle cx="12" cy="7" r="2.5" fill="currentColor" opacity=".7"/><circle cx="8" cy="15" r="2.5" fill="currentColor" opacity=".35"/><circle cx="16" cy="15" r="2.5" fill="currentColor" opacity=".5"/></>,

  "时间戳转换": <><circle cx="12" cy="12" r="9" {...P}/><path d="M12 7v5l3 2" {...P}/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,

  "密码生成器": <><circle cx="8" cy="15" r="4.5" {...P}/><path d="M12 11l8-8" {...P}/><circle cx="8" cy="15" r="1.5" fill="currentColor" opacity=".3"/></>,

  "UUID 生成器": <><rect x="3" y="3" width="18" height="18" rx="9" {...P}/><text x="7" y="16" fontSize="10" fontWeight="800" fill="currentColor" fontFamily="monospace" letterSpacing="-0.5">ID</text></>,

  "哈希计算": <><path d="M4 9h16" {...P}/><path d="M4 15h16" {...P}/><path d="M9 4l-1.5 16" {...P}/><path d="M15 4l-1.5 16" {...P}/></>,

  "URL 编解码": <><path d="M10 14a4.5 4.5 0 006.36.36l2-2a4.5 4.5 0 00-6.36-6.36l-1 1" {...P}/><path d="M14 10a4.5 4.5 0 00-6.36-.36l-2 2a4.5 4.5 0 006.36 6.36l1-1" {...P}/></>,

  "Markdown 编辑器": <><path d="M12 20h9" {...P}/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" {...P}/></>,

  "文本对比": <><rect x="2" y="3" width="8" height="18" rx="2" {...P}/><rect x="14" y="3" width="8" height="18" rx="2" {...P}/><path d="M4.5 8h3M4.5 12h3" {...P} strokeWidth="1"/><path d="M16.5 8h3M16.5 12h3" {...P} strokeWidth="1"/><path d="M4.5 16h3" stroke="#ef4444" strokeWidth="1" strokeLinecap="round"/><path d="M16.5 16h3" stroke="#22c55e" strokeWidth="1" strokeLinecap="round"/></>,

  "JWT 解码": <><path d="M12 2l2.4 3.6h5.6l-3.2 3.2 1.2 4.8-4-2.8-4 2.8 1.2-4.8-3.2-3.2h5.6z" {...P}/><path d="M8 16h8M10 20h4" {...P} strokeWidth="1.2"/></>,

  "Cron 解析": <><circle cx="12" cy="12" r="9" {...P}/><path d="M12 7v5l2.5 1.5" {...P}/><path d="M12 2v1M12 21v1M2 12h1M21 12h1" {...P} strokeWidth="1"/></>,

  "YAML/JSON 互转": <><path d="M6 16l-3-3 3-3" {...P}/><path d="M18 8l3 3-3 3" {...P}/><path d="M3 13h18" {...P}/></>,

  "HTML 实体编解码": <><path d="M4 6l6 6-6 6" {...P}/><path d="M20 6l-6 6 6 6" {...P}/><path d="M15 4l-6 16" {...P}/></>,

  "单位换算": <><path d="M3 12h18" {...P}/><path d="M6 9l-3 3 3 3" {...P}/><path d="M18 9l3 3-3 3" {...P}/><path d="M9 7v10M12 5v14M15 7v10" {...P} strokeWidth="1" opacity=".4"/></>,

  "Lorem 生成器": <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" {...P}/><path d="M14 2v6h6" {...P}/><path d="M8 13h8M8 17h5" {...P} strokeWidth="1.2"/></>,

  "CSS 压缩": <><path d="M16 18l4-4-4-4" {...P}/><path d="M8 6L4 10l4 4" {...P}/><path d="M14 4l-4 16" {...P} strokeWidth="1" opacity=".4"/></>,

  "图片调整尺寸": <><rect x="3" y="3" width="18" height="18" rx="2" {...P}/><path d="M14 3v4h4" {...P}/><path d="M21 3l-7 7" {...P}/><path d="M3 21l7-7" {...P}/><path d="M10 21h-4v-4" {...P}/></>,

  "列表随机排序": <><path d="M4 6h6" {...P}/><path d="M4 12h10" {...P}/><path d="M4 18h4" {...P}/><path d="M18 4l2 2-2 2" {...P}/><path d="M14 8h6" {...P}/><path d="M14 16h6" {...P}/><path d="M18 14l2 2-2 2" {...P}/></>,

  "进制转换": <><rect x="3" y="3" width="18" height="18" rx="3" {...P}/><text x="5.5" y="16.5" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="monospace">01</text></>,

  "字符串分析器": <><circle cx="10.5" cy="10.5" r="6.5" {...P}/><path d="M15.5 15.5L20 20" {...P} strokeWidth="2"/><path d="M8 10.5h5M10.5 8v5" {...P} strokeWidth="1.2" opacity=".4"/></>,

  "JSON 转 TypeScript": <><path d="M8 5c-2 0-3 1-3 3v2c0 1.2-1 1.8-1.5 2s1.5 .8 1.5 2v2c0 2 1 3 3 3" {...P}/><path d="M14 5l3 3-3 3" {...P}/><rect x="13" y="13" width="7" height="7" rx="1.5" {...P} strokeWidth="1.2"/><text x="15" y="18.5" fontSize="7" fontWeight="800" fill="currentColor" fontFamily="sans-serif">T</text></>,

  "CSS 渐变生成器": <><rect x="3" y="7" width="18" height="10" rx="5" {...P}/><circle cx="8" cy="12" r="1.5" fill="currentColor" opacity=".6"/><circle cx="12" cy="12" r="1.5" fill="currentColor" opacity=".4"/><circle cx="16" cy="12" r="1.5" fill="currentColor" opacity=".2"/></>,

  "秒表/计时器": <><circle cx="12" cy="13" r="8" {...P}/><path d="M12 9v4l2 1.5" {...P}/><path d="M10 2h4" {...P}/><circle cx="12" cy="13" r="1" fill="currentColor"/></>,

  "CSS 阴影生成器": <><rect x="6" y="6" width="12" height="12" rx="2" {...P}/><path d="M6 16c-2 0-3-1-3-2" {...P} strokeWidth="1" opacity=".5"/><path d="M18 8c2 0 3 1 3 2" {...P} strokeWidth="1" opacity=".5"/></>,

  "SQL 格式化": <><ellipse cx="12" cy="6" rx="7" ry="3" {...P}/><path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" {...P}/><path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" {...P}/></>,

  "日期计算": <><rect x="3" y="4" width="18" height="17" rx="2" {...P}/><path d="M16 2v4M8 2v4M3 10h18" {...P}/><path d="M8 15h1.5M11.25 15h1.5M14.5 15h1.5" {...P} strokeWidth="1.5"/></>,

  "百分比计算": <><circle cx="7.5" cy="7.5" r="3" {...P}/><circle cx="16.5" cy="16.5" r="3" {...P}/><path d="M18 6L6 18" {...P} strokeWidth="2"/></>,

  "JSON/CSV 互转": <><path d="M8 4c-2 0-3 1-3 3v10c0 2 1 3 3 3" {...P}/><path d="M16 4c2 0 3 1 3 3v10c0 2-1 3-3 3" {...P}/><path d="M11 9h2M11 12h2M11 15h2" {...P} strokeWidth="1.2"/></>,

  "随机数据生成": <><rect x="3" y="3" width="7" height="7" rx="1.5" {...P}/><rect x="14" y="3" width="7" height="7" rx="1.5" {...P}/><rect x="3" y="14" width="7" height="7" rx="1.5" {...P}/><circle cx="5.5" cy="5.5" r=".8" fill="currentColor"/><circle cx="9" cy="5.5" r=".8" fill="currentColor" opacity=".5"/><circle cx="5.5" cy="9" r=".8" fill="currentColor" opacity=".3"/><circle cx="17" cy="5.5" r=".8" fill="currentColor"/><circle cx="20" cy="5.5" r=".8" fill="currentColor" opacity=".5"/><circle cx="5.5" cy="17" r=".8" fill="currentColor"/><path d="M18.5 17l-3 3m0 0l-1-1m1 1l-1 1m4-3l1-1" {...P} strokeWidth="1.2"/></>,

  "文字转 Unicode": <><text x="3" y="16" fontSize="12" fontWeight="700" fill="currentColor" fontFamily="sans-serif">文</text><path d="M13 12h4" {...P}/><path d="M15 10l2 2-2 2" {...P}/></>,

  "Emoji 大全": <><circle cx="12" cy="12" r="9" {...P}/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/><path d="M8 14.5c1.2 2 6.8 2 8 0" {...P}/></>,

  "简易计算器": <><rect x="5" y="2" width="14" height="20" rx="2" {...P}/><rect x="7" y="4.5" width="10" height="4" rx="1" {...P} strokeWidth="1" opacity=".4"/><circle cx="9" cy="12.5" r=".8" fill="currentColor" opacity=".6"/><circle cx="12" cy="12.5" r=".8" fill="currentColor" opacity=".6"/><circle cx="15" cy="12.5" r=".8" fill="currentColor" opacity=".6"/><circle cx="9" cy="16" r=".8" fill="currentColor" opacity=".6"/><circle cx="12" cy="16" r=".8" fill="currentColor" opacity=".6"/><circle cx="15" cy="16" r=".8" fill="currentColor" opacity=".6"/></>,

  "配色方案生成": <><circle cx="12" cy="12" r="9" {...P}/><circle cx="12" cy="7" r="2.5" fill="currentColor" opacity=".8"/><circle cx="8" cy="15" r="2.5" fill="currentColor" opacity=".4"/><circle cx="16" cy="15" r="2.5" fill="currentColor" opacity=".6"/></>,

  "提词器": <><rect x="2" y="4" width="20" height="13" rx="2" {...P}/><path d="M6 8.5h8M6 11.5h5" {...P} strokeWidth="1" opacity=".4"/><path d="M9 20h6M12 17v3" {...P}/></>,

  "手持弹幕": <><rect x="3" y="3" width="18" height="18" rx="3" {...P}/><path d="M7 10h10" {...P} strokeWidth="2.5"/><path d="M7 15h6" {...P} strokeWidth="1.5" opacity=".5"/></>,

  "简繁转换": <><rect x="3" y="3" width="18" height="18" rx="3" {...P}/><text x="5" y="13" fontSize="7" fontWeight="700" fill="currentColor">简</text><path d="M11 9h2" {...P}/><text x="13.5" y="18" fontSize="7" fontWeight="700" fill="currentColor">繁</text></>,

  "图片加水印": <><rect x="3" y="3" width="18" height="18" rx="3" {...P}/><path d="M3 16l4-5 3 3 3-4 8 8" {...P}/><circle cx="15.5" cy="8.5" r="3" {...P} strokeWidth="1" opacity=".4"/></>,

  "图片拼接": <><rect x="3" y="3" width="8" height="8" rx="2" {...P}/><rect x="13" y="3" width="8" height="8" rx="2" {...P}/><rect x="3" y="13" width="8" height="8" rx="2" {...P}/><rect x="13" y="13" width="8" height="8" rx="2" {...P}/></>,

  "文字转语音": <><path d="M11 5L6 9H2v6h4l5 4V5z" {...P}/><path d="M15.5 8.5a5 5 0 010 7" {...P}/><path d="M18 5.5a9 9 0 010 13" {...P} strokeWidth="1" opacity=".4"/></>,

  "番茄钟": <><circle cx="12" cy="13" r="8" {...P}/><path d="M12 9v4l2.5 1.5" {...P}/><path d="M9 2.5c1.5 0 2.5-.5 3-.5s1.5.5 3 .5" {...P}/><path d="M9 4.5h6" {...P} strokeWidth="1"/></>,

  "PDF 转图片": <><path d="M7 2h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" {...P}/><path d="M14 2v5h5" {...P}/><circle cx="10" cy="15" r="2" fill="currentColor" opacity=".3"/><path d="M6 19l3-4 2 2 3-4 4 6H6z" {...P} strokeWidth="1"/></>,

  "文件格式转换": <><circle cx="12" cy="12" r="9" {...P}/><path d="M8 12h8" {...P}/><path d="M14 9l3 3-3 3" {...P}/></>,

  "BMI 计算器": <><path d="M12 3a3 3 0 013 3v3a3 3 0 01-6 0V6a3 3 0 013-3z" {...P}/><path d="M7 12h10l-1 9H8z" {...P}/></>,

  "电子签名": <><path d="M17 3a2.8 2.8 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z" {...P}/><path d="M14.5 5.5l4 4" {...P}/></>,
};

const palettes = [
  { bg: "#dbeafe", fg: "#2563eb" },
  { bg: "#ede9fe", fg: "#7c3aed" },
  { bg: "#d1fae5", fg: "#059669" },
  { bg: "#fef3c7", fg: "#d97706" },
  { bg: "#fce7f3", fg: "#db2777" },
  { bg: "#cffafe", fg: "#0891b2" },
  { bg: "#fee2e2", fg: "#dc2626" },
  { bg: "#e0e7ff", fg: "#4f46e5" },
];

export default function TechIcon({ name, size = 40 }: { name: string; size?: number }) {
  const h = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const { bg, fg } = palettes[Math.abs(h) % palettes.length];

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
      <rect width="40" height="40" rx="12" fill={bg} />
      <g transform="translate(8,8)" style={{ color: fg }}>
        {icons[name] ?? <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".3" />}
      </g>
    </svg>
  );
}
