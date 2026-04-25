"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./compound-interest.module.css";

const ツール定義 = {
  スラッグ: "compound-interest",
  タイトル: "複利計算シミュレーター",
  説明: "積立投資・新NISAの複利収益を長期グラフで試算",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📈 新NISA複利シミュレーション。{result}の資産になる計算→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

interface 年次データ {
  年: number;
  元本: number;
  評価額: number;
  利益: number;
}

export default function 複利計算シミュレーターページ() {
  const [初期投資, set初期投資] = useState("1000000");
  const [月積立, set月積立] = useState("30000");
  const [年利, set年利] = useState("5");
  const [期間, set期間] = useState("20");
  const [表示モード, set表示モード] = useState<"グラフ" | "表">("グラフ");

  const 結果 = useMemo(() => {
    const p0 = parseInt(初期投資) || 0;
    const monthly = parseInt(月積立) || 0;
    const rate = parseFloat(年利) / 100;
    const years = parseInt(期間) || 1;

    const monthlyRate = rate / 12;
    const data: 年次データ[] = [];

    let 元本累計 = p0;
    let 評価額 = p0;

    data.push({ 年: 0, 元本: p0, 評価額: p0, 利益: 0 });

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        評価額 = 評価額 * (1 + monthlyRate) + monthly;
        元本累計 += monthly;
      }
      data.push({
        年: y,
        元本: 元本累計,
        評価額: Math.round(評価額),
        利益: Math.round(評価額 - 元本累計),
      });
    }

    const 最終 = data[data.length - 1];
    const 利益率 = 元本累計 > 0 ? (最終.利益 / 元本累計) * 100 : 0;
    const 最大評価 = Math.max(...data.map(d => d.評価額));

    // グラフ表示用（5年毎or全年）
    const グラフデータ = years <= 20 ? data : data.filter((_, i) => i % Math.ceil(years / 20) === 0 || _ === data[data.length - 1]);

    return { data, グラフデータ, 最終, 利益率, 最大評価, 元本累計 };
  }, [初期投資, 月積立, 年利, 期間]);

  const 結果テキスト = `${期間}年後 ¥${fmt(結果.最終.評価額)}（利益 ¥${fmt(結果.最終.利益)}・利益率${結果.利益率.toFixed(1)}%）`;

  const 年利クイック = ["3","4","5","6","7","8","10"];
  const 期間クイック = ["10","15","20","25","30"];
  const 月積立クイック = ["10000","20000","30000","50000","100000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-finance">金融・投資</Link></li>
              <li aria-hidden="true">›</li>
              <li>複利計算シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📈 複利計算シミュレーター｜新NISA・積立投資</h1>
          <p className="ツールページ説明">
            初期投資額・毎月の積立額・想定年利・期間を入力するだけで、
            複利効果による資産成長をグラフで可視化。新NISA・iDeCo・投資信託の収益計画に。
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
                <label className="フィールドラベル">初期投資額（円）</label>
                <input type="number" className="数値入力" value={初期投資}
                  onChange={(e) => set初期投資(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {["0","500000","1000000","2000000","3000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${初期投資 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set初期投資(v)}>
                      {v === "0" ? "なし" : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">毎月の積立額（円）</label>
                <input type="number" className="数値入力" value={月積立}
                  onChange={(e) => set月積立(e.target.value)} min="0" step="5000" />
                <div className={styles.クイック群}>
                  {月積立クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${月積立 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set月積立(v)}>{Number(v)/10000}万</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">想定年利（%）</label>
                <input type="number" className="数値入力" value={年利}
                  onChange={(e) => set年利(e.target.value)} min="0.1" max="30" step="0.5" />
                <div className={styles.クイック群}>
                  {年利クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${年利 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set年利(v)}>{v}%</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                  参考：全世界株（MSCI ACWI）の長期年利 約5〜7%・S&P500 約7〜10%
                </p>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">積立期間（年）</label>
                <input type="number" className="数値入力" value={期間}
                  onChange={(e) => set期間(e.target.value)} min="1" max="50" />
                <div className={styles.クイック群}>
                  {期間クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${期間 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set期間(v)}>{v}年</button>
                  ))}
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 本シミュレーターは一定利率での複利計算です。実際の投資は元本保証ではなく、
                税金（NISAは非課税）・手数料は考慮していません。投資の最終判断はご自身でお願いします。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* メインカード */}
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>{期間}年後の評価額</span>
                  <span className={styles.メイン値}>¥{fmt(結果.最終.評価額)}<span className={styles.メイン単位}>円</span></span>
                  <div className={styles.内訳行}>
                    <span style={{ color: "#06b6d4" }}>元本 ¥{fmt(結果.元本累計)}</span>
                    <span style={{ color: "var(--カラー-テキスト薄)" }}>+</span>
                    <span style={{ color: "#10b981" }}>利益 ¥{fmt(結果.最終.利益)}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(16,185,129,0.7)" }}>
                    利益率 +{結果.利益率.toFixed(1)}%（複利効果）
                  </span>
                </div>

                {/* サマリーグリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "総投資元本", value: `¥${fmt(結果.元本累計)}`, color: "#06b6d4" },
                    { label: "運用益（複利）", value: `¥${fmt(結果.最終.利益)}`, color: "#10b981" },
                    { label: "月積立×期間", value: `¥${fmt(parseInt(月積立) * 12 * parseInt(期間))}`, color: "#f59e0b" },
                    { label: "利益率", value: `+${結果.利益率.toFixed(1)}%`, color: "#f25acc" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ fontSize: "1rem", color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 複利グラフ（SVGバー） */}
                <div className={styles.グラフラッパー}>
                  <div className={styles.グラフタイトル}>
                    <span>資産成長グラフ</span>
                    <div className={styles.グラフ凡例}>
                      <span style={{ color: "#06b6d4" }}>■元本</span>
                      <span style={{ color: "#10b981" }}>■運用益</span>
                    </div>
                  </div>
                  <div className={styles.グラフ本体}>
                    {結果.グラフデータ.slice(1).map((d) => {
                      const 元本pct = (d.元本 / 結果.最大評価) * 100;
                      const 評価pct = (d.評価額 / 結果.最大評価) * 100;
                      return (
                        <div key={d.年} className={styles.グラフ列}>
                          <div className={styles.グラフバー}>
                            <div className={styles.グラフ利益部} style={{ height: `${評価pct - 元本pct}%` }} />
                            <div className={styles.グラフ元本部} style={{ height: `${元本pct}%` }} />
                          </div>
                          <span className={styles.グラフラベル}>{d.年}年</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 年次表 */}
                <div className={styles.年次表}>
                  <div className={styles.年次表タイトル}>主要年の資産推移</div>
                  <div className={styles.年次行ヘッダ}>
                    <span>年数</span><span>元本</span><span>評価額</span><span>運用益</span>
                  </div>
                  {結果.data.filter(d => [5,10,15,20,25,30].includes(d.年) || d.年 === parseInt(期間)).map((d) => (
                    <div key={d.年} className={`${styles.年次行} ${d.年 === parseInt(期間) ? styles.年次行強調 : ""}`}>
                      <span>{d.年}年後</span>
                      <span>¥{fmt(d.元本)}</span>
                      <span style={{ color: "#10b981", fontWeight: 700 }}>¥{fmt(d.評価額)}</span>
                      <span style={{ color: "#f25acc" }}>+¥{fmt(d.利益)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
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
