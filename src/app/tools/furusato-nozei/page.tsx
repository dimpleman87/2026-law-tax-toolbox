"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./furusato-nozei.module.css";

const ツール定義 = {
  スラッグ: "furusato-nozei",
  タイトル: "ふるさと納税 控除上限額計算機",
  説明: "年収・家族構成から控除上限額を無料試算",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🏠 ふるさと納税の上限額を計算したら{result}円だった。返礼品を選ぶ前に確認→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

// 総務省・ふるさと納税ポータルの簡易計算式（2024年度基準）
function 控除上限額計算(年収: number, 家族区分: string): number {
  if (年収 <= 0) return 0;

  // 給与所得控除
  let 給与所得控除 = 0;
  if (年収 <= 1625000)      給与所得控除 = 550000;
  else if (年収 <= 1800000) 給与所得控除 = 年収 * 0.4 - 100000;
  else if (年収 <= 3600000) 給与所得控除 = 年収 * 0.3 + 80000;
  else if (年収 <= 6600000) 給与所得控除 = 年収 * 0.2 + 440000;
  else if (年収 <= 8500000) 給与所得控除 = 年収 * 0.1 + 1100000;
  else                      給与所得控除 = 1950000;

  const 給与所得 = 年収 - 給与所得控除;

  // 人的控除差額（家族区分別）
  const 人的控除差額マップ: Record<string, number> = {
    "独身・共働き":       0,
    "夫婦（配偶者控除）": 330000,
    "共働き＋子1人（中高生）": 260000,
    "共働き＋子1人（未就学）": 0,
    "共働き＋子2人（高校生以下）": 520000,
    "夫婦＋子1人（中高生）":  590000,
    "夫婦＋子2人（高校生以下）": 850000,
  };
  const 人的控除差額 = 人的控除差額マップ[家族区分] ?? 0;

  // 住民税所得割（概算）
  const 基礎控除 = 430000; // 住民税基礎控除
  const 課税所得 = Math.max(0, 給与所得 - 基礎控除 - 人的控除差額);
  const 住民税所得割 = 課税所得 * 0.1;

  // 控除上限額 ＝ 住民税所得割 × 20% ÷ (90% − 所得税率) + 2000
  // 所得税率の算出
  let 所得税率 = 0.05;
  const 課税所得年 = Math.max(0, 給与所得 - 480000 - 人的控除差額);
  if (課税所得年 > 40000000)     所得税率 = 0.45;
  else if (課税所得年 > 18000000) 所得税率 = 0.40;
  else if (課税所得年 > 9000000)  所得税率 = 0.33;
  else if (課税所得年 > 6950000)  所得税率 = 0.23;
  else if (課税所得年 > 3300000)  所得税率 = 0.20;
  else if (課税所得年 > 1950000)  所得税率 = 0.10;

  const 分母 = 0.9 - 所得税率 * 1.021; // 復興特別税込み
  const 上限額 = 住民税所得割 * 0.2 / 分母 + 2000;

  return Math.floor(上限額 / 1000) * 1000; // 千円単位に丸め
}

const 年収クイック = ["3000000","4000000","5000000","6000000","7000000","8000000","10000000"];

export default function ふるさと納税計算機ページ() {
  const [年収, set年収] = useState("5000000");
  const [家族区分, set家族区分] = useState("独身・共働き");

  const 結果 = useMemo(() => {
    const 年収数値 = parseInt(年収) || 0;
    if (年収数値 <= 0) return null;
    const 上限 = 控除上限額計算(年収数値, 家族区分);
    const 実質負担 = 2000;
    const お得額 = 上限 - 実質負担;
    return { 上限, 実質負担, お得額 };
  }, [年収, 家族区分]);

  const 結果テキスト = 結果 ? `ふるさと納税の上限額 ${fmt(結果.上限)}円` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>ふるさと納税 控除上限額計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏠 ふるさと納税 控除上限額計算機（2026年版）</h1>
          <p className="ツールページ説明">
            年収・家族構成を入力するだけで自己負担2,000円になる限度額を瞬時に試算。2024〜2026年度対応。
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
                <label className="フィールドラベル">年収（給与収入・円）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={年収}
                  onChange={(e) => set年収(e.target.value)}
                  min="0" step="100000"
                  placeholder="5000000"
                />
                <div className={styles.クイック群}>
                  {年収クイック.map((v) => (
                    <button
                      key={v}
                      className={`${styles.クイックボタン} ${年収 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set年収(v)}
                    >
                      {(Number(v) / 10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">家族構成</label>
                <div className={styles.家族選択}>
                  {[
                    "独身・共働き",
                    "夫婦（配偶者控除）",
                    "共働き＋子1人（中高生）",
                    "共働き＋子1人（未就学）",
                    "共働き＋子2人（高校生以下）",
                    "夫婦＋子1人（中高生）",
                    "夫婦＋子2人（高校生以下）",
                  ].map((k) => (
                    <button
                      key={k}
                      className={`${styles.家族ボタン} ${家族区分 === k ? styles.家族ボタンアクティブ : ""}`}
                      onClick={() => set家族区分(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 給与所得者の概算値です。医療費控除・住宅ローン控除等がある場合は実際の上限額が異なります。
                確定申告が必要な方は確定申告ベースでご確認ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>控除上限額（目安）</span>
                    <span className={styles.メイン値}>¥{fmt(結果.上限)}<span className={styles.メイン単位}>円</span></span>
                    <span className={styles.サブ説明}>この金額まで寄附すると自己負担は2,000円のみ</span>
                  </div>

                  <div className="結果グリッド">
                    {[
                      { label: "寄附推奨上限額",   value: `¥${fmt(結果.上限)}円`, color: "#10b981" },
                      { label: "実質自己負担",      value: `¥${fmt(結果.実質負担)}円`, color: "#f59e0b" },
                      { label: "税控除でお得になる額", value: `¥${fmt(結果.お得額)}円`, color: "#26d9ca" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.2rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.ヒント}>
                    💡 上限の80〜90%程度を寄附するのがおすすめです。
                    限度額ギリギリは計算誤差リスクがあります。
                  </div>

                  <div className={styles.ワンストップ}>
                    <strong>ワンストップ特例を使う条件</strong>
                    <ul>
                      <li>給与所得者（確定申告不要の方）</li>
                      <li>寄附先が5自治体以内</li>
                      <li>翌年1月10日までに申請書提出</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">年収を入力してください</p>
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
