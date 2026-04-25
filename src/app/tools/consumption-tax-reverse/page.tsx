"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./consumption-tax-reverse.module.css";

const ツール定義 = {
  スラッグ: "consumption-tax-reverse",
  タイトル: "消費税 逆算・内税外税計算機",
  説明: "税込・税抜・消費税額を一発計算",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💰 消費税の逆算計算機。税込{result}円の税抜価格がすぐわかる→"],
};

function fmt(n: number) {
  return n.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

type 計算モード = "税抜→税込" | "税込→税抜";
type 税率 = "10" | "8";

export default function 消費税逆算計算機ページ() {
  const [モード, setモード] = useState<計算モード>("税抜→税込");
  const [金額, set金額] = useState("10000");
  const [税率選択, set税率選択] = useState<税率>("10");

  const 結果 = useMemo(() => {
    const 入力金額 = parseFloat(金額) || 0;
    if (入力金額 <= 0) return null;
    const 税率数値 = parseFloat(税率選択) / 100;

    if (モード === "税抜→税込") {
      const 消費税額 = 入力金額 * 税率数値;
      const 税込金額 = 入力金額 + 消費税額;
      return {
        入力ラベル: "税抜価格",
        入力金額,
        消費税額,
        税込金額,
        税抜金額: 入力金額,
        メイン値: 税込金額,
        メインラベル: "税込価格",
      };
    } else {
      const 税抜金額 = 入力金額 / (1 + 税率数値);
      const 消費税額 = 入力金額 - 税抜金額;
      return {
        入力ラベル: "税込価格",
        入力金額,
        消費税額,
        税込金額: 入力金額,
        税抜金額,
        メイン値: 税抜金額,
        メインラベル: "税抜価格",
      };
    }
  }, [モード, 金額, 税率選択]);

  const 結果テキスト = 結果 ? `¥${fmt(結果.メイン値)}` : "";

  const クイック = ["1000","5000","10000","50000","100000","500000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>消費税 逆算・内税外税計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💰 消費税 逆算・内税外税計算機</h1>
          <p className="ツールページ説明">
            税込価格から税抜を逆算、または税抜から税込を計算。8%（軽減税率）・10%両対応。
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
              {/* モード切替 */}
              <div className="フィールドグループ">
                <label className="フィールドラベル">計算モード</label>
                <div className={styles.モード選択}>
                  {(["税抜→税込", "税込→税抜"] as 計算モード[]).map((m) => (
                    <button
                      key={m}
                      className={`${styles.モードボタン} ${モード === m ? styles.モードボタンアクティブ : ""}`}
                      onClick={() => setモード(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 税率 */}
              <div className="フィールドグループ">
                <label className="フィールドラベル">税率</label>
                <div className={styles.モード選択}>
                  {([["10", "10%（通常）"], ["8", "8%（軽減税率）"]] as [税率, string][]).map(([v, label]) => (
                    <button
                      key={v}
                      className={`${styles.モードボタン} ${税率選択 === v ? styles.モードボタンアクティブ : ""}`}
                      onClick={() => set税率選択(v)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {税率選択 === "8" && (
                  <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                    飲食料品・定期購読の新聞に適用される軽減税率
                  </p>
                )}
              </div>

              {/* 金額入力 */}
              <div className="フィールドグループ">
                <label className="フィールドラベル">
                  {モード === "税抜→税込" ? "税抜価格（円）" : "税込価格（円）"}
                </label>
                <input
                  type="number"
                  className="数値入力"
                  value={金額}
                  onChange={(e) => set金額(e.target.value)}
                  min="0" step="100"
                  placeholder="10000"
                />
                <div className={styles.クイック群}>
                  {クイック.map((v) => (
                    <button
                      key={v}
                      className={`${styles.クイックボタン} ${金額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set金額(v)}
                    >
                      {Number(v).toLocaleString()}円
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>{結果.メインラベル}</span>
                    <span className={styles.メイン値}>¥{fmt(結果.メイン値)}<span className={styles.メイン単位}>円</span></span>
                    <span className={styles.税率バッジ}>税率 {税率選択}%</span>
                  </div>

                  <div className="結果グリッド">
                    {[
                      { label: "税抜価格",  value: `¥${fmt(結果.税抜金額)}円` },
                      { label: "消費税額",  value: `¥${fmt(結果.消費税額)}円`, color: "#f59e0b" },
                      { label: "税込価格",  value: `¥${fmt(結果.税込金額)}円`, color: "#26d9ca" },
                      { label: "税率",     value: `${税率選択}%${税率選択 === "8" ? "（軽減）" : "（標準）"}` },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "1.1rem", color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 10万円単位の早見表 */}
                  <div className={styles.早見表}>
                    <div className={styles.早見表ラベル}>早見表（{税率選択}%・税抜ベース）</div>
                    <div className={styles.早見表グリッド}>
                      {[10000,30000,50000,100000,300000,500000].map((v) => {
                        const tax = v * (parseFloat(税率選択)/100);
                        return (
                          <div key={v} className={styles.早見表アイテム}>
                            <span className={styles.早見表税抜}>{(v/10000).toFixed(0)}万</span>
                            <span className={styles.早見表矢印}>→</span>
                            <span className={styles.早見表税込}>{fmt(v + tax)}円</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">金額を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
          <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
          </>
          }
        </div>
      </main>
    </>
  );
}
