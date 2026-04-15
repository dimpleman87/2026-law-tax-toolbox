/**
 * src/components/RakutenWidget.tsx
 * 楽天 300x250 モーションウィジェット（フッター共通）
 *
 * 楽天アフィリエイトの JS ウィジェット形式に対応。
 * Next.js の Script コンポーネントで afterInteractive に読み込み、
 * hydration エラーを防ぐため "use client" + useEffect で描画。
 *
 * 使い方:
 *   <RakutenWidget />                     // デフォルト（300x250）
 *   <RakutenWidget className="mx-auto" /> // 中央寄せなど
 */

"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { RAKUTEN_WIDGET_CONFIG } from "@/lib/ad-links";

interface RakutenWidgetProps {
  className?: string;
}

/** グローバル変数への型補完（楽天ウィジェットが window に変数を書く） */
declare global {
  interface Window {
    rakuten_design?: string;
    rakuten_affiliateId?: string;
    rakuten_items?: string;
    rakuten_genreId?: string;
    rakuten_size?: string;
    rakuten_target?: string;
    rakuten_theme?: string;
    rakuten_border?: string;
    rakuten_auto_mode?: string;
    rakuten_genre_title?: string;
    rakuten_recommend?: string;
    rakuten_ts?: string;
  }
}

export default function RakutenWidget({ className = "" }: RakutenWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cfg = RAKUTEN_WIDGET_CONFIG;

  // ウィジェット設定を window に書き込む
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.rakuten_design      = cfg.design;
    window.rakuten_affiliateId = cfg.affiliateId;
    window.rakuten_items       = cfg.items;
    window.rakuten_genreId     = cfg.genreId;
    window.rakuten_size        = cfg.size;
    window.rakuten_target      = cfg.target;
    window.rakuten_theme       = cfg.theme;
    window.rakuten_border      = cfg.border;
    window.rakuten_auto_mode   = cfg.autoMode;
    window.rakuten_genre_title = cfg.genreTitle;
    window.rakuten_recommend   = cfg.recommend;
    window.rakuten_ts          = cfg.ts;
  }, [cfg]);

  return (
    <div className={`rakuten-widget-wrap ${className}`} style={wrapStyle}>
      <p style={labelStyle}>スポンサーリンク</p>

      {/* ウィジェットが描画されるコンテナ */}
      <div
        ref={containerRef}
        style={{ width: "300px", minHeight: "250px", margin: "0 auto" }}
        aria-label="楽天広告"
      />

      {/* 楽天ウィジェット JS（afterInteractive でページ表示後に読み込む） */}
      <Script
        id="rakuten-widget"
        src="https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106"
        strategy="afterInteractive"
      />
    </div>
  );
}

const wrapStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "rgba(148, 163, 184, 0.5)",
  marginBottom: "6px",
  letterSpacing: "0.05em",
};
