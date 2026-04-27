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
import styles from "./mortgage-calculator.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "mortgage-calculator",
  タイトル: "住宅ローン計算機",
  説明: "月返済額・総支払額・利息総額をシミュレーション",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🏠 住宅ローン月返済額：{result}円と試算。マイホーム検討中の方に→"],
};

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP");
}

export default function 住宅ローン計算機ページ() {
  const [借入額, set借入額] = useState("3000");
  const [金利, set金利] = useState("1.5");
  const [返済期間, set返済期間] = useState("35");
  const [返済方式, set返済方式] = useState<"元利均等" | "元金均等">("元利均等");
  const [ボーナス月加算, setボーナス月加算] = useState("0");

  const 結果 = useMemo(() => {
    const P = parseFloat(借入額) * 10000; // 万円→円
    const annualRate = parseFloat(金利) / 100;
    const months = parseInt(返済期間) * 12;
    const bonus = parseFloat(ボーナス月加算) * 10000;

    if (!P || P <= 0 || annualRate < 0 || months <= 0) return null;

    const r = annualRate / 12;

    let 月返済額 = 0;
    let 総支払額 = 0;
    let 利息総額 = 0;

    if (返済方式 === "元利均等") {
      if (r === 0) {
        月返済額 = P / months;
      } else {
        月返済額 = P * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
      }
      総支払額 = 月返済額 * months;
      利息総額 = 総支払額 - P;
    } else {
      // 元金均等
      const 月元金 = P / months;
      let 累積利息 = 0;
      let 残高 = P;
      for (let i = 0; i < months; i++) {
        const 利息 = 残高 * r;
        累積利息 += 利息;
        残高 -= 月元金;
      }
      月返済額 = 月元金 + P * r; // 初回返済額
      総支払額 = P + 累積利息;
      利息総額 = 累積利息;
    }

    // ボーナス月（年2回）の追加返済加算
    const ボーナス回数 = parseInt(返済期間) * 2;
    const ボーナス総額 = bonus * ボーナス回数;

    // 返済比率（年収600万想定）
    const 想定年収 = 6000000;
    const 年間返済 = 月返済額 * 12 + bonus * 2;
    const 返済比率 = (年間返済 / 想定年収) * 100;

    // 繰上返済シミュレーション（月+1万円）
    let 繰上期間 = 0;
    if (r > 0 && 返済方式 === "元利均等") {
      const 追加 = 月返済額 + 10000;
      繰上期間 = Math.log(追加 / (追加 - P * r)) / Math.log(1 + r);
    }

    return {
      月返済額,
      総支払額,
      利息総額,
      元本: P,
      返済比率,
      繰上期間: Math.ceil(繰上期間),
      ボーナス総額,
      実質総支払: 総支払額 + ボーナス総額,
    };
  }, [借入額, 金利, 返済期間, 返済方式, ボーナス月加算]);

  const 結果テキスト = 結果 ? `月返済額 ${fmt(結果.月返済額)}円` : "";

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="mortgage-calculator" タイトル="住宅ローン計算機" 説明="月返済額・総支払額・利息総額をシミュレーション" カテゴリ="金融・投資" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>住宅ローン計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏠 住宅ローン計算機</h1>
          <FavoriteButton slug="mortgage-calculator" title="住宅ローン計算機" emoji="🏠" />
          <p className="ツールページ説明">
            借入額・金利・返済期間を入力するだけで月返済額・総支払額・利息総額を即計算。元利均等・元金均等の両方に対応。
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
                <label className="フィールドラベル">借入額（万円）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={借入額}
                  onChange={(e) => set借入額(e.target.value)}
                  min="100" max="100000" step="100"
                  placeholder="3000"
                />
                <span style={{ fontSize: "12px", color: "var(--カラー-テキスト極薄)" }}>
                  {借入額 ? `${Number(借入額).toLocaleString()}万円 = ${(Number(借入額) * 10000).toLocaleString()}円` : ""}
                </span>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">年利（%）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={金利}
                  onChange={(e) => set金利(e.target.value)}
                  min="0.1" max="10" step="0.01"
                  placeholder="1.5"
                />
                <div className={styles.金利クイック}>
                  {["0.5", "1.0", "1.5", "2.0", "3.0"].map((r) => (
                    <button key={r} className={`${styles.クイックボタン} ${金利 === r ? styles.クイックボタンアクティブ : ""}`} onClick={() => set金利(r)}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">返済期間（年）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={返済期間}
                  onChange={(e) => set返済期間(e.target.value)}
                  min="1" max="50" step="1"
                  placeholder="35"
                />
                <div className={styles.金利クイック}>
                  {["10", "20", "25", "30", "35"].map((y) => (
                    <button key={y} className={`${styles.クイックボタン} ${返済期間 === y ? styles.クイックボタンアクティブ : ""}`} onClick={() => set返済期間(y)}>
                      {y}年
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">返済方式</label>
                <div className={styles.返済方式選択}>
                  {(["元利均等", "元金均等"] as const).map((m) => (
                    <button
                      key={m}
                      className={`${styles.方式ボタン} ${返済方式 === m ? styles.方式ボタンアクティブ : ""}`}
                      onClick={() => set返済方式(m)}
                    >
                      {m}返済
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", lineHeight: 1.6 }}>
                  {返済方式 === "元利均等"
                    ? "毎月の返済額が一定。家計管理がしやすい。"
                    : "毎月の元金返済が一定。初期負担が大きいが総利息を抑えられる。"}
                </p>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">ボーナス月の追加返済（万円・年2回）</label>
                <input
                  type="number"
                  className="数値入力"
                  value={ボーナス月加算}
                  onChange={(e) => setボーナス月加算(e.target.value)}
                  min="0" max="500" step="1"
                  placeholder="0"
                />
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* メイン結果 */}
                  <div className={styles.メイン結果カード}>
                    <span className={styles.メイン結果ラベル}>月々の返済額</span>
                    <span className={styles.メイン結果値}>
                      ¥{fmt(結果.月返済額)}<span className={styles.メイン結果単位}>円/月</span>
                    </span>
                    {返済方式 === "元金均等" && (
                      <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                        ※初回返済額。以後毎月わずかに減少
                      </span>
                    )}
                  </div>

                  {/* 詳細グリッド */}
                  <div className="結果グリッド">
                    {[
                      { label: "借入元本",   value: `¥${fmt(結果.元本)}円` },
                      { label: "総支払額",   value: `¥${fmt(結果.総支払額)}円`, highlight: true },
                      { label: "利息総額",   value: `¥${fmt(結果.利息総額)}円`, warn: true },
                      { label: "元本の何倍", value: `${(結果.総支払額 / 結果.元本).toFixed(2)}倍` },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className={`結果値 ${item.highlight ? styles.強調値 : ""} ${item.warn ? styles.警告値 : ""}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ボーナス */}
                  {結果.ボーナス総額 > 0 && (
                    <div className={styles.ボーナス表示}>
                      <span>ボーナス加算分（{返済期間}年間）</span>
                      <span>+¥{fmt(結果.ボーナス総額)}円</span>
                    </div>
                  )}

                  {/* 繰上返済ヒント */}
                  {結果.繰上期間 > 0 && 結果.繰上期間 < parseInt(返済期間) * 12 && (
                    <div className={styles.繰上ヒント}>
                      💡 毎月1万円多く返済すると、返済期間が
                      <strong style={{ color: "var(--カラー-セカンダリ)" }}>
                        {" "}約{Math.round((parseInt(返済期間) * 12 - 結果.繰上期間) / 12)}年短縮
                      </strong>
                      できます
                    </div>
                  )}

                  {/* 返済比率 */}
                  <div className={styles.返済比率}>
                    <span>返済比率（年収600万想定）</span>
                    <span style={{ color: 結果.返済比率 > 35 ? "#f25acc" : 結果.返済比率 > 25 ? "#fbbf24" : "#26d9ca" }}>
                      {結果.返済比率.toFixed(1)}%
                      {結果.返済比率 > 35 ? " ⚠️ 高負担" : 結果.返済比率 > 25 ? " 注意" : " 適正"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">借入額・金利・返済期間を入力してください</p>
              )}
            </div>
          </div>

          {結果 && (
            <>
            <AffiliateSlot カテゴリ="business" />
            <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </>
          )}

          <ToolGuide slug="mortgage-calculator" />
        </div>
      </main>
    </>
  );
}
