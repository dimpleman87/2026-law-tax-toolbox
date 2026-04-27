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
import styles from "./employment-insurance-calc.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "employment-insurance-calc",
  タイトル: "雇用保険料計算機",
  説明: "給与から労働者・事業主の雇用保険料を即算出",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💼 雇用保険料を計算。給与¥{result}の負担額が判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 事業種別 = "一般の事業" | "農林水産・清酒製造の事業" | "建設の事業";

// 令和6年度（2024年度）雇用保険料率
// 失業等給付分 + 雇用保険二事業分
const 料率表: Record<事業種別, { 労働者: number; 事業主: number; 合計: number }> = {
  "一般の事業":           { 労働者: 0.006,  事業主: 0.0095, 合計: 0.0155 },
  "農林水産・清酒製造の事業": { 労働者: 0.007,  事業主: 0.0105, 合計: 0.0175 },
  "建設の事業":           { 労働者: 0.007,  事業主: 0.0115, 合計: 0.0185 },
};

export default function 雇用保険料計算機ページ() {
  const [賃金, set賃金] = useState("300000");
  const [事業種別, set事業種別] = useState<事業種別>("一般の事業");

  const 結果 = useMemo(() => {
    const 金額 = parseInt(賃金) || 0;
    const 料率 = 料率表[事業種別];
    const 労働者負担 = Math.floor(金額 * 料率.労働者);
    const 事業主負担 = Math.floor(金額 * 料率.事業主);
    const 合計 = Math.floor(金額 * 料率.合計);
    const 手取り = 金額 - 労働者負担;

    // 年間換算
    const 年間労働者 = 労働者負担 * 12;
    const 年間事業主 = 事業主負担 * 12;
    const 年間合計 = 合計 * 12;

    return { 金額, 労働者負担, 事業主負担, 合計, 手取り, 料率, 年間労働者, 年間事業主, 年間合計 };
  }, [賃金, 事業種別]);

  const 結果テキスト = `給与¥${fmt(結果.金額)}→雇用保険労働者負担¥${fmt(結果.労働者負担)}・手取り¥${fmt(結果.手取り)}`;

  const 賃金クイック = ["200000","250000","300000","400000","500000","600000"];
  const 事業リスト: 事業種別[] = ["一般の事業", "農林水産・清酒製造の事業", "建設の事業"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="employment-insurance-calc" タイトル="雇用保険料計算機" 説明="給与から労働者・事業主の雇用保険料を即算出" カテゴリ="ビジネス・経理" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-business">ビジネス・経理</Link></li>
              <li aria-hidden="true">›</li>
              <li>雇用保険料計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💼 雇用保険料計算機</h1>
          <FavoriteButton slug="employment-insurance-calc" title="雇用保険料計算機" emoji="💼" />
          <p className="ツールページ説明">
            毎月の賃金総額を入力するだけで、労働者負担分（給与天引き額）と事業主負担分を即算出。
            令和6年度の最新料率対応。業種別（一般・農林水産・建設）切替可能。
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
                <label className="フィールドラベル">事業の種類</label>
                <div className={styles.事業選択}>
                  {事業リスト.map((種別) => (
                    <button key={種別}
                      className={`${styles.事業ボタン} ${事業種別 === 種別 ? styles.事業ボタンアクティブ : ""}`}
                      onClick={() => set事業種別(種別)}>{種別}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">賃金総額（額面・交通費込・円）</label>
                <input type="number" className="数値入力" value={賃金}
                  onChange={(e) => set賃金(e.target.value)} min="0" step="10000" />
                <div className={styles.クイック群}>
                  {賃金クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${賃金 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set賃金(v)}>
                      {Number(v)/10000}万
                    </button>
                  ))}
                </div>
              </div>

              {/* 料率表 */}
              <div className={styles.料率表}>
                <div className={styles.料率表タイトル}>📋 令和6年度 雇用保険料率（{事業種別}）</div>
                <div className={styles.料率行}>
                  <span>労働者負担</span>
                  <span style={{ color: "#f25acc", fontWeight: 700 }}>
                    {(結果.料率.労働者 * 1000).toFixed(0)}/1,000（{(結果.料率.労働者 * 100).toFixed(1)}%）
                  </span>
                </div>
                <div className={styles.料率行}>
                  <span>事業主負担</span>
                  <span style={{ color: "#f97316", fontWeight: 700 }}>
                    {(結果.料率.事業主 * 1000).toFixed(1)}/1,000（{(結果.料率.事業主 * 100).toFixed(2)}%）
                  </span>
                </div>
                <div className={styles.料率行}>
                  <span>合計（労使折半）</span>
                  <span style={{ color: "#06b6d4", fontWeight: 700 }}>
                    {(結果.料率.合計 * 1000).toFixed(1)}/1,000（{(結果.料率.合計 * 100).toFixed(2)}%）
                  </span>
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 本ツールは令和6年度（2024年度）の料率で計算しています。
                通勤手当も保険料計算の対象に含まれます。週20時間以上・31日以上雇用見込みの従業員は加入義務があります。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* フロー */}
                <div className={styles.フロー}>
                  <div className={styles.フロー行}>
                    <span>賃金総額</span>
                    <span>¥{fmt(結果.金額)}</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>雇用保険料（労働者負担）</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.労働者負担)}</span>
                  </div>
                  <div className={styles.フロー仕切り} />
                  <div className={`${styles.フロー行} ${styles.フロー合計}`}>
                    <span>手取り（雇用保険控除後）</span>
                    <span className={styles.手取り値}>¥{fmt(結果.手取り)}</span>
                  </div>
                </div>

                {/* グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "労働者負担（天引き）", value: `¥${fmt(結果.労働者負担)}`, color: "#f25acc" },
                    { label: "事業主負担（会社）", value: `¥${fmt(結果.事業主負担)}`, color: "#f97316" },
                    { label: "保険料 合計", value: `¥${fmt(結果.合計)}`, color: "#6366f1" },
                    { label: "手取り（控除後）", value: `¥${fmt(結果.手取り)}`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 年間換算 */}
                <div className={styles.年間表}>
                  <div className={styles.年間表タイトル}>📊 年間換算（×12ヶ月）</div>
                  <div className={styles.年間行}>
                    <span>年間 労働者負担</span>
                    <span style={{ color: "#f25acc", fontWeight: 700 }}>¥{fmt(結果.年間労働者)}</span>
                  </div>
                  <div className={styles.年間行}>
                    <span>年間 事業主負担</span>
                    <span style={{ color: "#f97316", fontWeight: 700 }}>¥{fmt(結果.年間事業主)}</span>
                  </div>
                  <div className={styles.年間行}>
                    <span>年間 保険料合計</span>
                    <span style={{ color: "#06b6d4", fontWeight: 700 }}>¥{fmt(結果.年間合計)}</span>
                  </div>
                </div>

                {/* 賃金別早見表 */}
                <div className={styles.早見表}>
                  <div className={styles.早見表タイトル}>💡 賃金別 雇用保険料早見（{事業種別}）</div>
                  {[200000, 250000, 300000, 400000, 500000, 600000].map((amt) => {
                    const 料率 = 料率表[事業種別];
                    const 労 = Math.floor(amt * 料率.労働者);
                    const 事 = Math.floor(amt * 料率.事業主);
                    return (
                      <div key={amt}
                        className={`${styles.早見行} ${結果.金額 === amt ? styles.早見行強調 : ""}`}
                        onClick={() => set賃金(String(amt))}>
                        <span>¥{fmt(amt)}</span>
                        <span className={styles.早見労}>労働者 ¥{fmt(労)}</span>
                        <span className={styles.早見事}>事業主 ¥{fmt(事)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="employment-insurance-calc" />
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
