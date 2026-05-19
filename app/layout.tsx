import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "工具箱 - 免费在线工具集合",
  description: "免费在线工具集合，包含图片压缩、格式转换、PDF处理、JSON格式化等实用工具，全部在浏览器端运行，无需上传文件到服务器。",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
