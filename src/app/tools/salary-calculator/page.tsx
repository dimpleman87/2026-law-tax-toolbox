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
import styles from "./salary-calculator.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "salary-calculator",
  タイトル: "給与手取り計算機",
  説明: "月収から社会保険料・税金・手取りを計算",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💴 月収{result}万円の手取り計算。税・保険料の内訳がわかる→"],
};

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP");
}

// 2024年度 協会けんぽ（東京）標準報酬月額テーブル簡易版
function 健康保険料計算(月収: number): number {
  // 標準報酬月額 × 9.98% の半額（本人負担）
  const 標準報酬 = Math.min(Math.max(月収, 58000), 1390000);
  return 標準報酬 * 0.0499; // 9.98%の半分
}

function 厚生年金計算(月収: number): number {
  const 標準報酬 = Math.min(Math.max(月収, 88000), 650000);
  return 標準報酬 * 0.0915; // 18.3%の半分
}

function 雇用保険計算(月収: number): number {
  return 月収 * 0.006; // 0.6%（2024年度）
}

function 所得税概算(課税所得: number): number {
  if (課税所得 <= 0) return 0;
  const brackets = [
    { limit: 1950000,  rate: 0.05, deduct: 0 },
    { limit: 3300000,  rate: 0.10, deduct: 97500 },
    { limit: 6950000,  rate: 0.20, deduct: 427500 },
    { limit: 9000000,  rate: 0.23, deduct: 636000 },
    { limit: 18000000, rate: 0.33, deduct: 1536000 },
    { limit: 40000000, rate: 0.40, deduct: 2796000 },
    { limit: Infinity,  rate: 0.45, deduct: 4796000 },
  ];
  for (const b of brackets) {
    if (課税所得 <= b.limit) {
      return 課税所得 * b.rate - b.deduct;
    }
  }
  return 0;
}

export default function 給与手取り計算機ページ() {
  const [月収, set月収] = useState("300000");
  const [交通費, set交通費] = useState("10000");
  const [扶養人数, set扶養人数] = useState("0");
  const [住民税を含む, set住民税を含む] = useState(true);

  const 結果 = useMemo(() => {
    const 総支給 = parseInt(月収) || 0;
    const 非課税交通費 = Math.min(parseInt(交通費) || 0, 150000);
    const 扶養 = parseInt(扶養人数) || 0;

    if (総支給 <= 0) return null;

    // 社会保険料
    const 健康保険 = 健康保険料計算(総支給);
    const 厚生年金 = 厚生年金計算(総支給);
    const 雇用保険 = 雇用保険計算(総支給);
    const 社会保険合計 = 健康保険 + 厚生年金 + 雇用保険;

    // 給与所得控除（月収→年収換算）
    const 年収 = 総支給 * 12;
    let 給与所得控除 = 0;
    if (年収 <= 1625000)       給与所得控除 = 550000;
    else if (年収 <= 1800000)  給与所得控除 = 年収 * 0.4 - 100000;
    else if (年収 <= 3600000)  給与所得控除 = 年収 * 0.3 + 80000;
    else if (年収 <= 6600000)  給与所得控除 = 年収 * 0.2 + 440000;
    else if (年収 <= 8500000)  給与所得控除 = 年収 * 0.1 + 1100000;
    else                       給与所得控除 = 1950000;

    // 年間社会保険料
    const 年間社保 = 社会保険合計 * 12;
    // 基礎控除（2020年〜）
    const 基礎控除 = 480000;
    // 扶養控除
    const 扶養控除 = 扶養 * 380000;

    const 課税所得年 = Math.max(0, 年収 - 給与所得控除 - 年間社保 - 基礎控除 - 扶養控除 - 非課税交通費 * 12);

    // 所得税（月換算）※源泉徴収は概算
    const 年間所得税 = 所得税概算(課税所得年) * 1.021; // 復興特別税
    const 月所得税 = 年間所得税 / 12;

    // 住民税（前年所得ベース・10%概算）
    const 住民税月 = 住民税を含む ? 課税所得年 * 0.10 / 12 : 0;

    // 手取り
    const 控除合計 = 社会保険合計 + 月所得税 + 住民税月;
    const 手取り = 総支給 - 控除合計;
    const 手取り率 = (手取り / 総支給) * 100;

    return {
      総支給,
      健康保険: Math.round(健康保険),
      厚生年金: Math.round(厚生年金),
      雇用保険: Math.round(雇用保険),
      社会保険合計: Math.round(社会保険合計),
      所得税: Math.round(月所得税),
      住民税: Math.round(住民税月),
      控除合計: Math.round(控除合計),
      手取り: Math.round(手取り),
      手取り率,
      年収,
      年間手取り: Math.round(手取り * 12),
    };
  }, [月収, 交通費, 扶養人数, 住民税を含む]);

  const 結果テキスト = 結果 ? `手取り ${fmt(結果.手取り)}円/月（手取り率${結果.手取り率.toFixed(1)}%）` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="salary-calculator" タイトル="給与手取り計算機" 説明="月収から社会保険料・税金・手取りを計算" カテゴリ="ビジネス・経理" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>給与手取り計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💴 給与手取り計算機（2026年版）</h1>
          <FavoriteButton slug="salary-calculator" title="給与手取り計算機" emoji="💴" />
          <p className="ツールページ説明">
            月収（額面）から健康保険・厚生年金・雇用保険・所得税・住民税を自動計算。実際の手取り額を即確認。
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
                <label className="フィールドラベル">月収（額面・円）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={月収}
                  onChange={(e) => set月収(e.target.value)}
                  min="0" step="10000"
                  placeholder="300000"
                />
                <div className={styles.クイック群}>
                  {["200000","250000","300000","350000","400000","500000"].map((v) => (
                    <button key={v} className={`${styles.クイックボタン} ${月収 === v ? styles.クイックボタンアクティブ : ""}`} onClick={() => set月収(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">通勤交通費（円・月）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={交通費}
                  onChange={(e) => set交通費(e.target.value)}
                  min="0" step="1000"
                  placeholder="10000"
                />
                <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                  月15万円まで非課税
                </span>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">扶養家族の人数</label>
                <input
                  type="number"
                  className="数値入力"
                  value={扶養人数}
                  onChange={(e) => set扶養人数(e.target.value)}
                  min="0" max="10"
                  placeholder="0"
                />
              </div>

              <label className={styles.チェックラベル}>
                <input
                  type="checkbox"
                  checked={住民税を含む}
                  onChange={(e) => set住民税を含む(e.target.checked)}
                  style={{ accentColor: "var(--カラー-プライマリ)" }}
                />
                住民税を含めて計算（前年所得ベース・概算）
              </label>

              <div className={styles.注意書き}>
                ※ 協会けんぽ（東京）・2026年度概算です。組合健保・地方により異なります。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* 手取りメイン */}
                  <div className={styles.手取りカード}>
                    <span className={styles.手取りラベル}>月々の手取り額</span>
                    <span className={styles.手取り値}>¥{fmt(結果.手取り)}</span>
                    <span className={styles.手取り率}>手取り率 {結果.手取り率.toFixed(1)}%</span>
                  </div>

                  {/* ビジュアルバー */}
                  <div className={styles.内訳バー}>
                    <div className={styles.バーセグメント手取り} style={{ width: `${結果.手取り率}%` }} title={`手取り ${結果.手取り率.toFixed(1)}%`} />
                    <div className={styles.バーセグメント社保} style={{ width: `${(結果.社会保険合計/結果.総支給*100)}%` }} title="社会保険料" />
                    <div className={styles.バーセグメント税} style={{ width: `${((結果.所得税+結果.住民税)/結果.総支給*100)}%` }} title="税金" />
                  </div>
                  <div className={styles.バー凡例}>
                    <span className={styles.凡例手取り}>■ 手取り</span>
                    <span className={styles.凡例社保}>■ 社会保険料</span>
                    <span className={styles.凡例税}>■ 税金</span>
                  </div>

                  {/* 内訳 */}
                  <div className="結果グリッド">
                    {[
                      { label: "健康保険料",      value: `-¥${fmt(結果.健康保険)}`, color: "#f59e0b" },
                      { label: "厚生年金保険料",   value: `-¥${fmt(結果.厚生年金)}`, color: "#f59e0b" },
                      { label: "雇用保険料",       value: `-¥${fmt(結果.雇用保険)}`, color: "#f59e0b" },
                      { label: "所得税（概算）",   value: `-¥${fmt(結果.所得税)}`,  color: "#f25acc" },
                      { label: "住民税（概算）",   value: 住民税を含む ? `-¥${fmt(結果.住民税)}` : "計算対象外", color: "#f25acc" },
                      { label: "控除合計",          value: `-¥${fmt(結果.控除合計)}`, color: "#f25acc" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.1rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 年間サマリ */}
                  <div className={styles.年間サマリ}>
                    <div className={styles.サマリアイテム}>
                      <span>年収（額面）</span>
                      <span>¥{fmt(結果.年収)}</span>
                    </div>
                    <div className={styles.サマリアイテム強調}>
                      <span>年間手取り（概算）</span>
                      <span style={{ color: "var(--カラー-セカンダリ)" }}>¥{fmt(結果.年間手取り)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">月収を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }


          <ToolGuide slug="salary-calculator" />
        </div>
      </main>
    </>
  );
}
