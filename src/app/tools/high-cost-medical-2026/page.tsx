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
import styles from "./high-cost-medical-2026.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "high-cost-medical-2026",
  タイトル: "高額療養費2026年改正シミュレーター",
  説明: "月額上限引き上げ・年間上限新設の影響を試算",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🏥 2026年高額療養費改正。自己負担が月{result}変わります→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 所得区分 = "区分ア" | "区分イ" | "区分ウ" | "区分エ（一般）" | "区分オ（住民税非課税）";

interface 上限データ {
  区分: 所得区分;
  説明: string;
  // 旧制度（2026年7月まで）
  旧月額上限: (医療費: number) => number;
  旧多数回: number;
  // 新制度（2026年8月以降・予定値）
  新月額上限: (医療費: number) => number;
  新多数回: number;
  // 年間上限（新設・予定値）
  年間上限: number | null;
}

const 上限テーブル: Record<所得区分, 上限データ> = {
  "区分ア": {
    区分: "区分ア",
    説明: "年収約1,160万円超（標準報酬月額83万円以上）",
    旧月額上限: (m) => Math.floor(252600 + Math.max(0, m - 842000) * 0.01),
    旧多数回: 140100,
    新月額上限: (m) => Math.floor(270282 + Math.max(0, m - 900940) * 0.01),
    新多数回: 149907,
    年間上限: null,
  },
  "区分イ": {
    区分: "区分イ",
    説明: "年収約770〜1,160万円（標準報酬月額53〜79万円）",
    旧月額上限: (m) => Math.floor(167400 + Math.max(0, m - 558000) * 0.01),
    旧多数回: 93000,
    新月額上限: (m) => Math.floor(177444 + Math.max(0, m - 591480) * 0.01),
    新多数回: 98580,
    年間上限: null,
  },
  "区分ウ": {
    区分: "区分ウ",
    説明: "年収約370〜770万円（標準報酬月額28〜50万円）",
    旧月額上限: (m) => Math.floor(80100 + Math.max(0, m - 267000) * 0.01),
    旧多数回: 44400,
    新月額上限: (m) => Math.floor(84105 + Math.max(0, m - 280350) * 0.01),
    新多数回: 46620,
    年間上限: 2120000,
  },
  "区分エ（一般）": {
    区分: "区分エ（一般）",
    説明: "年収約370万円以下（標準報酬月額26万円以下）",
    旧月額上限: (_) => 57600,
    旧多数回: 44400,
    新月額上限: (_) => 59904,
    新多数回: 46176,
    年間上限: 530000,
  },
  "区分オ（住民税非課税）": {
    区分: "区分オ（住民税非課税）",
    説明: "住民税非課税世帯",
    旧月額上限: (_) => 35400,
    旧多数回: 24600,
    新月額上限: (_) => 36816,
    新多数回: 25584,
    年間上限: 240000,
  },
};

export default function 高額療養費シミュレーターページ() {
  const [区分, set区分] = useState<所得区分>("区分エ（一般）");
  const [医療費, set医療費] = useState("500000");
  const [治療月数, set治療月数] = useState("12");
  const [多数回, set多数回] = useState(false);

  const 結果 = useMemo(() => {
    const 月医療費 = parseInt(医療費) || 0;
    const 月数 = parseInt(治療月数) || 1;
    const データ = 上限テーブル[区分];

    // 月額上限（多数回考慮）
    const 旧月額 = 多数回 ? データ.旧多数回 : データ.旧月額上限(月医療費);
    const 新月額 = 多数回 ? データ.新多数回 : データ.新月額上限(月医療費);
    const 月額差 = 新月額 - 旧月額;

    // 治療期間合計（年間上限前）
    const 旧合計_上限前 = 旧月額 * 月数;
    const 新合計_上限前 = 新月額 * 月数;

    // 年間上限適用（12ヶ月換算）
    const 年間上限 = データ.年間上限;
    const 旧年間 = 年間上限 ? Math.min(旧合計_上限前, 年間上限) : 旧合計_上限前;
    const 新年間 = 年間上限 ? Math.min(新合計_上限前, 年間上限) : 新合計_上限前;
    const 年間上限適用 = 年間上限 !== null && 新合計_上限前 > 年間上限;
    const 年間上限による削減 = 年間上限適用? (新合計_上限前 - (年間上限 ?? 0)) : 0;

    // 正味負担（年間上限適用後）
    const 旧総負担 = 旧年間;
    const 新総負担 = 新年間;
    const 総負担差 = 新総負担 - 旧総負担;
    const 実質有利 = 総負担差 <= 0;

    return {
      月医療費, 月数, データ,
      旧月額, 新月額, 月額差,
      旧合計_上限前, 新合計_上限前,
      年間上限, 年間上限適用, 年間上限による削減,
      旧総負担, 新総負担, 総負担差, 実質有利,
    };
  }, [区分, 医療費, 治療月数, 多数回]);

  const 結果テキスト = `${区分}・月医療費¥${fmt(結果.月医療費)}→旧制度¥${fmt(結果.旧月額)}/月・新制度¥${fmt(結果.新月額)}/月`;

  const 医療費クイック = ["100000","300000","500000","1000000","2000000","5000000"];
  const 月数クイック = ["1","3","6","12","24","36"];
  const 区分リスト: 所得区分[] = ["区分ア", "区分イ", "区分ウ", "区分エ（一般）", "区分オ（住民税非課税）"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="high-cost-medical-2026" タイトル="高額療養費2026年改正シミュレーター" 説明="月額上限引き上げ・年間上限新設の影響を試算" カテゴリ="生活・計算" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-life">生活・計算</Link></li>
              <li aria-hidden="true">›</li>
              <li>高額療養費2026改正シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏥 高額療養費2026年改正シミュレーター</h1>
          <FavoriteButton slug="high-cost-medical-2026" title="高額療養費2026年改正シミュレーター" emoji="🏥" />
          <p className="ツールページ説明">
            2026年8月施行予定の高額療養費制度改正に対応。月額上限の引き上げと年間上限新設により、
            自己負担がどう変わるかを旧制度と比較シミュレーション。
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
                <label className="フィールドラベル">世帯年収区分（所得区分）</label>
                <div className={styles.区分選択}>
                  {区分リスト.map((k) => (
                    <button key={k}
                      className={`${styles.区分ボタン} ${区分 === k ? styles.区分ボタンアクティブ : ""}`}
                      onClick={() => set区分(k)}>
                      <span className={styles.区分名}>{k}</span>
                      <span className={styles.区分説明}>{上限テーブル[k].説明}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">1ヶ月の医療費（窓口支払前の総額・円）</label>
                <input type="number" className="数値入力" value={医療費}
                  onChange={(e) => set医療費(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {医療費クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${医療費 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set医療費(v)}>
                      {Number(v) >= 1000000 ? `${Number(v)/10000}万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">治療継続月数</label>
                <input type="number" className="数値入力" value={治療月数}
                  onChange={(e) => set治療月数(e.target.value)} min="1" max="36" />
                <div className={styles.クイック群}>
                  {月数クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${治療月数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set治療月数(v)}>{v}ヶ月</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">多数回該当（直近12ヶ月で3回以上上限適用）</label>
                <div className={styles.多数回選択}>
                  <button
                    className={`${styles.多数回ボタン} ${!多数回 ? styles.多数回ボタンアクティブ : ""}`}
                    onClick={() => set多数回(false)}>なし（初回〜2回目）</button>
                  <button
                    className={`${styles.多数回ボタン} ${多数回 ? styles.多数回ボタンアクティブ : ""}`}
                    onClick={() => set多数回(true)}>あり（3回以上）</button>
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 2026年改正は予定値（概算）です。実際の適用は加入する健康保険によって異なります。
                入院・外来は同一月・同一医療機関の条件があります。正確な計算は保険者にご確認ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">自己負担シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                {/* 月額比較 */}
                <div className={styles.月額比較}>
                  <div className={styles.月額カード} style={{ borderColor: "rgba(6,182,212,0.3)" }}>
                    <span className={styles.月額ラベル}>旧制度（〜2026年7月）</span>
                    <span className={styles.月額値} style={{ color: "#06b6d4" }}>¥{fmt(結果.旧月額)}<small>/月</small></span>
                  </div>
                  <div className={styles.月額矢印}>
                    <span className={結果.月額差 > 0 ? styles.増加 : styles.減少}>
                      {結果.月額差 > 0 ? `+¥${fmt(結果.月額差)}` : `-¥${fmt(Math.abs(結果.月額差))}`}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--カラー-テキスト極薄)" }}>月額差</span>
                  </div>
                  <div className={styles.月額カード} style={{ borderColor: "rgba(249,115,22,0.3)" }}>
                    <span className={styles.月額ラベル}>新制度（2026年8月〜予定）</span>
                    <span className={styles.月額値} style={{ color: "#f97316" }}>¥{fmt(結果.新月額)}<small>/月</small></span>
                  </div>
                </div>

                {/* 結果グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: `旧制度 ${治療月数}ヶ月合計`, value: `¥${fmt(結果.旧総負担)}`, color: "#06b6d4" },
                    { label: `新制度 ${治療月数}ヶ月合計`, value: `¥${fmt(結果.新総負担)}`, color: "#f97316" },
                    { label: "差額（新-旧）", value: 結果.総負担差 > 0 ? `+¥${fmt(結果.総負担差)}` : `-¥${fmt(Math.abs(結果.総負担差))}`, color: 結果.総負担差 > 0 ? "#f25acc" : "#10b981" },
                    { label: "年間上限", value: 結果.年間上限 ? `¥${fmt(結果.年間上限)}` : "新設なし（高所得）", color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 年間上限適用状況 */}
                {結果.年間上限 && (
                  <div className={結果.年間上限適用 ? styles.上限適用カード : styles.上限未適用カード}>
                    {結果.年間上限適用 ? (
                      <>
                        <div className={styles.上限タイトル}>✅ 年間上限が適用されます（新設）</div>
                        <p>新制度で{治療月数}ヶ月合計¥{fmt(結果.新合計_上限前)}のところ、
                        年間上限¥{fmt(結果.年間上限)}が適用され¥{fmt(結果.年間上限による削減)}削減。</p>
                      </>
                    ) : (
                      <>
                        <div className={styles.上限タイトル}>ℹ️ 年間上限（¥{fmt(結果.年間上限)}）には未達</div>
                        <p>治療期間合計¥{fmt(結果.新合計_上限前)}が年間上限以内のため、上限適用なし。</p>
                      </>
                    )}
                  </div>
                )}

                {/* 各区分の月額一覧 */}
                <div className={styles.区分表}>
                  <div className={styles.区分表タイトル}>📊 所得区分別 月額自己負担上限（医療費¥{fmt(parseInt(医療費) || 0)}の場合）</div>
                  {区分リスト.map((k) => {
                    const d = 上限テーブル[k];
                    const 旧 = 多数回 ? d.旧多数回 : d.旧月額上限(parseInt(医療費) || 0);
                    const 新 = 多数回 ? d.新多数回 : d.新月額上限(parseInt(医療費) || 0);
                    return (
                      <div key={k}
                        className={`${styles.区分行} ${区分 === k ? styles.区分行強調 : ""}`}
                        onClick={() => set区分(k)}>
                        <span className={styles.区分行名}>{k}</span>
                        <span style={{ color: "#06b6d4", fontSize: "12px" }}>旧:¥{fmt(旧)}</span>
                        <span style={{ color: "#f97316", fontSize: "12px" }}>新:¥{fmt(新)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="high-cost-medical-2026" />
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
