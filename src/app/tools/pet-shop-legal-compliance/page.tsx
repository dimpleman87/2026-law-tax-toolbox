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
import styles from "./pet-shop-legal-compliance.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-shop-legal-compliance",
  タイトル: "動物愛護法改正 施設基準対応コスト試算ツール",
  説明: "ブリーダー・ペットショップの設備投資コストを試算",
  カテゴリ: "ペット",
  category: "pet",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐾 動物愛護法改正対応の設備投資を試算。改正対応コスト¥{result}を確認→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function 動物愛護法対応コスト試算ページ() {
  const [ケージ数, setケージ数] = useState("20");
  const [ケージ非適合数, setケージ非適合数] = useState("10");
  const [空調設備未整備, set空調設備未整備] = useState(true);
  const [夜間展示区画未対応, set夜間展示区画未対応] = useState(true);
  const [追加スタッフ必要, set追加スタッフ必要] = useState(false);
  const [資格取得必要人数, set資格取得必要人数] = useState("1");
  const [施設面積, set施設面積] = useState("30");

  const 結果 = useMemo(() => {
    const 非適合ケージ = parseInt(ケージ非適合数) || 0;
    const 資格人数 = parseInt(資格取得必要人数) || 0;
    const 面積 = parseInt(施設面積) || 0;

    const ケージ更新費 = 非適合ケージ * 30000; // 1ケージ3万円想定
    const 空調費 = 空調設備未整備 ? 面積 * 8000 : 0; // 坪8000円
    const 夜間区画費 = 夜間展示区画未対応 ? 200000 : 0; // 仕切り工事20万
    const スタッフ費 = 追加スタッフ必要 ? 250000 * 12 : 0; // 月25万×12
    const 資格費 = 資格人数 * 50000; // 1人5万
    const 合計 = ケージ更新費 + 空調費 + 夜間区画費 + スタッフ費 + 資格費;
    const 月額換算 = Math.ceil(合計 / 36); // 3年分割

    return { ケージ更新費, 空調費, 夜間区画費, スタッフ費, 資格費, 合計, 月額換算 };
  }, [ケージ非適合数, 空調設備未整備, 夜間展示区画未対応, 追加スタッフ必要, 資格取得必要人数, 施設面積]);

  const 結果テキスト = `動物愛護法改正対応コスト合計¥${fmt(結果.合計)}（月割¥${fmt(結果.月額換算)}）`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-shop-legal-compliance" タイトル="動物愛護法改正 施設基準対応コスト試算ツール" 説明="ブリーダー・ペットショップの設備投資コストを試算" カテゴリ="ペット" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>動物愛護法改正 対応コスト試算</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐾 動物愛護法改正 施設基準対応コスト試算ツール</h1>
          <FavoriteButton slug="pet-shop-legal-compliance" title="動物愛護法改正 施設基準対応コスト試算ツール" emoji="🐾" />
          <p className="ツールページ説明">
            ケージサイズ・空調設備・夜間展示対応の現況を入力するだけで
            動物愛護法改正への対応に必要な設備投資コストを概算。補助金申請の根拠にも。
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
                { label: "現在のケージ総数（個）", val: ケージ数, set: setケージ数, step: "5" },
                { label: "うち基準サイズ非適合ケージ数（個）", val: ケージ非適合数, set: setケージ非適合数, step: "1" },
                { label: "施設面積（㎡）", val: 施設面積, set: set施設面積, step: "5" },
                { label: "資格取得が必要なスタッフ数（人）", val: 資格取得必要人数, set: set資格取得必要人数, step: "1" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">対応が必要な項目</label>
                <div className={styles.チェック群}>
                  {[
                    { label: "温度・湿度・換気設備が未整備", val: 空調設備未整備, set: set空調設備未整備 },
                    { label: "夜間展示禁止（20時以降）への区画対応が未実施", val: 夜間展示区画未対応, set: set夜間展示区画未対応 },
                    { label: "動物管理スタッフの追加が必要", val: 追加スタッフ必要, set: set追加スタッフ必要 },
                  ].map((c) => (
                    <label key={c.label} className={styles.チェックラベル}>
                      <input type="checkbox" checked={c.val} onChange={(e) => c.set(e.target.checked)} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">対応コスト試算</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>対応コスト合計</span>
                  <span className={styles.メイン値}>¥{fmt(結果.合計)}<span className={styles.メイン単位}>円</span></span>
                  <span className={styles.メインサブ}>3年分割の場合 月¥{fmt(結果.月額換算)}</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "ケージ更新費", value: `¥${fmt(結果.ケージ更新費)}`, color: "#10b981" },
                    { label: "空調・環境設備費", value: `¥${fmt(結果.空調費)}`, color: "#06b6d4" },
                    { label: "夜間区画工事費", value: `¥${fmt(結果.夜間区画費)}`, color: "#f59e0b" },
                    { label: "資格取得費", value: `¥${fmt(結果.資格費)}`, color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>費用内訳（概算）</div>
                  {[
                    { label: `ケージ更新（${ケージ非適合数}個×¥30,000）`, value: `¥${fmt(結果.ケージ更新費)}` },
                    { label: `空調・換気設備整備（${施設面積}㎡）`, value: `¥${fmt(結果.空調費)}` },
                    { label: "夜間展示区画仕切り工事", value: `¥${fmt(結果.夜間区画費)}` },
                    { label: `スタッフ人件費追加（年間）`, value: `¥${fmt(結果.スタッフ費)}` },
                    { label: `資格取得費（${資格取得必要人数}人×¥50,000）`, value: `¥${fmt(結果.資格費)}` },
                    { label: "合計", value: `¥${fmt(結果.合計)}` },
                  ].map((row, i) => (
                    <div key={row.label} className={`${styles.内訳行} ${i === 5 ? styles.内訳合計 : ""}`}>
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


          <ToolGuide slug="pet-shop-legal-compliance" />
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
