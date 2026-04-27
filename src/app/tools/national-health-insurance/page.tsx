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
import styles from "./national-health-insurance.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "national-health-insurance",
  タイトル: "国民健康保険料 計算機",
  説明: "フリーランス・退職後の保険料を年収から試算",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💊 国民健康保険料を計算したら年間{result}万円。フリーランス転身前に確認→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

// 2024年度 全国平均ベースの簡易計算
// 所得割率・均等割・平等割は市区町村により異なる
// ここでは協会けんぽ（中央値近似）を使用
const 地域設定: Record<string, { 医療所得割: number; 医療均等割: number; 医療平等割: number; 支援所得割: number; 支援均等割: number; 支援平等割: number; 介護所得割: number; 介護均等割: number; 医療上限: number; 支援上限: number; 介護上限: number }> = {
  "全国平均（概算）": { 医療所得割: 0.0795, 医療均等割: 29000, 医療平等割: 23000, 支援所得割: 0.026, 支援均等割: 9600,  支援平等割: 7600,  介護所得割: 0.022, 介護均等割: 14500, 医療上限: 650000, 支援上限: 240000, 介護上限: 170000 },
  "東京23区":        { 医療所得割: 0.0753, 医療均等割: 50100, 医療平等割: 0,     支援所得割: 0.0240, 支援均等割: 16500, 支援平等割: 0,     介護所得割: 0.0185, 介護均等割: 16500, 医療上限: 650000, 支援上限: 240000, 介護上限: 170000 },
  "大阪市":          { 医療所得割: 0.0919, 医療均等割: 39900, 医療平等割: 0,     支援所得割: 0.0284, 支援均等割: 12300, 支援平等割: 0,     介護所得割: 0.0260, 介護均等割: 15600, 医療上限: 650000, 支援上限: 240000, 介護上限: 170000 },
  "名古屋市":        { 医療所得割: 0.0785, 医療均等割: 38700, 医療平等割: 0,     支援所得割: 0.0246, 支援均等割: 11700, 支援平等割: 0,     介護所得割: 0.0232, 介護均等割: 15000, 医療上限: 650000, 支援上限: 240000, 介護上限: 170000 },
  "横浜市":          { 医療所得割: 0.0914, 医療均等割: 43300, 医療平等割: 0,     支援所得割: 0.0292, 支援均等割: 13700, 支援平等割: 0,     介護所得割: 0.0199, 介護均等割: 17300, 医療上限: 650000, 支援上限: 240000, 介護上限: 170000 },
};

function 国保計算(所得: number, 被保険者数: number, 介護対象人数: number, 地域: string) {
  const 設定 = 地域設定[地域] || 地域設定["全国平均（概算）"];
  const 算定基礎所得 = Math.max(0, 所得 - 430000); // 基礎控除43万

  // 医療分
  const 医療所得割 = 算定基礎所得 * 設定.医療所得割;
  const 医療均等割 = 設定.医療均等割 * 被保険者数;
  const 医療平等割 = 設定.医療平等割;
  const 医療合計 = Math.min(医療所得割 + 医療均等割 + 医療平等割, 設定.医療上限);

  // 支援金分
  const 支援所得割 = 算定基礎所得 * 設定.支援所得割;
  const 支援均等割 = 設定.支援均等割 * 被保険者数;
  const 支援平等割 = 設定.支援平等割;
  const 支援合計 = Math.min(支援所得割 + 支援均等割 + 支援平等割, 設定.支援上限);

  // 介護分（40〜64歳・介護対象者のみ）
  const 介護所得割 = 算定基礎所得 * 設定.介護所得割;
  const 介護均等割 = 設定.介護均等割 * 介護対象人数;
  const 介護合計 = 介護対象人数 > 0
    ? Math.min(介護所得割 + 介護均等割, 設定.介護上限)
    : 0;

  const 年額 = 医療合計 + 支援合計 + 介護合計;
  return { 年額, 医療合計, 支援合計, 介護合計, 月額: 年額 / 12 };
}

const 年収クイック = ["2000000","3000000","4000000","5000000","6000000","8000000"];

export default function 国民健康保険料計算機ページ() {
  const [年収, set年収] = useState("4000000");
  const [被保険者数, set被保険者数] = useState("1");
  const [介護対象, set介護対象] = useState("0");
  const [地域, set地域] = useState("全国平均（概算）");

  const 結果 = useMemo(() => {
    const 年収数値 = parseInt(年収) || 0;
    if (年収数値 <= 0) return null;
    // 給与所得控除
    let 給与所得控除 = 0;
    if (年収数値 <= 1625000)      給与所得控除 = 550000;
    else if (年収数値 <= 1800000) 給与所得控除 = 年収数値 * 0.4 - 100000;
    else if (年収数値 <= 3600000) 給与所得控除 = 年収数値 * 0.3 + 80000;
    else if (年収数値 <= 6600000) 給与所得控除 = 年収数値 * 0.2 + 440000;
    else if (年収数値 <= 8500000) 給与所得控除 = 年収数値 * 0.1 + 1100000;
    else                          給与所得控除 = 1950000;
    const 所得 = 年収数値 - 給与所得控除;

    const r = 国保計算(所得, parseInt(被保険者数)||1, parseInt(介護対象)||0, 地域);
    // 協会けんぽ（在職時）との比較
    const 在職健保 = Math.min(年収数値, 16680000) * 0.0499;
    const 在職厚年 = Math.min(年収数値, 7800000) * 0.0915;
    const 在職合計年 = (在職健保 + 在職厚年) * 12 / 12 * 12;

    return { ...r, 在職合計年, 差額: r.年額 - 在職合計年 };
  }, [年収, 被保険者数, 介護対象, 地域]);

  const 結果テキスト = 結果 ? `国保年額 ${fmt(結果.年額)}円（月額 ${fmt(結果.月額)}円）` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="national-health-insurance" タイトル="国民健康保険料 計算機" 説明="フリーランス・退職後の保険料を年収から試算" カテゴリ="生活・計算" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>国民健康保険料 計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💊 国民健康保険料 計算機（2026年版）</h1>
          <FavoriteButton slug="national-health-insurance" title="国民健康保険料 計算機" emoji="💊" />
          <p className="ツールページ説明">
            年収・居住地・家族構成から国民健康保険料を試算。フリーランス独立・退職後の保険料シミュレーションに。
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
                <label className="フィールドラベル">前年の年収（円）</label>
                <input type="number" className="数値入力" value={年収}
                  onChange={(e) => set年収(e.target.value)} min="0" step="100000" placeholder="4000000" />
                <div className={styles.クイック群}>
                  {年収クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${年収 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set年収(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">地域（市区町村）</label>
                <select className="数値入力" value={地域} onChange={(e) => set地域(e.target.value)}
                  style={{ fontFamily: "var(--フォント-本文)", cursor: "pointer" }}>
                  {Object.keys(地域設定).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                  ※ お住まいの市区町村で確認するとより正確です
                </span>
              </div>

              <div className={styles.条件グリッド}>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">被保険者数（人）</label>
                  <input type="number" className="数値入力" value={被保険者数}
                    onChange={(e) => set被保険者数(e.target.value)} min="1" max="10" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">介護対象者数（40〜64歳）</label>
                  <input type="number" className="数値入力" value={介護対象}
                    onChange={(e) => set介護対象(e.target.value)} min="0" max="10" />
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 給与収入ベースの概算値です。事業所得・不動産所得は経費控除後の金額で計算してください。
                実際の保険料は各市区町村窓口または公式サイトでご確認ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>国保 年間保険料（概算）</span>
                    <span className={styles.メイン値}>¥{fmt(結果.年額)}<span className={styles.メイン単位}>円/年</span></span>
                    <span className={styles.サブ}>月額 約 ¥{fmt(結果.月額)}円</span>
                  </div>

                  <div className="結果グリッド">
                    {[
                      { label: "医療分",   value: `¥${fmt(結果.医療合計)}円/年`, color: "#26d9ca" },
                      { label: "支援金分", value: `¥${fmt(結果.支援合計)}円/年`, color: "#f59e0b" },
                      { label: "介護分",   value: 結果.介護合計 > 0 ? `¥${fmt(結果.介護合計)}円/年` : "対象外", color: "#f25acc" },
                      { label: "月額",     value: `¥${fmt(結果.月額)}円/月`, color: "#26d9ca" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.05rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 社保との比較 */}
                  <div className={styles.比較カード}>
                    <div className={styles.比較タイトル}>会社員（協会けんぽ）との比較</div>
                    <div className={styles.比較行}>
                      <span>国民健康保険料</span>
                      <span style={{ color: "#26d9ca", fontWeight: 700 }}>¥{fmt(結果.年額)}円/年</span>
                    </div>
                    <div className={styles.比較行}>
                      <span>在職時 健保＋厚年（本人負担）</span>
                      <span style={{ color: "#f59e0b", fontWeight: 700 }}>¥{fmt(結果.在職合計年)}円/年</span>
                    </div>
                    <div className={styles.比較差額}>
                      <span>差額</span>
                      <span style={{ color: 結果.差額 > 0 ? "#f25acc" : "#10b981", fontWeight: 800 }}>
                        {結果.差額 > 0 ? `+¥${fmt(結果.差額)}円（国保が高い）` : `-¥${fmt(Math.abs(結果.差額))}円（国保が安い）`}
                      </span>
                    </div>
                  </div>

                  <div className={styles.ヒント}>
                    💡 退職後2年間は「任意継続」も選択可。前職の保険料の約2倍が目安。年収が低い場合は国保の方が安くなることも。
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">年収を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }


          <ToolGuide slug="national-health-insurance" />
        </div>
      </main>
    </>
  );
}
