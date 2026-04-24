"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./company-setup-cost.module.css";

const ツール定義 = {
  スラッグ: "company-setup-cost",
  タイトル: "会社設立コストシミュレーター",
  説明: "株式会社・合同会社の設立実費を即算出",
  カテゴリ: "ビジネス・経理",
  category: "Business",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🏢 会社設立費用を計算したら{result}でした。起業コストを確認→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 法人種別 = "株式会社" | "合同会社";
type 定款種別 = "紙の定款（印紙4万円）" | "電子定款（印紙0円）";

export default function 会社設立コストページ() {
  const [法人, set法人] = useState<法人種別>("株式会社");
  const [資本金, set資本金] = useState("1000000");
  const [定款, set定款] = useState<定款種別>("電子定款（印紙0円）");

  const 結果 = useMemo(() => {
    const 金額 = parseInt(資本金) || 0;

    // 登録免許税
    // 株式会社：資本金 × 0.7%（最低15万円）
    // 合同会社：資本金 × 0.7%（最低6万円）
    const 最低登録免許 = 法人 === "株式会社" ? 150000 : 60000;
    const 算出登録免許 = Math.floor(金額 * 0.007);
    const 登録免許税 = Math.max(最低登録免許, 算出登録免許);

    // 定款印紙代
    const 印紙代 = 定款 === "紙の定款（印紙4万円）" ? 40000 : 0;

    // 定款認証手数料（株式会社のみ・電子認証込み）
    // 2024年改正：資本金100万未満→3万、100〜500万→4万、500万超→5万
    let 定款認証 = 0;
    if (法人 === "株式会社") {
      if (金額 < 1000000) 定款認証 = 30000;
      else if (金額 < 5000000) 定款認証 = 40000;
      else 定款認証 = 50000;
    }

    // 謄本代（定款3通）
    const 謄本代 = 法人 === "株式会社" ? 2000 : 0;

    // 設立登記申請の実費（登録免許税以外）
    // 印鑑証明書・住民票等: 約3,000〜5,000円
    const 証明書代 = 3000;

    // 印鑑作成（法人実印・銀行印・認印セット）
    const 印鑑代 = 20000;

    // その他雑費（謄本取得・交通費等）
    const 雑費 = 10000;

    const 法定実費 = 登録免許税 + 印紙代 + 定款認証 + 謄本代 + 証明書代;
    const 総合計 = 法定実費 + 印鑑代 + 雑費;
    const 電子定款節約 = 定款 === "紙の定款（印紙4万円）" ? 40000 : 0;
    const 合同会社比較 = 法人 === "株式会社"
      ? 登録免許税 + 印紙代 + 定款認証 - (Math.max(60000, Math.floor(金額 * 0.007)))
      : 0;

    return {
      金額, 登録免許税, 印紙代, 定款認証, 謄本代, 証明書代,
      印鑑代, 雑費, 法定実費, 総合計, 電子定款節約, 合同会社比較,
    };
  }, [資本金, 法人, 定款]);

  const 結果テキスト = `${法人}設立実費 合計¥${fmt(結果.総合計)}（資本金¥${fmt(結果.金額)})`;

  const 資本金クイック = ["100000","300000","1000000","3000000","5000000","10000000"];

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-business">ビジネス・経理</Link></li>
              <li aria-hidden="true">›</li>
              <li>会社設立コストシミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏢 会社設立コストシミュレーター</h1>
          <p className="ツールページ説明">
            株式会社・合同会社の設立にかかる登録免許税・定款認証手数料・収入印紙代など
            法定実費を全て積み上げて試算。電子定款の節税効果も計算。
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
                <label className="フィールドラベル">設立する法人の種類</label>
                <div className={styles.選択群}>
                  {(["株式会社", "合同会社"] as 法人種別[]).map((v) => (
                    <button key={v}
                      className={`${styles.選択ボタン} ${法人 === v ? styles.選択ボタンアクティブ : ""}`}
                      onClick={() => set法人(v)}>
                      {v === "株式会社" ? "🏛️ 株式会社" : "🤝 合同会社（LLC）"}
                      <span className={styles.選択サブ}>
                        {v === "株式会社" ? "登録免許税 最低15万" : "登録免許税 最低6万"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">想定資本金（円）</label>
                <input type="number" className="数値入力" value={資本金}
                  onChange={(e) => set資本金(e.target.value)} min="0" step="100000" />
                <div className={styles.クイック群}>
                  {資本金クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${資本金 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set資本金(v)}>
                      {Number(v) >= 1000000 ? `${Number(v)/10000}万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">定款の作成方法</label>
                <div className={styles.選択群}>
                  {(["電子定款（印紙0円）", "紙の定款（印紙4万円）"] as 定款種別[]).map((v) => (
                    <button key={v}
                      className={`${styles.選択ボタン} ${定款 === v ? styles.選択ボタンアクティブ : ""}`}
                      onClick={() => set定款(v)}>
                      {v === "電子定款（印紙0円）" ? "💻 電子定款（推奨）" : "📄 紙の定款"}
                      <span className={styles.選択サブ}>
                        {v === "電子定款（印紙0円）" ? "収入印紙4万円が不要" : "収入印紙4万円が必要"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.比較メモ}>
                <div className={styles.比較メモタイトル}>📊 株式会社 vs 合同会社（費用比較）</div>
                <div className={styles.比較メモ行}>
                  <span>登録免許税</span>
                  <span style={{ color: "#f25acc" }}>株: 最低15万</span>
                  <span style={{ color: "#10b981" }}>合: 最低6万</span>
                </div>
                <div className={styles.比較メモ行}>
                  <span>定款認証手数料</span>
                  <span style={{ color: "#f25acc" }}>株: 3〜5万</span>
                  <span style={{ color: "#10b981" }}>合: 不要</span>
                </div>
                <div className={styles.比較メモ行}>
                  <span>社会的信用・上場可能</span>
                  <span style={{ color: "#10b981" }}>株: ◎</span>
                  <span style={{ color: "#f59e0b" }}>合: △</span>
                </div>
              </div>

              <div className={styles.注意書き}>
                ※ 登録免許税は資本金×0.7%（最低額以上）。印鑑代・雑費は目安です。
                司法書士への登記代行費用（5〜15万）は含まれません。
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">設立費用見積</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>設立費用 総合計（概算）</span>
                  <span className={styles.メイン値}>¥{fmt(結果.総合計)}<span className={styles.メイン単位}>円</span></span>
                  <span className={styles.メインサブ}>うち法定実費 ¥{fmt(結果.法定実費)}</span>
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>費用内訳</div>
                  {[
                    { label: "登録免許税", value: 結果.登録免許税, color: "#f25acc", note: "法務局へ" },
                    ...(結果.印紙代 > 0 ? [{ label: "収入印紙代", value: 結果.印紙代, color: "#f97316", note: "紙定款のみ" }] : []),
                    ...(結果.定款認証 > 0 ? [{ label: "定款認証手数料", value: 結果.定款認証, color: "#f59e0b", note: "公証役場へ" }] : []),
                    ...(結果.謄本代 > 0 ? [{ label: "定款謄本代", value: 結果.謄本代, color: "#a78bfa", note: "公証役場" }] : []),
                    { label: "印鑑証明書等", value: 結果.証明書代, color: "#6366f1", note: "各種証明" },
                    { label: "法人印鑑セット", value: 結果.印鑑代, color: "#06b6d4", note: "目安" },
                    { label: "雑費（交通費等）", value: 結果.雑費, color: "#10b981", note: "目安" },
                  ].map((item) => (
                    <div key={item.label} className={styles.内訳行}>
                      <span>{item.label}<small className={styles.内訳注記}> {item.note}</small></span>
                      <span style={{ color: item.color, fontWeight: 700 }}>¥{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className={styles.内訳合計}>
                    <span>合計</span>
                    <span>¥{fmt(結果.総合計)}</span>
                  </div>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "法定実費合計", value: `¥${fmt(結果.法定実費)}`, color: "#f25acc" },
                    { label: "登録免許税", value: `¥${fmt(結果.登録免許税)}`, color: "#f97316" },
                    ...(定款 === "電子定款（印紙0円）" ? [{ label: "電子定款節税額", value: "¥40,000", color: "#10b981" }] : [{ label: "収入印紙代", value: "¥40,000", color: "#f59e0b" }]),
                    { label: "設立総費用", value: `¥${fmt(結果.総合計)}`, color: "#06b6d4" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {法人 === "株式会社" && (
                  <div className={styles.ヒント}>
                    <div className={styles.ヒントタイトル}>💡 合同会社にした場合の節約額</div>
                    <p>同条件で合同会社を選択した場合、登録免許税・定款認証手数料の差で
                    約¥{fmt(Math.max(0, 結果.登録免許税 + 結果.定款認証 - Math.max(60000, Math.floor(結果.金額 * 0.007))))}の節約が可能。</p>
                  </div>
                )}
              </div>

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
