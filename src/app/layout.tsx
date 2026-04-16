import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "태평프레시 | Taepyeong Fresh - 프리미엄 신선 물류의 미래",
  description: "최고의 신선도를 약속하는 태평프레시입니다. 자연의 신선함을 고객의 식탁까지 안전하게 전달합니다.",
  keywords: ["태평프레시", "신선물류", "유통", "신선식품", "Taepyeong Fresh"],
  icons: {
    icon: "/logo.png",
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
