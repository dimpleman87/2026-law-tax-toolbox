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
import styles from "./pet-lifetime-care-cost.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-lifetime-care-cost",
  タイトル: "ペット生涯飼育コスト計算機",
  説明: "犬・猫の一生にかかる総費用を年齢別に試算",
  カテゴリ: "ペット",
  category: "pet",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐾 ペット生涯飼育費は{result}。飼う前に総コストを確認→"],
};

type ペット種別 = "小型犬" | "中型犬" | "大型犬" | "猫（室内）" | "猫（外飼い）";

const デフォルト値: Record<ペット種別, {
  寿命: number; 月フード: number; 月医療: number; 月保険: number;
  月トリミング: number; 月消耗品: number; 初期費用: number;
}> = {
  "小型犬":    { 寿命: 15, 月フード: 8000,  月医療: 5000, 月保険: 4000, 月トリミング: 5000, 月消耗品: 3000, 初期費用: 300000 },
  "中型犬":    { 寿命: 13, 月フード: 12000, 月医療: 6000, 月保険: 5000, 月トリミング: 5000, 月消耗品: 3000, 初期費用: 250000 },
  "大型犬":    { 寿命: 11, 月フード: 18000, 月医療: 8000, 月保険: 6000, 月トリミング: 5000, 月消耗品: 3000, 初期費用: 250000 },
  "猫（室内）": { 寿命: 16, 月フード: 5000,  月医療: 3500, 月保険: 3000, 月トリミング: 0,    月消耗品: 3000, 初期費用: 100000 },
  "猫（外飼い）":{ 寿命: 12, 月フード: 4000, 月医療: 5000, 月保険: 2500, 月トリミング: 0,    月消耗品: 2000, 初期費用: 80000 },
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function ペット生涯飼育コスト計算機ページ() {
  const [種別, set種別] = useState<ペット種別>("小型犬");
  const d = デフォルト値[種別];

  const [寿命, set寿命] = useState(String(d.寿命));
  const [月フード, set月フード] = useState(String(d.月フード));
  const [月医療, set月医療] = useState(String(d.月医療));
  const [月保険, set月保険] = useState(String(d.月保険));
  const [月トリミング, set月トリミング] = useState(String(d.月トリミング));
  const [月消耗品, set月消耗品] = useState(String(d.月消耗品));
  const [初期費用, set初期費用] = useState(String(d.初期費用));

  function ペット切替(p: ペット種別) {
    const v = デフォルト値[p];
    set種別(p);
    set寿命(String(v.寿命));
    set月フード(String(v.月フード));
    set月医療(String(v.月医療));
    set月保険(String(v.月保険));
    set月トリミング(String(v.月トリミング));
    set月消耗品(String(v.月消耗品));
    set初期費用(String(v.初期費用));
  }

  const 結果 = useMemo(() => {
    const 年 = parseFloat(寿命) || 0;
    const 月合計 = (parseInt(月フード)||0)+(parseInt(月医療)||0)+(parseInt(月保険)||0)+(parseInt(月トリミング)||0)+(parseInt(月消耗品)||0);
    const 年合計 = 月合計 * 12;
    const 初期 = parseInt(初期費用)||0;
    const 生涯合計 = 年合計 * 年 + 初期;
    const 老齢補正 = 生涯合計 * 0.15; // シニア期（後半30%）の医療費増加 15%
    const 生涯推定 = 生涯合計 + 老齢補正;

    return { 月合計, 年合計, 初期, 生涯合計, 老齢補正, 生涯推定, 年 };
  }, [寿命, 月フード, 月医療, 月保険, 月トリミング, 月消耗品, 初期費用]);

  const 結果テキスト = `${種別}の生涯飼育コスト推定¥${fmt(結果.生涯推定)}（${結果.年}年間）`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-lifetime-care-cost" タイトル="ペット生涯飼育コスト計算機" 説明="犬・猫の一生にかかる総費用を年齢別に試算" カテゴリ="ペット" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペット生涯飼育コスト計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐾 ペット生涯飼育コスト計算機</h1>
          <FavoriteButton slug="pet-lifetime-care-cost" title="ペット生涯飼育コスト計算機" emoji="🐾" />
          <p className="ツールページ説明">
            犬・猫の種別を選び月間費用を入力するだけで、生涯にかかる総費用を試算。
            フード・医療・保険・トリミング・消耗品まで網羅した詳細シミュレーション。
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
                <label className="フィールドラベル">ペット種別</label>
                <div className={styles.クイック群}>
                  {(Object.keys(デフォルト値) as ペット種別[]).map((p) => (
                    <button key={p}
                      className={`${styles.クイックボタン} ${種別 === p ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => ペット切替(p)}>{p}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "平均寿命（年）", val: 寿命, set: set寿命, step: "1" },
                { label: "月間フード代（円）", val: 月フード, set: set月フード, step: "500" },
                { label: "月間医療費（円）", val: 月医療, set: set月医療, step: "500" },
                { label: "月間保険料（円）", val: 月保険, set: set月保険, step: "500" },
                { label: "月間トリミング代（円）", val: 月トリミング, set: set月トリミング, step: "500" },
                { label: "月間消耗品・おやつ代（円）", val: 月消耗品, set: set月消耗品, step: "500" },
                { label: "初期費用（購入・グッズ等）（円）", val: 初期費用, set: set初期費用, step: "10000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">生涯飼育コストシミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>生涯飼育費（推定）</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.生涯推定)}<span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.メインサブ}>{結果.年}年間 / シニア期医療費増加含む</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間費用合計", value: `¥${fmt(結果.月合計)}`, color: "#10b981" },
                    { label: "年間費用合計", value: `¥${fmt(結果.年合計)}`, color: "#06b6d4" },
                    { label: "初期費用", value: `¥${fmt(結果.初期)}`, color: "#f59e0b" },
                    { label: "シニア期医療費増", value: `¥${fmt(結果.老齢補正)}`, color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>年間費用内訳</div>
                  {[
                    { label: "フード代（月額×12）", value: `¥${fmt((parseInt(月フード)||0)*12)}` },
                    { label: "医療費（月額×12）", value: `¥${fmt((parseInt(月医療)||0)*12)}` },
                    { label: "保険料（月額×12）", value: `¥${fmt((parseInt(月保険)||0)*12)}` },
                    { label: "トリミング（月額×12）", value: `¥${fmt((parseInt(月トリミング)||0)*12)}` },
                    { label: "消耗品・おやつ（月額×12）", value: `¥${fmt((parseInt(月消耗品)||0)*12)}` },
                    { label: "年間合計", value: `¥${fmt(結果.年合計)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 5 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 5 ? "var(--カラー-テキスト)" : "var(--カラー-テキスト薄)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-lifetime-care-cost" />
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
