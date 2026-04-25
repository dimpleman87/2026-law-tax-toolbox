"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./pet-annual-cost.module.css";

const ツール定義 = {
  スラッグ: "pet-annual-cost",
  タイトル: "ペット年間飼育費シミュレーター",
  説明: "犬・猫の年間・生涯飼育コストを積み上げ計算",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🐾 ペットの年間飼育費を計算したら{result}でした。生涯コストを確認→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type ペット種別 = "犬（小型・〜10kg）" | "犬（中型・10〜25kg）" | "犬（大型・25kg〜）" | "猫（室内飼い）" | "猫（室外アクセスあり）" | "うさぎ・小動物";

// デフォルト値（月額）
const デフォルト値: Record<ペット種別, { フード: number; おやつ: number; トイレ: number; トリミング年: number; 医療年: number; 保険月: number; 消耗品年: number; 寿命: number }> = {
  "犬（小型・〜10kg）":   { フード: 5000, おやつ: 2000, トイレ: 2000, トリミング年: 60000, 医療年: 30000, 保険月: 3500, 消耗品年: 20000, 寿命: 15 },
  "犬（中型・10〜25kg）": { フード: 8000, おやつ: 2000, トイレ: 2000, トリミング年: 30000, 医療年: 35000, 保険月: 5000, 消耗品年: 25000, 寿命: 13 },
  "犬（大型・25kg〜）":   { フード: 12000, おやつ: 2500, トイレ: 1500, トリミング年: 20000, 医療年: 40000, 保険月: 7000, 消耗品年: 30000, 寿命: 11 },
  "猫（室内飼い）":       { フード: 4000, おやつ: 1000, トイレ: 2000, トリミング年: 10000, 医療年: 25000, 保険月: 3000, 消耗品年: 15000, 寿命: 16 },
  "猫（室外アクセスあり）": { フード: 4000, おやつ: 1000, トイレ: 1500, トリミング年: 5000, 医療年: 35000, 保険月: 4000, 消耗品年: 15000, 寿命: 14 },
  "うさぎ・小動物":        { フード: 2000, おやつ: 500, トイレ: 1500, トリミング年: 5000, 医療年: 15000, 保険月: 0, 消耗品年: 10000, 寿命: 8 },
};

export default function ペット年間費シミュレーターページ() {
  const [ペット, setペット] = useState<ペット種別>("犬（小型・〜10kg）");
  const デフ = デフォルト値[ペット];
  const [フード, setフード] = useState(String(デフ.フード));
  const [おやつ, setおやつ] = useState(String(デフ.おやつ));
  const [トイレ, setトイレ] = useState(String(デフ.トイレ));
  const [トリミング, setトリミング] = useState(String(デフ.トリミング年));
  const [医療, set医療] = useState(String(デフ.医療年));
  const [保険, set保険] = useState(String(デフ.保険月));
  const [消耗品, set消耗品] = useState(String(デフ.消耗品年));
  const [飼育年数, set飼育年数] = useState(String(デフ.寿命));

  const ペット変更 = (種別: ペット種別) => {
    setペット(種別);
    const d = デフォルト値[種別];
    setフード(String(d.フード));
    setおやつ(String(d.おやつ));
    setトイレ(String(d.トイレ));
    setトリミング(String(d.トリミング年));
    set医療(String(d.医療年));
    set保険(String(d.保険月));
    set消耗品(String(d.消耗品年));
    set飼育年数(String(d.寿命));
  };

  const 結果 = useMemo(() => {
    const 月フード = parseInt(フード) || 0;
    const 月おやつ = parseInt(おやつ) || 0;
    const 月トイレ = parseInt(トイレ) || 0;
    const 月保険 = parseInt(保険) || 0;
    const 年トリミング = parseInt(トリミング) || 0;
    const 年医療 = parseInt(医療) || 0;
    const 年消耗品 = parseInt(消耗品) || 0;
    const 年数 = parseInt(飼育年数) || 1;

    const 月計 = 月フード + 月おやつ + 月トイレ + 月保険;
    const 年計固定 = 年トリミング + 年医療 + 年消耗品;
    const 年計 = 月計 * 12 + 年計固定;
    const 生涯計 = 年計 * 年数;

    const 内訳 = [
      { label: "フード代", 月: 月フード, 年: 月フード * 12 },
      { label: "おやつ・サプリ", 月: 月おやつ, 年: 月おやつ * 12 },
      { label: "トイレ用品", 月: 月トイレ, 年: 月トイレ * 12 },
      { label: "保険料", 月: 月保険, 年: 月保険 * 12 },
      { label: "トリミング", 月: Math.round(年トリミング / 12), 年: 年トリミング },
      { label: "医療・健診", 月: Math.round(年医療 / 12), 年: 年医療 },
      { label: "おもちゃ・消耗品", 月: Math.round(年消耗品 / 12), 年: 年消耗品 },
    ];

    return { 月計, 年計, 生涯計, 年数, 内訳 };
  }, [フード, おやつ, トイレ, トリミング, 医療, 保険, 消耗品, 飼育年数]);

  const 結果テキスト = `${ペット}の年間飼育費¥${fmt(結果.年計)}・生涯コスト約¥${fmt(結果.生涯計)}`;

  const ペットリスト: ペット種別[] = ["犬（小型・〜10kg）", "犬（中型・10〜25kg）", "犬（大型・25kg〜）", "猫（室内飼い）", "猫（室外アクセスあり）", "うさぎ・小動物"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-life">生活・計算</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペット年間飼育費シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐾 ペット年間飼育費シミュレーター</h1>
          <p className="ツールページ説明">
            フード・医療費・保険・トリミングなどを積み上げて月額・年額・生涯コストを試算。
            犬（小型/中型/大型）・猫・小動物に対応。飼育前の資金計画に。
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
                <div className={styles.ペット選択}>
                  {ペットリスト.map((p) => (
                    <button key={p}
                      className={`${styles.ペットボタン} ${ペット === p ? styles.ペットボタンアクティブ : ""}`}
                      onClick={() => ペット変更(p)}>{p}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "月間フード代（円）", val: フード, set: setフード },
                { label: "月間おやつ・サプリ（円）", val: おやつ, set: setおやつ },
                { label: "月間トイレ・砂代（円）", val: トイレ, set: setトイレ },
                { label: "ペット保険 月額（円）", val: 保険, set: set保険 },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step="500" />
                </div>
              ))}

              {[
                { label: "トリミング費（年額・円）", val: トリミング, set: setトリミング },
                { label: "医療費・健診費（年額・円）", val: 医療, set: set医療 },
                { label: "消耗品・おもちゃ（年額・円）", val: 消耗品, set: set消耗品 },
                { label: "想定飼育年数（年）", val: 飼育年数, set: set飼育年数 },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.label.includes("年") && !f.label.includes("年額") ? "1" : "1000"} />
                </div>
              ))}
            </div>

            <div className="結果セクション">
              <div className="結果見出し">飼育費シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className="結果グリッド">
                  {[
                    { label: "月間合計", value: `¥${fmt(結果.月計)}`, color: "#06b6d4" },
                    { label: "年間合計", value: `¥${fmt(結果.年計)}`, color: "#f25acc" },
                    { label: "生涯コスト概算", value: `¥${fmt(結果.生涯計)}`, color: "#f59e0b" },
                    { label: `飼育年数`, value: `${飼育年数}年間`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳表}>
                  <div className={styles.内訳タイトル}>費用内訳</div>
                  <div className={styles.内訳ヘッダー}>
                    <span>項目</span><span>月額</span><span>年額</span>
                  </div>
                  {結果.内訳.map((row) => (
                    <div key={row.label} className={styles.内訳行}>
                      <span>{row.label}</span>
                      <span>¥{fmt(row.月)}</span>
                      <span style={{ color: "#f25acc", fontWeight: 700 }}>¥{fmt(row.年)}</span>
                    </div>
                  ))}
                  <div className={styles.内訳合計}>
                    <span>合計</span>
                    <span>¥{fmt(結果.月計)}</span>
                    <span>¥{fmt(結果.年計)}</span>
                  </div>
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
