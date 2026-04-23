import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "태평프레시",
  description: "태평프레시는 기업용 화장지, 점보롤, 키친타올 등 고품질 제품을 공급하는 B2B 전문 유통 기업입니다.",
  keywords: ["태평프레시", "점보롤", "페이퍼타올", "기업용 화장지", "키친타올 도매", "화장지 도매", "화장지 유통"],
  openGraph: {
    title: "(주)태평프레시 - B2B 화장지 전문 유통",
    description: "합리적인 가격과 믿을 수 있는 화장지 제품 일체를 공급합니다.",
    url: "https://www.tpfresh.com",
    siteName: "태평프레시",
    images: [
      {
        url: "https://www.tpfresh.com/logo.png",
        width: 800,
        height: 600,
        alt: "태평프레시 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "(주)태평프레시 - B2B 화장지 전문 유통",
    description: "합리적인 가격과 믿을 수 있는 화장지 제품 일체를 공급합니다.",
    images: ["https://www.tpfresh.com/logo.png"],
  },
  verification: {
    other: {
      "naver-site-verification": "2eafd9ce903c6e485b21255f8a8c8f7e",
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
