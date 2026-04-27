"use client";

import { TOOL_GUIDES } from "@/data/tool-guides";

interface Props { slug: string; }

export default function ToolGuide({ slug }: Props) {
  const text = TOOL_GUIDES[slug];
  if (!text) return null;
  return (
    <section style={{
      background: "var(--カラー-サーフェス)",
      border: "1px solid var(--カラー-ボーダー)",
      borderRadius: "var(--半径-lg)",
      padding: "var(--スペース-xl)",
      marginTop: "var(--スペース-xl)",
    }}>
      <h2 style={{
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "var(--カラー-テキスト)",
        marginBottom: "var(--スペース-md)",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}>
        <span style={{ color: "var(--カラー-プライマリ)" }}>📖</span> このツールの使い方・解説
      </h2>
      <p style={{
        fontSize: "0.92rem",
        lineHeight: 1.85,
        color: "var(--カラー-テキスト薄)",
        whiteSpace: "pre-wrap",
      }}>{text}</p>
      <p style={{
        fontSize: "0.82rem",
        lineHeight: 1.7,
        color: "var(--カラー-テキスト極薄)",
        marginTop: "var(--スペース-md)",
        paddingTop: "var(--スペース-md)",
        borderTop: "1px solid var(--カラー-ボーダー)",
      }}>
        💡 <strong>ボタンの使い方：</strong>★マークでお気に入り登録するとトップページから即アクセス可能。「履歴」には直近10件の計算結果が自動保存されます。PDF出力・CSVダウンロード・コピーボタンで結果をそのまま資料や申請書類に活用できます。
      </p>
    </section>
  );
}
