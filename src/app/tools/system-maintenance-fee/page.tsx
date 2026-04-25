"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./system-maintenance-fee.module.css";

const ツール定義 = {
  スラッグ: "system-maintenance-fee",
  タイトル: "システム保守費用計算機",
  説明: "開発費・保守率・SLA等級から年間保守費を試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🔧 システム保守費を試算。開発費の{result}%が年間保守コストの目安→"],
};

type SLA等級 = "標準（平日9-17時）" | "拡張（平日8-20時）" | "24/7対応" | "ミッションクリティカル";
type 保守種別 = "基本保守" | "運用込み" | "フルマネージド";

const SLA係数: Record<SLA等級, number> = {
  "標準（平日9-17時）": 1.0,
  "拡張（平日8-20時）": 1.3,
  "24/7対応": 1.7,
  "ミッションクリティカル": 2.2,
};

const 保守種別係数: Record<保守種別, { 率: number; 内容: string }> = {
  "基本保守":     { 率: 0.15, 内容: "バグ修正・セキュリティパッチ・問合せ対応" },
  "運用込み":     { 率: 0.22, 内容: "基本保守＋監視・バックアップ・定期レポート" },
  "フルマネージド": { 率: 0.30, 内容: "運用込み＋インフラ管理・性能改善・機能追加対応" },
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function システム保守費用計算機ページ() {
  const [開発費, set開発費] = useState("5000000");
  const [SLA, setSLA] = useState<SLA等級>("標準（平日9-17時）");
  const [保守種別, set保守種別] = useState<保守種別>("基本保守");
  const [稼働年数, set稼働年数] = useState("5");
  const [インフラ月額, setインフラ月額] = useState("50000");

  const 結果 = useMemo(() => {
    const 開発 = parseInt(開発費) || 0;
    const sla係数 = SLA係数[SLA];
    const { 率 } = 保守種別係数[保守種別];
    const インフラ = (parseInt(インフラ月額)||0) * 12;
    const 年 = parseInt(稼働年数) || 1;

    const 基本年額 = 開発 * 率 * sla係数;
    const 年間合計 = 基本年額 + インフラ;
    const 月額 = 年間合計 / 12;
    const 総コスト = 年間合計 * 年 + 開発;
    const 保守率実質 = 開発 > 0 ? (年間合計 / 開発) * 100 : 0;

    return { 基本年額, インフラ, 年間合計, 月額, 総コスト, 保守率実質 };
  }, [開発費, SLA, 保守種別, 稼働年数, インフラ月額]);

  const 結果テキスト = `開発費¥${fmt(parseInt(開発費))}のシステム保守：年間¥${fmt(結果.年間合計)}（保守率${結果.保守率実質.toFixed(1)}%）`;

  const 開発費クイック = ["1000000","3000000","5000000","10000000","30000000","50000000"];

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
              <li>システム保守費用計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🔧 システム保守費用計算機</h1>
          <p className="ツールページ説明">
            開発費・SLA等級・保守種別を選ぶだけで年間保守費用・月額・総所有コスト（TCO）を試算。
            ベンダー見積もりの妥当性チェックや予算計画に。
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
                <label className="フィールドラベル">開発費（円）</label>
                <input type="number" className="数値入力" value={開発費}
                  onChange={(e) => set開発費(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {開発費クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${開発費 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set開発費(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">SLA等級（サポートレベル）</label>
                <div className={styles.クイック群}>
                  {(Object.keys(SLA係数) as SLA等級[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${SLA === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setSLA(k)}>{k}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">保守種別</label>
                <div className={styles.クイック群}>
                  {(Object.keys(保守種別係数) as 保守種別[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${保守種別 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set保守種別(k)}>{k}</button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--カラー-テキスト薄)", marginTop: 6 }}>
                  {保守種別係数[保守種別].内容}
                </div>
              </div>

              {[
                { label: "想定稼働年数（年）", val: 稼働年数, set: set稼働年数, step: "1" },
                { label: "インフラ月額費用（円）", val: インフラ月額, set: setインフラ月額, step: "10000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">保守費用シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間保守費用</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.年間合計)}<span className={styles.メイン単位}>円/年</span>
                  </span>
                  <span className={styles.メインサブ}>月額換算 ¥{fmt(結果.月額)}円</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "保守費（SLA加味）", value: `¥${fmt(結果.基本年額)}`, color: "#10b981" },
                    { label: "インフラ費（年間）", value: `¥${fmt(結果.インフラ)}`, color: "#06b6d4" },
                    { label: "実質保守率", value: `${結果.保守率実質.toFixed(1)}%`, color: "#f59e0b" },
                    { label: `総所有コスト（${稼働年数}年）`, value: `¥${fmt(結果.総コスト)}`, color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.85rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>年間費用内訳</div>
                  {[
                    { label: `開発費×保守率${(保守種別係数[保守種別].率*100).toFixed(0)}%×SLA${SLA係数[SLA]}倍`, value: `¥${fmt(結果.基本年額)}`, plus: true },
                    { label: "インフラ費（月額×12）", value: `¥${fmt(結果.インフラ)}`, plus: true },
                    { label: "年間保守費合計", value: `¥${fmt(結果.年間合計)}`, plus: true },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 2 ? styles.内訳合計 : ""}`}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700, color: i === 2 ? "var(--カラー-テキスト)" : "var(--カラー-テキスト薄)" }}>{row.value}</span>
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
