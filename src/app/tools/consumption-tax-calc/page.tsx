"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./consumption-tax-calc.module.css";

const ツール定義 = {
  スラッグ: "consumption-tax-calc",
  タイトル: "インボイス対応 消費税計算機",
  説明: "本則課税・簡易課税・2割特例の納税額を比較",
  カテゴリ: "金融・投資",
  category: "Finance",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🧾 消費税納税額を試算。本則vs簡易課税で{result}の差→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

type 業種区分 = "第1種（卸売・90%）" | "第2種（小売・80%）" | "第3種（建設・製造・70%）" | "第4種（飲食等・60%）" | "第5種（サービス・IT・50%）" | "第6種（不動産・40%）";

const みなし仕入率: Record<業種区分, number> = {
  "第1種（卸売・90%）": 0.90,
  "第2種（小売・80%）": 0.80,
  "第3種（建設・製造・70%）": 0.70,
  "第4種（飲食等・60%）": 0.60,
  "第5種（サービス・IT・50%）": 0.50,
  "第6種（不動産・40%）": 0.40,
};

export default function 消費税計算機ページ() {
  const [売上税込, set売上税込] = useState("11000000");
  const [経費税込, set経費税込] = useState("3300000");
  const [業種, set業種] = useState<業種区分>("第5種（サービス・IT・50%）");

  const 結果 = useMemo(() => {
    const 売上 = parseInt(売上税込) || 0;
    const 経費 = parseInt(経費税込) || 0;

    // 消費税額（税込→税抜き換算）
    const 預かり消費税 = Math.floor(売上 * 10 / 110);
    const 仕入消費税 = Math.floor(経費 * 10 / 110);
    const 売上税抜 = 売上 - 預かり消費税;

    // 本則課税
    const 本則納税 = Math.max(0, 預かり消費税 - 仕入消費税);

    // 簡易課税
    const 仕入率 = みなし仕入率[業種];
    const 簡易仕入消費税 = Math.floor(預かり消費税 * 仕入率);
    const 簡易納税 = Math.max(0, 預かり消費税 - 簡易仕入消費税);

    // 2割特例（売上消費税の20%）
    const 二割特例納税 = Math.floor(預かり消費税 * 0.2);

    // 最有利比較
    const 最小納税 = Math.min(本則納税, 簡易納税, 二割特例納税);
    const 有利制度 = 最小納税 === 本則納税 ? "本則課税" : 最小納税 === 二割特例納税 ? "2割特例" : "簡易課税";
    const 本則比差 = 本則納税 - 最小納税;

    return {
      売上, 経費, 預かり消費税, 仕入消費税, 売上税抜,
      本則納税, 簡易納税, 二割特例納税, 最小納税, 有利制度, 本則比差, 仕入率,
    };
  }, [売上税込, 経費税込, 業種]);

  const 結果テキスト = `売上${fmt(結果.売上)}円→本則¥${fmt(結果.本則納税)}・簡易¥${fmt(結果.簡易納税)}・2割¥${fmt(結果.二割特例納税)}（最安は${結果.有利制度}）`;

  const 売上クイック = ["5500000","11000000","16500000","22000000","33000000","55000000"];
  const 業種リスト = Object.keys(みなし仕入率) as 業種区分[];

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
              <li>インボイス対応 消費税計算機</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🧾 インボイス対応 消費税計算機</h1>
          <p className="ツールページ説明">
            年間売上・経費を入力するだけで本則課税・簡易課税・2割特例の納税額を比較。
            どの課税方式が最も有利かを即判定。インボイス制度対応の資金計画に。
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
                <label className="フィールドラベル">年間売上（税込・円）</label>
                <input type="number" className="数値入力" value={売上税込}
                  onChange={(e) => set売上税込(e.target.value)} min="0" step="1000000" />
                <div className={styles.クイック群}>
                  {売上クイック.map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${売上税込 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set売上税込(v)}>
                      {Number(v) >= 10000000 ? `${Number(v)/10000000}千万` : `${Number(v)/10000}万`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">年間経費（税込・課税仕入れ分のみ）</label>
                <input type="number" className="数値入力" value={経費税込}
                  onChange={(e) => set経費税込(e.target.value)} min="0" step="500000" />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">業種区分（簡易課税のみなし仕入率）</label>
                <div className={styles.業種選択}>
                  {業種リスト.map((b) => (
                    <button key={b}
                      className={`${styles.業種ボタン} ${業種 === b ? styles.業種ボタンアクティブ : ""}`}
                      onClick={() => set業種(b)}>{b}</button>
                  ))}
                </div>
              </div>

              <div className={styles.メモ}>
                <div className={styles.メモタイトル}>📌 2割特例について</div>
                <p>免税事業者からインボイス登録した事業者は一定期間、消費税納税額を「売上消費税×20%」に抑えられる経過措置があります。2割特例が最も有利なケースが多い。</p>
              </div>

              <div className={styles.注意書き}>
                ※ 概算値です。課税区分・非課税売上・免税売上が混在する場合は実際と異なります。
                簡易課税・2割特例は届出が必要です。正確な申告は税理士にご確認ください。
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">納税額比較</div>

              <div className={styles.結果コンテンツ}>
                {/* 有利制度バナー */}
                <div className={styles.有利バナー}>
                  <span className={styles.有利ラベル}>最も有利な課税方式</span>
                  <span className={styles.有利制度名}>{結果.有利制度}</span>
                  <span className={styles.有利節税}>本則比 ¥{fmt(結果.本則比差)}節税</span>
                </div>

                {/* 三択比較カード */}
                <div className={styles.三択}>
                  {[
                    { 名称: "本則課税", 値: 結果.本則納税, 色: "#06b6d4", 説明: "実額仕入控除" },
                    { 名称: "簡易課税", 値: 結果.簡易納税, 色: "#f59e0b", 説明: `みなし${(結果.仕入率*100).toFixed(0)}%` },
                    { 名称: "2割特例", 値: 結果.二割特例納税, 色: "#10b981", 説明: "売上消費税×20%" },
                  ].map((item) => (
                    <div key={item.名称}
                      className={`${styles.択カード} ${結果.有利制度 === item.名称 ? styles.択カード有利 : ""}`}
                      style={{ borderColor: 結果.有利制度 === item.名称 ? `${item.色}60` : undefined }}>
                      {結果.有利制度 === item.名称 && <span className={styles.最安バッジ} style={{ background: item.色 }}>最安</span>}
                      <span className={styles.択名称}>{item.名称}</span>
                      <span className={styles.択説明}>{item.説明}</span>
                      <span className={styles.択値} style={{ color: item.色 }}>¥{fmt(item.値)}</span>
                    </div>
                  ))}
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "預かり消費税（売上分）", value: `¥${fmt(結果.預かり消費税)}`, color: "#f25acc" },
                    { label: "仕入消費税（経費分）", value: `¥${fmt(結果.仕入消費税)}`, color: "#06b6d4" },
                    { label: "本則課税 納税額", value: `¥${fmt(結果.本則納税)}`, color: "#f97316" },
                    { label: "最安制度 納税額", value: `¥${fmt(結果.最小納税)}`, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.95rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
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
