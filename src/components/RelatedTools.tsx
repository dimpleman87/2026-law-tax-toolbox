/**
 * src/components/RelatedTools.tsx
 * 同カテゴリのおすすめツール（関連ツール動線）
 */

"use client";

import Link from "next/link";
import { getRelatedTools } from "@/data/tool-index";

interface RelatedToolsProps {
  currentSlug: string;
  category: string;
}

export default function RelatedTools({ currentSlug, category }: RelatedToolsProps) {
  const related = getRelatedTools(currentSlug, category, 3);
  if (related.length === 0) return null;

  return (
    <div style={wrapStyle}>
      <p style={labelStyle}>📌 一緒によく使われるツール</p>
      <div style={gridStyle}>
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            style={cardStyle}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--カラー-プライマリ)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--カラー-ボーダー)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
            }}
          >
            <span style={emojiStyle}>{tool.emoji}</span>
            <span style={textStyle}>{tool.title}</span>
            <span style={arrowStyle}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const wrapStyle: React.CSSProperties = {
  marginTop: "var(--スペース-lg)",
  padding: "var(--スペース-md)",
  background: "rgba(255,255,255,0.015)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-md)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--カラー-テキスト薄)",
  marginBottom: "10px",
  letterSpacing: "0.04em",
};

const gridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px 12px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-sm)",
  textDecoration: "none",
  transition: "all 0.15s",
  cursor: "pointer",
};

const emojiStyle: React.CSSProperties = {
  fontSize: "16px",
  flexShrink: 0,
};

const textStyle: React.CSSProperties = {
  flex: 1,
  fontSize: "12px",
  color: "var(--カラー-テキスト)",
  fontWeight: 600,
  lineHeight: 1.4,
};

const arrowStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--カラー-テキスト薄)",
  flexShrink: 0,
};
