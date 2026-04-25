"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./freelance-tax.module.css";

const ツール定義 = {
  スラッグ: "freelance-tax",
  タイトル: "フリーランス手取りシミュレーター",
  説明: "年間売上・経費を入力して所得税・住民税・国保・年金を一括試算",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["💸 フリーランス手取りを計算。年収{result}の実態がわかった→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function pct(a: number, b: number) { return b > 0 ? ((a / b) * 100).toFixed(1) : "0.0"; }

// 所得税計算（2024年）
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
  const b = brackets.find((x) => 課税所得 <= x.limit) ?? brackets[brackets.length - 1];
  const 税額 = 課税所得 * b.rate - b.deduct;
  // 復興特別所得税 2.1%
  return 税額 * 1.021;
}

// 国民健康保険料（全国平均概算）
function 国保計算(所得: number): number {
  if (所得 <= 0) return 430000; // 最低限
  // 医療分：所得×8.0% + 均等割約4.5万
  // 後期高齢者支援：所得×2.5% + 均等割約1.3万
  // 介護（40-64歳）：所得×2.0% + 均等割約1.5万
  const 医療 = Math.max(0, 所得 * 0.075 + 45000);
  const 支援 = Math.max(0, 所得 * 0.023 + 13000);
  const total = 医療 + 支援;
  // 上限：医療65万 + 支援24万 = 89万
  return Math.min(total, 890000);
}

type 青色控除種別 = "65万円" | "10万円" | "なし";

export default function フリーランス手取りページ() {
  const [売上, set売上] = useState("8000000");
  const [経費, set経費] = useState("2000000");
  const [青色控除, set青色控除] = useState<青色控除種別>("65万円");
  const [追加控除, set追加控除] = useState("0");
  const [インボイス, setインボイス] = useState(false);

  const 結果 = useMemo(() => {
    const 年商 = parseInt(売上) || 0;
    const 年経費 = parseInt(経費) || 0;
    const 追加 = parseInt(追加控除) || 0;

    const 青色控除額 = 青色控除 === "65万円" ? 650000 : 青色控除 === "10万円" ? 100000 : 0;
    const 基礎控除 = 480000; // 48万円

    // 事業所得（利益）
    const 事業所得 = Math.max(0, 年商 - 年経費 - 青色控除額);
    // 課税所得
    const 課税所得 = Math.max(0, 事業所得 - 基礎控除 - 追加);

    const 所得税 = 所得税計算(課税所得);
    const 住民税 = 事業所得 > 基礎控除 ? 課税所得 * 0.10 + 5000 : 5000; // 均等割5千円
    const 国保 = 国保計算(事業所得);
    const 国民年金 = 199980; // 2024年：月16,590円×12

    // インボイス登録の場合の消費税負担（簡易課税未選択・2割特例なしの概算）
    const 消費税負担 = インボイス ? Math.max(0, 年商 * 0.1 * 0.4) : 0; // 仕入れ等差引概算

    const 総負担 = 所得税 + 住民税 + 国保 + 国民年金 + 消費税負担;
    const 手取り = 年商 - 年経費 - 総負担;

    return {
      年商, 年経費, 事業所得, 課税所得,
      所得税, 住民税, 国保, 国民年金, 消費税負担,
      総負担, 手取り,
      実効負担率: pct(総負担, 年商 - 年経費),
    };
  }, [売上, 経費, 青色控除, 追加控除, インボイス]);

  const 結果テキスト = `年商${fmt(結果.年商)}円→手取り${fmt(Math.max(0, 結果.手取り))}円`;

  const 売上クイック = ["3000000","5000000","8000000","10000000","15000000","20000000"];
  const 経費クイック = ["500000","1000000","2000000","3000000","5000000"];

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
              <li>フリーランス手取りシミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💸 フリーランス手取りシミュレーター</h1>
          <p className="ツールページ説明">
            年間売上・経費を入力するだけで、所得税・住民税・国民健康保険・国民年金を一括計算。
            青色申告特別控除・インボイス消費税も対応。独立前の資金計画に。
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
                <label className="フィールドラベル">年間売上（税込）</label>
                <input type="number" className="数値入力" value={売上}
                  onChange={(e) => set売上(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {売上クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${売上 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set売上(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">年間経費（交通費・通信費・外注費など）</label>
                <input type="number" className="数値入力" value={経費}
                  onChange={(e) => set経費(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {経費クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${経費 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set経費(v)}>
                      {Number(v)/10000}万
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">青色申告特別控除</label>
                <div className={styles.税率選択}>
                  {(["65万円", "10万円", "なし"] as 青色控除種別[]).map((m) => (
                    <button key={m}
                      className={`${styles.税率ボタン} ${青色控除 === m ? styles.税率ボタンアクティブ : ""}`}
                      onClick={() => set青色控除(m)}>{m}</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px", lineHeight: 1.6 }}>
                  65万円：e-Tax申告でフルに節税 ／ 10万円：簡易帳簿 ／ なし：白色申告
                </p>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">追加控除（基礎控除以外）</label>
                <input type="number" className="数値入力" value={追加控除}
                  onChange={(e) => set追加控除(e.target.value)} min="0" step="10000"
                  placeholder="生命保険・ふるさと納税・医療費控除など" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">インボイス登録</label>
                <div className={styles.税率選択}>
                  <button
                    className={`${styles.税率ボタン} ${!インボイス ? styles.税率ボタンアクティブ : ""}`}
                    onClick={() => setインボイス(false)}>免税事業者</button>
                  <button
                    className={`${styles.税率ボタン} ${インボイス ? styles.税率ボタンアクティブ : ""}`}
                    onClick={() => setインボイス(true)}>課税事業者</button>
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px", lineHeight: 1.6 }}>
                  課税事業者：消費税納付（原則課税の概算値）を含めて試算します
                </p>
              </div>

              <div className={styles.注意書き}>
                ※ 本ツールは概算です。国保は全国平均値で計算（地域差あり）。
                実際の申告は税理士・税務署にご相談ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {/* 手取りメインカード */}
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>年間手取り額（概算）</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(Math.max(0, 結果.手取り))}
                    <span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.月換算}>月換算 約{fmt(Math.max(0, 結果.手取り) / 12)}円</span>
                  <span className={styles.実効税率}>実質負担率 {結果.実効負担率}%（利益に対する税・社保合計）</span>
                </div>

                {/* 内訳フロー */}
                <div className={styles.フロー}>
                  <div className={styles.フロー行}>
                    <span>年間売上</span>
                    <span className={styles.プラス}>+¥{fmt(結果.年商)}円</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>年間経費</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.年経費)}円</span>
                  </div>
                  <div className={`${styles.フロー行} ${styles.フロー小計}`}>
                    <span>事業利益（売上－経費）</span>
                    <span>¥{fmt(結果.事業所得)}円</span>
                  </div>
                  <div className={styles.フロー仕切り} />
                  <div className={styles.フロー行}>
                    <span>所得税（復興税込）</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.所得税)}円</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>住民税（10%）</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.住民税)}円</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>国民健康保険料</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.国保)}円</span>
                  </div>
                  <div className={styles.フロー行}>
                    <span>国民年金保険料</span>
                    <span className={styles.マイナス}>-¥{fmt(結果.国民年金)}円</span>
                  </div>
                  {インボイス && (
                    <div className={styles.フロー行}>
                      <span>消費税納付（概算）</span>
                      <span className={styles.マイナス}>-¥{fmt(結果.消費税負担)}円</span>
                    </div>
                  )}
                  <div className={styles.フロー仕切り} />
                  <div className={`${styles.フロー行} ${styles.フロー合計}`}>
                    <span>年間手取り</span>
                    <span className={styles.手取り値}>¥{fmt(Math.max(0, 結果.手取り))}円</span>
                  </div>
                </div>

                {/* 税・社保 グリッド */}
                <div className="結果グリッド">
                  {[
                    { label: "所得税", value: `¥${fmt(結果.所得税)}円`, color: "#f25acc" },
                    { label: "住民税", value: `¥${fmt(結果.住民税)}円`, color: "#f59e0b" },
                    { label: "国民健康保険", value: `¥${fmt(結果.国保)}円`, color: "#6366f1" },
                    { label: "国民年金", value: `¥${fmt(結果.国民年金)}円`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ fontSize: "1rem", color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* 節税ヒント */}
                <div className={styles.ヒントカード}>
                  <div className={styles.ヒントタイトル}>💡 節税ポイント</div>
                  <div className={styles.ヒント行}>
                    <span>青色申告65万円控除で</span>
                    <span className={styles.ヒント値}>最大約{fmt(650000 * 0.33)}円節税</span>
                  </div>
                  <div className={styles.ヒント行}>
                    <span>小規模企業共済（掛金控除）</span>
                    <span className={styles.ヒント値}>月最大7万円（年84万）</span>
                  </div>
                  <div className={styles.ヒント行}>
                    <span>iDeCo（個人型確定拠出年金）</span>
                    <span className={styles.ヒント値}>月最大6.8万円全額控除</span>
                  </div>
                </div>
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
