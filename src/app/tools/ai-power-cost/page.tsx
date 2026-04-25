"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./ai-power-cost.module.css";

const ツール定義 = {
  スラッグ: "ai-power-cost",
  タイトル: "AI・データセンター電力コストシミュレーター",
  説明: "GPU運用・クラウドAIの電力費を試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["⚡ AIインフラの年間電力コスト¥{result}。GPU運用コストを今すぐ試算→"],
};

type GPU種別 = "H100" | "A100" | "RTX4090" | "RTX3090" | "なし";
const GPU消費W: Record<GPU種別, number> = {
  H100: 700, A100: 400, RTX4090: 450, RTX3090: 350, なし: 0,
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtF(n: number) { return n.toFixed(1); }

export default function AI電力コストページ() {
  const [GPU, setGPU] = useState<GPU種別>("A100");
  const [GPU台数, setGPU台数] = useState("4");
  const [稼働時間, set稼働時間] = useState("400");
  const [電力単価, set電力単価] = useState("30");
  const [API月額, setAPI月額] = useState("50000");
  const [PUE, setPUE] = useState("1.5");

  const 結果 = useMemo(() => {
    const w = GPU消費W[GPU];
    const 台 = parseInt(GPU台数) || 0;
    const h = parseFloat(稼働時間) || 0;
    const 単価 = parseFloat(電力単価) || 30;
    const api = parseInt(API月額) || 0;
    const pue = parseFloat(PUE) || 1.5;

    const 月kWh = (w * 台 * h * pue) / 1000;
    const 月電気代 = 月kWh * 単価;
    const 月合計 = 月電気代 + api;
    const 年合計 = 月合計 * 12;
    const GX賦課金月 = 月kWh * 0.5; // 2026年GX賦課金概算
    const CO2月kg = 月kWh * 0.43;

    return { 月kWh, 月電気代, api, 月合計, 年合計, GX賦課金月, CO2月kg };
  }, [GPU, GPU台数, 稼働時間, 電力単価, API月額, PUE]);

  const 結果テキスト = `AIインフラ年間コスト¥${fmt(結果.年合計)}（月間電力${fmtF(結果.月kWh)}kWh）`;

  const GPU選択肢: { key: GPU種別; label: string }[] = [
    { key: "H100", label: "H100（700W）" },
    { key: "A100", label: "A100（400W）" },
    { key: "RTX4090", label: "RTX 4090（450W）" },
    { key: "RTX3090", label: "RTX 3090（350W）" },
    { key: "なし", label: "APIのみ" },
  ];

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
              <li>AI電力コストシミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">⚡ AI・データセンター電力コストシミュレーター</h1>
          <p className="ツールページ説明">
            GPU種別・台数・稼働時間・電力単価を入力するだけで月間電力コストと年間AIインフラ費用を試算。
            クラウドAPI料金も合算してROI計算の根拠に。
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
                <label className="フィールドラベル">GPU種類</label>
                <div className={styles.クイック群}>
                  {GPU選択肢.map((g) => (
                    <button key={g.key}
                      className={`${styles.クイックボタン} ${GPU === g.key ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setGPU(g.key)}>{g.label}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "GPU台数（台）", val: GPU台数, set: setGPU台数, step: "1" },
                { label: "月間稼働時間（時間/台）", val: 稼働時間, set: set稼働時間, step: "50" },
                { label: "電力単価（円/kWh）", val: 電力単価, set: set電力単価, step: "1" },
                { label: "クラウドAPI月額（円）", val: API月額, set: setAPI月額, step: "10000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">PUE（電力効率）</label>
                <div className={styles.クイック群}>
                  {[["1.2","高効率DC"],["1.5","一般サーバー室"],["2.0","旧式設備"]].map(([v, l]) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${PUE === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setPUE(v)}>{v}（{l}）</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">電力コストシミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間AIインフラコスト</span>
                  <span className={styles.メイン値}>¥{fmt(結果.年合計)}<span className={styles.メイン単位}>円/年</span></span>
                  <span className={styles.メインサブ}>月間 ¥{fmt(結果.月合計)}</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間電力消費量", value: `${fmtF(結果.月kWh)}kWh`, color: "#f59e0b" },
                    { label: "月間電気代（GPU）", value: `¥${fmt(結果.月電気代)}`, color: "#10b981" },
                    { label: "GX賦課金（概算）", value: `¥${fmt(結果.GX賦課金月)}/月`, color: "#f25acc" },
                    { label: "CO₂排出量", value: `${fmtF(結果.CO2月kg)}kg/月`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>月間コスト内訳</div>
                  {[
                    { label: `GPU電気代（${GPU消費W[GPU]}W×${GPU台数}台×${稼働時間}h×PUE${PUE}）`, value: `¥${fmt(結果.月電気代)}` },
                    { label: "クラウドAPI料金", value: `¥${fmt(結果.api)}` },
                    { label: "GX賦課金（2026年概算）", value: `¥${fmt(結果.GX賦課金月)}` },
                    { label: "月合計（電気代＋API）", value: `¥${fmt(結果.月合計)}` },
                    { label: "年合計", value: `¥${fmt(結果.年合計)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i >= 3 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700 }}>{row.value}</span>
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
