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
import styles from "./inheritance-tax.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "inheritance-tax",
  タイトル: "相続税シミュレーター",
  説明: "相続財産・法定相続人数から相続税の目安を試算",
  カテゴリ: "士業・法務",
  category: "Legal",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📋 相続税をシミュレーション。財産{result}の場合の税額が判明→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function 万(n: number) { return `${Math.round(n / 10000)}万`; }

// 相続税の税率表
function 相続税計算(課税遺産: number): number {
  if (課税遺産 <= 0) return 0;
  const brackets = [
    { limit: 10000000,  rate: 0.10, deduct: 0 },
    { limit: 30000000,  rate: 0.15, deduct: 500000 },
    { limit: 50000000,  rate: 0.20, deduct: 2000000 },
    { limit: 100000000, rate: 0.30, deduct: 7000000 },
    { limit: 200000000, rate: 0.40, deduct: 17000000 },
    { limit: 300000000, rate: 0.45, deduct: 27000000 },
    { limit: 600000000, rate: 0.50, deduct: 42000000 },
    { limit: Infinity,  rate: 0.55, deduct: 72000000 },
  ];
  const b = brackets.find((x) => 課税遺産 <= x.limit) ?? brackets[brackets.length - 1];
  return Math.max(0, 課税遺産 * b.rate - b.deduct);
}

export default function 相続税シミュレーターページ() {
  const [財産, set財産] = useState("50000000");
  const [相続人数, set相続人数] = useState("2");
  const [うち子, setうち子] = useState("2");
  const [配偶者あり, set配偶者あり] = useState(true);
  const [債務, set債務] = useState("0");
  const [葬儀費用, set葬儀費用] = useState("1500000");

  const 結果 = useMemo(() => {
    const 総財産 = parseInt(財産) || 0;
    const 人数 = Math.max(1, parseInt(相続人数) || 1);
    const 子供数 = Math.max(0, parseInt(うち子) || 0);
    const 負債 = parseInt(債務) || 0;
    const 葬儀 = parseInt(葬儀費用) || 0;

    // 正味遺産額
    const 正味遺産 = 総財産 - 負債 - 葬儀;

    // 基礎控除：3,000万 + 600万 × 法定相続人数
    const 基礎控除 = 30000000 + 6000000 * 人数;

    // 課税遺産総額
    const 課税遺産総額 = Math.max(0, 正味遺産 - 基礎控除);

    if (課税遺産総額 === 0) {
      return { 課税遺産総額: 0, 基礎控除, 正味遺産, 総税額: 0, 配偶者控除後: 0, 実効税率: 0, 非課税: true };
    }

    // 法定相続分で按分して税額計算
    // 配偶者 1/2、子供 合計1/2（または全額）
    let 配偶者法定分 = 0;
    let 子法定分 = 0;
    if (配偶者あり && 子供数 > 0) {
      配偶者法定分 = 0.5;
      子法定分 = 0.5 / 子供数;
    } else if (配偶者あり) {
      配偶者法定分 = 1.0;
    } else {
      子法定分 = 1.0 / 子供数;
    }

    let 相続税総額 = 0;
    if (配偶者あり) {
      相続税総額 += 相続税計算(課税遺産総額 * 配偶者法定分);
    }
    for (let i = 0; i < 子供数; i++) {
      相続税総額 += 相続税計算(課税遺産総額 * 子法定分);
    }
    if (!配偶者あり && 子供数 === 0) {
      相続税総額 = 相続税計算(課税遺産総額);
    }

    // 配偶者税額軽減：配偶者の法定相続分または1億6千万円のいずれか大きい額まで非課税
    const 配偶者控除対象 = Math.min(課税遺産総額 * 配偶者法定分, 課税遺産総額);
    const 配偶者税額軽減 = 配偶者あり
      ? 相続税計算(Math.min(課税遺産総額 * 配偶者法定分, 160000000))
      : 0;

    const 配偶者控除後 = Math.max(0, 相続税総額 - 配偶者税額軽減);
    const 実効税率 = 総財産 > 0 ? (配偶者控除後 / 総財産) * 100 : 0;

    return {
      課税遺産総額, 基礎控除, 正味遺産, 総税額: 相続税総額,
      配偶者控除後, 配偶者税額軽減, 実効税率, 非課税: false,
    };
  }, [財産, 相続人数, うち子, 配偶者あり, 債務, 葬儀費用]);

  const 結果テキスト = 結果.非課税
    ? "基礎控除内のため相続税は0円"
    : `相続税概算 ¥${fmt(結果.配偶者控除後)}（実効税率${結果.実効税率.toFixed(1)}%）`;

  const 財産クイック = ["10000000","30000000","50000000","100000000","200000000","500000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="inheritance-tax" タイトル="相続税シミュレーター" 説明="相続財産・法定相続人数から相続税の目安を試算" カテゴリ="士業・法務" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-legal">士業・法務</Link></li>
              <li aria-hidden="true">›</li>
              <li>相続税シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📋 相続税シミュレーター（2024年対応）</h1>
          <FavoriteButton slug="inheritance-tax" title="相続税シミュレーター" emoji="📋" />
          <p className="ツールページ説明">
            相続財産と法定相続人の数を入力するだけで、基礎控除・課税遺産総額・相続税の概算を試算。
            配偶者税額軽減も考慮。相続税の準備・対策の第一歩に。
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
                <label className="フィールドラベル">相続財産の合計（不動産・預貯金・有価証券など）</label>
                <input type="number" className="数値入力" value={財産}
                  onChange={(e) => set財産(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {財産クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${財産 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set財産(v)}>
                      {Number(v) >= 100000000 ? `${Number(v)/100000000}億` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">配偶者</label>
                <div className={styles.税率選択}>
                  <button
                    className={`${styles.税率ボタン} ${配偶者あり ? styles.税率ボタンアクティブ : ""}`}
                    onClick={() => set配偶者あり(true)}>あり</button>
                  <button
                    className={`${styles.税率ボタン} ${!配偶者あり ? styles.税率ボタンアクティブ : ""}`}
                    onClick={() => set配偶者あり(false)}>なし</button>
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">法定相続人の総数（配偶者含む）</label>
                <input type="number" className="数値入力" value={相続人数}
                  onChange={(e) => set相続人数(e.target.value)} min="1" max="10" />
                <div className={styles.クイック群}>
                  {["1","2","3","4","5"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${相続人数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set相続人数(v)}>{v}人</button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--カラー-テキスト極薄)", marginTop: "4px" }}>
                  基礎控除 = 3,000万 + 600万 × 法定相続人数
                </p>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">うち子供の人数</label>
                <div className={styles.クイック群}>
                  {["0","1","2","3","4"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${うち子 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => setうち子(v)}>{v}人</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">債務・借入（ローン残債など）</label>
                <input type="number" className="数値入力" value={債務}
                  onChange={(e) => set債務(e.target.value)} min="0" step="500000" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">葬儀費用（相続財産から控除可）</label>
                <input type="number" className="数値入力" value={葬儀費用}
                  onChange={(e) => set葬儀費用(e.target.value)} min="0" step="100000" />
              </div>

              <div className={styles.注意書き}>
                ※ 本ツールは概算です。小規模宅地特例・生命保険非課税枠・贈与加算などは含みません。
                正確な試算は税理士にご相談ください。
              </div>
            </div>

            {/* ─── 結果 ─── */}
            <div className="結果セクション">
              <div className="結果見出し">試算結果</div>

              <div className={styles.結果コンテンツ}>
                {結果.非課税 ? (
                  <div className={styles.非課税カード}>
                    <div className={styles.非課税アイコン}>✅</div>
                    <div className={styles.非課税タイトル}>相続税はかかりません</div>
                    <div className={styles.非課税説明}>
                      正味遺産額 ¥{fmt(結果.正味遺産)}円 が
                      基礎控除額 ¥{fmt(結果.基礎控除)}円 以下のため、
                      相続税の申告・納付は不要です。
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.メインカード}>
                      <span className={styles.メインラベル}>相続税概算（配偶者控除後）</span>
                      <span className={styles.メイン値}>
                        ¥{fmt(結果.配偶者控除後)}<span className={styles.メイン単位}>円</span>
                      </span>
                      <span className={styles.実効税率}>実効税率 {結果.実効税率.toFixed(1)}%</span>
                    </div>

                    <div className={styles.フロー}>
                      <div className={styles.フロー行}>
                        <span>相続財産</span>
                        <span>¥{fmt(parseInt(財産))}円</span>
                      </div>
                      <div className={styles.フロー行}>
                        <span>債務・葬儀費用</span>
                        <span className={styles.マイナス}>-¥{fmt((parseInt(債務)||0) + (parseInt(葬儀費用)||0))}円</span>
                      </div>
                      <div className={`${styles.フロー行} ${styles.フロー小計}`}>
                        <span>正味遺産額</span>
                        <span>¥{fmt(結果.正味遺産)}円</span>
                      </div>
                      <div className={styles.フロー行}>
                        <span>基礎控除</span>
                        <span className={styles.マイナス}>-¥{fmt(結果.基礎控除)}円</span>
                      </div>
                      <div className={`${styles.フロー行} ${styles.フロー小計}`}>
                        <span>課税遺産総額</span>
                        <span>¥{fmt(結果.課税遺産総額)}円</span>
                      </div>
                      <div className={styles.フロー行}>
                        <span>相続税総額（法定相続分按分）</span>
                        <span className={styles.マイナス}>¥{fmt(結果.総税額)}円</span>
                      </div>
                      {配偶者あり && (
                        <div className={styles.フロー行}>
                          <span>配偶者税額軽減</span>
                          <span className={styles.マイナス} style={{ color: "#10b981" }}>-¥{fmt(結果.配偶者税額軽減 ?? 0)}円</span>
                        </div>
                      )}
                      <div className={styles.フロー仕切り} />
                      <div className={`${styles.フロー行} ${styles.フロー合計}`}>
                        <span>概算相続税</span>
                        <span className={styles.合計値}>¥{fmt(結果.配偶者控除後)}円</span>
                      </div>
                    </div>

                    {/* 基礎控除チェック */}
                    <div className={styles.ヒントカード}>
                      <div className={styles.ヒントタイトル}>💡 節税ポイント</div>
                      <div className={styles.ヒント行}>
                        <span>生命保険の非課税枠</span>
                        <span className={styles.ヒント値}>500万×{相続人数}人={万(5000000 * parseInt(相続人数))}</span>
                      </div>
                      <div className={styles.ヒント行}>
                        <span>暦年贈与（年110万×10年）</span>
                        <span className={styles.ヒント値}>子1人あたり最大1,100万</span>
                      </div>
                      <div className={styles.ヒント行}>
                        <span>小規模宅地特例（居住用）</span>
                        <span className={styles.ヒント値}>最大80%評価減</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="inheritance-tax" />
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
