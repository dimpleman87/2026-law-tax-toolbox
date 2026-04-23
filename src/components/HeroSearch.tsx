"use client";

/**
 * src/components/HeroSearch.tsx
 * ヒーローセクション用リアルタイム検索コンポーネント
 * サーバーコンポーネントから全ツール一覧をpropsで受け取り、クライアント側でフィルタリング
 */

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./HeroSearch.module.css";

export interface ToolSearchItem {
  スラッグ: string;
  タイトル: string;
  説明: string;
  カテゴリ: string;
}

const カテゴリ絵文字: Record<string, string> = {
  "金融・投資":    "💰",
  "ビジネス・経理":"💼",
  "士業・法務":    "⚖️",
  "IT・DX推進":   "🚀",
  "テキスト解析":  "📝",
  "生活・計算":    "🛠️",
  "ペット":        "🐾",
};

interface Props {
  ツール一覧: ToolSearchItem[];
}

export default function HeroSearch({ ツール一覧 }: Props) {
  const [クエリ, setクエリ] = useState("");
  const [フォーカス, setフォーカス] = useState(false);
  const [選択インデックス, set選択インデックス] = useState(-1);
  const ラッパーRef = useRef<HTMLDivElement>(null);
  const 入力Ref = useRef<HTMLInputElement>(null);

  const 検索結果 = useMemo(() => {
    const q = クエリ.trim().toLowerCase();
    if (!q) return [];
    return ツール一覧
      .filter((t) =>
        t.タイトル.toLowerCase().includes(q) ||
        t.説明.toLowerCase().includes(q) ||
        t.カテゴリ.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [クエリ, ツール一覧]);

  const ドロップダウン表示 = フォーカス && (検索結果.length > 0 || クエリ.trim().length > 0);

  // 外クリックで閉じる
  useEffect(() => {
    function ハンドラ(e: MouseEvent) {
      if (ラッパーRef.current && !ラッパーRef.current.contains(e.target as Node)) {
        setフォーカス(false);
        set選択インデックス(-1);
      }
    }
    document.addEventListener("mousedown", ハンドラ);
    return () => document.removeEventListener("mousedown", ハンドラ);
  }, []);

  // キーボードナビゲーション
  function キーダウン(e: React.KeyboardEvent) {
    if (!ドロップダウン表示) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      set選択インデックス((prev) => Math.min(prev + 1, 検索結果.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      set選択インデックス((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setフォーカス(false);
      set選択インデックス(-1);
      入力Ref.current?.blur();
    } else if (e.key === "Enter" && 選択インデックス >= 0) {
      e.preventDefault();
      const ツール = 検索結果[選択インデックス];
      if (ツール) window.location.href = `/tools/${ツール.スラッグ}`;
    }
  }

  return (
    <div className={styles.検索ラッパー} ref={ラッパーRef}>
      <div className={`${styles.検索ボックス} ${フォーカス ? styles.検索ボックスフォーカス : ""}`}>
        <span className={styles.検索アイコン} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </span>
        <input
          ref={入力Ref}
          type="search"
          className={styles.検索入力}
          placeholder="ツールを検索（例：文字数カウント、ROAS計算、MEO診断…）"
          value={クエリ}
          onChange={(e) => { setクエリ(e.target.value); set選択インデックス(-1); }}
          onFocus={() => setフォーカス(true)}
          onKeyDown={キーダウン}
          aria-label="ツール検索"
          aria-expanded={ドロップダウン表示}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {クエリ && (
          <button
            className={styles.クリアボタン}
            onClick={() => { setクエリ(""); set選択インデックス(-1); 入力Ref.current?.focus(); }}
            aria-label="クリア"
          >
            ✕
          </button>
        )}
      </div>

      {/* ドロップダウン */}
      {ドロップダウン表示 && (
        <div className={styles.ドロップダウン} role="listbox">
          {検索結果.length > 0 ? (
            <>
              <div className={styles.ドロップダウンヘッダー}>
                <span>{検索結果.length} 件のツールが見つかりました</span>
              </div>
              {検索結果.map((ツール, i) => (
                <Link
                  key={ツール.スラッグ}
                  href={`/tools/${ツール.スラッグ}`}
                  className={`${styles.検索結果アイテム} ${i === 選択インデックス ? styles.検索結果アイテム選択 : ""}`}
                  role="option"
                  onClick={() => { setフォーカス(false); setクエリ(""); }}
                >
                  <span className={styles.結果アイコン} aria-hidden="true">
                    {カテゴリ絵文字[ツール.カテゴリ] || "🛠️"}
                  </span>
                  <div className={styles.結果テキスト}>
                    <span className={styles.結果タイトル}>{ツール.タイトル.split("｜")[0]}</span>
                    <span className={styles.結果説明}>{ツール.説明.slice(0, 50)}…</span>
                  </div>
                  <span className={styles.結果カテゴリ}>{ツール.カテゴリ}</span>
                </Link>
              ))}
            </>
          ) : (
            <div className={styles.検索無結果}>
              <span>「{クエリ}」に一致するツールは見つかりませんでした</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
