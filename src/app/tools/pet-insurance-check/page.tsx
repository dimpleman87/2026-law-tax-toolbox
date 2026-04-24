"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./pet-insurance-check.module.css";

const ツール定義 = {
  スラッグ: "pet-insurance-check",
  タイトル: "ペット保険 損益分岐シミュレーター",
  説明: "加入すべきか費用対効果を数字で判断",
  カテゴリ: "生活・計算",
  category: "Life",
  ロジック種別: "calculation" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["🐶 ペット保険の損益分岐点を計算。生涯保険料と補償額の差は{result}→"],
};

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPct(n: number) { return n.toFixed(1); }

type ペット種別 = "犬（小型・〜10kg）" | "犬（中型・10〜25kg）" | "犬（大型・25kg〜）" | "猫（室内飼い）" | "猫（室外アクセスあり）";
type 補償率 = "50%補償" | "70%補償" | "80%補償" | "90%補償";
type 加入期間 = "3年" | "5年" | "8年" | "10年" | "15年（生涯）";
type リスク = "特になし（健康体）" | "遺伝性疾患リスクあり" | "肥満・生活習慣病リスク" | "過去に大きな病歴あり";

const リスク係数: Record<リスク, number> = {
  "特になし（健康体）": 1.0,
  "遺伝性疾患リスクあり": 1.5,
  "肥満・生活習慣病リスク": 1.3,
  "過去に大きな病歴あり": 1.7,
};

// ペット別の年間平均医療費（目安）
const 平均医療費: Record<ペット種別, number> = {
  "犬（小型・〜10kg）": 80000,
  "犬（中型・10〜25kg）": 90000,
  "犬（大型・25kg〜）": 100000,
  "猫（室内飼い）": 70000,
  "猫（室外アクセスあり）": 90000,
};

const 加入期間年数: Record<加入期間, number> = {
  "3年": 3, "5年": 5, "8年": 8, "10年": 10, "15年（生涯）": 15,
};

const 補償率数値: Record<補償率, number> = {
  "50%補償": 0.50, "70%補償": 0.70, "80%補償": 0.80, "90%補償": 0.90,
};

export default function ペット保険シミュレーターページ() {
  const [ペット, setペット] = useState<ペット種別>("犬（小型・〜10kg）");
  const [保険月額, set保険月額] = useState("3500");
  const [補償率, set補償率] = useState<補償率>("70%補償");
  const [加入期間, set加入期間] = useState<加入期間>("10年");
  const [リスク, setリスク] = useState<リスク>("特になし（健康体）");

  const 結果 = useMemo(() => {
    const 月額 = parseInt(保険月額) || 0;
    const 年数 = 加入期間年数[加入期間];
    const 補償 = 補償率数値[補償率];
    const 係数 = リスク係数[リスク];

    // 累計保険料
    const 累計保険料 = 月額 * 12 * 年数;

    // 損益分岐医療費（累計保険料÷補償率）
    const 損益分岐医療費 = Math.ceil(累計保険料 / 補償);

    // 期待医療費（リスク係数適用）
    const 基準医療費 = 平均医療費[ペット];
    const 期待年間医療費 = Math.floor(基準医療費 * 係数);
    const 期待累計医療費 = 期待年間医療費 * 年数;
    const 期待補償額 = Math.floor(期待累計医療費 * 補償);

    // 手術1回20万円での回収
    const 手術費 = 200000;
    const 手術補償 = Math.floor(手術費 * 補償);
    const 手術回収年 = 手術補償 > 0 ? 累計保険料 / 手術補償 : 99;

    // 通院1回1.5万円での元取り回数
    const 通院費 = 15000;
    const 通院補償 = Math.floor(通院費 * 補償);
    const 元取り回数 = 通院補償 > 0 ? Math.ceil(累計保険料 / 通院補償) : 999;

    // 加入スコア（1〜5）
    const 期待収支 = 期待補償額 - 累計保険料;
    let スコア = 3;
    if (期待収支 > 100000) スコア = 5;
    else if (期待収支 > 30000) スコア = 4;
    else if (期待収支 > -30000) スコア = 3;
    else if (期待収支 > -100000) スコア = 2;
    else スコア = 1;

    const スコアラベル = ["", "加入非推奨", "やや非推奨", "どちらとも言えない", "加入推奨", "強く推奨"];

    return {
      月額, 年数, 累計保険料, 損益分岐医療費,
      期待年間医療費, 期待累計医療費, 期待補償額, 期待収支,
      手術補償, 手術回収年, 元取り回数, 通院補償, スコア, スコアラベル,
    };
  }, [ペット, 保険月額, 補償率, 加入期間, リスク]);

  const 結果テキスト = `ペット保険加入推奨度${結果.スコアラベル[結果.スコア]}（${結果.スコア}/5）・生涯保険料¥${fmt(結果.累計保険料)}`;

  const ペットリスト: ペット種別[] = ["犬（小型・〜10kg）", "犬（中型・10〜25kg）", "犬（大型・25kg〜）", "猫（室内飼い）", "猫（室外アクセスあり）"];
  const 補償率リスト: 補償率[] = ["50%補償", "70%補償", "80%補償", "90%補償"];
  const 加入期間リスト: 加入期間[] = ["3年", "5年", "8年", "10年", "15年（生涯）"];
  const リスクリスト: リスク[] = ["特になし（健康体）", "遺伝性疾患リスクあり", "肥満・生活習慣病リスク", "過去に大きな病歴あり"];

  const スコア色 = 結果.スコア >= 4 ? "#10b981" : 結果.スコア === 3 ? "#f59e0b" : "#f25acc";

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
              <li>ペット保険 損益分岐シミュレーター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🐶 ペット保険 損益分岐シミュレーター</h1>
          <p className="ツールページ説明">
            保険料・補償率・加入期間・リスクを入力して生涯保険料と期待補償額を比較。
            損益分岐点・加入推奨度スコアで「入るべきか」を数字で判断。
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
                      onClick={() => setペット(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">月額保険料（円）</label>
                <input type="number" className="数値入力" value={保険月額}
                  onChange={(e) => set保険月額(e.target.value)} min="0" step="500" />
                <div className={styles.クイック群}>
                  {["1500","2500","3500","5000","7000","10000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${保険月額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set保険月額(v)}>¥{fmt(parseInt(v))}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">補償率</label>
                <div className={styles.横選択}>
                  {補償率リスト.map((b) => (
                    <button key={b}
                      className={`${styles.横ボタン} ${補償率 === b ? styles.横ボタンアクティブ : ""}`}
                      onClick={() => set補償率(b)}>{b}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">加入期間</label>
                <div className={styles.横選択}>
                  {加入期間リスト.map((k) => (
                    <button key={k}
                      className={`${styles.横ボタン} ${加入期間 === k ? styles.横ボタンアクティブ : ""}`}
                      onClick={() => set加入期間(k)}>{k}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">健康リスク</label>
                <div className={styles.リスク選択}>
                  {リスクリスト.map((r) => (
                    <button key={r}
                      className={`${styles.リスクボタン} ${リスク === r ? styles.リスクボタンアクティブ : ""}`}
                      onClick={() => setリスク(r)}>{r}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="結果セクション">
              <div className="結果見出し">損益分岐シミュレーション</div>

              <div className={styles.結果コンテンツ}>
                {/* スコアカード */}
                <div className={styles.スコアカード}>
                  <span className={styles.スコアラベル}>加入推奨度</span>
                  <div className={styles.スコア点数}>
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className={styles.スコア星} style={{ color: i <= 結果.スコア ? スコア色 : "rgba(255,255,255,0.1)" }}>★</span>
                    ))}
                  </div>
                  <span className={styles.スコアテキスト} style={{ color: スコア色 }}>{結果.スコアラベル[結果.スコア]}</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "累計保険料", value: `¥${fmt(結果.累計保険料)}`, color: "#f25acc" },
                    { label: "期待補償額（累計）", value: `¥${fmt(結果.期待補償額)}`, color: "#10b981" },
                    { label: "損益分岐 医療費", value: `¥${fmt(結果.損益分岐医療費)}`, color: "#f59e0b" },
                    { label: "期待収支", value: 結果.期待収支 >= 0 ? `+¥${fmt(結果.期待収支)}` : `-¥${fmt(Math.abs(結果.期待収支))}`, color: 結果.期待収支 >= 0 ? "#10b981" : "#f25acc" },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color, fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.損益表}>
                  <div className={styles.損益タイトル}>📊 元が取れる条件</div>
                  <div className={styles.損益行}>
                    <span>通院（1回¥15,000）で元取り</span>
                    <span style={{ color: "#06b6d4", fontWeight: 700 }}>約{結果.元取り回数}回</span>
                  </div>
                  <div className={styles.損益行}>
                    <span>手術1回（¥200,000）の補償額</span>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>¥{fmt(結果.手術補償)}</span>
                  </div>
                  <div className={styles.損益行}>
                    <span>手術補償で保険料回収年数</span>
                    <span style={{ color: "#f59e0b", fontWeight: 700 }}>{結果.手術回収年.toFixed(1)}年</span>
                  </div>
                  <div className={styles.損益行}>
                    <span>期待年間医療費（リスク加味）</span>
                    <span style={{ color: "#f97316", fontWeight: 700 }}>¥{fmt(結果.期待年間医療費)}</span>
                  </div>
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
