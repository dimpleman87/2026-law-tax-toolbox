/**
 * src/components/AdSlot.tsx
 * 広告枠一元管理コンポーネント
 *
 * AdSense広告スロットをJSON定義の `広告配置` フィールドに従って表示します。
 * 開発環境ではプレースホルダーを表示し、本番環境でのみ実際の広告を表示します。
 *
 * 使用例:
 *   <AdSlot 位置="上部" />
 *   <AdSlot 位置="中部" スロットID="1234567890" />
 */

"use client";

import type { CSSProperties } from "react";
import Script from "next/script";
import { 広告スロットProps } from "@/lib/types";
import { ADSENSE_CLIENT_ID } from "@/lib/constants";

// ============================================================
// AdSense設定
// ============================================================

// 位置別のデフォルトスロットID（AdSenseの管理画面で取得したIDを設定）
const デフォルトスロットID: Record<string, string> = {
  top: "1111111111",
  middle: "2222222222",
  bottom: "3333333333",
  sidebar: "4444444444",
};

// 位置別のスタイル設定
const 広告スタイル: Record<string, CSSProperties> = {
  top: { display: "block", width: "100%", minHeight: "90px" },
  middle: { display: "block", width: "100%", minHeight: "250px" },
  bottom: { display: "block", width: "100%", minHeight: "90px" },
  sidebar: { display: "block", width: "300px", minHeight: "600px" },
};

// ============================================================
// コンポーネント
// ============================================================

export default function AdSlot({ 位置, スロットID, className = "" }: 広告スロットProps) {
  const 開発環境 = process.env.NODE_ENV === "development";
  const 使用スロットID = スロットID || デフォルトスロットID[位置] || "0000000000";
  const スタイル = 広告スタイル[位置] || 広告スタイル["middle"];

  // 開発環境ではプレースホルダーを表示
  if (開発環境) {
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{
          ...スタイル,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          border: "2px dashed rgba(99, 102, 241, 0.4)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "8px",
          padding: "16px",
        }}
        aria-label="AdSense slot preview"
      >
        <span style={{ fontSize: "12px", color: "rgba(99, 102, 241, 0.8)", fontWeight: "600" }}>
          📢 Ad Slot — {位置}
        </span>
        <span style={{ fontSize: "11px", color: "rgba(148, 163, 184, 0.6)" }}>
          スロットID: {使用スロットID}
        </span>
        <span style={{ fontSize: "10px", color: "rgba(148, 163, 184, 0.4)" }}>
          本番環境でAdSense広告が表示されます
        </span>
      </div>
    );
  }

  // 本番環境では実際のAdSense広告を表示
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={スタイル}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={使用スロットID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
