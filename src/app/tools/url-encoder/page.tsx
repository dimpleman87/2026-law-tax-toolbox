"use client";

import { useState } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import FavoriteButton from "@/components/FavoriteButton";
import RelatedTools from "@/components/RelatedTools";
import CalcHistory from "@/components/CalcHistory";
import ToolJsonLd from "@/components/ToolJsonLd";
import styles from "./url-encoder.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "url-encoder",
  タイトル: "URLエンコード・デコードツール",
  説明: "日本語URLをエンコード/デコード",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "conversion" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["URLエンコード結果: {result}"],
};

export default function URLエンコーダーページ() {
  const [入力値, set入力値] = useState("");
  const [出力値, set出力値] = useState("");
  const [モード, setモード] = useState<"encode" | "decode">("encode");
  const [コピー済み, setコピー済み] = useState(false);

  function 変換実行() {
    if (!入力値.trim()) return;
    try {
      if (モード === "encode") {
        set出力値(encodeURIComponent(入力値));
      } else {
        set出力値(decodeURIComponent(入力値));
      }
    } catch {
      set出力値("⚠️ デコードエラー：無効なエンコード文字列です");
    }
  }

  function コピー() {
    if (!出力値) return;
    navigator.clipboard.writeText(出力値).then(() => {
      setコピー済み(true);
      setTimeout(() => setコピー済み(false), 2000);
    });
  }

  function リセット() {
    set入力値("");
    set出力値("");
    setコピー済み(false);
  }

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="url-encoder" タイトル="URLエンコード・デコードツール" 説明="日本語URLをエンコード/デコード" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>URLエンコード・デコード</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">URLエンコード・デコードツール</h1>
          <FavoriteButton slug="url-encoder" title="URLエンコード・デコードツール" emoji="URLエンコード・デコードツール" />
          <p className="ツールページ説明">
            日本語・記号を含むURLをパーセントエンコーディング形式に変換、または元の文字に戻します。
          </p>
        </div>
      </div>

      <main className="ツールページメイン">
        <div className="ツールページコンテナ">
          <div className="広告ラッパー" style={{ padding: 0, marginBottom: "var(--スペース-lg)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="top" />
          </div>

          <div className={styles.ツールUI}>
            {/* 入力パネル */}
            <div className="入力セクション">
              <div className={styles.モード切替}>
                <button
                  className={`${styles.モードボタン} ${モード === "encode" ? styles.モードボタンアクティブ : ""}`}
                  onClick={() => setモード("encode")}
                >
                  エンコード（変換）
                </button>
                <button
                  className={`${styles.モードボタン} ${モード === "decode" ? styles.モードボタンアクティブ : ""}`}
                  onClick={() => setモード("decode")}
                >
                  デコード（解除）
                </button>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">
                  {モード === "encode" ? "変換したい文字列・URL" : "デコードするエンコード済みURL"}
                </label>
                <textarea
                  className="テキストエリア"
                  rows={5}
                  value={入力値}
                  onChange={(e) => set入力値(e.target.value)}
                  placeholder={
                    モード === "encode"
                      ? "https://example.com/商品一覧?カテゴリ=食品"
                      : "https%3A%2F%2Fexample.com%2F%E5%95%86%E5%93%81"
                  }
                  spellCheck={false}
                />
              </div>

              <div className={styles.ボタン群}>
                <button className={styles.変換ボタン} onClick={変換実行} disabled={!入力値.trim()}>
                  {モード === "encode" ? "🔒 エンコード実行" : "🔓 デコード実行"}
                </button>
                <button className={styles.リセットボタン} onClick={リセット}>
                  リセット
                </button>
              </div>
            </div>

            {/* 出力パネル */}
            <div className="結果セクション">
              <div className="結果見出し">変換結果</div>

              {出力値 ? (
                <>
                  <textarea
                    className="テキストエリア"
                    rows={5}
                    value={出力値}
                    readOnly
                    spellCheck={false}
                    style={{ cursor: "text" }}
                  />
                  <button className={styles.コピーボタン} onClick={コピー}>
                    {コピー済み ? "✓ コピーしました" : "📋 クリップボードにコピー"}
                  </button>

                  {/* 文字数比較 */}
                  <div className={styles.比較情報}>
                    <div className={styles.比較アイテム}>
                      <span className={styles.比較ラベル}>入力文字数</span>
                      <span className={styles.比較値}>{入力値.length} 文字</span>
                    </div>
                    <div className={styles.比較区切り}>→</div>
                    <div className={styles.比較アイテム}>
                      <span className={styles.比較ラベル}>出力文字数</span>
                      <span className={styles.比較値}>{出力値.length} 文字</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="プレースホルダーメッセージ">
                  左側に文字列を入力して変換ボタンを押してください
                </p>
              )}
            </div>
          </div>

          {出力値 && (
            <ShareButtons
              ツール={ツール定義}
              結果テキスト={`${入力値.slice(0, 30)}… → ${出力値.slice(0, 30)}…`}
            />
          )}

          <ToolGuide slug="url-encoder" />
        </div>
      </main>
    </>
  );
}
