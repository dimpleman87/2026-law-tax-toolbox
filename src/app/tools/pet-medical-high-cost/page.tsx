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
import styles from "./pet-medical-high-cost.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-medical-high-cost",
  タイトル: "犬猫 高額獣医療 自己負担シミュレーター",
  説明: "診察・手術・入院の医療費と保険補償額を明細試算",
  カテゴリ: "ペット",
  category: "pet",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐾 ペット高額医療の自己負担を試算。手術・入院¥{result}の備えを確認→"],
};

type 保険プラン = "なし" | "50%補償" | "70%補償" | "90%補償";
const 補償率: Record<保険プラン, number> = {
  "なし": 0, "50%補償": 0.5, "70%補償": 0.7, "90%補償": 0.9,
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function 高額獣医療計算機ページ() {
  const [診察料, set診察料] = useState("3000");
  const [検査費, set検査費] = useState("30000");
  const [麻酔料, set麻酔料] = useState("40000");
  const [手術費, set手術費] = useState("80000");
  const [入院日数, set入院日数] = useState("5");
  const [入院日額, set入院日額] = useState("15000");
  const [薬代, set薬代] = useState("10000");
  const [保険プラン, set保険プラン] = useState<保険プラン>("70%補償");
  const [免責金額, set免責金額] = useState("3000");

  const 結果 = useMemo(() => {
    const 小計 = [診察料, 検査費, 麻酔料, 手術費, 薬代].reduce((s, v) => s + (parseInt(v) || 0), 0);
    const 入院費 = (parseInt(入院日数) || 0) * (parseInt(入院日額) || 0);
    const 合計 = 小計 + 入院費;
    const 率 = 補償率[保険プラン];
    const 免責 = parseInt(免責金額) || 0;
    const 補償対象 = Math.max(0, 合計 - 免責);
    const 補償額 = Math.round(補償対象 * 率);
    const 自己負担 = 合計 - 補償額;

    return { 合計, 入院費, 補償額, 自己負担, 補償対象 };
  }, [診察料, 検査費, 麻酔料, 手術費, 入院日数, 入院日額, 薬代, 保険プラン, 免責金額]);

  const 結果テキスト = `高額獣医療費¥${fmt(結果.合計)}・保険補償¥${fmt(結果.補償額)}・自己負担¥${fmt(結果.自己負担)}`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-medical-high-cost" タイトル="犬猫 高額獣医療 自己負担シミュレーター" 説明="診察・手術・入院の医療費と保険補償額を明細試算" カテゴリ="ペット" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>高額獣医療 自己負担シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏥 犬猫 高額獣医療 自己負担シミュレーター</h1>
          <FavoriteButton slug="pet-medical-high-cost" title="犬猫 高額獣医療 自己負担シミュレーター" emoji="🏥" />
          <p className="ツールページ説明">
            診察・検査・手術・入院費を入力してペット保険の補償額と自己負担額を即算出。
            2026年最新の費用水準に対応。保険プラン選択の参考に。
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
                { label: "診察料・初診料（円）", val: 診察料, set: set診察料, step: "500" },
                { label: "検査費用（血液・レントゲン・エコー等）（円）", val: 検査費, set: set検査費, step: "5000" },
                { label: "麻酔料（円）", val: 麻酔料, set: set麻酔料, step: "5000" },
                { label: "手術費用（円）", val: 手術費, set: set手術費, step: "10000" },
                { label: "入院日数（日）", val: 入院日数, set: set入院日数, step: "1" },
                { label: "入院費（1泊あたり）（円）", val: 入院日額, set: set入院日額, step: "1000" },
                { label: "薬代・術後ケア（円）", val: 薬代, set: set薬代, step: "1000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">ペット保険の補償プラン</label>
                <div className={styles.クイック群}>
                  {(["なし","50%補償","70%補償","90%補償"] as 保険プラン[]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${保険プラン === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set保険プラン(v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">免責金額（円）</label>
                <input type="number" className="数値入力" value={免責金額}
                  onChange={(e) => set免責金額(e.target.value)} min="0" step="1000" />
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">医療費シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>自己負担額</span>
                  <span className={styles.メイン値} style={{ color: "#f59e0b" }}>¥{fmt(結果.自己負担)}<span className={styles.メイン単位}>円</span></span>
                  <span className={styles.メインサブ}>医療費合計 ¥{fmt(結果.合計)}</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "医療費合計", value: `¥${fmt(結果.合計)}`, color: "#10b981" },
                    { label: "入院費小計", value: `¥${fmt(結果.入院費)}`, color: "#06b6d4" },
                    { label: "保険補償額", value: `¥${fmt(結果.補償額)}`, color: "#a78bfa" },
                    { label: "自己負担額", value: `¥${fmt(結果.自己負担)}`, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>医療費内訳</div>
                  {[
                    { label: "診察料", value: `¥${fmt(parseInt(診察料)||0)}` },
                    { label: "検査費", value: `¥${fmt(parseInt(検査費)||0)}` },
                    { label: "麻酔料", value: `¥${fmt(parseInt(麻酔料)||0)}` },
                    { label: "手術費", value: `¥${fmt(parseInt(手術費)||0)}` },
                    { label: `入院費（${入院日数}日×¥${fmt(parseInt(入院日額)||0)}）`, value: `¥${fmt(結果.入院費)}` },
                    { label: "薬代", value: `¥${fmt(parseInt(薬代)||0)}` },
                    { label: "医療費合計", value: `¥${fmt(結果.合計)}` },
                    { label: `保険補償（${保険プラン}・免責¥${fmt(parseInt(免責金額)||0)}）`, value: `-¥${fmt(結果.補償額)}` },
                    { label: "自己負担額", value: `¥${fmt(結果.自己負担)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i >= 6 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-medical-high-cost" />
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
