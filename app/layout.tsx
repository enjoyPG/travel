import type { Metadata } from "next";
import { Caveat, DM_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const korean = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-korean", display: "swap" });
const latin = DM_Sans({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const script = Caveat({ subsets: ["latin"], variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  title: "여행의 조각들 | Travel Film Archive",
  description: "여행의 계획과 장면을 차곡차곡 모아두는 작은 여행 기록장",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={korean.variable + " " + latin.variable + " " + script.variable}>{children}</body>
    </html>
  );
}
