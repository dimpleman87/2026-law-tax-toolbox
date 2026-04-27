/**
 * src/components/ShareButtons.tsx
 * SNS（X）シェア + エクスポート + フィードバック + 履歴保存
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ツール定義型 } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";
import { useCalcHistory } from "@/hooks/useCalcHistory";

export interface CSVRow {
  label: string;
  value: string;
}

interface ShareButtonsProps {
  ツール: ツール定義型;
  結果テキスト?: string;
  csvRows?: CSVRow[];
}

/** X(Twitter)シェアURL */
function Xシェア用URL(テキスト: string, ツールURL: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${テキスト}\n${ツールURL}`)}`;
}

/** CSVダウンロード */
function CSVダウンロード(ツール名: string, rows: CSVRow[], 結果テキスト?: string) {
  const now = new Date();
  const 日時 = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
  const bom = "﻿";
  const header = `ツール名,${ツール名}\n計算日時,${日時}\n項目,値\n`;
  const body = rows.length > 0
    ? rows.map((r) => `${escape(r.label)},${escape(r.value)}`).join("\n")
    : `計算結果,${escape(結果テキスト ?? "")}`;
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

function escape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g,'""')}"`;
  return s;
}

/** フィードバックをLocalStorageに保存 */
function saveFeedback(slug: string, vote: "up" | "down") {
  if (typeof window === "undefined") return;
  try {
    const key = "tfree_feedback";
    const data = JSON.parse(localStorage.getItem(key) ?? "{}");
    data[slug] = vote;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function loadFeedback(slug: string): "up" | "down" | null {
  if (typeof window === "undefined") return null;
  try {
    const data = JSON.parse(localStorage.getItem("tfree_feedback") ?? "{}");
    return data[slug] ?? null;
  } catch { return null; }
}

export default function ShareButtons({ ツール, 結果テキスト, csvRows }: ShareButtonsProps) {
  const [選択インデックス, set選択インデックス] = useState<number | null>(null);
  const [コピー済み, setコピー済み] = useState(false);
  const [フィードバック, setフィードバック] = useState<"up" | "down" | null>(null);
  const ツールURL = `${SITE_URL}/tools/${encodeURIComponent(ツール.スラッグ)}`;
  const 結果プレースホルダー = 結果テキスト ?? "◯◯";
  const ラベル = ["📊 計算結果を報告", "💡 便利さを伝える", "📢 最新情報として紹介"];

  // 履歴フック
  const { addHistory } = useCalcHistory(ツール.スラッグ, ツール.タイトル);

  // 結果テキストが変わるたびに履歴保存（デバウンス1秒）
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!結果テキスト) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => addHistory(結果テキスト), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [結果テキスト, addHistory]);

  // フィードバック読み込み
  useEffect(() => {
    setフィードバック(loadFeedback(ツール.スラッグ));
  }, [ツール.スラッグ]);

  const handleFeedback = useCallback((vote: "up" | "down") => {
    saveFeedback(ツール.スラッグ, vote);
    setフィードバック(vote);
  }, [ツール.スラッグ]);

  const handlePDF = useCallback(() => window.print(), []);

  const handleCSV = useCallback(() => {
    CSVダウンロード(ツール.タイトル, csvRows ?? [], 結果テキスト);
  }, [csvRows, ツール.タイトル, 結果テキスト]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`【${ツール.タイトル}】\n${結果テキスト ?? ""}\n${ツールURL}`);
    setコピー済み(true);
    setTimeout(() => setコピー済み(false), 2000);
  }, [ツール.タイトル, 結果テキスト, ツールURL]);

  return (
    <>
      {/* ── フィードバック ── */}
      <div style={fbWrapStyle}>
        <span style={fbLabelStyle}>このツールは役に立ちましたか？</span>
        <div style={{ display: "flex", gap: 6 }}>
          {(["up", "down"] as const).map((v) => (
            <button
              key={v}
              onClick={() => handleFeedback(v)}
              style={{
                ...fbBtnStyle,
                ...(フィードバック === v ? fbBtnActiveStyle(v) : {}),
              }}
              aria-label={v === "up" ? "役に立った" : "役に立たなかった"}
            >
              {v === "up" ? "👍 役に立った" : "👎 改善が必要"}
            </button>
          ))}
        </div>
        {フィードバック && (
          <span style={{ fontSize: 10, color: "#10b981", marginTop: 4 }}>
            フィードバックありがとうございます！
          </span>
        )}
      </div>

      {/* ── エクスポート ── */}
      <div className="export-section" style={exportWrapStyle}>
        <p style={exportLabelStyle}>計算結果を保存・共有</p>
        <div style={exportGridStyle}>
          <button onClick={handlePDF} style={exportBtnStyle}>📄 PDF保存</button>
          <button onClick={handleCSV} style={exportBtnStyle}>📊 CSV保存</button>
          <button onClick={handleCopy} style={{ ...exportBtnStyle, ...(コピー済み ? exportBtnActiveStyle : {}) }}>
            {コピー済み ? "✓ コピー済み" : "📋 結果コピー"}
          </button>
        </div>
        <p style={exportHintStyle}>PDF保存：印刷ダイアログで「PDFに保存」を選択 ／ CSV：Excelで開けます</p>
      </div>

      {/* ── Xシェア ── */}
      {(ツール.socialPostTemplates ?? []).length > 0 && (
        <div className="share-section">
          <div className="share-header">
            <span className="share-icon">X</span>
            <span className="share-title">計算結果をシェアする</span>
          </div>
          <div className="share-templates">
            {(ツール.socialPostTemplates ?? []).map((テンプレート, i) => {
              const 投稿文 = テンプレート.replace(/\{result\}/g, 結果プレースホルダー);
              const 選択済み = 選択インデックス === i;
              return (
                <div key={i} className={`share-card${選択済み ? " share-card--selected" : ""}`}
                  onClick={() => set選択インデックス(選択済み ? null : i)}
                  role="button" tabIndex={0} aria-pressed={選択済み}
                  onKeyDown={(e) => e.key === "Enter" && set選択インデックス(選択済み ? null : i)}>
                  <span className="share-card-label">{ラベル[i] ?? `パターン${i + 1}`}</span>
                  <p className="share-card-text">{投稿文}</p>
                  {選択済み && (
                    <a href={Xシェア用URL(投稿文, ツールURL)} target="_blank" rel="noopener noreferrer"
                      className="x-post-button" onClick={(e) => e.stopPropagation()}>
                      X でポストする
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          <p className="share-hint">↑ カードをタップして投稿文を確認 → 「X でポストする」でシェア</p>
        </div>
      )}
    </>
  );
}

/* ── スタイル ── */
const fbWrapStyle: React.CSSProperties = {
  marginTop: "var(--スペース-lg)",
  padding: "var(--スペース-md)",
  background: "rgba(255,255,255,0.015)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-md)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const fbLabelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "var(--カラー-テキスト薄)" };
const fbBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-sm)",
  color: "var(--カラー-テキスト薄)",
  fontSize: 12, fontWeight: 700, cursor: "pointer",
  transition: "all 0.15s",
  fontFamily: "var(--フォント-本文)",
};
const fbBtnActiveStyle = (v: "up" | "down"): React.CSSProperties => ({
  background: v === "up" ? "rgba(16,185,129,0.15)" : "rgba(242,90,204,0.15)",
  borderColor: v === "up" ? "#10b981" : "#f25acc",
  color: v === "up" ? "#10b981" : "#f25acc",
});
const exportWrapStyle: React.CSSProperties = {
  marginTop: "var(--スペース-md)",
  padding: "var(--スペース-md)",
  background: "rgba(255,255,255,0.015)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-md)",
};
const exportLabelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "var(--カラー-テキスト薄)",
  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10,
};
const exportGridStyle: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
const exportBtnStyle: React.CSSProperties = {
  flex: "1 1 auto", minWidth: 90, padding: "8px 10px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid var(--カラー-ボーダー)", borderRadius: "var(--角丸-sm)",
  color: "var(--カラー-テキスト薄)", fontSize: 12, fontWeight: 700,
  cursor: "pointer", transition: "all 0.15s",
  fontFamily: "var(--フォント-本文)", textAlign: "center" as const,
};
const exportBtnActiveStyle: React.CSSProperties = {
  background: "rgba(16,185,129,0.15)", borderColor: "#10b981", color: "#10b981",
};
const exportHintStyle: React.CSSProperties = {
  fontSize: 10, color: "var(--カラー-テキスト薄)", marginTop: 8, lineHeight: 1.5,
};
