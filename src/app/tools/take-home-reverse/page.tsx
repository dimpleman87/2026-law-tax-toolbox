"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./take-home-reverse.module.css";

const ツール定義 = {
  スラッグ: "take-home-reverse",
  タイトル: "手取り逆算計算機",
  説明: "希望手取りから必要年収を逆算",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💰 月手取り{result}欲しいなら必要年収を逆算→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 入力モード = "月額手取り" | "年間手取り";
type 扶養人数 = "0" | "1" | "2" | "3";

// 年収→手取りを計算（会社員）
function 手取り計算(年収: number, 扶養: number): number {
  if (年収 <= 0) return 0;

  // 給与所得控除
  let 給与所得控除 = 0;
  if (年収 <= 1625000) 給与所得控除 = 550000;
  else if (年収 <= 1800000) 給与所得控除 = 年収 * 0.4 - 100000;
  else if (年収 <= 3600000) 給与所得控除 = 年収 * 0.3 + 80000;
  else if (年収 <= 6600000) 給与所得控除 = 年収 * 0.2 + 440000;
  else if (年収 <= 8500000) 給与所得控除 = 年収 * 0.1 + 1100000;
  else 給与所得控除 = 1950000;

  const 給与所得 = 年収 - 給与所得控除;

  // 社会保険料（概算：健保5.0% + 厚年9.15% + 雇保0.6% = 14.75%、上限あり）
  const 社会保険料率 = 0.1475;
  const 社会保険料 = Math.min(年収 * 社会保険料率, 1400000); // 上限140万

  // 各種控除
  const 基礎控除 = 480000;
  const 配偶者控除 = 扶養 >= 1 ? 380000 : 0;
  const 扶養控除 = Math.max(0, 扶養 - 1) * 380000;
  const 社保控除 = 社会保険料;

  const 課税所得 = Math.max(0,
    給与所得 - 基礎控除 - 配偶者控除 - 扶養控除 - 社保控除
  );

  // 所得税（累進）
  let 所得税 = 0;
  const brackets = [
    { limit: 1950000,  rate: 0.05, deduct: 0 },
    { limit: 3300000,  rate: 0.10, deduct: 97500 },
    { limit: 6950000,  rate: 0.20, deduct: 427500 },
    { limit: 9000000,  rate: 0.23, deduct: 636000 },
    { limit: 18000000, rate: 0.33, deduct: 1536000 },
    { limit: 40000000, rate: 0.40, deduct: 2796000 },
    { limit: Infinity,  rate: 0.45, deduct: 4796000 },
  ];
  const b = brackets.find((x) => 課税所得 <= x.limit) ?? brackets[brackets.length - 1];
  所得税 = Math.max(0, 課税所得 * b.rate - b.deduct) * 1.021; // 復興税

  // 住民税（10%、均等割5000円）
  const 住民税課税所得 = Math.max(0, 給与所得 - 基礎控除 - 配偶者控除 - 扶養控除 - 社保控除 - 50000);
  const 住民税 = 住民税課税所得 * 0.10 + 5000;

  return 年収 - 社会保険料 - 所得税 - 住民税;
}

// 手取り→必要年収 二分探索
function 必要年収計算(目標手取り: number, 扶養: number): number {
  let lo = 目標手取り;
  let hi = 目標手取り * 2.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (手取り計算(mid, 扶養) < 目標手取り) lo = mid;
    else hi = mid;
  }
  return Math.round((lo + hi) / 2);
}

export default function 手取り逆算ページ() {
  const [入力モード, set入力モード] = useState<入力モード>("月額手取り");
  const [目標手取り, set目標手取り] = useState("300000");
  const [扶養人数, set扶養人数] = useState<扶養人数>("0");

  const 結果 = useMemo(() => {
    const 月額 = 入力モード === "月額手取り"
      ? parseInt(目標手取り) || 0
      : Math.round((parseInt(目標手取り) || 0) / 12);
    const 年間 = 月額 * 12;
    const 扶養 = parseInt(扶養人数) || 0;

    const 必要年収 = 必要年収計算(年間, 扶養);
    const 必要月収 = Math.round(必要年収 / 12);

    // 実際の手取りを検証
    const 実際手取り = 手取り計算(必要年収, 扶養);
    const 実際月手取り = Math.round(実際手取り / 12);

    // 控除内訳
    const 社会保険料 = Math.min(必要年収 * 0.1475, 1400000);

    let 給与所得控除 = 0;
    if (必要年収 <= 1625000) 給与所得控除 = 550000;
    else if (必要年収 <= 1800000) 給与所得控除 = 必要年収 * 0.4 - 100000;
    else if (必要年収 <= 3600000) 給与所得控除 = 必要年収 * 0.3 + 80000;
    else if (必要年収 <= 6600000) 給与所得控除 = 必要年収 * 0.2 + 440000;
    else if (必要年収 <= 8500000) 給与所得控除 = 必要年収 * 0.1 + 1100000;
    else 給与所得控除 = 1950000;

    const 給与所得 = 必要年収 - 給与所得控除;
    const 配偶者控除 = 扶養 >= 1 ? 380000 : 0;
    const 扶養控除 = Math.max(0, 扶養 - 1) * 380000;
    const 課税所得 = Math.max(0, 給与所得 - 480000 - 配偶者控除 - 扶養控除 - 社会保険料);

    const brackets = [
      { limit: 1950000,  rate: 0.05, deduct: 0 },
      { limit: 3300000,  rate: 0.10, deduct: 97500 },
      { limit: 6950000,  rate: 0.20, deduct: 427500 },
      { limit: 9000000,  rate: 0.23, deduct: 636000 },
      { limit: 18000000, rate: 0.33, deduct: 1536000 },
      { limit: 40000000, rate: 0.40, deduct: 2796000 },
      { limit: Infinity,  rate: 0.45, deduct: 4796000 },
    ];
    const b = brackets.find((x) => 課税所得 <= x.limit) ?? brackets[brackets.length - 1];
    const 所得税 = Math.max(0, 課税所得 * b.rate - b.deduct) * 1.021;
    const 住民税課税 = Math.max(0, 課税所得 - 50000);
    const 住民税 = 住民税課税 * 0.10 + 5000;

    const 総控除 = 社会保険料 + 所得税 + 住民税;
    const 実効負担率 = 必要年収 > 0 ? ((総控除 / 必要年収) * 100).toFixed(1) : "0.0";

    return {
      必要年収, 必要月収,
      実際月手取り,
      社会保険料, 所得税, 住民税, 総控除,
      実効負担率,
      目標月額: 月額,
    };
  }, [入力モード, 目標手取り, 扶養人数]);

  const 結果テキスト = `月手取り${fmt(結果.目標月額)}円には年収${fmt(結果.必要年収)}円が必要`;

  const 月額クイック = ["200000","250000","300000","350000","400000","500000"];
  const 年額クイック = ["3000000","4000000","5000000","6000000","8000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-life">生活・計算</Link></li>
              <li aria-hidden="true">›</li>
              <li>手取り逆算計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💰 手取り逆算計算機</h1>
          <p className="ツールページ説明">
            「月手取り30万円欲しい」→必要な年収を即逆算。
            転職・給与交渉・収入目標設定に。扶養家族も考慮して計算します。
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
                <label className="フィールドラベル">入力モード</label>
                <div className={styles.税率選択}>
                  {(["月額手取り", "年間手取り"] as 入力モード[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${入力モード === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set入力モード(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">
                  {入力モード === "月額手取り" ? "希望月額手取り（円）" : "希望年間手取り（円）"}
                </label>
                <input type="number" className="数値入力" value={目標手取り}
                  onChange={(e) => set目標手取り(e.target.value)} min="0" step="10000" />
                <div className={styles.クイック群}>
                  {(入力モード === "月額手取り" ? 月額クイック : 年額クイック).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${目標手取り === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set目標手取り(v)}>
                      {入力モード === "月額手取り"
                        ? `${Number(v)/10000}万`
                        : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">扶養家族の人数（配偶者含む）</label>
                <div className={styles.クイック群}>
                  {(["0", "1", "2", "3"] as 扶養人数[]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${扶養人数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set扶養人数(v)}>
                      {v === "0" ? "なし" : `${v}人`}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                  扶養控除（38万円/人）・配偶者控除を考慮して計算
                </p>
              </div>

              <div className={styles.注意書き}>
                ※ 会社員（給与所得者）を想定した概算です。社会保険料は協会けんぽ基準。
                実際の手取りは会社の保険組合・住所地によって変動します。
              </div>

              {/* 年収早見表 */}
              <div className={styles.早見表カード}>
                <div className={styles.早見表タイトル}>📋 月手取り別 必要年収早見表</div>
                {[200000, 250000, 300000, 350000, 400000, 500000].map((月額) => {
                  const 扶養 = parseInt(扶養人数) || 0;
                  const 年収 = 必要年収計算(月額 * 12, 扶養);
                  return (
                    <div key={月額}
                      className={`${styles.早見表行} ${結果.目標月額 === 月額 ? styles.早見表行強調 : ""}`}
                      onClick={() => { set入力モード("月額手取り"); set目標手取り(String(月額)); }}>
                      <span>月{fmt(月額)}円</span>
                      <span className={styles.早見表矢印}>→</span>
                      <span className={styles.早見表年収}>年収 約{fmt(年収)}円</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* メインカード */}
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>必要年収（額面）</span>
                  <span className={styles.メイン値}>
                    {fmt(結果.必要年収)}
                    <span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.月換算}>月収 約{fmt(結果.必要月収)}円（額面）</span>
                </div>

                {/* 検証値 */}
                <div className={styles.検証カード}>
                  <div className={styles.検証行}>
                    <span>目標手取り</span>
                    <span style={{ color: "#10b981", fontWeight: 800 }}>月{fmt(結果.目標月額)}円</span>
                  </div>
                  <div className={styles.検証行}>
                    <span>試算後の実際の手取り</span>
                    <span style={{ color: "#06b6d4", fontWeight: 800 }}>月{fmt(結果.実際月手取り)}円</span>
                  </div>
                </div>

                {/* 控除内訳 */}
                <div className="結果グリッド">
                  {[
                    { label: "社会保険料", value: `¥${fmt(結果.社会保険料)}円`, color: "#6366f1" },
                    { label: "所得税（復興税込）", value: `¥${fmt(結果.所得税)}円`, color: "#f25acc" },
                    { label: "住民税（10%）", value: `¥${fmt(結果.住民税)}円`, color: "#f59e0b" },
                    { label: "総控除額", value: `¥${fmt(結果.総控除)}円`, color: "var(--カラー-テキスト)" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ fontSize: "0.95rem", color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 負担率 */}
                <div className={styles.負担率カード}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "var(--カラー-テキスト薄)" }}>実効負担率（年収に対する税・社保）</span>
                    <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#f59e0b" }}>{結果.実効負担率}%</span>
                  </div>
                  <div className={styles.負担率バー}>
                    <div className={styles.負担率塗り} style={{ width: `${結果.実効負担率}%` }} />
                  </div>
                </div>
              </div>

              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>

          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>
        </div>
      </main>

      <div className="広告ラッパー">
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
