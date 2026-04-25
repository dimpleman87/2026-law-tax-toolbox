"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./digital-sign-saving.module.css";

const ツール定義 = {
  スラッグ: "digital-sign-saving",
  タイトル: "電子署名・電子契約コスト削減計算機",
  説明: "紙契約から電子契約に移行した場合のコスト削減効果を試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["✍️ 電子契約導入で年間¥{result}削減。印紙代・郵送費・保管費を一括試算→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function 電子署名削減計算機ページ() {
  const [月間契約件数, set月間契約件数] = useState("50");
  const [印紙代平均, set印紙代平均] = useState("4000");
  const [郵送費用, set郵送費用] = useState("200");
  const [印刷費, set印刷費] = useState("50");
  const [保管費月, set保管費月] = useState("30000");
  const [担当者工数, set担当者工数] = useState("2");
  const [時給, set時給] = useState("2500");
  const [電子契約月額, set電子契約月額] = useState("10000");

  const 結果 = useMemo(() => {
    const 件数 = parseInt(月間契約件数) || 0;
    const 印紙 = parseInt(印紙代平均) || 0;
    const 郵送 = parseInt(郵送費用) || 0;
    const 印刷 = parseInt(印刷費) || 0;
    const 保管 = parseInt(保管費月) || 0;
    const 工数 = parseFloat(担当者工数) || 0;
    const 単価 = parseInt(時給) || 0;
    const 電子月額 = parseInt(電子契約月額) || 0;

    // 紙契約の月間コスト
    const 印紙月 = 印紙 * 件数;
    const 郵送月 = 郵送 * 件数 * 2; // 往復
    const 印刷月 = 印刷 * 件数 * 4; // 原本2部×2枚
    const 工数月 = 工数 * 単価 * 件数;
    const 紙月合計 = 印紙月 + 郵送月 + 印刷月 + 保管 + 工数月;

    // 電子契約後
    const 電子工数月 = 工数 * 0.2 * 単価 * 件数; // 工数80%削減想定
    const 電子月合計 = 電子月額 + 電子工数月;

    const 月削減 = 紙月合計 - 電子月合計;
    const 年削減 = 月削減 * 12;
    const ROI = 電子月額 * 12 > 0 ? (年削減 / (電子月額 * 12)) * 100 : 0;
    const 回収月 = 月削減 > 0 ? 0 : 0; // 即時効果型

    return {
      印紙月, 郵送月, 印刷月, 保管月: 保管, 工数月,
      紙月合計, 電子月合計, 月削減, 年削減, ROI,
    };
  }, [月間契約件数, 印紙代平均, 郵送費用, 印刷費, 保管費月, 担当者工数, 時給, 電子契約月額]);

  const 結果テキスト = `電子契約導入で年間¥${fmt(結果.年削減)}削減（月¥${fmt(結果.月削減)}）ROI ${結果.ROI.toFixed(0)}%`;

  const 件数クイック = ["10","30","50","100","200"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>電子署名・電子契約コスト削減計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">✍️ 電子署名・電子契約コスト削減計算機</h1>
          <p className="ツールページ説明">
            印紙代・郵送費・印刷費・保管費・担当者工数を入力するだけで
            電子契約導入による年間コスト削減額とROIを即算出。稟議の根拠データに。
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
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">月間契約件数（件）</label>
                <input type="number" className="数値入力" value={月間契約件数}
                  onChange={(e) => set月間契約件数(e.target.value)} min="1" step="10" />
                <div className={styles.クイック群}>
                  {件数クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${月間契約件数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set月間契約件数(v)}>{v}件</button>
                  ))}
                </div>
              </div>

              {[
                { label: "印紙代 平均（円/件）", val: 印紙代平均, set: set印紙代平均, step: "1000" },
                { label: "郵送費（円/件・片道）", val: 郵送費用, set: set郵送費用, step: "50" },
                { label: "印刷費（円/枚）", val: 印刷費, set: set印刷費, step: "10" },
                { label: "書類保管費（円/月）", val: 保管費月, set: set保管費月, step: "5000" },
                { label: "契約1件あたり担当者工数（時間）", val: 担当者工数, set: set担当者工数, step: "0.5" },
                { label: "担当者時給（円）", val: 時給, set: set時給, step: "500" },
                { label: "電子契約サービス月額（円）", val: 電子契約月額, set: set電子契約月額, step: "5000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">電子契約 削減効果試算</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間コスト削減額</span>
                  <span className={styles.メイン値} style={{ color: 結果.年削減 >= 0 ? "#10b981" : "#f25acc" }}>
                    {結果.年削減 >= 0 ? "+" : ""}¥{fmt(結果.年削減)}<span className={styles.メイン単位}>円/年</span>
                  </span>
                  <span className={styles.メインサブ}>月削減 ¥{fmt(結果.月削減)} / ROI {結果.ROI.toFixed(0)}%</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "現在の月間コスト", value: `¥${fmt(結果.紙月合計)}`, color: "#f25acc" },
                    { label: "電子契約後の月間コスト", value: `¥${fmt(結果.電子月合計)}`, color: "#10b981" },
                    { label: "印紙代削減（年間）", value: `¥${fmt(結果.印紙月 * 12)}`, color: "#f59e0b" },
                    { label: "工数削減（年間）", value: `¥${fmt(結果.工数月 * 0.8 * 12)}`, color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>現在の月間コスト内訳</div>
                  {[
                    { label: "印紙代", value: `¥${fmt(結果.印紙月)}` },
                    { label: "郵送費（往復）", value: `¥${fmt(結果.郵送月)}` },
                    { label: "印刷費", value: `¥${fmt(結果.印刷月)}` },
                    { label: "書類保管費", value: `¥${fmt(結果.保管月)}` },
                    { label: "担当者工数コスト", value: `¥${fmt(結果.工数月)}` },
                    { label: "合計", value: `¥${fmt(結果.紙月合計)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 5 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 5 ? "var(--カラー-テキスト)" : "var(--カラー-テキスト薄)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>

          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>
        </div>
      </main>
      <div className="広告ラッパー"><div className="広告ラベル">スポンサー</div><AdSlot 位置="bottom" /></div>
    </>
  );
}
