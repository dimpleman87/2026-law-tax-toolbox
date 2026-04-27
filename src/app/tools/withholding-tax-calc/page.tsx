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
import styles from "./withholding-tax-calc.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "withholding-tax-calc",
  タイトル: "源泉徴収税額計算機",
  説明: "外注報酬・原稿料の源泉徴収税と手取りを即算出",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💰 源泉徴収税を計算。報酬{result}の手取りが判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function pct(n: number) { return n.toFixed(2); }

type 報酬種別 = "原稿料・講演料等" | "弁護士・税理士等" | "司法書士等" | "不動産賃貸" | "デザイン・執筆" | "芸能人・モデル";

interface 計算結果 {
  支払額: number;
  源泉税: number;
  手取り: number;
  税率: number;
  説明: string;
  消費税込支払: number;
  源泉税込: number;
}

function 源泉税計算(種別: 報酬種別, 支払額: number): 計算結果 {
  let 税率 = 0.1021; // 基本10.21%
  let 説明 = "支払金額の10.21%（100万円超は20.42%）";

  // 支払額に応じた税率
  let 源泉税 = 0;

  switch (種別) {
    case "原稿料・講演料等":
    case "デザイン・執筆":
    case "芸能人・モデル":
      if (支払額 <= 1000000) {
        源泉税 = Math.round(支払額 * 0.1021);
        説明 = "支払金額 × 10.21%";
      } else {
        源泉税 = Math.round(1000000 * 0.1021 + (支払額 - 1000000) * 0.2042);
        説明 = "100万円まで10.21%・超過分20.42%";
      }
      税率 = 源泉税 / 支払額 * 100;
      break;

    case "弁護士・税理士等":
      if (支払額 <= 1000000) {
        源泉税 = Math.round(支払額 * 0.1021);
        説明 = "支払金額 × 10.21%";
      } else {
        源泉税 = Math.round(1000000 * 0.1021 + (支払額 - 1000000) * 0.2042);
        説明 = "100万円まで10.21%・超過分20.42%";
      }
      税率 = 源泉税 / 支払額 * 100;
      break;

    case "司法書士等":
      // 司法書士は1万円控除後に10.21%
      const 控除後 = Math.max(0, 支払額 - 10000);
      源泉税 = Math.round(控除後 * 0.1021);
      税率 = 源泉税 / 支払額 * 100;
      説明 = "（支払金額 - 10,000円）× 10.21%";
      break;

    case "不動産賃貸":
      源泉税 = Math.round(支払額 * 0.1021);
      説明 = "支払金額 × 10.21%（個人地主への家賃）";
      税率 = 10.21;
      break;

    default:
      源泉税 = Math.round(支払額 * 0.1021);
      税率 = 10.21;
  }

  const 手取り = 支払額 - 源泉税;
  // 消費税込み請求額（受注者が税込請求する場合）
  const 消費税込支払 = 支払額 * 1.1;
  // 消費税込みの場合の源泉徴収（消費税込み全額に課税）
  const 源泉税込 = 種別 === "原稿料・講演料等" || 種別 === "デザイン・執筆"
    ? Math.round(消費税込支払 * 0.1021)
    : 源泉税;

  return { 支払額, 源泉税, 手取り, 税率, 説明, 消費税込支払, 源泉税込 };
}

export default function 源泉徴収税計算機ページ() {
  const [支払金額, set支払金額] = useState("300000");
  const [報酬種別, set報酬種別] = useState<報酬種別>("原稿料・講演料等");
  const [消費税モード, set消費税モード] = useState<"税抜" | "税込">("税抜");

  const 結果 = useMemo(() => {
    const 金額 = parseInt(支払金額) || 0;
    const 実支払 = 消費税モード === "税込" ? Math.round(金額 / 1.1) : 金額;
    return 源泉税計算(報酬種別, 実支払);
  }, [支払金額, 報酬種別, 消費税モード]);

  const 結果テキスト = `報酬¥${fmt(結果.支払額)}→源泉税¥${fmt(結果.源泉税)}・手取り¥${fmt(結果.手取り)}`;

  const 金額クイック = ["100000","200000","300000","500000","1000000","2000000"];
  const 報酬種別リスト: 報酬種別[] = [
    "原稿料・講演料等", "デザイン・執筆", "弁護士・税理士等",
    "司法書士等", "不動産賃貸", "芸能人・モデル",
  ];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="withholding-tax-calc" タイトル="源泉徴収税額計算機" 説明="外注報酬・原稿料の源泉徴収税と手取りを即算出" カテゴリ="金融・投資" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-finance">金融・投資</Link></li>
              <li aria-hidden="true">›</li>
              <li>源泉徴収税額計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💼 源泉徴収税額計算機</h1>
          <FavoriteButton slug="withholding-tax-calc" title="源泉徴収税額計算機" emoji="💼" />
          <p className="ツールページ説明">
            外注費・原稿料・講演料などの支払時に発生する源泉徴収税額と手取りを即算出。
            フリーランス・個人事業主への報酬支払いや確定申告の参考に。
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
                <label className="フィールドラベル">報酬の種別</label>
                <div className={styles.種別選択}>
                  {報酬種別リスト.map((種別) => (
                    <button key={種別}
                      className={`${styles.種別ボタン} ${報酬種別 === 種別 ? styles.種別ボタンアクティブ : ""}`}
                      onClick={() => set報酬種別(種別)}>{種別}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">消費税</label>
                <div className={styles.税率選択}>
                  {(["税抜", "税込"] as const).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${消費税モード === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set消費税モード(m)}>
                      {m === "税抜" ? "税抜金額を入力" : "税込金額を入力"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">
                  支払金額（{消費税モード}・円）
                </label>
                <input type="number" className="数値入力" value={支払金額}
                  onChange={(e) => set支払金額(e.target.value)} min="0" step="10000" />
                <div className={styles.クイック群}>
                  {金額クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${支払金額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set支払金額(v)}>
                      {Number(v) >= 1000000 ? `${Number(v)/10000}万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.メモ}>
                <div className={styles.メモタイトル}>📌 計算ルール</div>
                <p>{結果.説明}</p>
                <p style={{ marginTop: "6px" }}>
                  源泉徴収税率：10.21%（所得税10% + 復興特別所得税0.21%）<br />
                  100万円超の報酬は超過部分に20.42%が適用されます
                </p>
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* メインカード */}
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>手取り金額（受取額）</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.手取り)}<span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.メイン説明}>源泉税率 実効{pct(結果.税率)}%</span>
                </div>

                {/* フロー */}
                <div className={styles.フロー}>
                  <div className={styles.フロー行}>
                    <span>支払金額（税抜）</span>
                    <span>¥{fmt(結果.支払額)}円</span>
                  </div>
                  {消費税モード === "税込" && (
                    <div className={styles.フロー行}>
                      <span>消費税（10%）</span>
                      <span>¥{fmt(Math.round(結果.支払額 * 0.1))}円</span>
                    </div>
                  )}
                  <div className={styles.フロー行}>
                    <span>源泉徴収税額（控除）</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.源泉税)}円</span>
                  </div>
                  <div className={styles.フロー仕切り} />
                  <div className={`${styles.フロー行} ${styles.フロー合計}`}>
                    <span>手取り（振込額）</span>
                    <span className={styles.手取り値}>¥{fmt(結果.手取り)}円</span>
                  </div>
                </div>

                {/* グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "支払金額（税抜）", value: `¥${fmt(結果.支払額)}`, color: "#06b6d4" },
                    { label: "源泉徴収税額", value: `¥${fmt(結果.源泉税)}`, color: "#f25acc" },
                    { label: "手取り金額", value: `¥${fmt(結果.手取り)}`, color: "#10b981" },
                    { label: "消費税込み請求額", value: `¥${fmt(Math.round(結果.支払額 * 1.1))}`, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ fontSize: "0.95rem", color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 一括表 */}
                <div className={styles.一括表}>
                  <div className={styles.一括表タイトル}>💡 よくある報酬額の源泉税早見</div>
                  {[100000, 200000, 300000, 500000, 1000000].map((amt) => {
                    const r = 源泉税計算(報酬種別, amt);
                    return (
                      <div key={amt}
                        className={`${styles.一括行} ${結果.支払額 === amt ? styles.一括行強調 : ""}`}
                        onClick={() => set支払金額(String(amt))}>
                        <span>¥{fmt(amt)}</span>
                        <span className={styles.一括税}>源泉税 ¥{fmt(r.源泉税)}</span>
                        <span className={styles.一括手取}>手取 ¥{fmt(r.手取り)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="withholding-tax-calc" />
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
