/**
 * src/app/tools/[slug]/page.tsx
 * 動的ツールページ（SSG）
 *
 * generateStaticParams でビルド時に全ツールページを静的生成します。
 * generateMetadata でJSONからSEOメタデータを動的生成します。
 *
 * ※ パラメータ名を英語 [slug] に変更（旧: [ツールスラッグ]）
 *    日本語パラメータ名は Next.js 16 Turbopack で InvalidCharacterError を起こすため
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 全スラッグ取得, ツール取得, 全ツール取得, 同一カテゴリツール取得 } from "@/lib/load-tools";
import ToolRenderer from "@/components/ToolRenderer";
import ToolCard from "@/components/ツールカード";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/constants";

// ============================================================
// カテゴリ → アンカー マッピング
// ============================================================
const カテゴリアンカーマップ: Record<string, string> = {
  "金融・投資": "finance",
  "ビジネス・経理": "business",
  "法律・税務": "legal",
  "IT・DX": "it",
  "テキスト": "text",
  "健康・生活": "health",
  "変換・計算": "convert",
};

// ============================================================
// 静的パス生成（ビルド時に全ツールページを SSG）
// ============================================================

export async function generateStaticParams() {
  const スラッグ一覧 = await 全スラッグ取得();
  return スラッグ一覧.map((スラッグ) => ({
    slug: スラッグ,
  }));
}

export const dynamicParams = false;

// ============================================================
// SEOメタデータ（JSONから動的生成）
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ツール = await ツール取得(slug);

  if (!ツール) {
    return { title: "ツールが見つかりません" };
  }

  const ページURL = `${SITE_URL}/tools/${encodeURIComponent(ツール.スラッグ)}`;

  return {
    title: ツール.タイトル,
    description: ツール.説明,
    keywords: ツール.キーワード,
    openGraph: {
      title: ツール.タイトル,
      description: ツール.説明,
      url: ページURL,
      type: "website",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary",
      title: ツール.タイトル,
      description: ツール.説明,
    },
    alternates: {
      canonical: ページURL,
    },
  };
}

// ============================================================
// ページコンポーネント
// ============================================================

export default async function ツールページ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ツール = await ツール取得(slug);

  if (!ツール) {
    notFound();
  }

  // 関連ツールを取得
  const 全ツール = await 全ツール取得();
  const 手動関連ツール一覧 = ツール.関連ツール
    ? 全ツール.filter((t) => ツール.関連ツール!.includes(t.スラッグ))
    : [];

  // 同一カテゴリの他のツールを取得（内回遊率向上のため）
  const 同一カテゴリツール一覧 = await 同一カテゴリツール取得(slug, ツール.カテゴリ);

  const ページURL = `${SITE_URL}/tools/${encodeURIComponent(ツール.スラッグ)}`;
  const カテゴリアンカー = カテゴリアンカーマップ[ツール.カテゴリ] ?? "tools";

  // JSON-LD 構造化データ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: ツール.タイトル,
    description: ツール.説明,
    url: ページURL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    inLanguage: "ja",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: ツール.カテゴリ,
          item: `${SITE_URL}/#cat-${カテゴリアンカー}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: ツール.タイトル.split("｜")[0],
          item: ページURL,
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href={`/#cat-${カテゴリアンカー}`}>
                  {ツール.カテゴリ}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>{ツール.タイトル.split("｜")[0]}</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">{ツール.タイトル}</h1>
          <p className="ツールページ説明">{ツール.説明}</p>
        </div>
      </div>

      {/* メインツールUI */}
      <main className="ツールページメイン">
        <div className="ツールページコンテナ">
          {/* 上部広告 */}
          {ツール.広告配置.includes("top") && (
            <div className="広告ラッパー" style={{ padding: 0, marginBottom: "var(--スペース-lg)" }}>
              <div className="広告ラベル">スポンサー</div>
              <AdSlot 位置="top" />
            </div>
          )}

          {/* ツールUI（ロジック種別に応じて動的レンダリング） */}
          <ToolRenderer ツール={ツール} />

          {/* 中部広告 */}
          {ツール.広告配置.includes("middle") && (
            <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
              <div className="広告ラベル">スポンサー</div>
              <AdSlot 位置="middle" />
            </div>
          )}
        </div>
      </main>

      {/* 関連・おすすめツールセクション */}
      {(手動関連ツール一覧.length > 0 || 同一カテゴリツール一覧.length > 0) && (
        <section className="関連ツールセクション" aria-label="関連ツール">
          <div className="ツールページコンテナ">
            {手動関連ツール一覧.length > 0 && (
              <>
                <h2 className="関連ツール見出し">おすすめツール</h2>
                <div className="ツールグリッド">
                  {手動関連ツール一覧.map((関連ツール) => (
                    <ToolCard key={関連ツール.スラッグ} ツール={関連ツール} />
                  ))}
                </div>
              </>
            )}

            {同一カテゴリツール一覧.length > 0 && (
              <div className="同一カテゴリセクション">
                <h2 className="関連ツール見出し">「{ツール.カテゴリ}」の他のツール</h2>
                <div className="ツールグリッド">
                  {同一カテゴリツール一覧.map((関連ツール) => (
                    <ToolCard key={関連ツール.スラッグ} ツール={関連ツール} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 下部広告 */}
      {ツール.広告配置.includes("bottom") && (
        <div className="広告ラッパー">
          <div className="広告ラベル">スポンサー</div>
          <AdSlot 位置="bottom" />
        </div>
      )}
    </>
  );
}
