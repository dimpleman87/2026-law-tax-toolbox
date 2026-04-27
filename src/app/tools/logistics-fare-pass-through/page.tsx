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
import styles from "./logistics-fare-pass-through.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "logistics-fare-pass-through",
  タイトル: "物流費値上げ転嫁シミュレーター",
  説明: "2024年問題による物流コスト増加の販売価格への転嫁効果を試算",
  カテゴリ: "ビジネス・経営",
  category: "business",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🚛 物流費値上げ分を価格転嫁した場合の影響を試算。利益率を守る戦略を→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function 物流費転嫁シミュレーターページ() {
  const [月間物流費, set月間物流費] = useState("500000");
  const [値上率, set値上率] = useState("20");
  const [月間売上, set月間売上] = useState("5000000");
  const [物流費比率現在, set物流費比率現在] = useState("");
  const [転嫁率, set転嫁率] = useState("70");
  const [月間出荷件数, set月間出荷件数] = useState("1000");

  const 結果 = useMemo(() => {
    const 物流現在 = parseInt(月間物流費) || 0;
    const 上率 = (parseInt(値上率)||0) / 100;
    const 売上 = parseInt(月間売上) || 0;
    const 転嫁 = (parseInt(転嫁率)||0) / 100;
    const 件数 = parseInt(月間出荷件数) || 1;

    const 物流増加額 = 物流現在 * 上率;
    const 物流新計 = 物流現在 + 物流増加額;
    const 自社負担 = 物流増加額 * (1 - 転嫁);
    const 転嫁額合計 = 物流増加額 * 転嫁;
    const 件あたり転嫁 = Math.ceil(転嫁額合計 / 件数);
    const 転嫁後売上 = 売上 + 転嫁額合計;
    const 物流比率before = 売上 > 0 ? (物流現在 / 売上) * 100 : 0;
    const 物流比率after = 転嫁後売上 > 0 ? (物流新計 / 転嫁後売上) * 100 : 0;
    const 年間自社負担 = 自社負担 * 12;

    return {
      物流増加額, 物流新計, 自社負担, 転嫁額合計, 件あたり転嫁,
      転嫁後売上, 物流比率before, 物流比率after, 年間自社負担,
    };
  }, [月間物流費, 値上率, 月間売上, 転嫁率, 月間出荷件数]);

  const 結果テキスト = `物流費${値上率}%値上げ：転嫁${転嫁率}%で1件あたり+¥${fmt(結果.件あたり転嫁)}・自社負担¥${fmt(結果.自社負担)}/月`;

  const 値上率クイック = ["10","15","20","25","30"];
  const 転嫁率クイック = ["50","70","80","100"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="logistics-fare-pass-through" タイトル="物流費値上げ転嫁シミュレーター" 説明="2024年問題による物流コスト増加の販売価格への転嫁効果を試算" カテゴリ="ビジネス・経営" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-business">ビジネス・経営</Link></li>
              <li aria-hidden="true">›</li>
              <li>物流費値上げ転嫁シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🚛 物流費値上げ転嫁シミュレーター</h1>
          <FavoriteButton slug="logistics-fare-pass-through" title="物流費値上げ転嫁シミュレーター" emoji="🚛" />
          <p className="ツールページ説明">
            2024年問題による物流コスト増加分を販売価格に転嫁した場合の影響を試算。
            転嫁率・件数・売上に対する利益圧迫額と1件あたりの値上げ幅を即算出。
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
              {[
                { label: "現在の月間物流費（円）", val: 月間物流費, set: set月間物流費, step: "50000" },
                { label: "月間売上（円）", val: 月間売上, set: set月間売上, step: "500000" },
                { label: "月間出荷件数（件）", val: 月間出荷件数, set: set月間出荷件数, step: "100" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">物流費値上率（%）</label>
                <input type="number" className="数値入力" value={値上率}
                  onChange={(e) => set値上率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {値上率クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${値上率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set値上率(v)}>{v}%</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">価格転嫁率（%）</label>
                <input type="number" className="数値入力" value={転嫁率}
                  onChange={(e) => set転嫁率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {転嫁率クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${転嫁率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set転嫁率(v)}>{v}%</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">転嫁シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>1件あたり値上げ幅（転嫁分）</span>
                  <span className={styles.メイン値}>
                    +¥{fmt(結果.件あたり転嫁)}<span className={styles.メイン単位}>円/件</span>
                  </span>
                  <span className={styles.メインサブ}>自社負担 ¥{fmt(結果.自社負担)}/月（年間¥{fmt(結果.年間自社負担)}）</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "物流費増加額（月）", value: `¥${fmt(結果.物流増加額)}`, color: "#f25acc" },
                    { label: "転嫁額合計（月）", value: `¥${fmt(結果.転嫁額合計)}`, color: "#10b981" },
                    { label: "物流費比率（前）", value: `${結果.物流比率before.toFixed(1)}%`, color: "#f59e0b" },
                    { label: "物流費比率（後）", value: `${結果.物流比率after.toFixed(1)}%`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>月間コスト影響明細</div>
                  {[
                    { label: "現在の物流費", value: `¥${fmt(parseInt(月間物流費)||0)}` },
                    { label: `値上り分（+${値上率}%）`, value: `+¥${fmt(結果.物流増加額)}` },
                    { label: "値上後の物流費", value: `¥${fmt(結果.物流新計)}` },
                    { label: `転嫁額（${転嫁率}%転嫁）`, value: `¥${fmt(結果.転嫁額合計)}` },
                    { label: `自社負担（${100 - parseInt(転嫁率)}%負担）`, value: `¥${fmt(結果.自社負担)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 4 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 4 ? "#f25acc" : "var(--カラー-テキスト薄)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="logistics-fare-pass-through" />
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
