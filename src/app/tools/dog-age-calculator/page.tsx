"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./dog-age-calculator.module.css";

const ツール定義 = {
  スラッグ: "dog-age-calculator",
  タイトル: "犬の年齢換算ツール",
  説明: "愛犬の年齢を人間年齢に換算・ライフステージ判定",
  カテゴリ: "ペット",
  category: "Pet",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🐶 うちの子は人間換算で{result}！犬の年齢換算ツールで確認→"],
};

type 犬サイズ = "小型犬（〜10kg）" | "中型犬（10〜25kg）" | "大型犬（25kg〜）";

// サイズ別の人間年齢換算（Purina/AKC研究ベース）
// 小型犬: 1歳=15, 2歳=24, その後+4/年（最長18年前後）
// 中型犬: 1歳=15, 2歳=24, その後+5/年
// 大型犬: 1歳=15, 2歳=24, その後+6/年（老化が早い）
function 人間年齢換算(犬齢: number, サイズ: 犬サイズ): number {
  if (犬齢 <= 0) return 0;
  if (犬齢 <= 1) return Math.round(15 * 犬齢);
  if (犬齢 <= 2) return Math.round(15 + (24 - 15) * (犬齢 - 1));
  const 追加率 = サイズ === "小型犬（〜10kg）" ? 4 : サイズ === "中型犬（10〜25kg）" ? 5 : 6;
  return Math.round(24 + (犬齢 - 2) * 追加率);
}

interface ライフステージ情報 {
  ステージ: string;
  説明: string;
  色: string;
  アイコン: string;
}

function ライフステージ判定(犬齢: number, サイズ: 犬サイズ): ライフステージ情報 {
  const シニア開始 = サイズ === "大型犬（25kg〜）" ? 6 : 7;
  const 超シニア開始 = サイズ === "大型犬（25kg〜）" ? 10 : 12;

  if (犬齢 < 1) return { ステージ: "パピー期", 説明: "成長が最も急速な時期。社会化トレーニングが重要です。", 色: "#f59e0b", アイコン: "🐾" };
  if (犬齢 < 3) return { ステージ: "若犬期", 説明: "エネルギーが最も旺盛な時期。しっかり運動させましょう。", 色: "#10b981", アイコン: "🏃" };
  if (犬齢 < シニア開始) return { ステージ: "成犬期", 説明: "最も安定した時期。定期健診で健康維持を。", 色: "#06b6d4", アイコン: "🐕" };
  if (犬齢 < 超シニア開始) return { ステージ: "シニア期", 説明: "老化のサインが出始める時期。半年ごとの健診がおすすめ。", 色: "#f97316", アイコン: "🦮" };
  return { ステージ: "超シニア期", 説明: "関節・心臓・腎臓のケアが特に重要になります。", 色: "#f25acc", アイコン: "❤️" };
}

function 平均寿命推定(サイズ: 犬サイズ): number {
  if (サイズ === "小型犬（〜10kg）") return 15;
  if (サイズ === "中型犬（10〜25kg）") return 13;
  return 11;
}

export default function 犬の年齢換算ページ() {
  const [犬齢, set犬齢] = useState("3");
  const [サイズ, setサイズ] = useState<犬サイズ>("小型犬（〜10kg）");

  const 結果 = useMemo(() => {
    const 年齢 = parseFloat(犬齢) || 0;
    const 人間年齢 = 人間年齢換算(年齢, サイズ);
    const ステージ情報 = ライフステージ判定(年齢, サイズ);
    const 寿命 = 平均寿命推定(サイズ);
    const 余命目安 = Math.max(0, 寿命 - 年齢);
    const シニア開始 = サイズ === "大型犬（25kg〜）" ? 6 : 7;
    const 次ステージまで = 年齢 < シニア開始 ? Math.max(0, シニア開始 - 年齢) : 0;

    return { 年齢, 人間年齢, ステージ情報, 寿命, 余命目安, 次ステージまで };
  }, [犬齢, サイズ]);

  const 結果テキスト = `愛犬${犬齢}歳は人間換算${結果.人間年齢}歳（${結果.ステージ情報.ステージ}）`;

  const サイズリスト: 犬サイズ[] = ["小型犬（〜10kg）", "中型犬（10〜25kg）", "大型犬（25kg〜）"];
  const 年齢クイック = ["0.5","1","2","3","5","7","10","12","15"];

  // 対応表生成（1〜15歳）
  const 対応表 = Array.from({ length: 15 }, (_, i) => ({
    犬齢: i + 1,
    人間年齢: 人間年齢換算(i + 1, サイズ),
  }));

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>犬の年齢換算ツール</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐶 犬の年齢換算ツール</h1>
          <p className="ツールページ説明">
            愛犬の年齢を犬種サイズ（小型・中型・大型）別に人間年齢へ換算。
            ライフステージ判定・平均余命の目安・年齢対応表も表示します。
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
                <label className="フィールドラベル">犬種サイズ</label>
                <div className={styles.サイズ選択}>
                  {サイズリスト.map((s) => (
                    <button key={s}
                      className={`${styles.サイズボタン} ${サイズ === s ? styles.サイズボタンアクティブ : ""}`}
                      onClick={() => setサイズ(s)}>
                      {s === "小型犬（〜10kg）" ? "🐩 " : s === "中型犬（10〜25kg）" ? "🐕 " : "🐕‍🦺 "}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">愛犬の年齢（歳）</label>
                <input type="number" className="数値入力" value={犬齢}
                  onChange={(e) => set犬齢(e.target.value)} min="0" max="30" step="0.5" />
                <div className={styles.クイック群}>
                  {年齢クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${犬齢 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set犬齢(v)}>{v}歳</button>
                  ))}
                </div>
              </div>

              {/* ライフステージ早見 */}
              <div className={styles.ステージ表}>
                <div className={styles.ステージ表タイトル}>📋 ライフステージ目安（{サイズ}）</div>
                <div className={styles.ステージ行}>
                  <span className={styles.ステージバッジ} style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>パピー期</span>
                  <span>〜1歳</span>
                </div>
                <div className={styles.ステージ行}>
                  <span className={styles.ステージバッジ} style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>若犬期</span>
                  <span>1〜3歳</span>
                </div>
                <div className={styles.ステージ行}>
                  <span className={styles.ステージバッジ} style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}>成犬期</span>
                  <span>3〜{サイズ === "大型犬（25kg〜）" ? 6 : 7}歳</span>
                </div>
                <div className={styles.ステージ行}>
                  <span className={styles.ステージバッジ} style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>シニア期</span>
                  <span>{サイズ === "大型犬（25kg〜）" ? "6〜10" : "7〜12"}歳</span>
                </div>
                <div className={styles.ステージ行}>
                  <span className={styles.ステージバッジ} style={{ background: "rgba(242,90,204,0.15)", color: "#f25acc" }}>超シニア期</span>
                  <span>{サイズ === "大型犬（25kg〜）" ? "10歳〜" : "12歳〜"}</span>
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 換算値はAKC・Purina研究に基づく目安です。個体差・犬種・体格により異なります。
                医療上の判断は必ず獣医師にご相談ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">換算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* メインカード */}
                <div className={styles.メインカード}>
                  <span className={styles.犬アイコン}>🐶</span>
                  <span className={styles.メインラベル}>愛犬 {犬齢}歳 の人間換算年齢</span>
                  <span className={styles.メイン値}>{結果.人間年齢}<span className={styles.メイン単位}>歳</span></span>
                </div>

                {/* ライフステージカード */}
                <div className={styles.ステージカード} style={{ borderColor: `${結果.ステージ情報.色}40` }}>
                  <div className={styles.ステージヘッダー}>
                    <span className={styles.ステージアイコン}>{結果.ステージ情報.アイコン}</span>
                    <span className={styles.ステージ名} style={{ color: 結果.ステージ情報.色 }}>
                      {結果.ステージ情報.ステージ}
                    </span>
                  </div>
                  <p className={styles.ステージ説明}>{結果.ステージ情報.説明}</p>
                </div>

                {/* グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "人間換算年齢", value: `${結果.人間年齢}歳`, color: "#f25acc" },
                    { label: "平均寿命の目安", value: `約${結果.寿命}歳`, color: "#06b6d4" },
                    { label: "余命の目安", value: 結果.余命目安 > 0 ? `あと約${結果.余命目安.toFixed(1)}年` : "平均寿命超え", color: "#10b981" },
                    { label: "シニアまで", value: 結果.次ステージまで > 0 ? `あと${結果.次ステージまで.toFixed(1)}年` : "シニア期以上", color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 対応表 */}
                <div className={styles.対応表}>
                  <div className={styles.対応表タイトル}>📊 年齢対応表（{サイズ}）</div>
                  <div className={styles.対応表ヘッダー}>
                    <span>犬齢</span>
                    <span>人間換算</span>
                    <span>ステージ</span>
                  </div>
                  {対応表.map((row) => {
                    const st = ライフステージ判定(row.犬齢, サイズ);
                    const 強調 = Math.floor(parseFloat(犬齢)) === row.犬齢;
                    return (
                      <div key={row.犬齢}
                        className={`${styles.対応表行} ${強調 ? styles.対応表行強調 : ""}`}
                        onClick={() => set犬齢(String(row.犬齢))}>
                        <span>{row.犬齢}歳</span>
                        <span style={{ color: "#f25acc", fontWeight: 700 }}>{row.人間年齢}歳</span>
                        <span style={{ color: st.色, fontSize: "11px" }}>{st.ステージ}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
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
