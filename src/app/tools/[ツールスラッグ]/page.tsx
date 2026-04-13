/**
 * src/app/tools/[ツールスラッグ]/page.tsx
 * 動的ツールページ（SSG）
 *
 * generateStaticParams でビルド時に全ツールページを静的生成します。
 * generateMetadata でJSONからSEOメタデータを動的生成します。
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { 全スラッグ取得, ツール取得, 全ツール取得, 同一カテゴリツール取得 } from "@/lib/load-tools";
import ツールレンダラー from "@/components/ツールレンダラー";
import ToolCard from "@/components/ツールカード";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/constants";

// ============================================================
// 静的パス生成（ビルド時全ページSSG）
// ============================================================

export async function generateStaticParams() {
  const スラッグ一覧 = await 全スラッグ取得();
  // Next.js が自動でURLエンコードするため、生のスラッグをそのまま渡す
  return スラッグ一覧.map((スラッグ) => ({
    ツールスラッグ: スラッグ,
  }));
}

// ============================================================
// SEOメタデータ（JSONから動的生成）
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ツールスラッグ: string }>;
}): Promise<Metadata> {
  const { ツールスラッグ } = await params;
  const ツール = await ツール取得(ツールスラッグ);

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
  params: Promise<{ ツールスラッグ: string }>;
}) {
  const { ツールスラッグ } = await params;
  const ツール = await ツール取得(ツールスラッグ);

  if (!ツール) {
    notFound();
  }

  // 関連ツールを取得
  const 全ツール = await 全ツール取得();
  const 手動関連ツール一覧 = ツール.関連ツール
    ? 全ツール.filter((t) => ツール.関連ツール!.includes(t.スラッグ))
    : [];

  // 同一カテゴリの他のツールを取得（内回遊率向上のため）
  const 同一カテゴリツール一覧 = await 同一カテゴリツール取得(ツールスラッグ, ツール.カテゴリ);

  // 構造化データ (SoftwareApplication)
  const 構造化データ = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": ツール.タイトル,
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "description": ツール.説明,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "url": `${SITE_URL}/tools/${encodeURIComponent(ツールスラッグ)}`
  };

  return (
    <>
      {/* 構造化データの注入 (InvalidCharacterError 調査のため一時無効化)
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(構造化データ) }}
      />
      */}

      {/* 上部広告 */}
      {ツール.広告配置.includes("top") && (
        <div className="広告ラッパー">
          <AdSlot 位置="top" />
        </div>
      )}

      <div className="tool-page-header">
        <div className="tool-page-container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <ol>
              <li><a href="/">ホーム</a></li>
              <li aria-hidden="true">&gt;</li>
              <li><a href={`/?category=${encodeURIComponent(ツール.カテゴリ)}`}>{ツール.カテゴリ}</a></li>
              <li aria-hidden="true">&gt;</li>
              <li>{ツール.スラッグ}</li>
            </ol>
          </nav>
          <h1 className="tool-page-title">{ツール.スラッグ}</h1>
          <p className="tool-page-description">{ツール.説明}</p>
        </div>
      </div>

      {/* メインツールUI */}
      <div className="tool-page-main">
        <div className="tool-page-container tool-layout">
          <div className="tool-content">
            {/* 中部広告 */}
            {ツール.広告配置.includes("middle") && (
              <div className="ad-wrapper middle-ad">
                <AdSlot 位置="middle" />
              </div>
            )}

            {/* ツールUI（ロジック種別に応じて動的レンダリング） */}
            <ツールレンダラー ツール={ツール} />
          </div>
        </div>
      </div>

      {/* 関連・おすすめツールセクション */}
      {(手動関連ツール一覧.length > 0 || 同一カテゴリツール一覧.length > 0) && (
        <section className="関連ツールセクション" aria-label="Related tools">
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
          <AdSlot 位置="bottom" />
        </div>
      )}
    </>
  );
}
