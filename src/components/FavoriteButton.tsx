/**
 * src/components/FavoriteButton.tsx
 * ツールページ見出し横の「お気に入り」☆ボタン
 */

"use client";

import { useFavorite } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  slug: string;
  title: string;
  emoji: string;
}

export default function FavoriteButton({ slug, title, emoji }: FavoriteButtonProps) {
  const { isFav, toggle } = useFavorite(slug, title, emoji);

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? "お気に入りから削除" : "お気に入りに追加"}
      title={isFav ? "お気に入りから削除" : "お気に入りに追加"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        background: isFav ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${isFav ? "#f59e0b" : "var(--カラー-ボーダー)"}`,
        borderRadius: "var(--角丸-sm)",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: isFav ? "#f59e0b" : "var(--カラー-テキスト薄)",
        transition: "all 0.15s",
        fontFamily: "var(--フォント-本文)",
        marginLeft: 8,
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    >
      {isFav ? "★" : "☆"} {isFav ? "登録済み" : "お気に入り"}
    </button>
  );
}
