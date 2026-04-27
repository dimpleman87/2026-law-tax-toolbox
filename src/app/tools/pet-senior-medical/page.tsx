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
import styles from "./pet-senior-medical.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-senior-medical",
  タイトル: "ペット老後医療費積立シミュレーター",
  説明: "シニア期の医療費を今から準備する積立プランを試算",
  カテゴリ: "ペット",
  category: "pet",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐾 ペットのシニア期医療費の積立額を試算。月¥{result}から備える→"],
};

type ペット = "小型犬" | "中型犬" | "大型犬" | "猫";
const 寿命: Record<ペット, number> = { 小型犬: 15, 中型犬: 13, 大型犬: 11, 猫: 16 };
const シニア開始: Record<ペット, number> = { 小型犬: 8, 中型犬: 7, 大型犬: 7, 猫: 8 };
const シニア月医療費: Record<ペット, number> = { 小型犬: 15000, 中型犬: 18000, 大型犬: 22000, 猫: 12000 };

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function ペット老後積立シミュレーターページ() {
  const [ペット種, setペット種] = useState<ペット>("小型犬");
  const [現在年齢, set現在年齢] = useState("3");
  const [現在月医療費, set現在月医療費] = useState("5000");
  const [保険加入, set保険加入] = useState(false);
  const [保険補償率, set保険補償率] = useState("70");

  const d = useMemo(() => ({
    寿: 寿命[ペット種],
    シニア: シニア開始[ペット種],
    月医: シニア月医療費[ペット種],
  }), [ペット種]);

  const 結果 = useMemo(() => {
    const 現在齢 = parseInt(現在年齢) || 0;
    const 現在月 = parseInt(現在月医療費) || 0;
    const 補償率 = 保険加入 ? (parseInt(保険補償率) || 70) / 100 : 0;

    const シニア残年 = Math.max(0, d.寿 - Math.max(現在齢, d.シニア));
    const 積立残年 = Math.max(0, d.シニア - 現在齢);
    const シニア月増加 = Math.max(0, d.月医 - 現在月);
    const シニア総医療費 = d.月医 * 12 * シニア残年;
    const 保険補償総額 = シニア総医療費 * 補償率;
    const 必要積立総額 = Math.max(0, シニア総医療費 - 保険補償総額);
    const 月積立額 = 積立残年 > 0 ? Math.ceil(必要積立総額 / (積立残年 * 12)) : 必要積立総額;

    return {
      シニア残年, 積立残年, シニア月増加, シニア総医療費,
      保険補償総額, 必要積立総額, 月積立額,
    };
  }, [現在年齢, 現在月医療費, 保険加入, 保険補償率, d]);

  const 結果テキスト = `${ペット種}シニア期医療費総額¥${fmt(結果.シニア総医療費)}・月¥${fmt(結果.月積立額)}の積立が必要`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-senior-medical" タイトル="ペット老後医療費積立シミュレーター" 説明="シニア期の医療費を今から準備する積立プランを試算" カテゴリ="ペット" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペット老後医療費積立シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐾 ペット老後医療費積立シミュレーター</h1>
          <FavoriteButton slug="pet-senior-medical" title="ペット老後医療費積立シミュレーター" emoji="🐾" />
          <p className="ツールページ説明">
            現在のペットの年齢・種別を入力するだけでシニア期に備える必要積立額と
            月々の積立目安を即算出。ペット保険の有無も考慮した現実的なプランに。
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
                <label className="フィールドラベル">ペットの種類</label>
                <div className={styles.クイック群}>
                  {(["小型犬","中型犬","大型犬","猫"] as ペット[]).map((p) => (
                    <button key={p}
                      className={`${styles.クイックボタン} ${ペット種 === p ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setペット種(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">現在の年齢（歳）</label>
                <input type="number" className="数値入力" value={現在年齢}
                  onChange={(e) => set現在年齢(e.target.value)} min="0" max={d.寿} step="1" />
                <div className={styles.クイック群}>
                  {["1","3","5","7"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${現在年齢 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set現在年齢(v)}>{v}歳</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">現在の月間医療費（円）</label>
                <input type="number" className="数値入力" value={現在月医療費}
                  onChange={(e) => set現在月医療費(e.target.value)} min="0" step="1000" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">ペット保険</label>
                <div className={styles.チェック群}>
                  <label className={styles.チェックラベル}>
                    <input type="checkbox" checked={保険加入} onChange={(e) => set保険加入(e.target.checked)} />
                    <span>ペット保険に加入している（またはする予定）</span>
                  </label>
                </div>
                {保険加入 && (
                  <div className={styles.クイック群} style={{ marginTop: 8 }}>
                    {["50","70","90"].map((v) => (
                      <button key={v}
                        className={`${styles.クイックボタン} ${保険補償率 === v ? styles.クイックボタンアクティブ : ""}`}
                        onClick={() => set保険補償率(v)}>{v}%補償</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">老後医療費積立シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>月々の積立目安</span>
                  <span className={styles.メイン値}>¥{fmt(結果.月積立額)}<span className={styles.メイン単位}>円/月</span></span>
                  <span className={styles.メインサブ}>
                    {結果.積立残年 > 0 ? `シニア期まで${結果.積立残年}年間積み立て` : "既にシニア期・一括備えを推奨"}
                  </span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "シニア期残年数", value: `${結果.シニア残年}年間`, color: "#06b6d4" },
                    { label: "シニア期総医療費", value: `¥${fmt(結果.シニア総医療費)}`, color: "#f59e0b" },
                    { label: "保険補償総額", value: `¥${fmt(結果.保険補償総額)}`, color: "#a78bfa" },
                    { label: "必要積立総額", value: `¥${fmt(結果.必要積立総額)}`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>{ペット種}の目安データ</div>
                  {[
                    { label: "平均寿命", value: `${d.寿}歳` },
                    { label: "シニア期開始", value: `${d.シニア}歳〜` },
                    { label: "シニア期平均月医療費", value: `¥${fmt(d.月医)}` },
                    { label: "現在との月差額", value: `+¥${fmt(結果.シニア月増加)}` },
                    { label: "積立期間", value: 結果.積立残年 > 0 ? `残${結果.積立残年}年` : "シニア期到達済み" },
                  ].map((row) => (
                    <div key={row.label} className={styles.内訳行}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-senior-medical" />
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
