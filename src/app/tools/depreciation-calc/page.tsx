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
import styles from "./depreciation-calc.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "depreciation-calc",
  タイトル: "減価償却費計算機",
  説明: "定額法・定率法の年次償却スケジュールを即算出",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📊 減価償却シミュレーション。{result}の経費計上が可能→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 計算方法 = "定額法" | "定率法" | "比較";

// 定率法の償却率表（2012年4月以降取得の法定償却率）
const 定率法償却率: Record<number, number> = {
  2: 1.000, 3: 0.667, 4: 0.500, 5: 0.400, 6: 0.333,
  7: 0.286, 8: 0.250, 9: 0.222, 10: 0.200, 11: 0.182,
  12: 0.167, 13: 0.154, 14: 0.143, 15: 0.133, 16: 0.125,
  17: 0.118, 18: 0.111, 19: 0.105, 20: 0.100, 25: 0.080,
  30: 0.067, 40: 0.050, 50: 0.040,
};

function 最近傍償却率(年数: number): number {
  if (定率法償却率[年数]) return 定率法償却率[年数];
  const keys = Object.keys(定率法償却率).map(Number).sort((a, b) => a - b);
  const near = keys.reduce((prev, curr) => Math.abs(curr - 年数) < Math.abs(prev - 年数) ? curr : prev);
  return 定率法償却率[near];
}

interface 年次データ { 年: number; 定額: number; 定率: number; 定額累計: number; 定率累計: number; 定額残: number; 定率残: number; }

export default function 減価償却計算機ページ() {
  const [取得価額, set取得価額] = useState("5000000");
  const [耐用年数, set耐用年数] = useState("5");
  const [計算方法, set計算方法] = useState<計算方法>("比較");
  const [取得月, set取得月] = useState("4");

  const 結果 = useMemo(() => {
    const 価額 = parseInt(取得価額) || 0;
    const 年数 = parseInt(耐用年数) || 1;
    const 月 = parseInt(取得月) || 1;
    const 初年度月数 = 13 - 月; // 取得月から12月まで

    // 定額法：取得価額 × 1/耐用年数
    const 定額年額 = Math.floor(価額 / 年数);
    const 定額初年度 = Math.floor(定額年額 * 初年度月数 / 12);

    // 定率法
    const 償却率 = 最近傍償却率(年数);
    const 保証率 = 0.1 / 年数; // 簡略保証率
    const 保証額 = Math.floor(価額 * 保証率);

    const data: 年次データ[] = [];
    let 定額残 = 価額;
    let 定率残 = 価額;

    for (let y = 1; y <= 年数; y++) {
      // 定額
      const 定額 = y === 年数 ? Math.max(0, 定額残 - 1) : y === 1 ? 定額初年度 : Math.min(定額年額, 定額残 - 1);
      定額残 = Math.max(1, 定額残 - 定額);

      // 定率
      let 定率 = Math.floor(定率残 * 償却率);
      if (定率 < 保証額) 定率 = 保証額;
      if (y === 年数) 定率 = Math.max(0, 定率残 - 1);
      定率 = Math.min(定率, 定率残 - 1);
      定率残 = Math.max(1, 定率残 - 定率);

      data.push({
        年: y,
        定額, 定率,
        定額累計: 価額 - 定額残,
        定率累計: 価額 - 定率残,
        定額残, 定率残,
      });
    }

    const 最大償却 = Math.max(...data.map(d => Math.max(d.定額, d.定率)));

    return { data, 定額年額, 定額初年度, 償却率, 最大償却, 価額, 年数 };
  }, [取得価額, 耐用年数, 取得月]);

  const 結果テキスト = `取得価額¥${fmt(結果.価額)}・耐用${耐用年数}年→年間定額法¥${fmt(結果.定額年額)}・定率法初年度¥${fmt(結果.data[0]?.定率 ?? 0)}`;

  const 耐用年数プリセット = [
    { label: "PC・サーバー", 年: "4" },
    { label: "自動車（普通）", 年: "6" },
    { label: "建物（鉄骨）", 年: "34" },
    { label: "建物（木造）", 年: "22" },
    { label: "器具・備品", 年: "5" },
    { label: "ソフトウェア", 年: "5" },
  ];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="depreciation-calc" タイトル="減価償却費計算機" 説明="定額法・定率法の年次償却スケジュールを即算出" カテゴリ="金融・投資" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-finance">金融・投資</Link></li>
              <li aria-hidden="true">›</li>
              <li>減価償却費計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📊 減価償却費計算機（定額法・定率法）</h1>
          <FavoriteButton slug="depreciation-calc" title="減価償却費計算機" emoji="📊" />
          <p className="ツールページ説明">
            取得価額・耐用年数を入力するだけで定額法・定率法の年次償却スケジュールを全期間算出。
            決算前の経費シミュレーション・節税計画・設備投資判断に。
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
                <label className="フィールドラベル">取得価額（円）</label>
                <input type="number" className="数値入力" value={取得価額}
                  onChange={(e) => set取得価額(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {["500000","1000000","3000000","5000000","10000000","30000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${取得価額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set取得価額(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">耐用年数プリセット</label>
                <div className={styles.クイック群}>
                  {耐用年数プリセット.map((p) => (
                    <button key={p.年}
                      className={`${styles.クイックボタン} ${耐用年数 === p.年 ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set耐用年数(p.年)}>
                      {p.label}（{p.年}年）
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">耐用年数（年）</label>
                <input type="number" className="数値入力" value={耐用年数}
                  onChange={(e) => set耐用年数(e.target.value)} min="2" max="50" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">取得月（初年度の月按分用）</label>
                <div className={styles.クイック群}>
                  {["1","4","7","10"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${取得月 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set取得月(v)}>{v}月取得</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">表示モード</label>
                <div className={styles.税率選択}>
                  {(["定額法", "定率法", "比較"] as 計算方法[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${計算方法 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set計算方法(m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 2012年4月1日以降取得の有形固定資産を想定。建物・建物附属設備は定額法のみ。
                1円（備忘価額）まで償却します。実際の申告は税理士にご確認ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">償却スケジュール</div>

              <div className={styles.結果コンテンツ}>
                {/* サマリー */}
                <div className="結果グリッド">
                  {[
                    { label: "定額法 年間償却額", value: `¥${fmt(結果.定額年額)}`, color: "#06b6d4" },
                    { label: "定率法 償却率", value: `${(結果.償却率 * 100).toFixed(1)}%`, color: "#f25acc" },
                    { label: "定率法 初年度償却", value: `¥${fmt(結果.data[0]?.定率 ?? 0)}`, color: "#f59e0b" },
                    { label: "耐用年数", value: `${耐用年数}年間`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "1rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* グラフ */}
                <div className={styles.グラフラッパー}>
                  <div className={styles.グラフタイトル}>
                    <span>年次償却額グラフ</span>
                    <div className={styles.グラフ凡例}>
                      {(計算方法 === "定額法" || 計算方法 === "比較") && <span style={{ color: "#06b6d4" }}>■定額法</span>}
                      {(計算方法 === "定率法" || 計算方法 === "比較") && <span style={{ color: "#f25acc" }}>■定率法</span>}
                    </div>
                  </div>
                  <div className={styles.グラフ本体}>
                    {結果.data.map((d) => (
                      <div key={d.年} className={styles.グラフ列}>
                        <div className={styles.グラフバー}>
                          {(計算方法 === "定率法" || 計算方法 === "比較") && (
                            <div className={styles.グラフ定率} style={{ height: `${(d.定率 / 結果.最大償却) * 100}%` }} />
                          )}
                          {(計算方法 === "定額法" || 計算方法 === "比較") && (
                            <div className={styles.グラフ定額} style={{ height: `${(d.定額 / 結果.最大償却) * 100}%` }} />
                          )}
                        </div>
                        <span className={styles.グラフラベル}>{d.年}年</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* テーブル */}
                <div className={styles.テーブル}>
                  <div className={styles.テーブルヘッダ}>
                    <span>年次</span>
                    {(計算方法 === "定額法" || 計算方法 === "比較") && <span>定額法</span>}
                    {(計算方法 === "定率法" || 計算方法 === "比較") && <span>定率法</span>}
                    <span>帳簿残高</span>
                  </div>
                  {結果.data.map((d) => (
                    <div key={d.年} className={styles.テーブル行}>
                      <span>{d.年}年目</span>
                      {(計算方法 === "定額法" || 計算方法 === "比較") && (
                        <span style={{ color: "#06b6d4", fontWeight: 700 }}>¥{fmt(d.定額)}</span>
                      )}
                      {(計算方法 === "定率法" || 計算方法 === "比較") && (
                        <span style={{ color: "#f25acc", fontWeight: 700 }}>¥{fmt(d.定率)}</span>
                      )}
                      <span style={{ color: "var(--カラー-テキスト薄)" }}>
                        {計算方法 === "定率法" ? `¥${fmt(d.定率残)}` : `¥${fmt(d.定額残)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="depreciation-calc" />
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
