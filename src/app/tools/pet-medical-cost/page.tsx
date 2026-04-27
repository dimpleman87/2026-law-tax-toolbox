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
import styles from "./pet-medical-cost.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-medical-cost",
  タイトル: "ペット高額医療費シミュレーター",
  説明: "手術・入院の自己負担額と保険効果を比較",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐾 ペット医療費シミュレーション。手術費用{result}の自己負担額が判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 治療種別 = "通院（軽度）" | "通院（重度）" | "入院（5日）" | "入院（10日）" | "手術（軽度）" | "手術（重度）" | "がん治療（1クール）" | "骨折・整形外科";
type 補償率 = "未加入" | "50%" | "70%" | "80%" | "90%";

const 治療費目安: Record<治療種別, { min: number; max: number; avg: number }> = {
  "通院（軽度）":     { min: 3000,  max: 15000,  avg: 8000 },
  "通院（重度）":     { min: 15000, max: 50000,  avg: 30000 },
  "入院（5日）":      { min: 40000, max: 120000, avg: 80000 },
  "入院（10日）":     { min: 80000, max: 250000, avg: 150000 },
  "手術（軽度）":     { min: 50000, max: 150000, avg: 100000 },
  "手術（重度）":     { min: 150000,max: 500000, avg: 300000 },
  "がん治療（1クール）": { min: 100000,max: 600000, avg: 350000 },
  "骨折・整形外科":   { min: 80000, max: 300000, avg: 180000 },
};

const 補償率数値: Record<補償率, number> = {
  "未加入": 0, "50%": 0.5, "70%": 0.7, "80%": 0.8, "90%": 0.9,
};

export default function ペット医療費シミュレーターページ() {
  const [治療, set治療] = useState<治療種別>("手術（軽度）");
  const [医療費, set医療費] = useState("");
  const [補償率, set補償率] = useState<補償率>("70%");
  const [免責, set免責] = useState("0");

  const 結果 = useMemo(() => {
    const 目安 = 治療費目安[治療];
    const 入力費 = parseInt(医療費) || 目安.avg;
    const 補償 = 補償率数値[補償率];
    const 免責額 = parseInt(免責) || 0;

    const 補償対象 = Math.max(0, 入力費 - 免責額);
    const 保険補償 = 補償率 === "未加入" ? 0 : Math.floor(補償対象 * 補償);
    const 自己負担 = 入力費 - 保険補償;
    const 節約額 = 保険補償;

    return { 入力費, 補償対象, 保険補償, 自己負担, 節約額, 目安 };
  }, [治療, 医療費, 補償率, 免責]);

  const 結果テキスト = `${治療}・医療費¥${fmt(結果.入力費)}→自己負担¥${fmt(結果.自己負担)}（保険補償¥${fmt(結果.保険補償)})`;

  const 治療リスト = Object.keys(治療費目安) as 治療種別[];
  const 補償率リスト: 補償率[] = ["未加入", "50%", "70%", "80%", "90%"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-medical-cost" タイトル="ペット高額医療費シミュレーター" 説明="手術・入院の自己負担額と保険効果を比較" カテゴリ="生活・計算" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-life">生活・計算</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペット高額医療費シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏥 ペット高額医療費シミュレーター</h1>
          <FavoriteButton slug="pet-medical-cost" title="ペット高額医療費シミュレーター" emoji="🏥" />
          <p className="ツールページ説明">
            手術・入院・がん治療などの種別を選ぶだけで、平均医療費・保険補償額・自己負担額を即試算。
            ペット保険の有無による差額も一目で確認できます。
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
                <label className="フィールドラベル">治療の種別</label>
                <div className={styles.治療選択}>
                  {治療リスト.map((t) => (
                    <button key={t}
                      className={`${styles.治療ボタン} ${治療 === t ? styles.治療ボタンアクティブ : ""}`}
                      onClick={() => { set治療(t); set医療費(""); }}>
                      <span>{t}</span>
                      <span className={styles.治療目安}>平均¥{fmt(治療費目安[t].avg)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">
                  実際の医療費（空欄で平均値 ¥{fmt(治療費目安[治療].avg)} を使用）
                </label>
                <input type="number" className="数値入力" value={医療費}
                  onChange={(e) => set医療費(e.target.value)} min="0" step="10000"
                  placeholder={String(治療費目安[治療].avg)} />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">ペット保険の補償率</label>
                <div className={styles.横選択}>
                  {補償率リスト.map((b) => (
                    <button key={b}
                      className={`${styles.横ボタン} ${補償率 === b ? styles.横ボタンアクティブ : ""}`}
                      onClick={() => set補償率(b)}>{b}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">免責金額（円）</label>
                <input type="number" className="数値入力" value={免責}
                  onChange={(e) => set免責(e.target.value)} min="0" step="5000" />
              </div>

              <div className={styles.費用参考}>
                <div className={styles.費用参考タイトル}>📊 {治療} の費用相場</div>
                <div className={styles.費用参考行}>
                  <span>最低目安</span><span style={{ color: "#10b981" }}>¥{fmt(治療費目安[治療].min)}</span>
                </div>
                <div className={styles.費用参考行}>
                  <span>平均</span><span style={{ color: "#f59e0b" }}>¥{fmt(治療費目安[治療].avg)}</span>
                </div>
                <div className={styles.費用参考行}>
                  <span>高額ケース</span><span style={{ color: "#f25acc" }}>¥{fmt(治療費目安[治療].max)}</span>
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">医療費シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>自己負担額</span>
                  <span className={styles.メイン値} style={{ color: 結果.自己負担 > 100000 ? "#f25acc" : "#10b981" }}>
                    ¥{fmt(結果.自己負担)}<span className={styles.メイン単位}>円</span>
                  </span>
                  {補償率 !== "未加入" && (
                    <span className={styles.保険節約}>保険で ¥{fmt(結果.保険補償)} カバー</span>
                  )}
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "医療費合計", value: `¥${fmt(結果.入力費)}`, color: "#f97316" },
                    { label: "保険補償額", value: `¥${fmt(結果.保険補償)}`, color: "#10b981" },
                    { label: "自己負担額", value: `¥${fmt(結果.自己負担)}`, color: "#f25acc" },
                    { label: "補償率", value: 補償率, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.比較表}>
                  <div className={styles.比較表タイトル}>補償率別 自己負担シミュレーション</div>
                  {(["未加入","50%","70%","80%","90%"] as 補償率[]).map((r) => {
                    const comp = 補償率数値[r];
                    const 対象 = Math.max(0, 結果.入力費 - (parseInt(免責)||0));
                    const 負担 = 結果.入力費 - Math.floor(対象 * comp);
                    return (
                      <div key={r}
                        className={`${styles.比較行} ${補償率 === r ? styles.比較行強調 : ""}`}
                        onClick={() => set補償率(r)}>
                        <span>{r}</span>
                        <span style={{ color: "#f25acc" }}>自己負担 ¥{fmt(負担)}</span>
                        <span style={{ color: "#10b981" }}>補償 ¥{fmt(結果.入力費 - 負担)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-medical-cost" />
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
