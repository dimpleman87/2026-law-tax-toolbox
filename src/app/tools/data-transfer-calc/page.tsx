"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./data-transfer-calc.module.css";

const ツール定義 = {
  スラッグ: "data-transfer-calc",
  タイトル: "データ転送量・帯域計算機",
  説明: "Webサイトや動画配信の転送コストと必要帯域を試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["📡 月間データ転送量{result}GB。クラウド転送コストを今すぐ試算→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtF(n: number, d = 2) { return n.toFixed(d); }

export default function データ転送計算機ページ() {
  const [ページサイズMB, setページサイズMB] = useState("3");
  const [月間PV, set月間PV] = useState("100000");
  const [転送単価, set転送単価] = useState("14");
  const [ピーク倍率, setピーク倍率] = useState("5");

  const 結果 = useMemo(() => {
    const mb = parseFloat(ページサイズMB) || 0;
    const pv = parseInt(月間PV) || 0;
    const 単価 = parseFloat(転送単価) || 14;
    const ピーク = parseFloat(ピーク倍率) || 5;

    const 月GB = (mb * pv) / 1024;
    const 月コスト = 月GB * 単価;
    const 年GB = 月GB * 12;
    const 年コスト = 月コスト * 12;
    const 平均秒PV = pv / (30 * 24 * 3600);
    const ピークMbps = (平均秒PV * ピーク * mb * 8);

    return { 月GB, 月コスト, 年GB, 年コスト, ピークMbps };
  }, [ページサイズMB, 月間PV, 転送単価, ピーク倍率]);

  const 結果テキスト = `月間転送量${fmtF(結果.月GB)}GB・コスト¥${fmt(結果.月コスト)}（年間¥${fmt(結果.年コスト)}）`;

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
              <li>データ転送量・帯域計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📡 データ転送量・帯域計算機</h1>
          <p className="ツールページ説明">
            ページサイズ・月間PV・クラウド転送単価を入力するだけで月間転送量・コスト・
            ピーク帯域を即算出。AWSやCloudflareの料金設計に。
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
                { label: "平均ページサイズ（MB）", val: ページサイズMB, set: setページサイズMB, step: "0.5" },
                { label: "月間PV数", val: 月間PV, set: set月間PV, step: "10000" },
                { label: "転送量単価（円/GB）", val: 転送単価, set: set転送単価, step: "1" },
                { label: "ピーク倍率（平均の何倍）", val: ピーク倍率, set: setピーク倍率, step: "1" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">転送単価クイック選択</label>
                <div className={styles.クイック群}>
                  {[["9","AWS無料枠超過"],["14","AWS標準"],["8","CloudFront"],["0","Cloudflare無料"]].map(([v, l]) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${転送単価 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set転送単価(v)}>¥{v}/GB<br/><small>{l}</small></button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">転送コストシミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>月間データ転送量</span>
                  <span className={styles.メイン値}>{fmtF(結果.月GB)}<span className={styles.メイン単位}>GB/月</span></span>
                  <span className={styles.メインサブ}>転送コスト ¥{fmt(結果.月コスト)}/月</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間転送コスト", value: `¥${fmt(結果.月コスト)}`, color: "#10b981" },
                    { label: "年間転送コスト", value: `¥${fmt(結果.年コスト)}`, color: "#06b6d4" },
                    { label: "年間総転送量", value: `${fmtF(結果.年GB)}GB`, color: "#f59e0b" },
                    { label: "ピーク帯域", value: `${fmtF(結果.ピークMbps)}Mbps`, color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>計算詳細</div>
                  {[
                    { label: `月間転送量（${ページサイズMB}MB×${parseInt(月間PV).toLocaleString("ja-JP")}PV）`, value: `${fmtF(結果.月GB)}GB` },
                    { label: `転送コスト（¥${転送単価}/GB）`, value: `¥${fmt(結果.月コスト)}` },
                    { label: "年間転送量", value: `${fmtF(結果.年GB)}GB` },
                    { label: "年間コスト", value: `¥${fmt(結果.年コスト)}` },
                    { label: `ピーク帯域（平均の${ピーク倍率}倍）`, value: `${fmtF(結果.ピークMbps)}Mbps` },
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
