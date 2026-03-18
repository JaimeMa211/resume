import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "懒人简历",
  title: {
    default: "懒人简历",
    template: "%s | 懒人简历",
  },
  description: "懒人简历用 AI 帮你完成职位匹配、内容改写、模板套版和 PDF 导出，把做简历压缩成一条更省事的工作流。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
