import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
      <head>
        <Script 
          src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=ab92c2392cf2f9d1f29ad4d9f4069d9a&autoload=false"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
