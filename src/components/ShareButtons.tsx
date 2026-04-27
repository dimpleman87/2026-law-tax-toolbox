/**
 * src/components/ShareButtons.tsx
 * SNS（X）シェア + 結果エクスポートボタン
 *
 * - X(Twitter) シェア
 * - PDF保存（ブラウザ印刷ダイアログ）
 * - CSV保存（結果データをダウンロード）
 * - クリップボードコピー
 */

"use client";

import { useState, useCallback } from "react";
import { ツール定義型 } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";

export interface CSVRow {
  label: string;
  value: string;
}

interface ShareButtonsProps {
  /** 対象ツールの定義 */
  ツール: ツール定義型;
  /** {result} に代入する実際の計算結果テキスト */
  結果テキスト?: string;
  /** CSV出力用の行データ（省略時は結果テキストのみCSV出力） */
  csvRows?: CSVRow[];
}

/** X(Twitter)シェアURLを生成します */
function Xシェア用URL(テキスト: string, ツールURL: string): string {
  const 投稿文 = `${テキスト}\n${ツールURL}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(投稿文)}`;
}

/** CSVダウンロード処理 */
function CSVダウンロード(ツール名: string, rows: CSVRow[], 結果テキスト?: string) {
  const now = new Date();
  const 日時 = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;

  const header = `ツール名,${ツール名}\n計算日時,${日時}\n項目,値\n`;
  const body = rows.length > 0
    ? rows.map((r) => `${csvEscape(r.label)},${csvEscape(r.value)}`).join("\n")
    : `計算結果,${csvEscape(結果テキスト ?? "")}`;

  const bom = "﻿"; // Excel対応 BOM
  const blob = new Blob([bom + header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ツール名}_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default function ShareButtons({ ツール, 結果テキスト, csvRows }: ShareButtonsProps) {
  const [選択インデックス, set選択インデックス] = useState<number | null>(null);
  const [コピー済み, setコピー済み] = useState(false);

  const テンプレート一覧 = ツール.socialPostTemplates ?? [];
  const ツールURL = `${SITE_URL}/tools/${encodeURIComponent(ツール.スラッグ)}`;
  const 結果プレースホルダー = 結果テキスト ?? "◯◯";

  const ラベル = ["📊 計算結果を報告", "💡 便利さを伝える", "📢 最新情報として紹介"];

  const handlePDF = useCallback(() => {
    window.print();
  }, []);

  const handleCSV = useCallback(() => {
    const rows: CSVRow[] = csvRows ?? [];
    CSVダウンロード(ツール.タイトル, rows, 結果テキスト);
  }, [csvRows, ツール.タイトル, 結果テキスト]);

  const handleCopy = useCallback(async () => {
    const text = `【${ツール.タイトル}】\n${結果テキスト ?? ""}\n${ツールURL}`;
    await navigator.clipboard.writeText(text);
    setコピー済み(true);
    setTimeout(() => setコピー済み(false), 2000);
  }, [ツール.タイトル, 結果テキスト, ツールURL]);

  return (
    <>
      {/* ── エクスポートボタン ── */}
      <div className="export-section" style={exportWrapStyle}>
        <p style={exportLabelStyle}>計算結果を保存・共有</p>
        <div style={exportGridStyle}>
          <button onClick={handlePDF} style={exportBtnStyle} title="PDFとして保存（ブラウザの印刷→PDFを選択）">
            📄 PDF保存
          </button>
          <button onClick={handleCSV} style={exportBtnStyle} title="計算結果をCSVファイルでダウンロード">
            📊 CSV保存
          </button>
          <button onClick={handleCopy} style={{ ...exportBtnStyle, ...(コピー済み ? exportBtnActiveStyle : {}) }}>
            {コピー済み ? "✓ コピー済み" : "📋 結果コピー"}
          </button>
        </div>
        <p style={exportHintStyle}>
          PDF保存：印刷ダイアログで「PDFに保存」を選択 ／ CSV：Excelで開けます
        </p>
      </div>

      {/* ── Xシェア ── */}
      {テンプレート一覧.length > 0 && (
        <div className="share-section">
          <div className="share-header">
            <span className="share-icon">X</span>
            <span className="share-title">計算結果をシェアする</span>
          </div>

          <div className="share-templates">
            {テンプレート一覧.map((テンプレート, i) => {
              const 投稿文 = テンプレート.replace(/\{result\}/g, 結果プレースホルダー);
              const 選択済み = 選択インデックス === i;

              return (
                <div
                  key={i}
                  className={`share-card${選択済み ? " share-card--selected" : ""}`}
                  onClick={() => set選択インデックス(選択済み ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={選択済み}
                  onKeyDown={(e) => e.key === "Enter" && set選択インデックス(選択済み ? null : i)}
                >
                  <span className="share-card-label">{ラベル[i] ?? `パターン${i + 1}`}</span>
                  <p className="share-card-text">{投稿文}</p>

                  {選択済み && (
                    <a
                      href={Xシェア用URL(投稿文, ツールURL)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="x-post-button"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Xに投稿する"
                    >
                      X でポストする
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <p className="share-hint">
            ↑ カードをタップして投稿文を確認 → 「X でポストする」でシェア
          </p>
        </div>
      )}
    </>
  );
}

/* ── スタイル定義 ── */

const exportWrapStyle: React.CSSProperties = {
  marginTop: "var(--スペース-lg)",
  padding: "var(--スペース-md)",
  background: "rgba(255,255,255,0.015)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-md)",
};

const exportLabelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  color: "var(--カラー-テキスト薄)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "10px",
};

const exportGridStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const exportBtnStyle: React.CSSProperties = {
  flex: "1 1 auto",
  minWidth: "100px",
  padding: "8px 12px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-sm)",
  color: "var(--カラー-テキスト薄)",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.15s",
  fontFamily: "var(--フォント-本文)",
  textAlign: "center" as const,
};

const exportBtnActiveStyle: React.CSSProperties = {
  background: "rgba(16,185,129,0.15)",
  borderColor: "#10b981",
  color: "#10b981",
};

const exportHintStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "var(--カラー-テキスト薄)",
  marginTop: "8px",
  lineHeight: 1.5,
};
