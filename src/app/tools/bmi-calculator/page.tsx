"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./bmi-calculator.module.css";

const ツール定義 = {
  スラッグ: "bmi-calculator",
  タイトル: "BMI計算機",
  説明: "身長・体重からBMIと肥満度を即判定",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["👆 BMI計算したら{result}でした。理想体重まで確認→"],
};

function fmt1(n: number) { return n.toFixed(1); }
function fmt(n: number) { return Math.round(n * 10) / 10; }

type 単位 = "cm/kg" | "ft/lb";

interface 判定結果 {
  bmi: number;
  判定: string;
  色: string;
  説明: string;
}

function BMI判定(bmi: number): 判定結果 {
  if (bmi < 18.5) return { bmi, 判定: "低体重（痩せ）", 色: "#06b6d4", 説明: "栄養不足や貧血のリスクがあります。" };
  if (bmi < 25.0) return { bmi, 判定: "普通体重", 色: "#10b981", 説明: "健康的な体重範囲です。" };
  if (bmi < 30.0) return { bmi, 判定: "肥満（1度）", 色: "#f59e0b", 説明: "生活習慣病のリスクが高まります。" };
  if (bmi < 35.0) return { bmi, 判定: "肥満（2度）", 色: "#f97316", 説明: "内科的治療が推奨されます。" };
  if (bmi < 40.0) return { bmi, 判定: "肥満（3度）", 色: "#ef4444", 説明: "高度肥満。専門医への相談を推奨。" };
  return { bmi, 判定: "肥満（4度）", 色: "#dc2626", 説明: "高度肥満。医療的介入が必要です。" };
}

export default function BMI計算機ページ() {
  const [身長, set身長] = useState("170");
  const [体重, set体重] = useState("65");
  const [単位, set単位] = useState<単位>("cm/kg");

  const 結果 = useMemo(() => {
    let h = parseFloat(身長) || 0;
    let w = parseFloat(体重) || 0;
    if (h <= 0 || w <= 0) return null;

    if (単位 === "ft/lb") {
      h = h * 30.48; // feet to cm
      w = w * 0.4536; // lb to kg
    }

    const hm = h / 100;
    const bmi = w / (hm * hm);
    const 判定 = BMI判定(bmi);
    const 標準体重 = 22 * hm * hm; // BMI=22
    const 理想体重 = 20 * hm * hm; // BMI=20
    const 差分 = w - 標準体重;

    return { ...判定, 身長cm: h, 体重kg: w, 標準体重, 理想体重, 差分, hm };
  }, [身長, 体重, 単位]);

  const 結果テキスト = 結果 ? `BMI ${fmt1(結果.bmi)}（${結果.判定}）標準体重まで${fmt(Math.abs(結果.差分))}kg` : "";

  const BMIゲージ範囲 = [
    { 境界: 18.5, ラベル: "18.5", 色: "#06b6d4" },
    { 境界: 25,   ラベル: "25",   色: "#10b981" },
    { 境界: 30,   ラベル: "30",   色: "#f59e0b" },
    { 境界: 35,   ラベル: "35",   色: "#f97316" },
    { 境界: 40,   ラベル: "40",   色: "#ef4444" },
  ];

  // BMI 0〜45 のスケールでのゲージ位置
  const ゲージ位置 = 結果 ? Math.min(100, (結果.bmi / 45) * 100) : 0;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-life">生活・計算</Link></li>
              <li aria-hidden="true">›</li>
              <li>BMI計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">⚖️ BMI計算機（体格指数）</h1>
          <p className="ツールページ説明">
            身長と体重を入力するだけでBMI・肥満度を即判定。標準体重・理想体重・目標差分もリアルタイム表示。
            ダイエット計画や健康管理に。
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
            {/* ─── 入力 ─── */}
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">単位</label>
                <div className={styles.税率選択}>
                  {(["cm/kg", "ft/lb"] as 単位[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${単位 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set単位(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">身長（{単位 === "cm/kg" ? "cm" : "ft"}）</label>
                <input type="number" className="数値入力" value={身長}
                  onChange={(e) => set身長(e.target.value)}
                  min={単位 === "cm/kg" ? "50" : "3"} max={単位 === "cm/kg" ? "250" : "8"}
                  step={単位 === "cm/kg" ? "1" : "0.1"} />
                <div className={styles.クイック群}>
                  {(単位 === "cm/kg" ? ["155","160","165","170","175","180"] : ["5.0","5.3","5.6","5.9","6.2"]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${身長 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set身長(v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">体重（{単位 === "cm/kg" ? "kg" : "lb"}）</label>
                <input type="number" className="数値入力" value={体重}
                  onChange={(e) => set体重(e.target.value)}
                  min={単位 === "cm/kg" ? "1" : "66"} step={単位 === "cm/kg" ? "0.5" : "1"} />
                <div className={styles.クイック群}>
                  {(単位 === "cm/kg" ? ["50","55","60","65","70","75","80"] : ["110","130","150","165","180"]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${体重 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set体重(v)}>{v}</button>
                  ))}
                </div>
              </div>

              {/* BMI基準表 */}
              <div className={styles.基準表}>
                <div className={styles.基準表タイトル}>WHO肥満度分類（日本肥満学会準拠）</div>
                {[
                  { range: "〜18.4", label: "低体重（痩せ）", color: "#06b6d4" },
                  { range: "18.5〜24.9", label: "普通体重", color: "#10b981" },
                  { range: "25.0〜29.9", label: "肥満（1度）", color: "#f59e0b" },
                  { range: "30.0〜34.9", label: "肥満（2度）", color: "#f97316" },
                  { range: "35.0〜39.9", label: "肥満（3度）", color: "#ef4444" },
                  { range: "40.0〜", label: "肥満（4度）", color: "#dc2626" },
                ].map((item) => (
                  <div key={item.range} className={styles.基準行}>
                    <span className={styles.基準ドット} style={{ background: item.color }} />
                    <span className={styles.基準範囲}>{item.range}</span>
                    <span className={styles.基準ラベル}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* メインBMI */}
                  <div className={styles.メインカード} style={{ borderColor: `${結果.色}40` }}>
                    <span className={styles.メインラベル}>BMI（体格指数）</span>
                    <span className={styles.メイン値} style={{ color: 結果.色 }}>
                      {fmt1(結果.bmi)}
                    </span>
                    <span className={styles.判定バッジ} style={{ background: `${結果.色}18`, color: 結果.色 }}>
                      {結果.判定}
                    </span>
                    <span className={styles.判定説明}>{結果.説明}</span>
                  </div>

                  {/* ゲージ */}
                  <div className={styles.ゲージラッパー}>
                    <div className={styles.ゲージトラック}>
                      <div className={styles.ゲージグラデ} />
                      <div className={styles.ゲージ針} style={{ left: `${ゲージ位置}%` }} />
                    </div>
                    <div className={styles.ゲージラベル}>
                      {BMIゲージ範囲.map((r) => (
                        <span key={r.境界} style={{ left: `${(r.境界 / 45) * 100}%`, color: r.色 }}>
                          {r.ラベル}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 体重グリッド */}
                  <div className="結果グリッド">
                    <div className="結果カード">
                      <span className="結果ラベル">標準体重（BMI=22）</span>
                      <span className="結果値" style={{ color: "#10b981" }}>{fmt(結果.標準体重)}kg</span>
                    </div>
                    <div className="結果カード">
                      <span className="結果ラベル">理想体重（BMI=20）</span>
                      <span className="結果値" style={{ color: "#06b6d4" }}>{fmt(結果.理想体重)}kg</span>
                    </div>
                    <div className="結果カード">
                      <span className="結果ラベル">標準体重との差</span>
                      <span className="結果値" style={{ color: 結果.差分 > 0 ? "#f25acc" : "#10b981" }}>
                        {結果.差分 > 0 ? "+" : ""}{fmt(結果.差分)}kg
                      </span>
                    </div>
                    <div className="結果カード">
                      <span className="結果ラベル">入力値</span>
                      <span className="結果値" style={{ fontSize: "0.9rem" }}>
                        {fmt(結果.身長cm)}cm / {fmt(結果.体重kg)}kg
                      </span>
                    </div>
                  </div>

                  {/* 目標体重スライダー的表示 */}
                  <div className={styles.目標カード}>
                    <div className={styles.目標タイトル}>🎯 目標BMI別 体重目安</div>
                    {[
                      { bmi: 18.5, label: "低体重ギリギリ" },
                      { bmi: 20,   label: "理想（BMI=20）" },
                      { bmi: 22,   label: "標準（BMI=22）" },
                      { bmi: 25,   label: "肥満ライン" },
                    ].map((item) => (
                      <div key={item.bmi} className={styles.目標行}>
                        <span>{item.label}</span>
                        <span className={styles.目標値}>{fmt(item.bmi * 結果.hm * 結果.hm)}kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">身長と体重を入力してください</p>
              )}

              {結果 && <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />}
            </div>
          </div>

          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>
        </div>
      </main>

      <div className="広告ラッパー">
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
