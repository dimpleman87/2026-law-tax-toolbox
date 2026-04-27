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
import styles from "./pet-2024-logistics-impact.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-2024-logistics-impact",
  タイトル: "ペットホテル・トリミングサロン 2024年問題コスト転嫁シミュレーター",
  説明: "人件費・燃料費増加に伴う値上げ幅の根拠を算出",
  カテゴリ: "ビジネス・経営",
  category: "business",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐶 ペットサロン2024年問題の値上げ根拠を算出。月¥{result}のコスト増を可視化→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function ペットサロン2024年問題ページ() {
  const [月間労働時間, set月間労働時間] = useState("400");
  const [現在時給, set現在時給] = useState("1100");
  const [月間売上, set月間売上] = useState("600000");
  const [燃料費月, set燃料費月] = useState("30000");
  const [電気代月, set電気代月] = useState("50000");
  const [消耗品月, set消耗品月] = useState("40000");
  const [最賃引上率, set最賃引上率] = useState("4");
  const [月間件数, set月間件数] = useState("100");

  const 結果 = useMemo(() => {
    const 時間 = parseInt(月間労働時間) || 0;
    const 時給 = parseInt(現在時給) || 0;
    const 売上 = parseInt(月間売上) || 0;
    const 燃料 = parseInt(燃料費月) || 0;
    const 電気 = parseInt(電気代月) || 0;
    const 消耗 = parseInt(消耗品月) || 0;
    const 引上率 = parseFloat(最賃引上率) / 100;
    const 件数 = parseInt(月間件数) || 1;

    const 人件費月 = 時間 * 時給;
    const 人件費増 = Math.round(人件費月 * 引上率);
    const 燃料増 = Math.round(燃料 * 0.15); // 2024年問題による輸送費15%増想定
    const 電気増 = Math.round(電気 * 0.12); // 電気代12%増想定
    const 消耗増 = Math.round(消耗 * 0.08); // 物価上昇8%想定
    const 月間コスト増 = 人件費増 + 燃料増 + 電気増 + 消耗増;
    const 年間コスト増 = 月間コスト増 * 12;
    const 件当たり値上げ = Math.ceil(月間コスト増 / 件数);
    const 値上げ率 = 売上 > 0 ? (月間コスト増 / 売上) * 100 : 0;

    return {
      人件費月, 人件費増, 燃料増, 電気増, 消耗増,
      月間コスト増, 年間コスト増, 件当たり値上げ, 値上げ率,
    };
  }, [月間労働時間, 現在時給, 月間売上, 燃料費月, 電気代月, 消耗品月, 最賃引上率, 月間件数]);

  const 結果テキスト = `2024年問題でコスト月間¥${fmt(結果.月間コスト増)}増加・1件¥${fmt(結果.件当たり値上げ)}の値上げ根拠`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-2024-logistics-impact" タイトル="ペットホテル・トリミングサロン 2024年問題コスト転嫁シミュレーター" 説明="人件費・燃料費増加に伴う値上げ幅の根拠を算出" カテゴリ="ビジネス・経営" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペットサロン 2024年問題コスト転嫁シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐶 ペットサロン 2024年問題コスト転嫁シミュレーター</h1>
          <FavoriteButton slug="pet-2024-logistics-impact" title="ペットホテル・トリミングサロン 2024年問題コスト転嫁シミュレーター" emoji="🐶" />
          <p className="ツールページ説明">
            人件費・燃料費・電気代の上昇コストを数値化し、値上げ幅の正当な根拠を算出。
            ペットホテル・トリミングサロンの料金改定時の説明資料に。
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
                { label: "月間スタッフ総労働時間（時間）", val: 月間労働時間, set: set月間労働時間, step: "50" },
                { label: "現在の平均時給（円）", val: 現在時給, set: set現在時給, step: "50" },
                { label: "月間売上（円）", val: 月間売上, set: set月間売上, step: "50000" },
                { label: "月間燃料費・送迎費（円）", val: 燃料費月, set: set燃料費月, step: "5000" },
                { label: "月間電気代（円）", val: 電気代月, set: set電気代月, step: "5000" },
                { label: "月間消耗品・薬剤費（円）", val: 消耗品月, set: set消耗品月, step: "5000" },
                { label: "月間受付件数（件）", val: 月間件数, set: set月間件数, step: "10" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">最低賃金引き上げ率（%）</label>
                <input type="number" className="数値入力" value={最賃引上率}
                  onChange={(e) => set最賃引上率(e.target.value)} min="0" step="0.5" />
                <div className={styles.クイック群}>
                  {["2","3","4","5"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${最賃引上率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set最賃引上率(v)}>{v}%</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">コスト転嫁シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>1件あたり必要値上げ額</span>
                  <span className={styles.メイン値}>¥{fmt(結果.件当たり値上げ)}<span className={styles.メイン単位}>円/件</span></span>
                  <span className={styles.メインサブ}>月間コスト増 ¥{fmt(結果.月間コスト増)}（売上比 {結果.値上げ率.toFixed(1)}%）</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "人件費増（月）", value: `¥${fmt(結果.人件費増)}`, color: "#f25acc" },
                    { label: "燃料・電気増（月）", value: `¥${fmt(結果.燃料増 + 結果.電気増)}`, color: "#f59e0b" },
                    { label: "消耗品増（月）", value: `¥${fmt(結果.消耗増)}`, color: "#06b6d4" },
                    { label: "年間コスト増", value: `¥${fmt(結果.年間コスト増)}`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>コスト増加の内訳</div>
                  {[
                    { label: `人件費増（時給${最賃引上率}%引上）`, value: `+¥${fmt(結果.人件費増)}` },
                    { label: "燃料費増（15%上昇想定）", value: `+¥${fmt(結果.燃料増)}` },
                    { label: "電気代増（12%上昇想定）", value: `+¥${fmt(結果.電気増)}` },
                    { label: "消耗品増（8%物価上昇想定）", value: `+¥${fmt(結果.消耗増)}` },
                    { label: "月間コスト増合計", value: `+¥${fmt(結果.月間コスト増)}` },
                    { label: "年間コスト増合計", value: `+¥${fmt(結果.年間コスト増)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i >= 4 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: "#f25acc" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-2024-logistics-impact" />
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
