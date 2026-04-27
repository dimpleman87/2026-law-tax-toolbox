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
import styles from "./invoice-tax-calc.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "invoice-tax-calc",
  タイトル: "インボイス制度 消費税計算機",
  説明: "免税・課税事業者の実質負担を比較試算",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📋 インボイス登録で消費税負担{result}万円。2割特例・簡易課税と比較→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

// 業種別みなし仕入率（簡易課税）
const みなし仕入率マップ: Record<string, { rate: number; label: string }> = {
  "第1種（卸売業）":     { rate: 0.90, label: "卸売業" },
  "第2種（小売業）":     { rate: 0.80, label: "小売業" },
  "第3種（製造業等）":   { rate: 0.70, label: "製造業・建設業" },
  "第4種（その他）":     { rate: 0.60, label: "飲食業・その他" },
  "第5種（サービス業）": { rate: 0.50, label: "IT・コンサル・フリーランス" },
  "第6種（不動産業）":   { rate: 0.40, label: "不動産業" },
};

export default function インボイス消費税計算機ページ() {
  const [年間売上, set年間売上] = useState("5000000");
  const [年間経費, set年間経費] = useState("1000000");
  const [業種, set業種] = useState("第5種（サービス業）");
  const [経費消費税率, set経費消費税率] = useState("0.7"); // 経費のうち消費税課税対象の割合

  const 結果 = useMemo(() => {
    const 売上N = parseInt(年間売上) || 0;
    const 経費N = parseInt(年間経費) || 0;
    if (売上N <= 0) return null;

    const 売上消費税 = 売上N * 0.10; // 売上に含まれる消費税（税抜ベース）
    const 経費消費税課税割合 = parseFloat(経費消費税率) || 0.7;
    const 仕入消費税 = 経費N * 経費消費税課税割合 * 0.10;

    // ① 免税事業者（インボイス登録なし）
    const 免税納付額 = 0;
    const 免税手取り = 売上N - 経費N; // 消費税分は利益に含める（益税）

    // ② 課税事業者・本則課税
    const 本則納付額 = 売上消費税 - 仕入消費税;
    const 本則手取り = 売上N - 経費N - 本則納付額;

    // ③ 2割特例（売上消費税 × 20%）2026年9月まで
    const 特例納付額 = 売上消費税 * 0.20;
    const 特例手取り = 売上N - 経費N - 特例納付額;

    // ④ 簡易課税
    const { rate: みなし率 } = みなし仕入率マップ[業種] ?? みなし仕入率マップ["第5種（サービス業）"];
    const 簡易納付額 = 売上消費税 * (1 - みなし率);
    const 簡易手取り = 売上N - 経費N - 簡易納付額;

    // 免税との差額（ダメージ額）
    const 本則ダメージ = 免税手取り - 本則手取り;
    const 特例ダメージ = 免税手取り - 特例手取り;
    const 簡易ダメージ = 免税手取り - 簡易手取り;

    // 最安の課税方式
    const 最安手取り = Math.max(本則手取り, 特例手取り, 簡易手取り);
    const 最安方式 = 最安手取り === 本則手取り ? "本則課税" :
                    最安手取り === 特例手取り ? "2割特例" : "簡易課税";

    return {
      売上消費税, 仕入消費税,
      免税納付額, 免税手取り,
      本則納付額, 本則手取り,
      特例納付額, 特例手取り,
      簡易納付額, 簡易手取り,
      本則ダメージ, 特例ダメージ, 簡易ダメージ,
      最安方式, 最安手取り,
      みなし率,
    };
  }, [年間売上, 年間経費, 業種, 経費消費税率]);

  const 結果テキスト = 結果 ? `インボイス登録後の最適手取り ${fmt(結果.最安手取り)}円（${結果.最安方式}）` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="invoice-tax-calc" タイトル="インボイス制度 消費税計算機" 説明="免税・課税事業者の実質負担を比較試算" カテゴリ="ビジネス・経理" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>インボイス制度 消費税計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📋 インボイス制度 消費税計算機</h1>
          <FavoriteButton slug="invoice-tax-calc" title="インボイス制度 消費税計算機" emoji="📋" />
          <p className="ツールページ説明">
            売上・経費・業種から免税／2割特例／簡易課税／本則課税の消費税負担を比較。フリーランス・個人事業主向け。
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
                <label className="フィールドラベル">年間売上（税込・円）</label>
                <input type="number" className="数値入力" value={年間売上}
                  onChange={(e) => set年間売上(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {["3000000","5000000","8000000","10000000","20000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${年間売上 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set年間売上(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">年間経費（税込・円）</label>
                <input type="number" className="数値入力" value={年間経費}
                  onChange={(e) => set年間経費(e.target.value)} min="0" step="100000" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">業種（簡易課税のみなし仕入率）</label>
                <select className="数値入力" value={業種} onChange={(e) => set業種(e.target.value)}
                  style={{ fontFamily: "var(--フォント-本文)", cursor: "pointer" }}>
                  {Object.entries(みなし仕入率マップ).map(([k, v]) => (
                    <option key={k} value={k}>{k}（{v.label}・{(v.rate * 100).toFixed(0)}%）</option>
                  ))}
                </select>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">経費のうち消費税課税対象の割合</label>
                <div className={styles.クイック群}>
                  {[["0.5","50%"],["0.7","70%"],["0.9","90%"],["1.0","100%"]].map(([v, l]) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${経費消費税率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set経費消費税率(v)}>{l}</button>
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                  人件費・給与は課税対象外。物品・通信費等は課税対象。
                </span>
              </div>

              <div className={styles.注意書き}>
                ※ 2割特例は2026年9月30日が属する課税期間まで適用可能。
                簡易課税は前々年の課税売上高が5,000万円以下の場合に選択可。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* おすすめバッジ */}
                  <div className={styles.おすすめバッジ}>
                    <span>💡 最もお得な方式：</span>
                    <strong style={{ color: "#26d9ca" }}>{結果.最安方式}</strong>
                    <span style={{ fontSize: "12px", color: "var(--カラー-テキスト薄)" }}>
                      （手取り ¥{fmt(結果.最安手取り)}円）
                    </span>
                  </div>

                  {/* 比較テーブル */}
                  <div className={styles.比較表}>
                    <div className={styles.比較ヘッダー}>
                      <span>方式</span>
                      <span>納付消費税</span>
                      <span>手取り</span>
                      <span>免税比</span>
                    </div>
                    {[
                      { 方式: "免税事業者",  納付: 結果.免税納付額, 手取り: 結果.免税手取り, ダメージ: 0, 注記: "取引先に影響あり" },
                      { 方式: "2割特例",    納付: 結果.特例納付額, 手取り: 結果.特例手取り, ダメージ: 結果.特例ダメージ, 注記: "〜2026/9" },
                      { 方式: "簡易課税",   納付: 結果.簡易納付額, 手取り: 結果.簡易手取り, ダメージ: 結果.簡易ダメージ, 注記: `みなし${(結果.みなし率*100).toFixed(0)}%` },
                      { 方式: "本則課税",   納付: 結果.本則納付額, 手取り: 結果.本則手取り, ダメージ: 結果.本則ダメージ, 注記: "原則" },
                    ].map((row) => (
                      <div key={row.方式}
                        className={`${styles.比較行} ${row.手取り === 結果.最安手取り && row.方式 !== "免税事業者" ? styles.比較行強調 : ""}`}>
                        <span className={styles.比較方式}>{row.方式}<span className={styles.比較注記}>{row.注記}</span></span>
                        <span style={{ color: row.納付 === 0 ? "#10b981" : "#f25acc" }}>
                          ¥{fmt(row.納付)}
                        </span>
                        <span style={{ color: "#26d9ca", fontWeight: 700 }}>¥{fmt(row.手取り)}</span>
                        <span style={{ color: row.ダメージ > 0 ? "#f25acc" : "#10b981", fontSize: "12px" }}>
                          {row.ダメージ === 0 ? "基準" : `-¥${fmt(row.ダメージ)}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.売上消費税メモ}>
                    <span>売上に含まれる消費税（10%）</span>
                    <span>¥{fmt(結果.売上消費税)}円</span>
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">年間売上を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }


          <ToolGuide slug="invoice-tax-calc" />
        </div>
      </main>
    </>
  );
}
