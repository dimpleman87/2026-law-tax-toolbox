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
import styles from "./telework-cost-benefit.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "telework-cost-benefit",
  タイトル: "テレワーク導入効果シミュレーター",
  説明: "交通費削減とオフィス維持費削減のメリット試算",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🏠 テレワーク導入で年間{result}のコスト削減。経営効果を数値で確認→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function テレワーク効果シミュレーターページ() {
  const [従業員数, set従業員数] = useState("10");
  const [テレワーク率, setテレワーク率] = useState("50");
  const [通勤費月人, set通勤費月人] = useState("15000");
  const [オフィス賃料月, setオフィス賃料月] = useState("300000");
  const [削減率, set削減率] = useState("30");
  const [在宅手当月人, set在宅手当月人] = useState("3000");
  const [IT整備費, setIT整備費] = useState("500000");

  const 結果 = useMemo(() => {
    const 人数 = parseInt(従業員数) || 0;
    const 率 = (parseInt(テレワーク率) || 0) / 100;
    const 通勤 = parseInt(通勤費月人) || 0;
    const 賃料 = parseInt(オフィス賃料月) || 0;
    const 賃料削減率 = (parseInt(削減率) || 0) / 100;
    const 手当 = parseInt(在宅手当月人) || 0;
    const IT = parseInt(IT整備費) || 0;

    const テレワーク人数 = Math.floor(人数 * 率);

    // 削減効果
    const 月間通勤削減 = 通勤 * テレワーク人数 * 率;
    const 月間賃料削減 = 賃料 * 賃料削減率;
    const 月間削減合計 = 月間通勤削減 + 月間賃料削減;
    const 年間削減合計 = 月間削減合計 * 12;

    // コスト
    const 月間在宅手当 = 手当 * テレワーク人数;
    const 年間在宅手当 = 月間在宅手当 * 12;
    const 年間総コスト = 年間在宅手当 + IT;

    const 年間純利益 = 年間削減合計 - 年間総コスト;
    const 回収期間 = 月間削減合計 > 0 ? Math.ceil(IT / (月間削減合計 - 月間在宅手当)) : 0;

    return {
      テレワーク人数, 月間通勤削減, 月間賃料削減, 月間削減合計,
      年間削減合計, 月間在宅手当, 年間在宅手当, 年間総コスト,
      年間純利益, 回収期間,
    };
  }, [従業員数, テレワーク率, 通勤費月人, オフィス賃料月, 削減率, 在宅手当月人, IT整備費]);

  const 結果テキスト = `テレワーク${テレワーク率}%導入→年間削減¥${fmt(結果.年間削減合計)}・純利益¥${fmt(結果.年間純利益)}`;

  const 率クイック = ["25","50","75","100"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="telework-cost-benefit" タイトル="テレワーク導入効果シミュレーター" 説明="交通費削減とオフィス維持費削減のメリット試算" カテゴリ="IT・DX推進" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-it">IT・DX推進</Link></li>
              <li aria-hidden="true">›</li>
              <li>テレワーク導入効果シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏠 テレワーク導入効果シミュレーター</h1>
          <FavoriteButton slug="telework-cost-benefit" title="テレワーク導入効果シミュレーター" emoji="🏠" />
          <p className="ツールページ説明">
            従業員数・テレワーク率・通勤費・オフィス賃料を入力するだけで
            交通費削減・オフィス縮小効果を年間コスト削減額として即算出。
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
              {[
                { label: "従業員数（人）", val: 従業員数, set: set従業員数, step: "1" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="1" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">テレワーク実施率（%）</label>
                <input type="number" className="数値入力" value={テレワーク率}
                  onChange={(e) => setテレワーク率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {率クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${テレワーク率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setテレワーク率(v)}>{v}%</button>
                  ))}
                </div>
              </div>

              {[
                { label: "通勤費 1人あたり月額（円）", val: 通勤費月人, set: set通勤費月人, step: "1000" },
                { label: "現在のオフィス賃料（月額・円）", val: オフィス賃料月, set: setオフィス賃料月, step: "50000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">オフィス縮小率（%）</label>
                <input type="number" className="数値入力" value={削減率}
                  onChange={(e) => set削減率(e.target.value)} min="0" max="100" />
                <div className={styles.クイック群}>
                  {["0","20","30","50"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${削減率 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set削減率(v)}>{v === "0" ? "縮小なし" : `${v}%縮小`}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "在宅勤務手当 1人あたり月額（円）", val: 在宅手当月人, set: set在宅手当月人, step: "500" },
                { label: "PC・通信環境などIT整備費（一時）", val: IT整備費, set: setIT整備費, step: "100000" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">導入効果シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間純削減コスト</span>
                  <span className={styles.メイン値} style={{ color: 結果.年間純利益 >= 0 ? "#10b981" : "#f25acc" }}>
                    {結果.年間純利益 >= 0 ? "+" : ""}¥{fmt(結果.年間純利益)}<span className={styles.メイン単位}>円/年</span>
                  </span>
                  <span className={styles.メインサブ}>テレワーク対象 {結果.テレワーク人数}名</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "月間通勤費削減", value: `¥${fmt(結果.月間通勤削減)}`, color: "#10b981" },
                    { label: "月間賃料削減", value: `¥${fmt(結果.月間賃料削減)}`, color: "#06b6d4" },
                    { label: "年間削減合計", value: `¥${fmt(結果.年間削減合計)}`, color: "#f59e0b" },
                    { label: "IT費回収期間", value: 結果.回収期間 > 0 ? `${結果.回収期間}ヶ月` : "即回収", color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>年間収支明細</div>
                  {[
                    { label: "通勤費削減（年間）", value: `+¥${fmt(結果.月間通勤削減 * 12)}`, plus: true },
                    { label: "賃料削減（年間）", value: `+¥${fmt(結果.月間賃料削減 * 12)}`, plus: true },
                    { label: "在宅手当（年間）", value: `-¥${fmt(結果.年間在宅手当)}`, plus: false },
                    { label: "IT整備費（一時）", value: `-¥${fmt(parseInt(IT整備費)||0)}`, plus: false },
                    { label: "年間純利益", value: `${結果.年間純利益 >= 0 ? "+" : ""}¥${fmt(結果.年間純利益)}`, plus: 結果.年間純利益 >= 0 },
                  ].map((row) => (
                    <div key={row.label} className={styles.内訳行}>
                      <span>{row.label}</span>
                      <span style={{ color: row.plus ? "#10b981" : "#f25acc", fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="IT" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="telework-cost-benefit" />
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
