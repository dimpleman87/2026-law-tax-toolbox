"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./age-calculator.module.css";

const ツール定義 = {
  スラッグ: "age-calculator",
  タイトル: "年齢計算機",
  説明: "満年齢・和暦・干支を生年月日から即計算",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["⏰ 年齢計算機で{result}と判明。誕生日・年金・手続きの年齢確認に→"],
};

const 干支リスト = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const 十二支英語 = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

function 和暦変換(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  if (d >= new Date(2019, 4, 1)) return `令和${year - 2018}年`;
  if (d >= new Date(1989, 0, 8)) return `平成${year - 1988}年`;
  if (d >= new Date(1926, 11, 25)) return `昭和${year - 1925}年`;
  if (d >= new Date(1912, 6, 30)) return `大正${year - 1911}年`;
  return `明治${year - 1867}年`;
}

export default function 年齢計算機ページ() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [生年月日, set生年月日] = useState("1990-01-01");
  const [基準日, set基準日] = useState(todayStr);
  const [基準日使用, set基準日使用] = useState(false);

  const 結果 = useMemo(() => {
    if (!生年月日) return null;
    const [by, bm, bd] = 生年月日.split("-").map(Number);
    const 基準 = 基準日使用 && 基準日 ? new Date(基準日) : new Date();
    const 基準年 = 基準.getFullYear();
    const 基準月 = 基準.getMonth() + 1;
    const 基準日数 = 基準.getDate();

    if (isNaN(by) || isNaN(bm) || isNaN(bd)) return null;
    if (new Date(by, bm - 1, bd) > 基準) return null;

    // 満年齢（誕生日の前日に1歳加齢）
    let 満年齢 = 基準年 - by;
    if (基準月 < bm || (基準月 === bm && 基準日数 < bd)) 満年齢--;

    // 数え年
    const 数え年 = 基準年 - by + 1;

    // 干支
    const 干支Index = (by - 4) % 12;
    const 干支 = 干支リスト[(干支Index + 12) % 12];
    const 干支英 = 十二支英語[(干支Index + 12) % 12];

    // 和暦
    const 生まれ和暦 = 和暦変換(by, bm, bd);
    const 現在和暦 = 和暦変換(基準年, 基準月, 基準日数);

    // 生まれてから何日
    const 誕生日obj = new Date(by, bm - 1, bd);
    const 経過日数 = Math.floor((基準.getTime() - 誕生日obj.getTime()) / (1000 * 60 * 60 * 24));
    const 経過時間 = 経過日数 * 24;

    // 次の誕生日まで
    let 次誕生日 = new Date(基準年, bm - 1, bd);
    if (次誕生日 <= 基準) 次誕生日 = new Date(基準年 + 1, bm - 1, bd);
    const 次まで日数 = Math.ceil((次誕生日.getTime() - 基準.getTime()) / (1000 * 60 * 60 * 24));
    const 次誕生日曜 = ["日","月","火","水","木","金","土"][次誕生日.getDay()];

    // 星座
    const 星座リスト = [
      { 名前: "山羊座", m: 1, d: 20 }, { 名前: "水瓶座", m: 2, d: 19 },
      { 名前: "魚座", m: 3, d: 21 }, { 名前: "牡羊座", m: 4, d: 20 },
      { 名前: "牡牛座", m: 5, d: 21 }, { 名前: "双子座", m: 6, d: 22 },
      { 名前: "蟹座", m: 7, d: 23 }, { 名前: "獅子座", m: 8, d: 23 },
      { 名前: "乙女座", m: 9, d: 23 }, { 名前: "天秤座", m: 10, d: 24 },
      { 名前: "蠍座", m: 11, d: 23 }, { 名前: "射手座", m: 12, d: 22 },
    ];
    const 月 = bm;
    const 日 = bd;
    let 星座 = "山羊座";
    for (let i = 0; i < 星座リスト.length; i++) {
      const curr = 星座リスト[i];
      const next = 星座リスト[(i + 1) % 12];
      if (月 === curr.m && 日 >= curr.d) { 星座 = next.名前; break; }
      if (月 === next.m && 日 < next.d) { 星座 = next.名前; break; }
    }

    // 節目年
    const 節目 = [];
    const 節目候補 = [20, 25, 30, 40, 50, 60, 70, 77, 80, 88, 90, 99, 100];
    for (const 歳 of 節目候補) {
      if (歳 > 満年齢) {
        const 節目年 = by + 歳;
        節目.push({ 歳, 年: 節目年, 呼名: 歳 === 60 ? "還暦" : 歳 === 70 ? "古希" : 歳 === 77 ? "喜寿" : 歳 === 80 ? "傘寿" : 歳 === 88 ? "米寿" : 歳 === 99 ? "白寿" : 歳 === 100 ? "百寿" : "" });
        if (節目.length >= 3) break;
      }
    }

    return {
      満年齢, 数え年, 干支, 干支英, 生まれ和暦, 現在和暦,
      経過日数, 経過時間, 次まで日数, 次誕生日, 次誕生日曜,
      星座, 節目,
      生年月日: { y: by, m: bm, d: bd },
      基準日: 基準,
    };
  }, [生年月日, 基準日, 基準日使用]);

  const 結果テキスト = 結果 ? `満${結果.満年齢}歳（${結果.干支}年生まれ・${結果.星座}）次の誕生日まで${結果.次まで日数}日` : "";

  const 有名生年月日 = [
    { label: "1990年生まれ", value: "1990-01-01" },
    { label: "1985年生まれ", value: "1985-04-01" },
    { label: "2000年生まれ", value: "2000-01-01" },
    { label: "1980年生まれ", value: "1980-07-15" },
  ];

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
              <li>年齢計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📅 年齢計算機｜満年齢・和暦・干支・星座</h1>
          <p className="ツールページ説明">
            生年月日を入力するだけで満年齢・数え年・和暦・干支・星座・次の誕生日までの日数を一括計算。
            行政手続き・年金・保険の年齢確認に。
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
                <label className="フィールドラベル">生年月日</label>
                <input type="date" className="数値入力" value={生年月日}
                  onChange={(e) => set生年月日(e.target.value)}
                  min="1900-01-01" max={todayStr} />
                <div className={styles.クイック群}>
                  {有名生年月日.map((item) => (
                    <button key={item.value}
                      className={`${styles.クイックボタン} ${生年月日.startsWith(item.value.slice(0,4)) ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set生年月日(item.value)}>{item.label}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <label className="フィールドラベル" style={{ margin: 0 }}>基準日</label>
                  <button
                    className={`${styles.クイックボタン} ${基準日使用 ? styles.クイックボタンアクティブ : ""}`}
                    onClick={() => set基準日使用(!基準日使用)}>
                    {基準日使用 ? "カスタム日付" : "今日"}
                  </button>
                </div>
                {基準日使用 && (
                  <input type="date" className="数値入力" value={基準日}
                    onChange={(e) => set基準日(e.target.value)} />
                )}
                {!基準日使用 && (
                  <p style={{ fontSize: "13px", color: "var(--カラー-テキスト薄)" }}>
                    今日（{new Date().toLocaleDateString("ja-JP")}）を基準に計算中
                  </p>
                )}
              </div>

              {/* 元号早見表 */}
              <div className={styles.元号表}>
                <div className={styles.元号表タイトル}>元号・和暦早見表</div>
                {[
                  { 元号: "令和", 開始: "2019年5月1日〜", color: "#10b981" },
                  { 元号: "平成", 開始: "1989年1月8日〜2019年4月30日", color: "#06b6d4" },
                  { 元号: "昭和", 開始: "1926年12月25日〜1989年1月7日", color: "#6366f1" },
                  { 元号: "大正", 開始: "1912年7月30日〜1926年12月24日", color: "#f59e0b" },
                ].map((e) => (
                  <div key={e.元号} className={styles.元号行}>
                    <span style={{ color: e.color, fontWeight: 700 }}>{e.元号}</span>
                    <span>{e.開始}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* メインカード */}
                  <div className={styles.メインカード}>
                    <span className={styles.メインラベル}>満年齢</span>
                    <span className={styles.メイン値}>
                      {結果.満年齢}<span className={styles.メイン単位}>歳</span>
                    </span>
                    <span className={styles.サブ値}>数え年 {結果.数え年}歳</span>
                  </div>

                  {/* メタ情報グリッド */}
                  <div className="結果グリッド">
                    {[
                      { label: "生年（和暦）", value: 結果.生まれ和暦, color: "#f59e0b" },
                      { label: "現在（和暦）", value: 結果.現在和暦, color: "#10b981" },
                      { label: "干支", value: `${結果.干支}（${結果.干支英}）`, color: "#f25acc" },
                      { label: "星座", value: 結果.星座, color: "#06b6d4" },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 経過・カウントダウン */}
                  <div className={styles.カウントカード}>
                    <div className={styles.カウント行}>
                      <span>生まれてから</span>
                      <span className={styles.カウント値} style={{ color: "#6366f1" }}>
                        {結果.経過日数.toLocaleString("ja-JP")}日
                      </span>
                    </div>
                    <div className={styles.カウント行}>
                      <span>生まれてから（時間）</span>
                      <span className={styles.カウント値} style={{ color: "#818cf8" }}>
                        約{結果.経過時間.toLocaleString("ja-JP")}時間
                      </span>
                    </div>
                    <div className={styles.カウント行}>
                      <span>次の誕生日まで</span>
                      <span className={styles.カウント値} style={{ color: "#f59e0b" }}>
                        {結果.次まで日数}日
                        <span style={{ fontSize: "11px", marginLeft: "4px", opacity: 0.7 }}>
                          （{結果.次誕生日.toLocaleDateString("ja-JP")}・{結果.次誕生日曜}）
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* 節目年 */}
                  {結果.節目.length > 0 && (
                    <div className={styles.節目カード}>
                      <div className={styles.節目タイトル}>🎊 これからの節目</div>
                      {結果.節目.map((m) => (
                        <div key={m.歳} className={styles.節目行}>
                          <span>{m.年}年 {m.呼名 ? `（${m.呼名}）` : ""}</span>
                          <span className={styles.節目値}>{m.歳}歳</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">生年月日を入力してください</p>
              )}

              {結果 && <>
              <AffiliateSlot カテゴリ="general" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }
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
