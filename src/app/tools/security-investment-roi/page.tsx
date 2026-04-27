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
import styles from "./security-investment-roi.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "security-investment-roi",
  タイトル: "セキュリティ投資ROI計算機（ROSI）",
  説明: "情報セキュリティ投資の費用対効果をROSI指標で定量評価",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🛡️ セキュリティ投資ROSIを算出。リスク低減効果¥{result}円で投資判断が明確に→"],
};

type インシデント種別 = "情報漏洩" | "ランサムウェア" | "なりすまし・不正アクセス" | "DDoS攻撃" | "内部不正";

const インシデント被害額: Record<インシデント種別, { 最小: number; 最大: number; 発生確率: number }> = {
  "情報漏洩":           { 最小: 5000000,   最大: 500000000, 発生確率: 0.25 },
  "ランサムウェア":      { 最小: 3000000,   最大: 100000000, 発生確率: 0.30 },
  "なりすまし・不正アクセス": { 最小: 500000,  最大: 30000000,  発生確率: 0.40 },
  "DDoS攻撃":          { 最小: 1000000,   最大: 50000000,  発生確率: 0.20 },
  "内部不正":           { 最小: 2000000,   最大: 200000000, 発生確率: 0.15 },
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function セキュリティ投資ROI計算機ページ() {
  const [インシデント種別, setインシデント種別] = useState<インシデント種別>("情報漏洩");
  const [被害額想定, set被害額想定] = useState("50000000");
  const [発生確率, set発生確率] = useState("25");
  const [セキュリティ投資額, setセキュリティ投資額] = useState("3000000");
  const [リスク低減率, setリスク低減率] = useState("70");
  const [運用年数, set運用年数] = useState("3");

  function インシデント切替(k: インシデント種別) {
    const d = インシデント被害額[k];
    const avg = Math.round((d.最小 + d.最大) / 2);
    setインシデント種別(k);
    set被害額想定(String(avg));
    set発生確率(String(Math.round(d.発生確率 * 100)));
  }

  const 結果 = useMemo(() => {
    const 被害 = parseInt(被害額想定) || 0;
    const 確率 = (parseInt(発生確率)||0) / 100;
    const 投資 = parseInt(セキュリティ投資額) || 0;
    const 低減率 = (parseInt(リスク低減率)||0) / 100;
    const 年数 = parseInt(運用年数) || 1;

    // ALE（年間期待損失）
    const ALE_before = 被害 * 確率;
    const ALE_after  = 被害 * 確率 * (1 - 低減率);
    const 年間リスク低減額 = ALE_before - ALE_after;
    const 期間リスク低減額 = 年間リスク低減額 * 年数;
    const ROSI = 投資 > 0 ? ((期間リスク低減額 - 投資) / 投資) * 100 : 0;
    const 回収月 = 年間リスク低減額 > 0 ? Math.ceil((投資 / 年間リスク低減額) * 12) : 0;

    return { ALE_before, ALE_after, 年間リスク低減額, 期間リスク低減額, ROSI, 回収月 };
  }, [被害額想定, 発生確率, セキュリティ投資額, リスク低減率, 運用年数]);

  const 結果テキスト = `セキュリティ投資ROSI${結果.ROSI.toFixed(0)}%・年間リスク低減¥${fmt(結果.年間リスク低減額)}`;

  const 低減率クイック = ["50","60","70","80","90"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="security-investment-roi" タイトル="セキュリティ投資ROI計算機（ROSI）" 説明="情報セキュリティ投資の費用対効果をROSI指標で定量評価" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>セキュリティ投資ROI計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🛡️ セキュリティ投資ROI計算機（ROSI）</h1>
          <FavoriteButton slug="security-investment-roi" title="セキュリティ投資ROI計算機（ROSI）" emoji="🛡️" />
          <p className="ツールページ説明">
            情報セキュリティへの投資効果を国際標準指標「ROSI」で定量化。
            インシデント被害額・発生確率・リスク低減率から年間期待損失（ALE）の削減効果を算出。
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
                <label className="フィールドラベル">インシデント種別（参考値を自動設定）</label>
                <div className={styles.クイック群}>
                  {(Object.keys(インシデント被害額) as インシデント種別[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${インシデント種別 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => インシデント切替(k)}>{k}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "インシデント被害想定額（円）", val: 被害額想定, set: set被害額想定, step: "1000000" },
                { label: "年間発生確率（%）", val: 発生確率, set: set発生確率, step: "5" },
                { label: "セキュリティ投資額（円）", val: セキュリティ投資額, set: setセキュリティ投資額, step: "500000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">リスク低減率（%）</label>
                <input type="number" className="数値入力" value={リスク低減率}
                  onChange={(e) => setリスク低減率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {低減率クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${リスク低減率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setリスク低減率(v)}>{v}%</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">評価期間（年）</label>
                <input type="number" className="数値入力" value={運用年数}
                  onChange={(e) => set運用年数(e.target.value)} min="1" step="1" />
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">ROSI分析結果</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>ROSI（セキュリティ投資ROI）</span>
                  <span className={styles.メイン値} style={{ color: 結果.ROSI > 0 ? "#10b981" : "#f25acc" }}>
                    {結果.ROSI.toFixed(0)}<span className={styles.メイン単位}>%</span>
                  </span>
                  <span className={styles.メインサブ}>
                    回収期間 {結果.回収月 > 0 ? `${結果.回収月}ヶ月` : "回収不可"}
                  </span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "投資前ALE（年間期待損失）", value: `¥${fmt(結果.ALE_before)}`, color: "#f25acc" },
                    { label: "投資後ALE", value: `¥${fmt(結果.ALE_after)}`, color: "#10b981" },
                    { label: "年間リスク低減額", value: `¥${fmt(結果.年間リスク低減額)}`, color: "#06b6d4" },
                    { label: `${運用年数}年間リスク低減`, value: `¥${fmt(結果.期間リスク低減額)}`, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.85rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>ROSI計算式</div>
                  {[
                    { label: "ALE（投資前）＝被害額×発生確率", value: `¥${fmt(結果.ALE_before)}` },
                    { label: `ALE（投資後）＝ALE×(1-低減率${リスク低減率}%)`, value: `¥${fmt(結果.ALE_after)}` },
                    { label: `期間リスク低減額（${運用年数}年）`, value: `¥${fmt(結果.期間リスク低減額)}` },
                    { label: "セキュリティ投資額", value: `-¥${fmt(parseInt(セキュリティ投資額)||0)}` },
                    { label: `ROSI＝(低減額-投資)/投資×100`, value: `${結果.ROSI.toFixed(1)}%` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 4 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 4 ? (結果.ROSI > 0 ? "#10b981" : "#f25acc") : "var(--カラー-テキスト薄)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="security-investment-roi" />
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
