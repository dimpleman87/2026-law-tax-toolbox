"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import FavoriteButton from "@/components/FavoriteButton";
import RelatedTools from "@/components/RelatedTools";
import CalcHistory from "@/components/CalcHistory";
import ToolJsonLd from "@/components/ToolJsonLd";
import styles from "./content-certified-mail.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "content-certified-mail",
  タイトル: "内容証明郵便 料金計算機",
  説明: "文字数・枚数に応じた内容証明の発送コストを算出",
  カテゴリ: "士業・法務",
  category: "Legal",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["📮 内容証明郵便の発送料金を計算。合計¥{result}→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function 内容証明計算機ページ() {
  const [枚数, set枚数] = useState("1");
  const [配達証明, set配達証明] = useState(true);
  const [電子内容証明, set電子内容証明] = useState(false);

  const 結果 = useMemo(() => {
    const 枚 = parseInt(枚数) || 1;

    // 2024年10月改定後の料金
    const 基本書留料 = 480; // 一般書留
    const 定形外料 = 140; // 50g以内定形外
    const 内容証明料 = 440 + (Math.max(0, 枚 - 1) * 260); // 1枚440円、追加1枚ごと260円
    const 配達証明料 = 配達証明 ? 320 : 0;
    const 電子割引 = 電子内容証明 ? -210 : 0; // e内容証明割引

    const 合計 = 基本書留料 + 定形外料 + 内容証明料 + 配達証明料 + 電子割引;

    return { 基本書留料, 定形外料, 内容証明料, 配達証明料, 電子割引, 合計 };
  }, [枚数, 配達証明, 電子内容証明]);

  const 結果テキスト = `内容証明郵便（${枚数}枚）の発送料金合計¥${fmt(結果.合計)}`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="content-certified-mail" タイトル="内容証明郵便 料金計算機" 説明="文字数・枚数に応じた内容証明の発送コストを算出" カテゴリ="士業・法務" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-legal">士業・法務</Link></li>
              <li aria-hidden="true">›</li>
              <li>内容証明郵便 料金計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📮 内容証明郵便 料金計算機</h1>
          <FavoriteButton slug="content-certified-mail" title="内容証明郵便 料金計算機" emoji="📮" />
          <p className="ツールページ説明">
            枚数・配達証明の有無を入力するだけで内容証明郵便の発送料金を即算出。
            2024年10月改定後の最新料金に対応。請求書・催告書の発送コスト確認に。
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
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">文書の枚数</label>
                <input type="number" className="数値入力" value={枚数}
                  onChange={(e) => set枚数(e.target.value)} min="1" max="10" step="1" />
                <div className={styles.クイック群}>
                  {["1","2","3","5"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${枚数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set枚数(v)}>{v}枚</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">オプション</label>
                <div className={styles.チェック群}>
                  {[
                    { label: "配達証明をつける（+¥320）", val: 配達証明, set: set配達証明 },
                    { label: "e内容証明（電子）を利用する（-¥210）", val: 電子内容証明, set: set電子内容証明 },
                  ].map((c) => (
                    <label key={c.label} className={styles.チェックラベル}>
                      <input type="checkbox" checked={c.val} onChange={(e) => c.set(e.target.checked)} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.情報カード}>
                <div className={styles.情報タイトル}>内容証明郵便とは</div>
                <div className={styles.情報テキスト}>
                  誰が・いつ・どんな内容の文書を送ったかを郵便局が証明する郵便。
                  借金の時効中断・契約解除通知・損害賠償請求などに使われる法的証拠手段。
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">料金計算結果</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>発送料金合計</span>
                  <span className={styles.メイン値}>¥{fmt(結果.合計)}<span className={styles.メイン単位}>円</span></span>
                  <span className={styles.メインサブ}>{枚数}枚・{配達証明 ? "配達証明あり" : "配達証明なし"}{電子内容証明 ? "・e内容証明" : ""}</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "内容証明料", value: `¥${fmt(結果.内容証明料)}`, color: "#10b981" },
                    { label: "一般書留料", value: `¥${fmt(結果.基本書留料)}`, color: "#06b6d4" },
                    { label: "配達証明料", value: 配達証明 ? `¥${fmt(結果.配達証明料)}` : "なし", color: "#f59e0b" },
                    { label: "e内容証明割引", value: 電子内容証明 ? `-¥${fmt(Math.abs(結果.電子割引))}` : "なし", color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>料金内訳（2024年10月改定後）</div>
                  {[
                    { label: "定形外郵便料（50g以内）", value: `¥${fmt(結果.定形外料)}` },
                    { label: "一般書留加算料", value: `¥${fmt(結果.基本書留料)}` },
                    { label: `内容証明料（1枚¥440＋追加¥260/枚）`, value: `¥${fmt(結果.内容証明料)}` },
                    { label: "配達証明料", value: 配達証明 ? `¥${fmt(結果.配達証明料)}` : "¥0" },
                    { label: "e内容証明割引", value: 電子内容証明 ? `-¥${fmt(Math.abs(結果.電子割引))}` : "¥0" },
                    { label: "合計", value: `¥${fmt(結果.合計)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 5 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="content-certified-mail" />
          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>
        </div>
      </main>
      <div className="広告ラッパー"><div className="広告ラベル">スポンサー</div><AdSlot 位置="bottom" /></div>
    </>
  );
}
