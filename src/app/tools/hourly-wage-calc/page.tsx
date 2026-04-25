"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./hourly-wage-calc.module.css";

const ツール定義 = {
  スラッグ: "hourly-wage-calc",
  タイトル: "時給・年収換算計算機",
  説明: "時給から年収、年収から時給を瞬時に換算",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["⏰ 時給→年収換算したら{result}万円。転職・副業の参考に→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtF(n: number, d = 0) { return n.toLocaleString("ja-JP", { minimumFractionDigits: d, maximumFractionDigits: d }); }

type 換算モード = "時給→年収" | "年収→時給" | "月給→年収" | "日給→月給";

export default function 時給年収換算計算機ページ() {
  const [モード, setモード] = useState<換算モード>("時給→年収");
  const [入力値, set入力値] = useState("1500");
  const [労働時間, set労働時間] = useState("8");
  const [労働日数, set労働日数] = useState("20");
  const [残業時間月, set残業時間月] = useState("0");

  const 結果 = useMemo(() => {
    const 入力 = parseFloat(入力値) || 0;
    const 時間 = parseFloat(労働時間) || 8;
    const 日数 = parseFloat(労働日数) || 20;
    const 残業 = parseFloat(残業時間月) || 0;
    if (入力 <= 0) return null;

    switch (モード) {
      case "時給→年収": {
        const 日給 = 入力 * 時間;
        const 月給 = 日給 * 日数;
        const 残業代月 = 入力 * 1.25 * 残業;
        const 月給込残業 = 月給 + 残業代月;
        const 年収 = 月給込残業 * 12;
        return { 時給: 入力, 日給, 月給: 月給込残業, 年収, ラベル: "年収（概算）", メイン値: 年収, メイン単位: "円/年", 残業代月 };
      }
      case "年収→時給": {
        const 年間労働時間 = 時間 * 日数 * 12;
        const 月給 = 入力 / 12;
        const 日給 = 月給 / 日数;
        const 時給 = 年間労働時間 > 0 ? 入力 / 年間労働時間 : 0;
        return { 時給, 日給, 月給, 年収: 入力, ラベル: "時給（概算）", メイン値: 時給, メイン単位: "円/時", 残業代月: 0 };
      }
      case "月給→年収": {
        const 残業代月 = (入力 / 時間 / 日数) * 1.25 * 残業;
        const 月給込残業 = 入力 + 残業代月;
        const 年収 = 月給込残業 * 12;
        const 日給 = 入力 / 日数;
        const 時給 = 日給 / 時間;
        return { 時給, 日給, 月給: 月給込残業, 年収, ラベル: "年収（概算）", メイン値: 年収, メイン単位: "円/年", 残業代月 };
      }
      case "日給→月給": {
        const 月給 = 入力 * 日数;
        const 年収 = 月給 * 12;
        const 時給 = 入力 / 時間;
        return { 時給, 日給: 入力, 月給, 年収, ラベル: "月給（概算）", メイン値: 月給, メイン単位: "円/月", 残業代月: 0 };
      }
    }
  }, [モード, 入力値, 労働時間, 労働日数, 残業時間月]);

  const 結果テキスト = 結果 ? `${fmt(結果.メイン値)}${結果.メイン単位}` : "";

  const モード一覧: { key:換算モード; ラベル: string }[] = [
    { key: "時給→年収", ラベル: "時給→年収" },
    { key: "年収→時給", ラベル: "年収→時給" },
    { key: "月給→年収", ラベル: "月給→年収" },
    { key: "日給→月給", ラベル: "日給→月給" },
  ];

  const 入力ラベルマップ: Record<換算モード, string> = {
    "時給→年収": "時給（円）",
    "年収→時給": "年収（円）",
    "月給→年収": "月給（円）",
    "日給→月給": "日給（円）",
  };

  const クイック: Record<換算モード, string[]> = {
    "時給→年収": ["1000","1200","1500","2000","3000"],
    "年収→時給": ["3000000","4000000","5000000","6000000","8000000"],
    "月給→年収": ["200000","250000","300000","400000","500000"],
    "日給→月給": ["8000","10000","15000","20000","30000"],
  };

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>時給・年収換算計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">⏰ 時給・日給・月給・年収 換算計算機</h1>
          <p className="ツールページ説明">
            時給から年収、年収から時給など給与の単位を自由に換算。残業代・実質時給も計算。
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
              {/* モード */}
              <div className="フィールドグループ">
                <label className="フィールドラベル">換算モード</label>
                <div className={styles.モードグリッド}>
                  {モード一覧.map(({ key, ラベル }) => (
                    <button
                      key={key}
                      className={`${styles.モードボタン} ${モード === key ? styles.モードボタンアクティブ : ""}`}
                      onClick={() => { setモード(key); set入力値(""); }}
                    >
                      {ラベル}
                    </button>
                  ))}
                </div>
              </div>

              {/* 入力値 */}
              <div className="フィールドグループ">
                <label className="フィールドラベル">{入力ラベルマップ[モード]}</label>
                <input
                  type="number"
                  className="数値入力"
                  value={入力値}
                  onChange={(e) => set入力値(e.target.value)}
                  min="0" step="100"
                />
                <div className={styles.クイック群}>
                  {クイック[モード].map((v) => (
                    <button
                      key={v}
                      className={`${styles.クイックボタン} ${入力値 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set入力値(v)}
                    >
                      {モード === "年収→時給"
                        ? `${(Number(v)/10000).toFixed(0)}万`
                        : `${Number(v).toLocaleString()}円`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 労働条件 */}
              <div className={styles.条件グリッド}>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">1日の労働時間</label>
                  <input type="number" className="数値入力" value={労働時間}
                    onChange={(e) => set労働時間(e.target.value)} min="1" max="24" step="0.5" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">月の労働日数</label>
                  <input type="number" className="数値入力" value={労働日数}
                    onChange={(e) => set労働日数(e.target.value)} min="1" max="31" step="1" />
                </div>
              </div>

              {モード !== "年収→時給" && (
                <div className="フィールドグループ">
                  <label className="フィールドラベル">月の残業時間（時間）</label>
                  <input type="number" className="数値入力" value={残業時間月}
                    onChange={(e) => set残業時間月(e.target.value)} min="0" max="200" step="1" placeholder="0" />
                  <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                    残業割増率 1.25倍で計算
                  </span>
                </div>
              )}
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>{結果.ラベル}</span>
                    <span className={styles.メイン値}>
                      {結果.メイン単位 === "円/年"
                        ? `${fmtF(結果.メイン値 / 10000, 1)}万`
                        : `¥${fmt(結果.メイン値)}`}
                    </span>
                    <span className={styles.メイン単位テキスト}>{結果.メイン単位}</span>
                  </div>

                  <div className="結果グリッド">
                    {[
                      { label: "時給",    value: `¥${fmt(結果.時給)}円/時` },
                      { label: "日給",    value: `¥${fmt(結果.日給)}円/日` },
                      { label: "月給",    value: `¥${fmt(結果.月給)}円/月`, color: "#f59e0b" },
                      { label: "年収",    value: `¥${fmtF(結果.年収/10000, 1)}万円`, color: "#26d9ca" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.05rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {結果.残業代月 > 0 && (
                    <div className={styles.残業カード}>
                      <span>残業代（月・1.25倍）</span>
                      <span style={{ color: "#fbbf24", fontWeight: 700 }}>+¥{fmt(結果.残業代月)}円</span>
                    </div>
                  )}

                  {/* 割増賃金一覧 */}
                  <div className={styles.割増表}>
                    <div className={styles.割増ラベル}>割増賃金の目安（時給 ¥{fmt(結果.時給)}円 基準）</div>
                    {[
                      { 種別: "時間外（1.25倍）",  金額: 結果.時給 * 1.25 },
                      { 種別: "時間外60h超（1.50倍）", 金額: 結果.時給 * 1.50 },
                      { 種別: "深夜（1.25倍）",    金額: 結果.時給 * 1.25 },
                      { 種別: "休日（1.35倍）",    金額: 結果.時給 * 1.35 },
                    ].map((r) => (
                      <div key={r.種別} className={styles.割増アイテム}>
                        <span>{r.種別}</span>
                        <span style={{ color: "#f59e0b" }}>¥{fmt(r.金額)}円/時</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">金額を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }

        </div>
      </main>
    </>
  );
}
