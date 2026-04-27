"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FavItem { slug: string; title: string; emoji: string; }
const STORAGE_KEY = "tfree_favorites";

export default function FavoritesSection() {
  const [favs, setFavs] = useState<FavItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch {}
  }, []);

  if (favs.length === 0) return null;

  return (
    <section
      aria-labelledby="favs-heading"
      style={{
        background: "linear-gradient(135deg, rgba(255,215,0,0.07) 0%, rgba(242,90,204,0.06) 100%)",
        border: "1px solid rgba(255,215,0,0.25)",
        borderRadius: "var(--半径-xl)",
        padding: "var(--スペース-xl) var(--スペース-xl) var(--スペース-lg)",
        margin: "var(--スペース-xl) auto",
        maxWidth: "var(--最大幅)",
        width: "calc(100% - 2rem)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "var(--スペース-md)" }}>
        <span style={{ fontSize: "1.3rem" }}>★</span>
        <h2
          id="favs-heading"
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--カラー-テキスト)",
            margin: 0,
          }}
        >
          よく使うツール <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--カラー-テキスト極薄)" }}>（{favs.length}件）</span>
        </h2>
      </div>

      <div
        role="list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {favs.map((f) => (
          <Link
            key={f.slug}
            href={`/tools/${f.slug}`}
            role="listitem"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.4rem 0.85rem",
              background: "var(--カラー-サーフェス)",
              border: "1px solid rgba(255,215,0,0.3)",
              borderRadius: "999px",
              fontSize: "0.85rem",
              color: "var(--カラー-テキスト)",
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(242,90,204,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,215,0,0.3)";
            }}
          >
            <span>{f.emoji}</span>
            <span>{f.title}</span>
          </Link>
        ))}
      </div>

      <p style={{ fontSize: "0.78rem", color: "var(--カラー-テキスト極薄)", marginTop: "var(--スペース-md)", marginBottom: 0 }}>
        各ツールの★ボタンで登録・解除できます
      </p>
    </section>
  );
}
