"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./gift-tax-calc.module.css";

const ツール定義 = {
  スラッグ: "gift-tax-calc",
  タイトル: "贈与税 計算機",
  説明: "暦年贈与・基礎控除・税率を即試算",
  カテゴリ: "士業・法務",
  category: "Legal",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💰 贈与税を計算。{result}万円贈与した場合の税額は？→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

// 一般税率
function 一般税率計算(課税価格: number): number {
  if (課税価格 <= 0) return 0;
  const b = [
    { limit: 2000000,  rate: 0.10, deduct: 0 },
    { limit: 3000000,  rate: 0.15, deduct: 100000 },
    { limit: 4000000,  rate: 0.20, deduct: 250000 },
    { limit: 6000000,  rate: 0.30, deduct: 650000 },
    { limit: 10000000, rate: 0.40, deduct: 1250000 },
    { limit: 15000000, rate: 0.45, deduct: 1750000 },
    { limit: 30000000, rate: 0.50, deduct: 2500000 },
    { limit: Infinity,  rate: 0.55, deduct: 4000000 },
  ];
  const bracket = b.find((x) => 課税価格 <= x.limit) ?? b[b.length - 1];
  return 課税価格 * bracket.rate - bracket.deduct;
}

// 特例税率（直系尊属から18歳以上）
function 特例税率計算(課税価格: number): number {
  if (課税価格 <= 0) return 0;
  const b = [
    { limit: 2000000,  rate: 0.10, deduct: 0 },
    { limit: 4000000,  rate: 0.15, deduct: 100000 },
    { limit: 6000000,  rate: 0.20, deduct: 300000 },
    { limit: 10000000, rate: 0.30, deduct: 900000 },
    { limit: 15000000, rate: 0.40, deduct: 1900000 },
    { limit: 30000000, rate: 0.45, deduct: 2650000 },
    { limit: 45000000, rate: 0.50, deduct: 4150000 },
    { limit: Infinity,  rate: 0.55, deduct: 6400000 },
  ];
  const bracket = b.find((x) => 課税価格 <= x.limit) ?? b[b.length - 1];
  return 課税価格 * bracket.rate - bracket.deduct;
}

type 税率種別 = "特例税率" | "一般税率";

export default function 贈与税計算機ページ() {
  const [贈与額, set贈与額] = useState("5000000");
  const [税率種別, set税率種別] = useState<税率種別>("特例税率");
  const [複数年, set複数年] = useState("1");

  const 結果 = useMemo(() => {
    const 金額 = parseInt(贈与額) || 0;
    const 年数 = parseInt(複数年) || 1;
    if (金額 <= 0) return null;

    const 基礎控除 = 1100000; // 110万円
    const 課税価格 = Math.max(0, 金額 - 基礎控除);

    const 税額 = 税率種別 === "特例税率"
      ? 特例税率計算(課税価格)
      : 一般税率計算(課税価格);

    const 実効税率 = 金額 > 0 ? (税額 / 金額) * 100 : 0;

    // 110万円贈与×複数年 vs 一括贈与の比較
    const 分割年額 = 1100000; // 110万ちょうどなら非課税
    const 分割税額 = 0;
    const 分割累計 = 分割年額 * 年数;

    // 同額を年数で分割した場合の節税効果
    const 分割時税額 = 特例税率計算(Math.max(0, 金額 / 年数 - 基礎控除)) * 年数;
    const 節税効果 = 税額 - 分割時税額;

    return {
      贈与額: 金額, 基礎控除, 課税価格, 税額, 実効税率,
      分割時税額, 節税効果,
      税率名: 税率種別,
    };
  }, [贈与額, 税率種別, 複数年]);

  const 結果テキスト = 結果 ? `贈与税 ${fmt(結果.税額)}円（実効税率${結果.実効税率.toFixed(1)}%）` : "";

  const クイック = ["1000000","3000000","5000000","10000000","30000000","50000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>贈与税 計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💰 贈与税 計算機（2024年改正対応）</h1>
          <p className="ツールページ説明">
            贈与金額・税率種別を入力するだけで贈与税額を即計算。110万円基礎控除・特例税率・暦年分割節税効果もわかる。
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
            {/* ─── 入力 ─── */}
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">贈与額（1年間・円）</label>
                <input type="number" className="数値入力" value={贈与額}
                  onChange={(e) => set贈与額(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${贈与額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set贈与額(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">税率の種類</label>
                <div className={styles.税率選択}>
                  {(["特例税率", "一般税率"] as 税率種別[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${税率種別 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set税率種別(m)}>{m}</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", lineHeight: 1.6 }}>
                  {税率種別 === "特例税率"
                    ? "【特例税率】父母・祖父母など直系尊属から、18歳以上の子・孫への贈与。税率が低い優遇措置。"
                    : "【一般税率】兄弟・友人・夫婦間など、特例税率対象外の贈与に適用される標準税率。"}
                </p>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">節税シミュレーション：分割年数</label>
                <div className={styles.クイック群}>
                  {["2","3","5","7","10"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${複数年 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set複数年(v)}>{v}年</button>
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                  同額を複数年に分割した場合の節税効果を試算
                </span>
              </div>

              <div className={styles.注意書き}>
                ※ 相続時精算課税（2024年改正：年110万控除新設）は別途計算が必要です。
                定期贈与と認定された場合は全額一括課税になる場合があります。税理士に相談することを推奨します。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>贈与税額</span>
                    <span className={styles.メイン値}>¥{fmt(結果.税額)}<span className={styles.メイン単位}>円</span></span>
                    <span className={styles.実効税率}>実効税率 {結果.実効税率.toFixed(1)}%（{結果.税率名}）</span>
                  </div>

                  <div className="結果グリッド">
                    {[
                      { label: "贈与額",      value: `¥${fmt(結果.贈与額)}円` },
                      { label: "基礎控除",    value: `-¥${fmt(結果.基礎控除)}円`, color: "#10b981" },
                      { label: "課税価格",    value: `¥${fmt(結果.課税価格)}円` },
                      { label: "贈与税額",    value: `¥${fmt(結果.税額)}円`, color: "#f25acc" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.05rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 110万円以下チェック */}
                  {結果.課税価格 <= 0 ? (
                    <div className={styles.非課税バッジ}>
                      ✅ 基礎控除（110万円）以内のため贈与税はかかりません
                    </div>
                  ) : 結果.節税効果 > 0 && parseInt(複数年) > 1 ? (
                    <div className={styles.節税カード}>
                      <div className={styles.節税タイトル}>📊 {複数年}年分割した場合の節税効果</div>
                      <div className={styles.節税行}>
                        <span>一括贈与の税額</span>
                        <span style={{ color: "#f25acc" }}>¥{fmt(結果.税額)}円</span>
                      </div>
                      <div className={styles.節税行}>
                        <span>{複数年}年分割後の合計税額</span>
                        <span style={{ color: "#f59e0b" }}>¥{fmt(結果.分割時税額)}円</span>
                      </div>
                      <div className={styles.節税行強調}>
                        <span>節税効果</span>
                        <span style={{ color: "#10b981" }}>▼¥{fmt(結果.節税効果)}円</span>
                      </div>
                    </div>
                  ) : null}

                  {/* 税率表早見 */}
                  <div className={styles.税率表}>
                    <div className={styles.税率表ラベル}>特例税率 早見表（基礎控除後の課税価格）</div>
                    {[
                      [2000000, 0.10, 0],
                      [4000000, 0.15, 100000],
                      [6000000, 0.20, 300000],
                      [10000000, 0.30, 900000],
                      [15000000, 0.40, 1900000],
                    ].map(([limit, rate]) => (
                      <div key={limit} className={`${styles.税率行} ${結果.課税価格 <= (limit as number) && 結果.課税価格 > 0 ? styles.税率行強調 : ""}`}>
                        <span>{(limit as number / 10000).toFixed(0)}万円以下</span>
                        <span>{((rate as number) * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">贈与額を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />}
        </div>
      </main>
    </>
  );
}
