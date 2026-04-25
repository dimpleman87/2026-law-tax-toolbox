"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./pension-simulator.module.css";

const ツール定義 = {
  スラッグ: "pension-simulator",
  タイトル: "年金受給額シミュレーター",
  説明: "老齢基礎・厚生年金の受給見込み額を試算",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📊 年金受給額を試算。65歳から月{result}の見込み→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 受給開始 = "60" | "61" | "62" | "63" | "64" | "65" | "66" | "67" | "68" | "69" | "70" | "71" | "72" | "73" | "74" | "75";
type 加入種別 = "会社員" | "フリーランス" | "混在";

export default function 年金シミュレーターページ() {
  const [現在年齢, set現在年齢] = useState("40");
  const [国年加入年数, set国年加入年数] = useState("20"); // 20歳から現在まで
  const [厚年加入年数, set厚年加入年数] = useState("15");
  const [平均年収, set平均年収] = useState("5000000");
  const [受給開始, set受給開始] = useState<受給開始>("65");
  const [加入種別, set加入種別] = useState<加入種別>("会社員");

  const 結果 = useMemo(() => {
    const 年齢 = parseInt(現在年齢) || 40;
    const 国年年数 = Math.min(parseInt(国年加入年数) || 20, 40);
    const 厚年年数 = parseInt(厚年加入年数) || 15;
    const 年収 = parseInt(平均年収) || 5000000;
    const 開始年齢 = parseInt(受給開始) || 65;

    // 60歳までの残り国民年金加入見込み
    const 残り年数 = Math.max(0, 60 - 年齢);
    const 見込み国年年数 = Math.min(40, 国年年数 + 残り年数);

    // 老齢基礎年金（2024年満額816,000円）
    const 基礎年金満額 = 816000;
    const 基礎年金年額 = 基礎年金満額 * (見込み国年年数 / 40);
    const 基礎年金月額 = 基礎年金年額 / 12;

    // 老齢厚生年金（平均標準報酬月額 × 5.481/1000 × 加入月数）
    const 平均月収 = 年収 / 12;
    // 標準報酬月額は月収×0.85程度（各種手当込）
    const 標準報酬月額 = Math.min(平均月収 * 0.85, 650000); // 上限65万
    // 残り会社員期間（加入種別が会社員なら残り年数も加算）
    const 総厚年月数 = (厚年年数 + (加入種別 === "会社員" ? 残り年数 : 0)) * 12;
    const 厚生年金年額 = 標準報酬月額 * (5.481 / 1000) * 総厚年月数;
    const 厚生年金月額 = 厚生年金年額 / 12;

    // 繰上げ・繰下げ補正率
    let 補正率 = 1.0;
    if (開始年齢 < 65) {
      const 繰上げ月数 = (65 - 開始年齢) * 12;
      補正率 = Math.max(0, 1 - 0.004 * 繰上げ月数); // 0.4%/月減
    } else if (開始年齢 > 65) {
      const 繰下げ月数 = (開始年齢 - 65) * 12;
      補正率 = 1 + 0.007 * 繰下げ月数; // 0.7%/月増
    }

    const 補正後基礎月額 = 基礎年金月額 * 補正率;
    const 補正後厚生月額 = 厚生年金月額 * 補正率;
    const 合計月額 = 補正後基礎月額 + 補正後厚生月額;
    const 合計年額 = 合計月額 * 12;

    // 損益分岐点（65歳受給との比較）
    const 基準月額 = 基礎年金月額 + 厚生年金月額;
    let 損益分岐年齢 = 65;
    if (Math.abs(補正率 - 1) > 0.001) {
      // 累計受給額が等しくなる年齢を計算
      // base×(t-65) = adjusted×(t-開始年齢) → t = ...
      const diff = 合計月額 - 基準月額;
      if (diff !== 0) {
        const 繰下げ益 = (合計月額 - 基準月額) * 12;
        const 繰下げコスト = 基準月額 * (開始年齢 - 65) * 12;
        損益分岐年齢 = 開始年齢 + Math.round(繰下げコスト / (繰下げ益));
      }
    }

    // 80歳・90歳までの累計
    const 累計80歳 = 合計月額 * Math.max(0, (80 - 開始年齢) * 12);
    const 累計90歳 = 合計月額 * Math.max(0, (90 - 開始年齢) * 12);

    return {
      基礎年金月額: 補正後基礎月額,
      厚生年金月額: 補正後厚生月額,
      合計月額, 合計年額,
      補正率, 開始年齢,
      損益分岐年齢,
      累計80歳, 累計90歳,
      見込み国年年数,
      総厚年月数,
    };
  }, [現在年齢, 国年加入年数, 厚年加入年数, 平均年収, 受給開始, 加入種別]);

  const 結果テキスト = `年金受給見込み月${fmt(結果.合計月額)}円（${受給開始}歳受給開始）`;

  const 年齢クイック = ["25","30","35","40","45","50","55"];
  const 年収クイック = ["3000000","4000000","5000000","6000000","8000000","10000000"];
  const 受給開始選択肢: 受給開始[] = ["60","62","65","67","70","75"];

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
              <li>年金受給額シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📊 年金受給額シミュレーター（2024年度対応）</h1>
          <p className="ツールページ説明">
            現在年齢・加入年数・平均年収を入力するだけで、老齢基礎年金と厚生年金の受給見込み額を試算。
            繰上げ・繰下げ受給の損益分岐点も確認できます。
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
                <label className="フィールドラベル">現在の年齢</label>
                <input type="number" className="数値入力" value={現在年齢}
                  onChange={(e) => set現在年齢(e.target.value)} min="20" max="64" />
                <div className={styles.クイック群}>
                  {年齢クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${現在年齢 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set現在年齢(v)}>{v}歳</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">加入形態</label>
                <div className={styles.税率選択}>
                  {(["会社員", "フリーランス", "混在"] as 加入種別[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${加入種別 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set加入種別(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">国民年金 納付年数（現在まで）</label>
                <input type="number" className="数値入力" value={国年加入年数}
                  onChange={(e) => set国年加入年数(e.target.value)} min="0" max="40" />
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                  ※ 60歳まで自動で加算。最大40年で満額（816,000円/年）
                </p>
              </div>

              {加入種別 !== "フリーランス" && (
                <div className="フィールドグループ">
                  <label className="フィールドラベル">厚生年金 加入年数（現在まで）</label>
                  <input type="number" className="数値入力" value={厚年加入年数}
                    onChange={(e) => set厚年加入年数(e.target.value)} min="0" max="45" />
                </div>
              )}

              <div className="フィールドグループ">
                <label className="フィールドラベル">平均年収（在職中）</label>
                <input type="number" className="数値入力" value={平均年収}
                  onChange={(e) => set平均年収(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {年収クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${平均年収 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set平均年収(v)}>
                      {Number(v) >= 10000000 ? "1千万" : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">受給開始年齢</label>
                <div className={styles.クイック群}>
                  {受給開始選択肢.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${受給開始 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set受給開始(v)}>{v}歳</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "6px" }}>
                  {parseInt(受給開始) < 65
                    ? `繰上げ受給：${((1 - 結果.補正率) * 100).toFixed(1)}%減額（終身）`
                    : parseInt(受給開始) > 65
                    ? `繰下げ受給：${((結果.補正率 - 1) * 100).toFixed(1)}%増額（終身）`
                    : "標準受給（65歳）"}
                </p>
              </div>

              <div className={styles.注意書き}>
                ※ 本シミュレーターは概算です。実際の受給額はねんきんネットまたは年金事務所でご確認ください。
                2024年度の年金額・保険料率を基準としています。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* メインカード */}
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>月額受給見込み（{受給開始}歳受給開始）</span>
                  <span className={styles.メイン値}>
                    {fmt(結果.合計月額)}
                    <span className={styles.メイン単位}>円/月</span>
                  </span>
                  <span className={styles.年額}>年間 約{fmt(結果.合計年額)}円</span>
                </div>

                {/* 内訳 */}
                <div className="結果グリッド">
                  <div className="結果カード">
                    <span className="結果ラベル">老齢基礎年金（国民年金）</span>
                    <span className="結果値" style={{ color: "#06b6d4", fontSize: "1.1rem" }}>
                      {fmt(結果.基礎年金月額)}円/月
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                      納付 {結果.見込み国年年数}年見込み
                    </span>
                  </div>
                  <div className="結果カード">
                    <span className="結果ラベル">老齢厚生年金</span>
                    <span className="結果値" style={{ color: "#6366f1", fontSize: "1.1rem" }}>
                      {fmt(結果.厚生年金月額)}円/月
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                      加入 {Math.round(結果.総厚年月数 / 12)}年見込み
                    </span>
                  </div>
                </div>

                {/* 繰上げ・繰下げ早見 */}
                <div className={styles.繰下げカード}>
                  <div className={styles.繰下げタイトル}>📈 受給開始年齢別 月額比較</div>
                  {(["60","65","70","75"] as 受給開始[]).map((age) => {
                    const a = parseInt(age);
                    let r = 1.0;
                    if (a < 65) r = Math.max(0, 1 - 0.004 * (65 - a) * 12);
                    else if (a > 65) r = 1 + 0.007 * (a - 65) * 12;
                    const base = (結果.基礎年金月額 + 結果.厚生年金月額) / 結果.補正率;
                    const 月額 = base * r;
                    return (
                      <div key={age} className={`${styles.繰下げ行} ${受給開始 === age ? styles.繰下げ行強調 : ""}`}>
                        <span>{age}歳</span>
                        <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                          {a === 65 ? "基準" : a < 65 ? `${((1-r)*100).toFixed(0)}%減` : `+${((r-1)*100).toFixed(0)}%増`}
                        </span>
                        <span className={styles.繰下げ金額}>{fmt(月額)}円/月</span>
                      </div>
                    );
                  })}
                </div>

                {/* 累計受給額 */}
                <div className={styles.累計カード}>
                  <div className={styles.累計タイトル}>💰 累計受給見込み</div>
                  <div className={styles.累計行}>
                    <span>80歳まで受給</span>
                    <span className={styles.累計値}>約{fmt(結果.累計80歳)}円</span>
                  </div>
                  <div className={styles.累計行}>
                    <span>90歳まで受給</span>
                    <span className={styles.累計値}>約{fmt(結果.累計90歳)}円</span>
                  </div>
                  {parseInt(受給開始) > 65 && (
                    <div className={styles.累計行}>
                      <span>損益分岐点</span>
                      <span className={styles.累計値} style={{ color: "#f59e0b" }}>約{結果.損益分岐年齢}歳</span>
                    </div>
                  )}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
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
