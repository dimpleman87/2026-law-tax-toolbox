"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./storage-cost-predict.module.css";

const ツール定義 = {
  スラッグ: "storage-cost-predict",
  タイトル: "ストレージコスト予測計算機",
  説明: "データ増加量から3〜5年後のストレージ費用を予測",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["💾 データ増加を試算。3年後のストレージコストが¥{result}に膨らむ前に対策を→"],
};

type ストレージ種別 = "クラウド（AWS S3等）" | "オンプレNAS" | "クラウドNAS" | "テープアーカイブ";

const 単価テーブル: Record<ストレージ種別, { 円per_GB_月: number; 年率低下: number }> = {
  "クラウド（AWS S3等）": { 円per_GB_月: 3.0,  年率低下: 0.05 },
  "オンプレNAS":         { 円per_GB_月: 1.5,  年率低下: 0.03 },
  "クラウドNAS":         { 円per_GB_月: 5.0,  年率低下: 0.04 },
  "テープアーカイブ":    { 円per_GB_月: 0.5,  年率低下: 0.02 },
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function ストレージコスト予測計算機ページ() {
  const [種別, set種別] = useState<ストレージ種別>("クラウド（AWS S3等）");
  const [現在容量GB, set現在容量GB] = useState("1000");
  const [月間増加GB, set月間増加GB] = useState("100");
  const [重複排除率, set重複排除率] = useState("30");
  const [予測年数, set予測年数] = useState("3");

  const 結果 = useMemo(() => {
    const { 円per_GB_月, 年率低下 } = 単価テーブル[種別];
    const 現在 = parseInt(現在容量GB) || 0;
    const 月増加 = parseInt(月間増加GB) || 0;
    const 排除率 = (parseInt(重複排除率)||0) / 100;
    const 年数 = parseInt(予測年数) || 3;

    const 実増加 = 月増加 * (1 - 排除率);
    const 現在月額 = 現在 * 円per_GB_月;

    const 予測 = Array.from({ length: 年数 }, (_, i) => {
      const 年 = i + 1;
      const 容量 = 現在 + 実増加 * 12 * 年;
      const 単価 = 円per_GB_月 * Math.pow(1 - 年率低下, 年);
      const 月額 = 容量 * 単価;
      const 年額 = 月額 * 12;
      return { 年, 容量: Math.round(容量), 月額: Math.round(月額), 年額: Math.round(年額) };
    });

    const 最終年 = 予測[予測.length - 1];
    const 増加率 = 現在月額 > 0 ? ((最終年.月額 - 現在月額) / 現在月額) * 100 : 0;

    return { 現在月額, 予測, 最終年, 増加率 };
  }, [種別, 現在容量GB, 月間増加GB, 重複排除率, 予測年数]);

  const 結果テキスト = `${予測年数}年後のストレージ費用：月¥${fmt(結果.最終年.月額)}（現在比+${結果.増加率.toFixed(0)}%）`;

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
              <li>ストレージコスト予測計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💾 ストレージコスト予測計算機</h1>
          <p className="ツールページ説明">
            現在の容量・月間増加量・重複排除率を入力して3〜5年後のストレージ費用を予測。
            クラウド・オンプレ・テープアーカイブの種別比較にも対応。
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
                <label className="フィールドラベル">ストレージ種別</label>
                <div className={styles.クイック群}>
                  {(Object.keys(単価テーブル) as ストレージ種別[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${種別 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set種別(k)}>{k}</button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--カラー-テキスト薄)", marginTop: 6 }}>
                  単価: ¥{単価テーブル[種別].円per_GB_月}/GB/月・年率{(単価テーブル[種別].年率低下*100).toFixed(0)}%低下想定
                </div>
              </div>

              {[
                { label: "現在のデータ容量（GB）", val: 現在容量GB, set: set現在容量GB, step: "100" },
                { label: "月間データ増加量（GB）", val: 月間増加GB, set: set月間増加GB, step: "50" },
                { label: "重複排除・圧縮率（%）", val: 重複排除率, set: set重複排除率, step: "5" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">予測年数</label>
                <div className={styles.クイック群}>
                  {["1","2","3","5"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${予測年数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set予測年数(v)}>{v}年後</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">ストレージコスト予測</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>{予測年数}年後 月額費用</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.最終年.月額)}<span className={styles.メイン単位}>円/月</span>
                  </span>
                  <span className={styles.メインサブ}>現在比 +{結果.増加率.toFixed(0)}% / 容量 {fmt(結果.最終年.容量)}GB</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "現在の月額", value: `¥${fmt(結果.現在月額)}`, color: "#06b6d4" },
                    { label: `${予測年数}年後の月額`, value: `¥${fmt(結果.最終年.月額)}`, color: "#f25acc" },
                    { label: `${予測年数}年後の年額`, value: `¥${fmt(結果.最終年.年額)}`, color: "#f59e0b" },
                    { label: `${予測年数}年後の容量`, value: `${fmt(結果.最終年.容量)}GB`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>年別予測推移</div>
                  <div className={styles.内訳ヘッダー}>
                    <span>年</span><span>容量</span><span>月額</span>
                  </div>
                  {結果.予測.map((row) => (
                    <div key={row.年} className={`${styles.内訳行} ${String(row.年) === 予測年数 ? styles.内訳強調 : ""}`}>
                      <span>{row.年}年後</span>
                      <span>{fmt(row.容量)}GB</span>
                      <span style={{ fontWeight: 700, color: String(row.年) === 予測年数 ? "#f25acc" : "var(--カラー-テキスト薄)" }}>¥{fmt(row.月額)}</span>
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
