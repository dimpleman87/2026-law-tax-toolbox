"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./crypto-tax-2026.module.css";

const ツール定義 = {
  スラッグ: "crypto-tax-2026",
  タイトル: "暗号資産税金シミュレーター2026",
  説明: "現行総合課税vs2026年分離課税20.315%を比較",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🚨 暗号資産の税金。現行vs2026年新制度で{result}の差！→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function pct(n: number) { return n.toFixed(1); }

type 控除区分 = "約150万円（給与所得者・標準）" | "約200万円（扶養あり）" | "約100万円（フリーランス）" | "約50万円（投資・副業中心）";
const 控除額マップ: Record<控除区分, number> = {
  "約150万円（給与所得者・標準）": 1500000,
  "約200万円（扶養あり）": 2000000,
  "約100万円（フリーランス）": 1000000,
  "約50万円（投資・副業中心）": 500000,
};

// 累進所得税（速算表）
function 所得税計算(課税所得: number): number {
  if (課税所得 <= 0) return 0;
  if (課税所得 <= 1950000) return Math.floor(課税所得 * 0.05);
  if (課税所得 <= 3300000) return Math.floor(課税所得 * 0.10 - 97500);
  if (課税所得 <= 6950000) return Math.floor(課税所得 * 0.20 - 427500);
  if (課税所得 <= 9000000) return Math.floor(課税所得 * 0.23 - 636000);
  if (課税所得 <= 18000000) return Math.floor(課税所得 * 0.33 - 1536000);
  if (課税所得 <= 40000000) return Math.floor(課税所得 * 0.40 - 2796000);
  return Math.floor(課税所得 * 0.45 - 4796000);
}

export default function 暗号資産税金シミュレーターページ() {
  const [暗号利益, set暗号利益] = useState("3000000");
  const [他所得, set他所得] = useState("5000000");
  const [繰越損失, set繰越損失] = useState("0");
  const [損出し, set損出し] = useState("0");
  const [控除区分, set控除区分] = useState<控除区分>("約150万円（給与所得者・標準）");

  const 結果 = useMemo(() => {
    const 暗号 = parseInt(暗号利益) || 0;
    const 他 = parseInt(他所得) || 0;
    const 繰越 = parseInt(繰越損失) || 0;
    const 損 = parseInt(損出し) || 0;
    const 控除 = 控除額マップ[控除区分];

    // ─── 現行制度（総合課税） ─────────────────────────────
    // 暗号利益 - 損出し → 今年の暗号所得
    const 今年暗号所得 = Math.max(0, 暗号 - 損);
    // 合計課税所得（他所得 + 暗号所得 - 控除）
    const 現行課税所得 = Math.max(0, 他 + 今年暗号所得 - 控除);
    // 他所得だけの場合の税額（暗号なし）
    const 他課税所得 = Math.max(0, 他 - 控除);
    const 他のみ所得税 = 所得税計算(他課税所得);
    const 他のみ復興 = Math.floor(他のみ所得税 * 0.021);
    const 他のみ住民税 = Math.floor(他課税所得 * 0.10);
    // 暗号込み合計税
    const 現行所得税 = 所得税計算(現行課税所得);
    const 現行復興税 = Math.floor(現行所得税 * 0.021);
    const 現行住民税 = Math.floor(現行課税所得 * 0.10);
    const 現行合計 = 現行所得税 + 現行復興税 + 現行住民税;
    // 暗号部分の税（差分）
    const 現行暗号税 = 現行合計 - (他のみ所得税 + 他のみ復興 + 他のみ住民税);
    const 現行実効税率 = 今年暗号所得 > 0 ? (現行暗号税 / 今年暗号所得) * 100 : 0;

    // ─── 2026年新制度（申告分離課税20.315%） ───────────────
    const 新制度課税対象 = Math.max(0, 暗号 - 繰越 - 損);
    // 所得税15% + 復興特別0.315% = 15.315%、住民税5%
    const 新制度所得税 = Math.floor(新制度課税対象 * 0.15315);
    const 新制度住民税 = Math.floor(新制度課税対象 * 0.05);
    const 新制度合計 = 新制度所得税 + 新制度住民税;
    const 新制度実効税率 = 今年暗号所得 > 0 ? (新制度合計 / 暗号) * 100 : 0;

    // 制度間差額（現行 - 新制度 = 節税効果）
    const 節税効果 = 現行暗号税 - 新制度合計;
    const 新制度有利 = 節税効果 > 0;

    // 損出し1円あたりの節税効果（現行制度での限界税率）
    const 限界税率 = 現行課税所得 > 18000000 ? 0.55 :
                    現行課税所得 > 9000000 ? 0.43 :
                    現行課税所得 > 6950000 ? 0.33 :
                    現行課税所得 > 3300000 ? 0.30 :
                    現行課税所得 > 1950000 ? 0.20 : 0.15;

    return {
      暗号, 他, 繰越, 損,
      今年暗号所得, 現行課税所得, 現行暗号税, 現行実効税率, 現行合計,
      新制度課税対象, 新制度合計, 新制度実効税率,
      節税効果, 新制度有利, 限界税率,
    };
  }, [暗号利益, 他所得, 繰越損失, 損出し, 控除区分]);

  const 結果テキスト = `暗号資産利益¥${fmt(結果.暗号)}→現行税額¥${fmt(結果.現行暗号税)}vs新制度¥${fmt(結果.新制度合計)}（差額¥${fmt(Math.abs(結果.節税効果))}）`;

  const 利益クイック = ["500000","1000000","3000000","5000000","10000000","30000000"];
  const 他所得クイック = ["0","3000000","5000000","8000000","12000000","20000000"];
  const 控除リスト: 控除区分[] = ["約150万円（給与所得者・標準）", "約200万円（扶養あり）", "約100万円（フリーランス）", "約50万円（投資・副業中心）"];

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
              <li>暗号資産税金シミュレーター2026</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">₿ 暗号資産税金シミュレーター2026</h1>
          <p className="ツールページ説明">
            暗号資産（仮想通貨）の売却益を現行の総合課税（最大55%）と
            2026年税制改正の申告分離課税（20.315%）で比較。繰越損失・損出し効果も計算。
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
                <label className="フィールドラベル">暗号資産の年間売却益（円）</label>
                <input type="number" className="数値入力" value={暗号利益}
                  onChange={(e) => set暗号利益(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {利益クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${暗号利益 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set暗号利益(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">給与・事業所得など他の年間所得（円）</label>
                <input type="number" className="数値入力" value={他所得}
                  onChange={(e) => set他所得(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {他所得クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${他所得 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set他所得(v)}>
                      {Number(v) === 0 ? "なし" : Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">所得控除の合計（社会保険料・基礎控除等）</label>
                <div className={styles.控除選択}>
                  {控除リスト.map((k) => (
                    <button key={k}
                      className={`${styles.控除ボタン} ${控除区分 === k ? styles.控除ボタンアクティブ : ""}`}
                      onClick={() => set控除区分(k)}>{k}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">繰越損失（新制度・前年以前の損失）</label>
                <input type="number" className="数値入力" value={繰越損失}
                  onChange={(e) => set繰越損失(e.target.value)} min="0" step="100000" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">損出し予定額（年内に確定する損失）</label>
                <input type="number" className="数値入力" value={損出し}
                  onChange={(e) => set損出し(e.target.value)} min="0" step="100000" />
              </div>

              <div className={styles.注意書き}>
                ※ 国税庁タックスアンサーNo.1521準拠の概算です。2026年新制度は税制改正大綱に基づく予定値。
                DeFi・NFT・ステーキング等は追加判断が必要です。実際の申告は税理士にご相談ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">税額比較</div>

              <div className={styles.結果コンテンツ}>
                {/* 比較カード */}
                <div className={styles.比較カード}>
                  <div className={styles.比較左}>
                    <span className={styles.比較ラベル}>現行制度（総合課税）</span>
                    <span className={styles.比較値} style={{ color: "#f25acc" }}>¥{fmt(結果.現行暗号税)}</span>
                    <span className={styles.比較税率}>実効税率 {pct(結果.現行実効税率)}%</span>
                  </div>
                  <div className={styles.比較中央}>
                    <span className={結果.新制度有利 ? styles.有利バッジ新 : styles.有利バッジ旧}>
                      {結果.新制度有利 ? "新制度が有利" : "現行が有利"}
                    </span>
                    <span className={styles.差額}>
                      差額<br />¥{fmt(Math.abs(結果.節税効果))}
                    </span>
                  </div>
                  <div className={styles.比較右}>
                    <span className={styles.比較ラベル}>新制度（分離20.315%）</span>
                    <span className={styles.比較値} style={{ color: "#10b981" }}>¥{fmt(結果.新制度合計)}</span>
                    <span className={styles.比較税率}>実効税率 {pct(結果.新制度実効税率)}%</span>
                  </div>
                </div>

                {/* グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "現行 暗号資産税額", value: `¥${fmt(結果.現行暗号税)}`, color: "#f25acc" },
                    { label: "新制度 税額（20.315%）", value: `¥${fmt(結果.新制度合計)}`, color: "#10b981" },
                    { label: "節税効果（現行-新制度）", value: 結果.新制度有利 ? `+¥${fmt(結果.節税効果)}` : `-¥${fmt(Math.abs(結果.節税効果))}`, color: 結果.新制度有利 ? "#10b981" : "#f59e0b" },
                    { label: "損出し限界税率", value: `${pct(結果.限界税率 * 100)}%`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 詳細内訳 */}
                <div className={styles.内訳カード}>
                  <div className={styles.内訳タイトル}>現行制度 詳細</div>
                  <div className={styles.内訳行}>
                    <span>今年の暗号所得（損出し後）</span>
                    <span>¥{fmt(結果.今年暗号所得)}</span>
                  </div>
                  <div className={styles.内訳行}>
                    <span>課税所得合計（他所得+暗号-控除）</span>
                    <span>¥{fmt(結果.現行課税所得)}</span>
                  </div>
                </div>

                <div className={styles.内訳カード}>
                  <div className={styles.内訳タイトル}>新制度 詳細（2026年予定）</div>
                  <div className={styles.内訳行}>
                    <span>繰越損失・損出し後の課税対象</span>
                    <span>¥{fmt(結果.新制度課税対象)}</span>
                  </div>
                  <div className={styles.内訳行}>
                    <span>所得税・復興税（15.315%）</span>
                    <span>¥{fmt(Math.floor(結果.新制度課税対象 * 0.15315))}</span>
                  </div>
                  <div className={styles.内訳行}>
                    <span>住民税（5%）</span>
                    <span>¥{fmt(Math.floor(結果.新制度課税対象 * 0.05))}</span>
                  </div>
                </div>

                {/* 損出し効果メモ */}
                {結果.損 > 0 && (
                  <div className={styles.ヒントカード}>
                    <div className={styles.ヒントタイトル}>💡 損出し効果（現行制度）</div>
                    <p>損出し¥{fmt(結果.損)}により、現行制度で概算¥{fmt(Math.floor(結果.損 * 結果.限界税率))}の節税効果。
                    限界税率{pct(結果.限界税率 * 100)}%適用。</p>
                  </div>
                )}
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
