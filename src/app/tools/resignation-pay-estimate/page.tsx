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
import styles from "./resignation-pay-estimate.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "resignation-pay-estimate",
  タイトル: "退職金概算シミュレーター",
  説明: "退職金控除・税引後手取りを即算出",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💼 退職金シミュレーション。{result}の手取りが判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPct(n: number) { return n.toFixed(1); }

type 退職理由 = "定年・会社都合" | "自己都合";

function 退職所得控除計算(勤続年数: number, 理由: 退職理由): number {
  const 年数 = Math.max(1, Math.round(勤続年数));
  // 自己都合の場合は控除額が同じ（退職所得控除自体は理由で変わらない）
  // ただし退職所得課税の計算に影響する場合あり（今回は標準計算）
  if (年数 <= 20) {
    return 年数 * 400000;
  } else {
    return 8000000 + (年数 - 20) * 700000;
  }
  // ※ 勤続年数が5年以下の役員等は1/2措置なし（今回は一般従業員として計算）
}

function 退職所得税計算(退職金: number, 控除額: number, 勤続年数: number, 理由: 退職理由) {
  const 課税退職所得 = Math.max(0, (退職金 - 控除額));
  // 勤続年数5年以下の一般従業員: 300万超分は1/2不適用（簡略のため5年超として計算、注記）
  const 退職所得金額 = Math.floor(課税退職所得 / 2 / 1000) * 1000; // 1000円未満切捨て

  // 所得税（2024年・総合課税と同じ累進）
  let 所得税 = 0;
  const 課税 = 退職所得金額;
  if (課税 <= 1950000) {
    所得税 = Math.floor(課税 * 0.05);
  } else if (課税 <= 3300000) {
    所得税 = Math.floor(課税 * 0.10 - 97500);
  } else if (課税 <= 6950000) {
    所得税 = Math.floor(課税 * 0.20 - 427500);
  } else if (課税 <= 9000000) {
    所得税 = Math.floor(課税 * 0.23 - 636000);
  } else if (課税 <= 18000000) {
    所得税 = Math.floor(課税 * 0.33 - 1536000);
  } else if (課税 <= 40000000) {
    所得税 = Math.floor(課税 * 0.40 - 2796000);
  } else {
    所得税 = Math.floor(課税 * 0.45 - 4796000);
  }
  // 復興特別所得税（2.1%）
  const 復興税 = Math.floor(所得税 * 0.021);
  const 所得税合計 = 所得税 + 復興税;

  // 住民税（退職所得 × 10%）
  const 住民税 = Math.floor(退職所得金額 * 0.10);

  const 税合計 = 所得税合計 + 住民税;
  const 手取り = 退職金 - 税合計;
  const 実効税率 = 退職金 > 0 ? (税合計 / 退職金) * 100 : 0;
  const 非課税判定 = 退職金 <= 控除額;

  return {
    課税退職所得,
    退職所得金額,
    所得税,
    復興税,
    所得税合計,
    住民税,
    税合計,
    手取り,
    実効税率,
    非課税判定,
  };
}

export default function 退職金概算シミュレーターページ() {
  const [退職金額, set退職金額] = useState("20000000");
  const [勤続年数, set勤続年数] = useState("30");
  const [退職理由, set退職理由] = useState<退職理由>("定年・会社都合");

  const 結果 = useMemo(() => {
    const 金額 = parseInt(退職金額) || 0;
    const 年数 = parseInt(勤続年数) || 1;
    const 控除額 = 退職所得控除計算(年数, 退職理由);
    const 税計算 = 退職所得税計算(金額, 控除額, 年数, 退職理由);
    return { 金額, 年数, 控除額, ...税計算 };
  }, [退職金額, 勤続年数, 退職理由]);

  const 結果テキスト = `退職金¥${fmt(結果.金額)}・勤続${勤続年数}年→手取り¥${fmt(結果.手取り)}`;

  const 退職金クイック = ["5000000","10000000","20000000","30000000","50000000","80000000"];
  const 勤続年数プリセット = ["5","10","15","20","25","30","35","40"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="resignation-pay-estimate" タイトル="退職金概算シミュレーター" 説明="退職金控除・税引後手取りを即算出" カテゴリ="ビジネス・経理" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-business">ビジネス・経理</Link></li>
              <li aria-hidden="true">›</li>
              <li>退職金概算シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💼 退職金概算シミュレーター</h1>
          <FavoriteButton slug="resignation-pay-estimate" title="退職金概算シミュレーター" emoji="💼" />
          <p className="ツールページ説明">
            退職金額・勤続年数を入力するだけで退職所得控除・課税退職所得・所得税・住民税・
            手取り額を即試算。退職前の資金計画・税負担シミュレーションに。
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
                <label className="フィールドラベル">退職金額（円）</label>
                <input type="number" className="数値入力" value={退職金額}
                  onChange={(e) => set退職金額(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {退職金クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${退職金額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set退職金額(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">勤続年数</label>
                <input type="number" className="数値入力" value={勤続年数}
                  onChange={(e) => set勤続年数(e.target.value)} min="1" max="50" />
                <div className={styles.クイック群}>
                  {勤続年数プリセット.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${勤続年数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set勤続年数(v)}>{v}年</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">退職の区分</label>
                <div className={styles.税率選択}>
                  {(["定年・会社都合", "自己都合"] as 退職理由[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${退職理由 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set退職理由(m)}>{m}</button>
                  ))}
                </div>
              </div>

              {/* 控除額解説 */}
              <div className={styles.控除表}>
                <div className={styles.控除表タイトル}>📋 退職所得控除の計算式</div>
                <div className={styles.控除行}>
                  <span>勤続年数20年以下</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>40万円 × 年数</span>
                </div>
                <div className={styles.控除行}>
                  <span>勤続年数20年超</span>
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>800万 + 70万×(年数-20)</span>
                </div>
                <div className={styles.控除行}>
                  <span>あなたの退職所得控除</span>
                  <span style={{ color: "#06b6d4", fontWeight: 700 }}>¥{fmt(結果.控除額)}</span>
                </div>
                <div className={styles.控除行}>
                  <span>課税退職所得（控除後×1/2）</span>
                  <span style={{ color: "#f25acc", fontWeight: 700 }}>¥{fmt(結果.退職所得金額)}</span>
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 本ツールは一般従業員（勤続年数5年超）を想定した概算です。
                役員・5年以下の退職や特定役員退職手当等は計算方法が異なります。
                正確な試算は税理士・会社の人事部門にご確認ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {結果.非課税判定 ? (
                  <div className={styles.非課税カード}>
                    <span className={styles.非課税バッジ}>🎉 非課税</span>
                    <span className={styles.非課税説明}>
                      退職金（¥{fmt(結果.金額)}）が退職所得控除（¥{fmt(結果.控除額)}）以下のため税金ゼロ
                    </span>
                    <span className={styles.非課税手取り}>手取り = 全額 ¥{fmt(結果.金額)}</span>
                  </div>
                ) : (
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>手取り退職金（税引後）</span>
                    <span className={styles.メイン値}>¥{fmt(結果.手取り)}<span className={styles.メイン単位}>円</span></span>
                    <span className={styles.実効税率}>実効税率 {fmtPct(結果.実効税率)}%</span>
                    <span className={styles.税負担}>税負担 ¥{fmt(結果.税合計)}</span>
                  </div>
                )}

                {/* フロー */}
                <div className={styles.フロー}>
                  <div className={styles.フロー行}>
                    <span>退職金（額面）</span>
                    <span>¥{fmt(結果.金額)}</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>退職所得控除</span>
                    <span style={{ color: "#10b981" }}>-¥{fmt(Math.min(結果.控除額, 結果.金額))}</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>課税退職所得（×1/2後）</span>
                    <span>¥{fmt(結果.退職所得金額)}</span>
                  </div>
                  <div className={styles.フロー仕切り} />
                  <div className={styles.フロー行}>
                    <span>所得税（復興特別税含む）</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.所得税合計)}</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>住民税（10%）</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.住民税)}</span>
                  </div>
                  <div className={styles.フロー仕切り} />
                  <div className={`${styles.フロー行} ${styles.フロー合計}`}>
                    <span>手取り（振込額）</span>
                    <span className={styles.手取り値}>¥{fmt(結果.手取り)}</span>
                  </div>
                </div>

                {/* グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "退職所得控除", value: `¥${fmt(結果.控除額)}`, color: "#10b981" },
                    { label: "課税退職所得", value: `¥${fmt(結果.退職所得金額)}`, color: "#f25acc" },
                    { label: "税合計", value: `¥${fmt(結果.税合計)}`, color: "#f97316" },
                    { label: "手取り退職金", value: `¥${fmt(結果.手取り)}`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 勤続年数早見表 */}
                <div className={styles.早見表}>
                  <div className={styles.早見表タイトル}>📊 退職所得控除 勤続年数別早見</div>
                  {[10, 15, 20, 25, 30, 35, 40].map((年) => {
                    const 控除 = 退職所得控除計算(年, 退職理由);
                    return (
                      <div key={年}
                        className={`${styles.早見行} ${parseInt(勤続年数) === 年 ? styles.早見行強調 : ""}`}
                        onClick={() => set勤続年数(String(年))}>
                        <span>{年}年</span>
                        <span className={styles.早見控除}>控除 ¥{fmt(控除)}</span>
                        <span className={styles.早見非課税}>非課税上限</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="resignation-pay-estimate" />
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
