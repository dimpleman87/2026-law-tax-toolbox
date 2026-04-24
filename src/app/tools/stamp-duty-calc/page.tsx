"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./stamp-duty-calc.module.css";

const ツール定義 = {
  スラッグ: "stamp-duty-calc",
  タイトル: "印紙税計算機",
  説明: "契約書・領収書の収入印紙代を即判定",
  カテゴリ: "士業・法務",
  category: "Legal",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📄 印紙税を計算。{result}の収入印紙が必要と判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 文書種別 = "不動産売買" | "請負契約" | "金銭消費貸借" | "領収書" | "継続的取引" | "約束手形";

// 印紙税額表（2024年）
const 印紙税表: Record<文書種別, { limit: number; tax: number }[]> = {
  "不動産売買": [
    { limit: 1000000, tax: 500 },
    { limit: 5000000, tax: 1000 },
    { limit: 10000000, tax: 5000 },
    { limit: 50000000, tax: 10000 },
    { limit: 100000000, tax: 30000 },
    { limit: 500000000, tax: 60000 },
    { limit: 1000000000, tax: 160000 },
    { limit: 5000000000, tax: 320000 },
    { limit: Infinity, tax: 480000 },
  ],
  "請負契約": [
    { limit: 1000000, tax: 200 },
    { limit: 2000000, tax: 400 },
    { limit: 3000000, tax: 1000 },
    { limit: 5000000, tax: 2000 },
    { limit: 10000000, tax: 10000 },
    { limit: 50000000, tax: 20000 },
    { limit: 100000000, tax: 60000 },
    { limit: 500000000, tax: 100000 },
    { limit: 1000000000, tax: 200000 },
    { limit: Infinity, tax: 400000 },
  ],
  "金銭消費貸借": [
    { limit: 1000000, tax: 1000 },
    { limit: 5000000, tax: 2000 },
    { limit: 10000000, tax: 10000 },
    { limit: 50000000, tax: 20000 },
    { limit: 100000000, tax: 60000 },
    { limit: 500000000, tax: 100000 },
    { limit: 1000000000, tax: 200000 },
    { limit: Infinity, tax: 600000 },
  ],
  "領収書": [
    { limit: 30000, tax: 0 },       // 3万円未満は非課税
    { limit: 100000, tax: 200 },
    { limit: 200000, tax: 400 },
    { limit: 300000, tax: 600 },
    { limit: 500000, tax: 1000 },
    { limit: 1000000, tax: 2000 },
    { limit: 2000000, tax: 4000 },
    { limit: 3000000, tax: 6000 },
    { limit: 5000000, tax: 10000 },
    { limit: 10000000, tax: 20000 },
    { limit: 20000000, tax: 40000 },
    { limit: 30000000, tax: 60000 },
    { limit: 50000000, tax: 100000 },
    { limit: Infinity, tax: 150000 },
  ],
  "継続的取引": [
    { limit: Infinity, tax: 4000 },  // 継続的取引の基本契約書は一律4,000円
  ],
  "約束手形": [
    { limit: 100000, tax: 200 },
    { limit: 200000, tax: 400 },
    { limit: 300000, tax: 600 },
    { limit: 500000, tax: 1000 },
    { limit: 1000000, tax: 2000 },
    { limit: 2000000, tax: 4000 },
    { limit: 3000000, tax: 6000 },
    { limit: 5000000, tax: 10000 },
    { limit: 10000000, tax: 20000 },
    { limit: 30000000, tax: 40000 },
    { limit: Infinity, tax: 60000 },
  ],
};

function 印紙税計算(種別: 文書種別, 金額: number): number {
  const 表 = 印紙税表[種別];
  const b = 表.find((x) => 金額 <= x.limit);
  return b ? b.tax : 表[表.length - 1].tax;
}

export default function 印紙税計算機ページ() {
  const [文書種別, set文書種別] = useState<文書種別>("不動産売買");
  const [契約金額, set契約金額] = useState("50000000");

  const 結果 = useMemo(() => {
    const 金額 = parseInt(契約金額) || 0;
    const 税額 = 印紙税計算(文書種別, 金額);
    const 非課税 = 税額 === 0;

    // 軽減措置対象（不動産売買・請負契約は2027年3月31日まで軽減）
    const 軽減対象 = 文書種別 === "不動産売買" || 文書種別 === "請負契約";

    return { 金額, 税額, 非課税, 軽減対象, 種別: 文書種別 };
  }, [文書種別, 契約金額]);

  const 結果テキスト = 結果.非課税
    ? "印紙税：非課税"
    : `印紙税 ¥${fmt(結果.税額)}（${文書種別}・¥${fmt(結果.金額)}）`;

  const 文書種別リスト: 文書種別[] = ["不動産売買", "請負契約", "金銭消費貸借", "領収書", "継続的取引", "約束手形"];

  const 金額クイック: Record<文書種別, string[]> = {
    "不動産売買":     ["10000000","30000000","50000000","100000000","300000000"],
    "請負契約":       ["1000000","5000000","10000000","50000000","100000000"],
    "金銭消費貸借":   ["1000000","5000000","10000000","50000000","100000000"],
    "領収書":         ["10000","50000","100000","300000","1000000"],
    "継続的取引":     ["1000000"],
    "約束手形":       ["100000","500000","1000000","5000000","10000000"],
  };

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-legal">士業・法務</Link></li>
              <li aria-hidden="true">›</li>
              <li>印紙税計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📄 印紙税計算機（2024年軽減措置対応）</h1>
          <p className="ツールページ説明">
            文書の種類と契約金額を選ぶだけで収入印紙の金額を即判定。
            不動産売買・請負契約・領収書・金銭消費貸借・約束手形に対応。軽減税率も反映。
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
                <label className="フィールドラベル">文書の種類</label>
                <div className={styles.文書選択}>
                  {文書種別リスト.map((種別) => (
                    <button key={種別}
                      className={`${styles.文書ボタン} ${文書種別 === 種別 ? styles.文書ボタンアクティブ : ""}`}
                      onClick={() => set文書種別(種別)}>{種別}</button>
                  ))}
                </div>
              </div>

              {文書種別 !== "継続的取引" && (
                <div className="フィールドグループ">
                  <label className="フィールドラベル">
                    {文書種別 === "領収書" ? "受取金額" : "契約金額"}（円）
                  </label>
                  <input type="number" className="数値入力" value={契約金額}
                    onChange={(e) => set契約金額(e.target.value)} min="0" step="100000" />
                  <div className={styles.クイック群}>
                    {金額クイック[文書種別].map((v) => (
                      <button key={v}
                        className={`${styles.クイックボタン} ${契約金額 === v ? styles.クイックボタンアクティブ : ""}`}
                        onClick={() => set契約金額(v)}>
                        {Number(v) >= 100000000 ? `${Number(v)/100000000}億` : Number(v) >= 10000 ? `${Number(v)/10000}万` : `${Number(v).toLocaleString()}円`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 文書説明 */}
              <div className={styles.文書説明}>
                {文書種別 === "不動産売買" && "土地・建物の売買契約書。2027年3月31日まで軽減税率適用。"}
                {文書種別 === "請負契約" && "建設工事・ソフトウェア開発などの請負契約書。2027年3月31日まで軽減税率適用。"}
                {文書種別 === "金銭消費貸借" && "金銭の貸借に関する契約書（ローン契約書など）。"}
                {文書種別 === "領収書" && "商品代金・サービス料の受取書。3万円未満は非課税。"}
                {文書種別 === "継続的取引" && "継続的取引の基本契約書（業務委託基本契約など）は金額に関わらず一律4,000円。"}
                {文書種別 === "約束手形" && "約束手形・為替手形。10万円未満は200円の定額。"}
              </div>

              {/* 印紙税早見表 */}
              <div className={styles.早見表}>
                <div className={styles.早見表タイトル}>📋 {文書種別} 印紙税早見表</div>
                {印紙税表[文書種別].slice(0, 6).map((row, i) => {
                  const prev = i > 0 ? 印紙税表[文書種別][i - 1].limit + 1 : 0;
                  const isActive = 結果.金額 > prev && 結果.金額 <= row.limit;
                  return (
                    <div key={i} className={`${styles.早見表行} ${isActive ? styles.早見表行強調 : ""}`}>
                      <span>
                        {prev === 0 ? "〜" : `${prev >= 100000000 ? `${prev/100000000}億` : `${prev/10000}万`}超〜`}
                        {row.limit === Infinity ? "超" : row.limit >= 100000000 ? `${row.limit/100000000}億` : `${row.limit/10000}万`}
                      </span>
                      <span className={styles.早見表税額}>{row.tax === 0 ? "非課税" : `¥${fmt(row.tax)}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              <div className={styles.結果コンテンツ}>
                {結果.非課税 ? (
                  <div className={styles.非課税カード}>
                    <div className={styles.非課税アイコン}>✅</div>
                    <div className={styles.非課税タイトル}>印紙税は非課税です</div>
                    <div className={styles.非課税説明}>
                      {文書種別 === "領収書"
                        ? "領収書の受取金額が3万円未満のため、印紙の貼付は不要です。"
                        : "この文書・金額では印紙の貼付は不要です。"}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.メインカード}>
                      <span className={styles.メインラベル}>必要な収入印紙</span>
                      <span className={styles.メイン値}>
                        ¥{fmt(結果.税額)}<span className={styles.メイン単位}>円</span>
                      </span>
                      {結果.軽減対象 && (
                        <span className={styles.軽減バッジ}>✅ 軽減税率適用中（〜2027年3月31日）</span>
                      )}
                    </div>

                    <div className="結果グリッド">
                      {[
                        { label: "文書種別", value: 結果.種別, color: "#f59e0b" },
                        { label: "契約金額", value: `¥${fmt(結果.金額)}`, color: "#06b6d4" },
                        { label: "印紙税額", value: `¥${fmt(結果.税額)}`, color: "#f25acc" },
                        { label: "印紙枚数の目安", value: `${Math.ceil(結果.税額 / 200)}枚〜`, color: "#10b981" },
                      ].map((item) => (
                        <div key={item.label} className="結果カード">
                          <span className="結果ラベル">{item.label}</span>
                          <span className="結果値" style={{ fontSize: "0.95rem", color: item.color }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.ポイントカード}>
                      <div className={styles.ポイントタイトル}>💡 印紙税のポイント</div>
                      <div className={styles.ポイント行}>
                        <span>収入印紙はコンビニ・郵便局で購入可能</span>
                      </div>
                      <div className={styles.ポイント行}>
                        <span>電子契約（電子署名）は印紙税不要</span>
                      </div>
                      <div className={styles.ポイント行}>
                        <span>印紙を貼り忘れると過怠税（3倍）が発生</span>
                      </div>
                      {結果.軽減対象 && (
                        <div className={styles.ポイント行}>
                          <span>軽減措置は2027年3月31日まで（延長の可能性あり）</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
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
