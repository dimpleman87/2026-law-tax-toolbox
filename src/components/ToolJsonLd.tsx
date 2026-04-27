/**
 * src/components/ToolJsonLd.tsx
 * 計算ツール用 JSON-LD 構造化データ
 * WebApplication + FAQPage スキーマを出力
 */

import { SITE_URL } from "@/lib/constants";

interface ToolJsonLdProps {
  スラッグ: string;
  タイトル: string;
  説明: string;
  カテゴリ: string;
}

export default function ToolJsonLd({ スラッグ, タイトル, 説明, カテゴリ }: ToolJsonLdProps) {
  const url = `${SITE_URL}/tools/${スラッグ}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#webapp`,
        "name": タイトル,
        "description": 説明,
        "url": url,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "JPY",
        },
        "inLanguage": "ja",
        "genre": カテゴリ,
        "isAccessibleForFree": true,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": カテゴリ, "item": `${SITE_URL}/#cat` },
          { "@type": "ListItem", "position": 3, "name": タイトル, "item": url },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
