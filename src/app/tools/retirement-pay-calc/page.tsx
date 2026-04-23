"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./retirement-pay-calc.module.css";

const ツール定義 = {
  スラッグ: "retirement-pay-calc",
  タイトル: "退職金 手取り計算機",
  説明: "退職所得控除・税金を差し引いた手取り額を試算",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💼 退職金{result}円の手取りを計算。退職所得控除で税負担が大幅に軽減→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

function 退職所得控除計算(勤続年数: number): number {
  if (勤続年数 <= 0) return 0;
  if (勤続年数 <= 20) return Math.max(400000 * 勤続年数, 800000);
  return 8000000 + 700000 * (勤続年数 - 20);
}

function 所得税計算(課税所得: number): number {
  if (課税所得 <= 0) return 0;
  const brackets = [
    { limit: 1950000,   rate: 0.05, deduct: 0 },
    { limit: 3300000,   rate: 0.10, deduct: 97500 },
    { limit: 6950000,   rate: 0.20, deduct: 427500 },
    { limit: 9000000,   rate: 0.23, deduct: 636000 },
    { limit: 18000000,  rate: 0.33, deduct: 1536000 },
    { limit: 40000000,  rate: 0.40, deduct: 2796000 },
    { limit: Infinity,  rate: 0.45, deduct: 4796000 },
  ];
  for (const b of brackets) {
    if (課税所得 <= b.limit) return Math.max(0, 課税所得 * b.rate - b.deduct);
  }
  return 0;
}

export default function 退職金手取り計算機ページ() {
  const [退職金, set退職金] = useState("10000000");
  const [勤続年数, set勤続年数] = useState("30");
  const [役員退職, set役員退職] = useState(false);

  const 結果 = useMemo(() => {
    const 退職金額 = parseInt(退職金) || 0;
    const 年数 = parseInt(勤続年数) || 0;
    if (退職金額 <= 0 || 年数 <= 0) return null;

    const 控除額 = 退職所得控除計算(年数);
    const 差引額 = Math.max(0, 退職金額 - 控除額);

    // 役員の場合は1/2課税なし（勤続5年以下）、通常は1/2
    const 課税退職所得 = 役員退職 && 年数 <= 5 ? 差引額 : Math.floor(差引額 / 2);

    const 所得税 = 所得税計算(課税退職所得) * 1.021; // 復興特別税
    const 住民税 = 課税退職所得 * 0.10; // 10%（分離課税）
    const 税合計 = 所得税 + 住民税;
    const 手取り = 退職金額 - 税合計;
    const 手取り率 = (手取り / 退職金額) * 100;
    const 実効税率 = (税合計 / 退職金額) * 100;

    return {
      退職金額, 控除額, 差引額, 課税退職所得,
      所得税: Math.round(所得税),
      住民税: Math.round(住民税),
      税合計: Math.round(税合計),
      手取り: Math.round(手取り),
      手取り率, 実効税率,
      全額控除: 差引額 <= 0,
    };
  }, [退職金, 勤続年数, 役員退職]);

  const 結果テキスト = 結果 ? `退職金手取り ${fmt(結果.手取り)}円（手取り率${結果.手取り率.toFixed(1)}%）` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>退職金 手取り計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💼 退職金 手取り計算機（2026年版）</h1>
          <p className="ツールページ説明">
            退職金額・勤続年数を入力するだけで退職所得控除・所得税・住民税・手取りを即計算。
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
            {/* 入力 */}
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">退職金額（円）</label>
                <input type="number" className="数値入力" value={退職金}
                  onChange={(e) => set退職金(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {["3000000","5000000","10000000","20000000","30000000","50000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${退職金 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set退職金(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">勤続年数（年）</label>
                <input type="number" className="数値入力" value={勤続年数}
                  onChange={(e) => set勤続年数(e.target.value)} min="1" max="60" step="1" />
                <div className={styles.クイック群}>
                  {["5","10","15","20","25","30","35","40"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${勤続年数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set勤続年数(v)}>
                      {v}年
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.チェックラベル}>
                <input type="checkbox" checked={役員退職}
                  onChange={(e) => set役員退職(e.target.checked)}
                  style={{ accentColor: "var(--カラー-プライマリ)" }} />
                役員退職（勤続5年以下は1/2課税なし）
              </label>

              {/* 控除額早見表 */}
              <div className={styles.控除早見}>
                <div className={styles.早見ラベル}>退職所得控除額の目安</div>
                {[
                  { 年: 10, 額: 退職所得控除計算(10) },
                  { 年: 20, 額: 退職所得控除計算(20) },
                  { 年: 30, 額: 退職所得控除計算(30) },
                  { 年: 40, 額: 退職所得控除計算(40) },
                ].map((r) => (
                  <div key={r.年} className={styles.早見行}>
                    <span>勤続{r.年}年</span>
                    <span style={{ color: "#10b981" }}>¥{fmt(r.額)}円まで非課税</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 結果 */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>
              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {結果.全額控除 ? (
                    <div className={styles.非課税カード}>
                      <span className={styles.非課税アイコン}>🎉</span>
                      <span className={styles.非課税テキスト}>全額非課税！</span>
                      <span className={styles.非課税サブ}>退職所得控除額が退職金を上回るため税金ゼロ</span>
                      <span className={styles.非課税値}>手取り ¥{fmt(結果.退職金額)}円</span>
                    </div>
                  ) : (
                    <div className={styles.メインカード}>
                      <span className={styles.メインラベル}>手取り額</span>
                      <span className={styles.メイン値}>¥{fmt(結果.手取り)}<span className={styles.メイン単位}>円</span></span>
                      <span className={styles.手取り率}>手取り率 {結果.手取り率.toFixed(1)}%（実効税率 {結果.実効税率.toFixed(1)}%）</span>
                    </div>
                  )}

                  <div className="結果グリッド">
                    {[
                      { label: "退職所得控除額", value: `¥${fmt(結果.控除額)}円`, color: "#10b981" },
                      { label: "課税退職所得",   value: `¥${fmt(結果.課税退職所得)}円` },
                      { label: "所得税（復興税込）", value: `-¥${fmt(結果.所得税)}円`, color: "#f25acc" },
                      { label: "住民税（10%）",  value: `-¥${fmt(結果.住民税)}円`, color: "#f25acc" },
                      { label: "税合計",         value: `-¥${fmt(結果.税合計)}円`, color: "#f25acc" },
                      { label: "手取り",         value: `¥${fmt(結果.手取り)}円`, color: "#26d9ca" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.05rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.ヒント}>
                    💡 退職金は分離課税のため、給与所得と合算されません。勤続年数が長いほど控除額が増え、税負担が軽くなります。
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">退職金額と勤続年数を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />}
        </div>
      </main>
    </>
  );
}
