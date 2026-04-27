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
import styles from "./year-end-tax-adj.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "year-end-tax-adj",
  タイトル: "年末調整 還付金・追徴額 計算機",
  説明: "配偶者・扶養・生命保険控除を反映して試算",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💴 年末調整で{result}円還付予定。控除を漏れなく申告しよう→"],
};

function fmt(n: number) { return Math.round(Math.abs(n)).toLocaleString("ja-JP"); }

function 所得税計算(課税所得: number): number {
  if (課税所得 <= 0) return 0;
  const brackets = [
    { limit: 1950000,  rate: 0.05, deduct: 0 },
    { limit: 3300000,  rate: 0.10, deduct: 97500 },
    { limit: 6950000,  rate: 0.20, deduct: 427500 },
    { limit: 9000000,  rate: 0.23, deduct: 636000 },
    { limit: 18000000, rate: 0.33, deduct: 1536000 },
    { limit: 40000000, rate: 0.40, deduct: 2796000 },
    { limit: Infinity,  rate: 0.45, deduct: 4796000 },
  ];
  for (const b of brackets) {
    if (課税所得 <= b.limit) return 課税所得 * b.rate - b.deduct;
  }
  return 0;
}

export default function 年末調整計算機ページ() {
  const [年収, set年収] = useState("5000000");
  const [既納税額, set既納税額] = useState("");
  // 各種控除
  const [配偶者有, set配偶者有] = useState(false);
  const [配偶者年収, set配偶者年収] = useState("0");
  const [扶養人数一般, set扶養人数一般] = useState("0");
  const [扶養人数特定, set扶養人数特定] = useState("0"); // 19〜22歳
  const [生命保険旧, set生命保険旧] = useState("0");
  const [生命保険新, set生命保険新] = useState("0");
  const [介護医療保険, set介護医療保険] = useState("0");
  const [個人年金旧, set個人年金旧] = useState("0");
  const [個人年金新, set個人年金新] = useState("0");
  const [地震保険, set地震保険] = useState("0");
  const [住宅ローン控除, set住宅ローン控除] = useState("0");

  const 結果 = useMemo(() => {
    const 年収N = parseInt(年収) || 0;
    if (年収N <= 0) return null;

    // 給与所得控除
    let 給与所得控除 = 0;
    if (年収N <= 1625000)      給与所得控除 = 550000;
    else if (年収N <= 1800000) 給与所得控除 = 年収N * 0.4 - 100000;
    else if (年収N <= 3600000) 給与所得控除 = 年収N * 0.3 + 80000;
    else if (年収N <= 6600000) 給与所得控除 = 年収N * 0.2 + 440000;
    else if (年収N <= 8500000) 給与所得控除 = 年収N * 0.1 + 1100000;
    else                       給与所得控除 = 1950000;
    const 給与所得 = 年収N - 給与所得控除;

    // 基礎控除
    let 基礎控除額 = 0;
    if (年収N <= 24000000)      基礎控除額 = 480000;
    else if (年収N <= 24500000) 基礎控除額 = 320000;
    else if (年収N <= 25000000) 基礎控除額 = 160000;

    // 配偶者控除・配偶者特別控除
    let 配偶者控除額 = 0;
    if (配偶者有) {
      const 配偶者N = parseInt(配偶者年収) || 0;
      if (配偶者N <= 1030000) {
        // 配偶者控除
        if (年収N <= 9000000)      配偶者控除額 = 380000;
        else if (年収N <= 9500000) 配偶者控除額 = 260000;
        else if (年収N <= 10000000) 配偶者控除額 = 130000;
      } else if (配偶者N <= 2015999) {
        // 配偶者特別控除（簡易計算）
        if (年収N <= 9000000) {
          if (配偶者N <= 1500000)      配偶者控除額 = 380000;
          else if (配偶者N <= 1550000)  配偶者控除額 = 260000;
          else if (配偶者N <= 1600000)  配偶者控除額 = 180000;
          else if (配偶者N <= 1667999)  配偶者控除額 = 110000;
          else if (配偶者N <= 1751999)  配偶者控除額 = 60000;
          else if (配偶者N <= 1831999)  配偶者控除額 = 30000;
          else                           配偶者控除額 = 0;
        }
      }
    }

    // 扶養控除
    const 一般扶養N = parseInt(扶養人数一般) || 0;
    const 特定扶養N = parseInt(扶養人数特定) || 0;
    const 扶養控除額 = 一般扶養N * 380000 + 特定扶養N * 630000;

    // 生命保険料控除（新制度上限4万・旧制度上限5万）
    function 生保控除計算(支払額: number, 旧制度: boolean): number {
      if (支払額 <= 0) return 0;
      const 上限 = 旧制度 ? 50000 : 40000;
      if (旧制度) {
        if (支払額 <= 25000) return 支払額;
        if (支払額 <= 50000) return 支払額 / 2 + 12500;
        if (支払額 <= 100000) return 支払額 / 4 + 25000;
        return 50000;
      } else {
        if (支払額 <= 20000) return 支払額;
        if (支払額 <= 40000) return 支払額 / 2 + 10000;
        if (支払額 <= 80000) return 支払額 / 4 + 20000;
        return 40000;
      }
      return Math.min(支払額, 上限); // fallback
    }

    const 一般生保控除 = Math.max(
      生保控除計算(parseInt(生命保険旧)||0, true),
      生保控除計算(parseInt(生命保険新)||0, false)
    );
    const 介護医療控除 = 生保控除計算(parseInt(介護医療保険)||0, false);
    const 年金控除 = Math.max(
      生保控除計算(parseInt(個人年金旧)||0, true),
      生保控除計算(parseInt(個人年金新)||0, false)
    );
    // 生命保険料控除合計上限12万（新制度の場合）
    const 生保控除合計 = Math.min(一般生保控除 + 介護医療控除 + 年金控除, 120000);

    // 地震保険料控除（上限5万）
    const 地震N = parseInt(地震保険) || 0;
    const 地震控除 = Math.min(地震N, 50000);

    // 課税所得
    const 課税所得 = Math.max(0,
      給与所得 - 基礎控除額 - 配偶者控除額 - 扶養控除額 - 生保控除合計 - 地震控除
    );

    // 本来の年税額（復興特別税含む）
    const 年税額 = 所得税計算(課税所得) * 1.021;
    // 住宅ローン控除（税額控除）
    const 住ローN = parseInt(住宅ローン控除) || 0;
    const 確定税額 = Math.max(0, 年税額 - 住ローN);

    // 既納税額の自動推定（入力なければ月割で推定）
    const 既納N = parseInt(既納税額) || Math.round(確定税額 * 10 / 12); // 1〜10月分
    const 過不足 = 既納N - 確定税額;

    return {
      給与所得控除,
      給与所得,
      基礎控除額,
      配偶者控除額,
      扶養控除額,
      生保控除合計,
      地震控除,
      住宅ローン控除額: 住ローN,
      課税所得,
      年税額,
      確定税額,
      既納N,
      過不足, // 正=還付、負=追徴
    };
  }, [年収, 既納税額, 配偶者有, 配偶者年収, 扶養人数一般, 扶養人数特定,
      生命保険旧, 生命保険新, 介護医療保険, 個人年金旧, 個人年金新, 地震保険, 住宅ローン控除]);

  const 結果テキスト = 結果
    ? 結果.過不足 >= 0
      ? `還付金 ${fmt(結果.過不足)}円の見込み`
      : `追徴 ${fmt(結果.過不足)}円の見込み`
    : "";

  const 年収クイック = ["3000000","4000000","5000000","6000000","8000000","10000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="year-end-tax-adj" タイトル="年末調整 還付金・追徴額 計算機" 説明="配偶者・扶養・生命保険控除を反映して試算" カテゴリ="ビジネス・経理" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>年末調整 還付金・追徴額 計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💴 年末調整 還付金・追徴額 計算機</h1>
          <FavoriteButton slug="year-end-tax-adj" title="年末調整 還付金・追徴額 計算機" emoji="💴" />
          <p className="ツールページ説明">
            年収・各種控除を入力して還付金または追徴税額を概算。配偶者・扶養・生命保険・住宅ローン控除に対応。
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
                <label className="フィールドラベル">年収（額面・円）</label>
                <input type="number" className="数値入力" value={年収}
                  onChange={(e) => set年収(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {年収クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${年収 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set年収(v)}>
                      {(Number(v)/10000).toFixed(0)}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">今年の源泉徴収済み税額（円）※任意</label>
                <input type="number" className="数値入力" value={既納税額}
                  onChange={(e) => set既納税額(e.target.value)} min="0" step="1000"
                  placeholder="空白の場合は自動推定" />
                <span style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)" }}>
                  源泉徴収票の「源泉徴収税額」欄の数字
                </span>
              </div>

              {/* 配偶者 */}
              <div className={styles.セクション区切り}>人的控除</div>
              <label className={styles.チェックラベル}>
                <input type="checkbox" checked={配偶者有} onChange={(e) => set配偶者有(e.target.checked)}
                  style={{ accentColor: "var(--カラー-プライマリ)" }} />
                配偶者あり
              </label>
              {配偶者有 && (
                <div className="フィールドグループ" style={{ marginTop: "8px" }}>
                  <label className="フィールドラベル">配偶者の年収（円）</label>
                  <input type="number" className="数値入力" value={配偶者年収}
                    onChange={(e) => set配偶者年収(e.target.value)} min="0" step="10000" />
                </div>
              )}
              <div className={styles.条件グリッド}>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">一般扶養（〜18歳・23〜）</label>
                  <input type="number" className="数値入力" value={扶養人数一般}
                    onChange={(e) => set扶養人数一般(e.target.value)} min="0" max="10" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">特定扶養（19〜22歳）</label>
                  <input type="number" className="数値入力" value={扶養人数特定}
                    onChange={(e) => set扶養人数特定(e.target.value)} min="0" max="10" />
                </div>
              </div>

              {/* 生命保険 */}
              <div className={styles.セクション区切り}>生命保険料控除（年間支払額・円）</div>
              <div className={styles.条件グリッド}>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">一般生命（新制度）</label>
                  <input type="number" className="数値入力" value={生命保険新}
                    onChange={(e) => set生命保険新(e.target.value)} min="0" step="1000" placeholder="0" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">一般生命（旧制度）</label>
                  <input type="number" className="数値入力" value={生命保険旧}
                    onChange={(e) => set生命保険旧(e.target.value)} min="0" step="1000" placeholder="0" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">介護医療保険</label>
                  <input type="number" className="数値入力" value={介護医療保険}
                    onChange={(e) => set介護医療保険(e.target.value)} min="0" step="1000" placeholder="0" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">個人年金（新制度）</label>
                  <input type="number" className="数値入力" value={個人年金新}
                    onChange={(e) => set個人年金新(e.target.value)} min="0" step="1000" placeholder="0" />
                </div>
              </div>

              {/* 地震・住宅ローン */}
              <div className={styles.セクション区切り}>その他の控除（円）</div>
              <div className={styles.条件グリッド}>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">地震保険料（年間）</label>
                  <input type="number" className="数値入力" value={地震保険}
                    onChange={(e) => set地震保険(e.target.value)} min="0" step="1000" placeholder="0" />
                </div>
                <div className="フィールドグループ">
                  <label className="フィールドラベル">住宅ローン控除額（年間）</label>
                  <input type="number" className="数値入力" value={住宅ローン控除}
                    onChange={(e) => set住宅ローン控除(e.target.value)} min="0" step="1000" placeholder="0" />
                </div>
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">計算結果</div>

              {結果 ? (
                <div className={styles.結果コンテンツ}>
                  {/* メイン: 還付 or 追徴 */}
                  <div className={結果.過不足 >= 0 ? styles.還付カード : styles.追徴カード}>
                    <span className={styles.メインラベル}>{結果.過不足 >= 0 ? "還付金（見込み）" : "追徴税額（見込み）"}</span>
                    <span className={styles.メイン値}>
                      {結果.過不足 >= 0 ? "＋" : "－"}¥{fmt(結果.過不足)}
                    </span>
                    <span className={styles.サブ説明}>
                      {結果.過不足 >= 0 ? "翌年1月の給与で還付予定" : "12月の給与から追加徴収"}
                    </span>
                  </div>

                  {/* 控除内訳 */}
                  <div className="結果グリッド">
                    {[
                      { label: "給与所得控除",     value: `¥${fmt(結果.給与所得控除)}円` },
                      { label: "基礎控除",          value: `¥${fmt(結果.基礎控除額)}円` },
                      { label: "配偶者控除",        value: `¥${fmt(結果.配偶者控除額)}円` },
                      { label: "扶養控除",          value: `¥${fmt(結果.扶養控除額)}円` },
                      { label: "生命保険料控除",    value: `¥${fmt(結果.生保控除合計)}円` },
                      { label: "地震保険料控除",    value: `¥${fmt(結果.地震控除)}円` },
                    ].map((item) => (
                      <div key={item.label} className="結果カード">
                        <span className="結果ラベル">{item.label}</span>
                        <span className="結果値" style={{ fontSize: "0.95rem" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 税額計算フロー */}
                  <div className={styles.税額フロー}>
                    <div className={styles.フロー行}>
                      <span>課税所得</span>
                      <span>¥{fmt(結果.課税所得)}円</span>
                    </div>
                    <div className={styles.フロー行}>
                      <span>本来の年税額</span>
                      <span>¥{fmt(結果.年税額)}円</span>
                    </div>
                    {結果.住宅ローン控除額 > 0 && (
                      <div className={styles.フロー行}>
                        <span>住宅ローン控除（税額控除）</span>
                        <span style={{ color: "#10b981" }}>−¥{fmt(結果.住宅ローン控除額)}円</span>
                      </div>
                    )}
                    <div className={styles.フロー行強調}>
                      <span>確定税額</span>
                      <span>¥{fmt(結果.確定税額)}円</span>
                    </div>
                    <div className={styles.フロー行}>
                      <span>源泉徴収済み税額</span>
                      <span>¥{fmt(結果.既納N)}円</span>
                    </div>
                    <div className={結果.過不足 >= 0 ? styles.フロー還付 : styles.フロー追徴}>
                      <span>{結果.過不足 >= 0 ? "還付金" : "追徴税額"}</span>
                      <span>{結果.過不足 >= 0 ? "＋" : "－"}¥{fmt(結果.過不足)}円</span>
                    </div>
                  </div>

                  <div className={styles.注意}>
                    ※ 概算値です。医療費控除・雑損控除・ふるさと納税（確定申告）等は含まれません。
                  </div>
                </div>
              ) : (
                <p className="プレースホルダーメッセージ">年収を入力してください</p>
              )}
            </div>
          </div>

          {結果 && <>
              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }


          <ToolGuide slug="year-end-tax-adj" />
        </div>
      </main>
    </>
  );
}
