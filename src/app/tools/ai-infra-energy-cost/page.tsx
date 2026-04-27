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
import styles from "./ai-infra-energy-cost.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "ai-infra-energy-cost",
  タイトル: "AI基盤電力・インフラコスト計算機",
  説明: "GPU・サーバー・冷却設備の電力コストと年間費用を試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["⚡ AI基盤の年間電力コストを試算。GPU{result}台で月額いくら？→"],
};

type GPU種別 = "NVIDIA A100 (400W)" | "NVIDIA H100 (700W)" | "NVIDIA L40S (300W)" | "NVIDIA RTX 4090 (450W)" | "AMD MI300X (750W)";

const GPU消費電力: Record<GPU種別, number> = {
  "NVIDIA A100 (400W)": 400,
  "NVIDIA H100 (700W)": 700,
  "NVIDIA L40S (300W)": 300,
  "NVIDIA RTX 4090 (450W)": 450,
  "AMD MI300X (750W)": 750,
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function AI基盤電力コスト計算機ページ() {
  const [GPU種別, setGPU種別] = useState<GPU種別>("NVIDIA A100 (400W)");
  const [GPU台数, setGPU台数] = useState("4");
  const [CPU_W, setCPU_W] = useState("300");
  const [メモリ_W, setメモリ_W] = useState("100");
  const [ストレージ_W, setストレージ_W] = useState("50");
  const [ネットワーク_W, setネットワーク_W] = useState("100");
  const [稼働率, set稼働率] = useState("70");
  const [電力単価, set電力単価] = useState("30");
  const [PUE, setPUE] = useState("1.4");

  const 結果 = useMemo(() => {
    const gpu台 = parseInt(GPU台数) || 0;
    const gpu_W = GPU消費電力[GPU種別] * gpu台;
    const 他_W = (parseInt(CPU_W)||0) + (parseInt(メモリ_W)||0) + (parseInt(ストレージ_W)||0) + (parseInt(ネットワーク_W)||0);
    const IT負荷_kW = (gpu_W + 他_W) / 1000;
    const pue = parseFloat(PUE) || 1.4;
    const 総消費_kW = IT負荷_kW * pue;
    const 稼働率_ratio = (parseInt(稼働率)||70) / 100;
    const 月間kWh = 総消費_kW * 24 * 30 * 稼働率_ratio;
    const 年間kWh = 月間kWh * 12;
    const 単価 = parseInt(電力単価) || 30;
    const 月間電力費 = 月間kWh * 単価;
    const 年間電力費 = 月間電力費 * 12;
    const CO2_t = 年間kWh * 0.000441; // 東京電力 排出係数 0.441kg/kWh

    return {
      gpu_W, 他_W, IT負荷_kW, 総消費_kW,
      月間kWh, 年間kWh, 月間電力費, 年間電力費, CO2_t,
    };
  }, [GPU種別, GPU台数, CPU_W, メモリ_W, ストレージ_W, ネットワーク_W, 稼働率, 電力単価, PUE]);

  const 結果テキスト = `AI基盤（GPU${GPU台数}台）年間電力費¥${fmt(結果.年間電力費)}・CO₂排出${結果.CO2_t.toFixed(1)}t/年`;

  const 台数クイック = ["1","4","8","16","32"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="ai-infra-energy-cost" タイトル="AI基盤電力・インフラコスト計算機" 説明="GPU・サーバー・冷却設備の電力コストと年間費用を試算" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>AI基盤電力・インフラコスト計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">⚡ AI基盤電力・インフラコスト計算機</h1>
          <FavoriteButton slug="ai-infra-energy-cost" title="AI基盤電力・インフラコスト計算機" emoji="⚡" />
          <p className="ツールページ説明">
            GPUサーバーの消費電力・PUE・稼働率・電力単価から月間・年間の電力コストとCO₂排出量を算出。
            オンプレAI基盤の運用コスト把握やクラウドとの比較に。
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
                <label className="フィールドラベル">GPU種別</label>
                <div className={styles.クイック群}>
                  {(Object.keys(GPU消費電力) as GPU種別[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${GPU種別 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setGPU種別(k)}>{k.split(" ")[0]} {k.split(" ")[1]}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">GPU台数</label>
                <input type="number" className="数値入力" value={GPU台数}
                  onChange={(e) => setGPU台数(e.target.value)} min="0" step="1" />
                <div className={styles.クイック群}>
                  {台数クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${GPU台数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setGPU台数(v)}>{v}台</button>
                  ))}
                </div>
              </div>

              {[
                { label: "CPU消費電力（W）", val: CPU_W, set: setCPU_W, step: "50" },
                { label: "メモリ消費電力（W）", val: メモリ_W, set: setメモリ_W, step: "20" },
                { label: "ストレージ消費電力（W）", val: ストレージ_W, set: setストレージ_W, step: "10" },
                { label: "ネットワーク機器消費電力（W）", val: ネットワーク_W, set: setネットワーク_W, step: "20" },
                { label: "GPU稼働率（%）", val: 稼働率, set: set稼働率, step: "5" },
                { label: "電力単価（円/kWh）", val: 電力単価, set: set電力単価, step: "1" },
                { label: "PUE（電力使用効率）", val: PUE, set: setPUE, step: "0.1" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">電力コストシミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間電力費用</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.年間電力費)}<span className={styles.メイン単位}>円/年</span>
                  </span>
                  <span className={styles.メインサブ}>月額 ¥{fmt(結果.月間電力費)}円 / CO₂ {結果.CO2_t.toFixed(1)}t/年</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "GPU消費電力合計", value: `${fmt(結果.gpu_W)}W`, color: "#f25acc" },
                    { label: "IT負荷合計", value: `${結果.IT負荷_kW.toFixed(2)}kW`, color: "#f59e0b" },
                    { label: "総消費電力（PUE込）", value: `${結果.総消費_kW.toFixed(2)}kW`, color: "#06b6d4" },
                    { label: "年間電力消費量", value: `${fmt(結果.年間kWh)}kWh`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>消費電力内訳</div>
                  {[
                    { label: `GPU（${GPU種別.match(/\d+W/)?.[0]} × ${GPU台数}台）`, value: `${fmt(結果.gpu_W)}W` },
                    { label: "CPU + メモリ + ストレージ + NW", value: `${fmt(結果.他_W)}W` },
                    { label: `IT負荷合計`, value: `${結果.IT負荷_kW.toFixed(2)}kW` },
                    { label: `冷却・UPS等（PUE ${PUE}倍）`, value: `${(結果.総消費_kW - 結果.IT負荷_kW).toFixed(2)}kW` },
                    { label: "総消費電力", value: `${結果.総消費_kW.toFixed(2)}kW` },
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


          <ToolGuide slug="ai-infra-energy-cost" />
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
