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
import styles from "./pet-microchip-registration.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "pet-microchip-registration",
  タイトル: "ペットマイクロチップ費用計算機",
  説明: "マイクロチップ装着・登録にかかる費用を地域別に試算",
  カテゴリ: "ペット",
  category: "pet",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🐾 ペットのマイクロチップ費用を試算。装着から登録まで¥{result}が目安→"],
};

type 地域 = "関東・関西" | "中部・東北" | "北海道・九州・沖縄";
type 動物種別 = "犬" | "猫" | "その他";

const 装着費相場: Record<地域, { 動物病院: number; 自治体: number }> = {
  "関東・関西":       { 動物病院: 8000, 自治体: 3000 },
  "中部・東北":       { 動物病院: 6500, 自治体: 2500 },
  "北海道・九州・沖縄": { 動物病院: 6000, 自治体: 2000 },
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function マイクロチップ費用計算機ページ() {
  const [地域, set地域] = useState<地域>("関東・関西");
  const [動物種別, set動物種別] = useState<動物種別>("犬");
  const [頭数, set頭数] = useState("1");
  const [自治体窓口, set自治体窓口] = useState(false);
  const [狂犬病同時, set狂犬病同時] = useState(false);

  const 結果 = useMemo(() => {
    const 数 = parseInt(頭数) || 1;
    const 相場 = 装着費相場[地域];
    const 装着費 = (自治体窓口 ? 相場.自治体 : 相場.動物病院) * 数;
    const 登録料 = 1050; // 公益社団法人日本獣医師会 AIPO登録料
    const 登録合計 = 登録料 * 数;
    const 狂犬病 = 動物種別 === "犬" && 狂犬病同時 ? 3000 * 数 : 0;
    const 合計 = 装着費 + 登録合計 + 狂犬病;
    const 一頭あたり = Math.round(合計 / 数);

    return { 装着費, 登録合計, 狂犬病, 合計, 一頭あたり, 登録料 };
  }, [地域, 動物種別, 頭数, 自治体窓口, 狂犬病同時]);

  const 結果テキスト = `マイクロチップ費用（${頭数}頭）：¥${fmt(結果.合計)}（1頭¥${fmt(結果.一頭あたり)})`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="pet-microchip-registration" タイトル="ペットマイクロチップ費用計算機" 説明="マイクロチップ装着・登録にかかる費用を地域別に試算" カテゴリ="ペット" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-pet">ペット</Link></li>
              <li aria-hidden="true">›</li>
              <li>ペットマイクロチップ費用計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐾 ペットマイクロチップ費用計算機</h1>
          <FavoriteButton slug="pet-microchip-registration" title="ペットマイクロチップ費用計算機" emoji="🐾" />
          <p className="ツールページ説明">
            2022年6月より販売業者への装着義務化。装着費・登録料・狂犬病ワクチン同時接種費を
            地域・頭数・施設別に合計金額を即算出。
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
                <label className="フィールドラベル">地域</label>
                <div className={styles.クイック群}>
                  {(["関東・関西","中部・東北","北海道・九州・沖縄"] as 地域[]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${地域 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set地域(v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">動物種別</label>
                <div className={styles.クイック群}>
                  {(["犬","猫","その他"] as 動物種別[]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${動物種別 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set動物種別(v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">頭数</label>
                <input type="number" className="数値入力" value={頭数}
                  onChange={(e) => set頭数(e.target.value)} min="1" step="1" />
                <div className={styles.クイック群}>
                  {["1","2","3","5"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${頭数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set頭数(v)}>{v}頭</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">オプション</label>
                <div className={styles.チェック群}>
                  <label className={styles.チェックラベル}>
                    <input type="checkbox" checked={自治体窓口} onChange={(e) => set自治体窓口(e.target.checked)} />
                    <span>自治体・集合接種会場で装着（割安）</span>
                  </label>
                  {動物種別 === "犬" && (
                    <label className={styles.チェックラベル}>
                      <input type="checkbox" checked={狂犬病同時} onChange={(e) => set狂犬病同時(e.target.checked)} />
                      <span>狂犬病ワクチン同時接種（犬のみ）</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">費用シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>合計費用（{頭数}頭）</span>
                  <span className={styles.メイン値}>
                    ¥{fmt(結果.合計)}<span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.メインサブ}>1頭あたり ¥{fmt(結果.一頭あたり)}円</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "装着費（施設別）", value: `¥${fmt(結果.装着費)}`, color: "#10b981" },
                    { label: "AIPO登録料", value: `¥${fmt(結果.登録合計)}`, color: "#06b6d4" },
                    { label: "狂犬病ワクチン", value: 結果.狂犬病 > 0 ? `¥${fmt(結果.狂犬病)}` : "対象外", color: "#f59e0b" },
                    { label: "装着費相場（1頭）", value: `¥${fmt(自治体窓口 ? 装着費相場[地域].自治体 : 装着費相場[地域].動物病院)}`, color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.情報カード}>
                  <div className={styles.情報タイトル}>マイクロチップ登録の流れ</div>
                  {[
                    "① 動物病院または自治体窓口で装着",
                    "② AIPO（犬・猫の登録機関）へ1,050円で登録",
                    "③ 転居・譲渡時は情報変更手続きが必要",
                    "④ 犬は狂犬病予防法の鑑札登録も別途必要",
                  ].map((s) => (
                    <div key={s} className={styles.情報行}>{s}</div>
                  ))}
                </div>
              </div>

              <AffiliateSlot カテゴリ="pet" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="pet-microchip-registration" />
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
