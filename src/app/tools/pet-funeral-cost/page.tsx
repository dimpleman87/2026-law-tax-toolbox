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
import styles from "./pet-funeral-cost.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-funeral-cost",
  タイトル: "ペット葬儀費用シミュレーター",
  説明: "火葬・埋葬・メモリアルの総費用を事前に把握",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🌸 ペット葬儀費用を事前試算。{result}の準備が必要です→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type ペット種別 = "小型犬・猫（〜5kg）" | "中型犬（5〜15kg）" | "大型犬（15kg〜）" | "うさぎ・小動物";
type 火葬プラン = "合同火葬（立会いなし）" | "個別火葬（お骨返し）" | "訪問火葬（自宅）" | "一任個別火葬";

const 火葬費用: Record<ペット種別, Record<火葬プラン, number>> = {
  "小型犬・猫（〜5kg）": { "合同火葬（立会いなし）": 10000, "個別火葬（お骨返し）": 25000, "訪問火葬（自宅）": 35000, "一任個別火葬": 20000 },
  "中型犬（5〜15kg）":  { "合同火葬（立会いなし）": 15000, "個別火葬（お骨返し）": 35000, "訪問火葬（自宅）": 45000, "一任個別火葬": 28000 },
  "大型犬（15kg〜）":   { "合同火葬（立会いなし）": 25000, "個別火葬（お骨返し）": 55000, "訪問火葬（自宅）": 70000, "一任個別火葬": 45000 },
  "うさぎ・小動物":     { "合同火葬（立会いなし）": 5000,  "個別火葬（お骨返し）": 15000, "訪問火葬（自宅）": 25000, "一任個別火葬": 12000 },
};

export default function ペット葬儀費用ページ() {
  const [ペット, setペット] = useState<ペット種別>("小型犬・猫（〜5kg）");
  const [火葬, set火葬] = useState<火葬プラン>("個別火葬（お骨返し）");
  const [骨壺, set骨壺] = useState("8000");
  const [メモリアル, setメモリアル] = useState("20000");
  const [ペットロス, setペットロス] = useState("0");

  const 結果 = useMemo(() => {
    const 火葬費 = 火葬費用[ペット][火葬];
    const 骨壺費 = parseInt(骨壺) || 0;
    const メモリアル費 = parseInt(メモリアル) || 0;
    const ペットロス費 = parseInt(ペットロス) || 0;
    const 合計 = 火葬費 + 骨壺費 + メモリアル費 + ペットロス費;
    return { 火葬費, 骨壺費, メモリアル費, ペットロス費, 合計 };
  }, [ペット, 火葬, 骨壺, メモリアル, ペットロス]);

  const 結果テキスト = `${ペット}・${火葬}→葬儀総費用¥${fmt(結果.合計)}`;

  const ペットリスト: ペット種別[] = ["小型犬・猫（〜5kg）", "中型犬（5〜15kg）", "大型犬（15kg〜）", "うさぎ・小動物"];
  const 火葬リスト: 火葬プラン[] = ["合同火葬（立会いなし）", "個別火葬（お骨返し）", "訪問火葬（自宅）", "一任個別火葬"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-funeral-cost" タイトル="ペット葬儀費用シミュレーター" 説明="火葬・埋葬・メモリアルの総費用を事前に把握" カテゴリ="生活・計算" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-life">生活・計算</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペット葬儀費用シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🌸 ペット葬儀費用シミュレーター</h1>
          <FavoriteButton slug="pet-funeral-cost" title="ペット葬儀費用シミュレーター" emoji="🌸" />
          <p className="ツールページ説明">
            ペットの種類・火葬プランを選ぶだけで葬儀の総費用を試算。
            骨壺・メモリアルグッズ・ペットロスケアまで含めた総合コストを事前に把握。
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
                <label className="フィールドラベル">ペットの種類・サイズ</label>
                <div className={styles.選択群}>
                  {ペットリスト.map((p) => (
                    <button key={p}
                      className={`${styles.選択ボタン} ${ペット === p ? styles.選択ボタンアクティブ : ""}`}
                      onClick={() => setペット(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">火葬プラン</label>
                <div className={styles.選択群}>
                  {火葬リスト.map((f) => (
                    <button key={f}
                      className={`${styles.選択ボタン} ${火葬 === f ? styles.選択ボタンアクティブ : ""}`}
                      onClick={() => set火葬(f)}>
                      <span>{f}</span>
                      <span className={styles.費用目安}>目安 ¥{fmt(火葬費用[ペット][f])}</span>
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "骨壺・仏具代（円）", val: 骨壺, set: set骨壺, ph: "8000" },
                { label: "メモリアルグッズ（遺影・位牌等・円）", val: メモリアル, set: setメモリアル, ph: "20000" },
                { label: "ペットロスケア・カウンセリング（円）", val: ペットロス, set: setペットロス, ph: "0" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step="1000" placeholder={f.ph} />
                </div>
              ))}

              <div className={styles.注意書き}>
                ※ 火葬費用は地域・業者によって異なります。本ツールは全国平均の目安を使用しています。
                事前に複数社の見積もりを取ることをおすすめします。
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">葬儀費用シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>葬儀費用 総合計</span>
                  <span className={styles.メイン値}>¥{fmt(結果.合計)}<span className={styles.メイン単位}>円</span></span>
                </div>

                <div className={styles.内訳}>
                  {[
                    { label: "火葬費用", value: 結果.火葬費, color: "#f25acc" },
                    { label: "骨壺・仏具", value: 結果.骨壺費, color: "#a78bfa" },
                    { label: "メモリアルグッズ", value: 結果.メモリアル費, color: "#06b6d4" },
                    { label: "ペットロスケア", value: 結果.ペットロス費, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className={styles.内訳行}>
                      <span>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>¥{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className={styles.内訳合計}><span>合計</span><span>¥{fmt(結果.合計)}</span></div>
                </div>

                <div className={styles.プラン比較}>
                  <div className={styles.プラン比較タイトル}>📊 火葬プラン別費用比較</div>
                  {火葬リスト.map((f) => (
                    <div key={f}
                      className={`${styles.プラン行} ${火葬 === f ? styles.プラン行強調 : ""}`}
                      onClick={() => set火葬(f)}>
                      <span>{f}</span>
                      <span style={{ color: "#f25acc", fontWeight: 700 }}>¥{fmt(火葬費用[ペット][f])}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-funeral-cost" />
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
