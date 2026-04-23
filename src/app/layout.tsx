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
    icon: "/favicon.svg?v=5",
    shortcut: "/favicon.svg?v=5",
    apple: "/apple-icon.png?v=5",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "(주)태평프레시",
              "alternateName": "Taepyeong Fresh",
              "url": "https://www.tpfresh.com",
              "logo": "https://www.tpfresh.com/logo.png",
              "image": "https://www.tpfresh.com/logo.png",
              "description": "태평프레시는 기업용 화장지, 점보롤, 키친타올 등 고품질 제품을 공급하는 B2B 전문 유통 기업입니다.",
              "telephone": "+82-2-6954-7988",
              "faxNumber": "+82-2-6958-7987",
              "email": "365@tpfresh.com",
              "founder": {
                "@type": "Person",
                "name": "김종윤"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "용마산로 419, 은현빌딩 4층 401호",
                "addressLocality": "중랑구",
                "addressRegion": "서울특별시",
                "postalCode": "02127",
                "addressCountry": "KR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 37.5890241,
                "longitude": 127.0963398
              },
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+82-2-6954-7988",
                "contactType": "customer service",
                "availableLanguage": "Korean"
              }
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
