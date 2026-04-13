/**
 * src/app/layout.tsx
 * ルートレイアウト — グローバルSEO・AdSense設定
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ヘッダー from "@/components/ヘッダー";
import フッター from "@/components/フッター";
import "@/styles/globals.css";
import { ADSENSE_CLIENT_ID, SITE_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ToolBox — 無料オンラインツール集",
    template: "%s | ToolBox 無料オンラインツール",
  },
  description:
    "文字数カウント・BMI計算・年齢計算など、日常で使える無料のWebツールを多数公開しています。登録不要・広告なしで即座に使えます。",
  keywords: ["無料ツール", "オンラインツール", "計算", "文字数", "変換"],
  authors: [{ name: "ToolBox" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "ToolBox — 無料オンラインツール集",
    title: "ToolBox — 無料オンラインツール集",
    description: "日常で使える無料Webツールを多数公開。登録不要・即座に使えます。",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox — 無料オンラインツール集",
    description: "日常で使える無料Webツールを多数公開。登録不要で即使えます。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <head>
        {/* Google AdSense — 本番公開時に有効化 */}
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {/* サイト構造化データ（JSON-LD） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ToolBox — 無料オンラインツール集",
              url: SITE_URL,
              description: "日常で使える無料Webツールを多数公開。",
              inLanguage: "ja",
            }),
          }}
        />
      </head>
      <body>
        <ヘッダー />
        <main id="main-content" role="main">
          {children}
        </main>
        <フッター />
      </body>
    </html>
  );
}
