"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./paperless-saving-calc.module.css";

const ツール定義 = {
  スラッグ: "paperless-saving-calc",
  タイトル: "ペーパーレス化コスト削減計算機",
  説明: "紙・印刷・保管コストの削減効果をリアルタイム試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["📄 ペーパーレス化で年間¥{result}削減。書類コストを今すぐ試算→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function ペーパーレス削減計算機ページ() {
  const [月間印刷枚数, set月間印刷枚数] = useState("1000");
  const [印刷単価, set印刷単価] = useState("10");
  const [月間郵送件数, set月間郵送件数] = useState("200");
  const [郵送単価, set郵送単価] = useState("110");
  const [書類保管面積, set書類保管面積] = useState("10");
  const [保管坪単価月, set保管坪単価月] = useState("20000");
  const [ファイリング工数月, setファイリング工数月] = useState("20");
  const [時給, set時給] = useState("2500");
  const [システム月額, setシステム月額] = useState("30000");
  const [ペーパーレス率, setペーパーレス率] = useState("80");

  const 結果 = useMemo(() => {
    const 率 = (parseInt(ペーパーレス率)||0) / 100;
    const 印刷月 = (parseInt(月間印刷枚数)||0) * (parseInt(印刷単価)||0);
    const 郵送月 = (parseInt(月間郵送件数)||0) * (parseInt(郵送単価)||0);
    const 保管月 = (parseFloat(書類保管面積)||0) * (parseInt(保管坪単価月)||0);
    const 工数月 = (parseInt(ファイリング工数月)||0) * (parseInt(時給)||0);
    const 現在月合計 = 印刷月 + 郵送月 + 保管月 + 工数月;

    const 月削減 = 現在月合計 * 率;
    const 年削減 = 月削減 * 12;
    const システム費 = (parseInt(システム月額)||0) * 12;
    const 年純削減 = 年削減 - システム費;
    const ROI = システム費 > 0 ? (年純削減 / システム費) * 100 : 0;
    const 回収月 = 月削減 > parseInt(システム月額) ? Math.ceil(システム費 / (月削減 - parseInt(システム月額))) : 0;

    return {
      印刷月, 郵送月, 保管月, 工数月, 現在月合計,
      月削減, 年削減, システム費, 年純削減, ROI, 回収月,
    };
  }, [月間印刷枚数, 印刷単価, 月間郵送件数, 郵送単価, 書類保管面積, 保管坪単価月, ファイリング工数月, 時給, システム月額, ペーパーレス率]);

  const 結果テキスト = `ペーパーレス${ペーパーレス率}%化で年間削減¥${fmt(結果.年削減)}・純削減¥${fmt(結果.年純削減)}`;

  const 率クイック = ["50","70","80","90","100"];

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
              <li>ペーパーレス化コスト削減計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📄 ペーパーレス化コスト削減計算機</h1>
          <p className="ツールページ説明">
            印刷枚数・郵送件数・書類保管スペース・ファイリング工数を入力するだけで
            ペーパーレス化による年間削減額と投資対効果を即算出。DX投資判断に。
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
                <label className="フィールドラベル">ペーパーレス化率（%）</label>
                <input type="number" className="数値入力" value={ペーパーレス率}
                  onChange={(e) => setペーパーレス率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {率クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${ペーパーレス率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setペーパーレス率(v)}>{v}%</button>
                  ))}
                </div>
              </div>

              {[
                { label: "月間印刷枚数（枚）", val: 月間印刷枚数, set: set月間印刷枚数, step: "100" },
                { label: "印刷単価（円/枚）", val: 印刷単価, set: set印刷単価, step: "1" },
                { label: "月間郵送件数（件）", val: 月間郵送件数, set: set月間郵送件数, step: "10" },
                { label: "郵送単価（円/件）", val: 郵送単価, set: set郵送単価, step: "10" },
                { label: "書類保管面積（坪）", val: 書類保管面積, set: set書類保管面積, step: "1" },
                { label: "保管坪単価（円/月）", val: 保管坪単価月, set: set保管坪単価月, step: "5000" },
                { label: "ファイリング工数（時間/月）", val: ファイリング工数月, set: setファイリング工数月, step: "5" },
                { label: "担当者時給（円）", val: 時給, set: set時給, step: "500" },
                { label: "ペーパーレスシステム月額（円）", val: システム月額, set: setシステム月額, step: "5000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">削減効果シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間純削減額</span>
                  <span className={styles.メイン値} style={{ color: 結果.年純削減 >= 0 ? "#10b981" : "#f25acc" }}>
                    {結果.年純削減 >= 0 ? "+" : ""}¥{fmt(結果.年純削減)}<span className={styles.メイン単位}>円/年</span>
                  </span>
                  <span className={styles.メインサブ}>現在月額 ¥{fmt(結果.現在月合計)} → 削減後 ¥{fmt(結果.現在月合計 - 結果.月削減)}</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間削減額", value: `¥${fmt(結果.月削減)}`, color: "#10b981" },
                    { label: "年間削減額（粗）", value: `¥${fmt(結果.年削減)}`, color: "#06b6d4" },
                    { label: "システム年間費", value: `-¥${fmt(結果.システム費)}`, color: "#f25acc" },
                    { label: "ROI", value: `${結果.ROI.toFixed(0)}%`, color: 結果.ROI > 0 ? "#f59e0b" : "#f25acc" },
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
                    { label: "印刷コスト", value: `¥${fmt(結果.印刷月)}` },
                    { label: "郵送コスト", value: `¥${fmt(結果.郵送月)}` },
                    { label: "保管コスト", value: `¥${fmt(結果.保管月)}` },
                    { label: "ファイリング工数コスト", value: `¥${fmt(結果.工数月)}` },
                    { label: "月間合計", value: `¥${fmt(結果.現在月合計)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 4 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 4 ? "var(--カラー-テキスト)" : "var(--カラー-テキスト薄)" }}>{row.value}</span>
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
