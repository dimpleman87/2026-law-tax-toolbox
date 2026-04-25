"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./subsidies-reverse-lookup-2026.module.css";

const ツール定義 = {
  スラッグ: "subsidies-reverse-lookup-2026",
  タイトル: "2026年版 補助金・給付金「逆引き」判定ツール",
  説明: "地域・業種・目的から受給可能な補助金を診断",
  カテゴリ: "ビジネス・経営",
  category: "business",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["💰 2026年版補助金逆引き診断。投資額に対し最大¥{result}の補助金が取れる可能性→"],
};

type 目的種別 = "設備投資" | "IT導入" | "販路開拓" | "事業転換" | "省エネ" | "賃上げ";
type 事業規模 = "小規模（5人以下）" | "中小（6〜50人）" | "中堅（51〜300人）";

interface 補助金候補 {
  名称: string;
  上限額: number;
  補助率: number;
  難易度: "低" | "中" | "高";
  条件: string;
}

const 補助金データ: Record<目的種別, 補助金候補[]> = {
  設備投資: [
    { 名称: "ものづくり補助金", 上限額: 12500000, 補助率: 50, 難易度: "高", 条件: "革新的製品・サービス開発" },
    { 名称: "事業再構築補助金", 上限額: 15000000, 補助率: 50, 難易度: "高", 条件: "新分野展開・業態転換" },
  ],
  IT導入: [
    { 名称: "IT導入補助金2026", 上限額: 4500000, 補助率: 75, 難易度: "低", 条件: "認定ITツール導入" },
    { 名称: "ものづくり補助金（デジタル枠）", 上限額: 12500000, 補助率: 50, 難易度: "高", 条件: "DX推進・AI活用" },
  ],
  販路開拓: [
    { 名称: "小規模事業者持続化補助金", 上限額: 2000000, 補助率: 66.7, 難易度: "低", 条件: "商工会議所確認書取得" },
    { 名称: "IT導入補助金（ECサイト枠）", 上限額: 3500000, 補助率: 75, 難易度: "低", 条件: "EC構築・集客ツール" },
  ],
  事業転換: [
    { 名称: "事業再構築補助金", 上限額: 15000000, 補助率: 50, 難易度: "高", 条件: "認定経営革新等支援機関の確認" },
    { 名称: "ものづくり補助金（回復型枠）", 上限額: 12500000, 補助率: 66.7, 難易度: "高", 条件: "売上減少要件あり" },
  ],
  省エネ: [
    { 名称: "省エネルギー投資促進補助金", 上限額: 150000000, 補助率: 33, 難易度: "中", 条件: "省エネ効果10%以上" },
    { 名称: "ものづくり補助金（グリーン枠）", 上限額: 12500000, 補助率: 50, 難易度: "高", 条件: "温室ガス削減効果" },
  ],
  賃上げ: [
    { 名称: "業務改善助成金", 上限額: 6000000, 補助率: 80, 難易度: "低", 条件: "最低賃金30円引上+設備投資" },
    { 名称: "キャリアアップ助成金", 上限額: 1200000, 補助率: 100, 難易度: "低", 条件: "非正規→正規転換" },
  ],
};

const 難易度色 = { "低": "#10b981", "中": "#f59e0b", "高": "#f25acc" };

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmt万(n: number) { return n >= 10000000 ? `${n/10000000}億` : n >= 10000 ? `${Math.round(n/10000)}万` : `${fmt(n)}`; }

export default function 補助金逆引き判定ページ() {
  const [目的, set目的] = useState<目的種別>("IT導入");
  const [投資額, set投資額] = useState("1000000");
  const [規模, set規模] = useState<事業規模>("中小（6〜50人）");
  const [賃上げ予定, set賃上げ予定] = useState(false);
  const [支援機関連携, set支援機関連携] = useState(false);

  const 結果 = useMemo(() => {
    const 投 = parseInt(投資額) || 0;
    const 候補一覧 = 補助金データ[目的];

    return 候補一覧.map((s) => {
      const 見込額 = Math.min(投 * (s.補助率 / 100), s.上限額);
      const 加点補正 = 賃上げ予定 ? 1.1 : 1.0;
      const 加点見込 = Math.min(Math.round(見込額 * 加点補正), s.上限額);
      return { ...s, 見込額, 加点見込 };
    }).sort((a, b) => b.加点見込 - a.加点見込);
  }, [目的, 投資額, 賃上げ予定]);

  const 最大補助額 = 結果[0]?.加点見込 ?? 0;
  const 結果テキスト = `${目的}目的の補助金：最大¥${fmt(最大補助額)}の受給可能性（${結果[0]?.名称}）`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-business">ビジネス・経営</Link></li>
              <li aria-hidden="true">›</li>
              <li>2026年版補助金逆引き判定</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💰 2026年版 補助金「逆引き」判定ツール</h1>
          <p className="ツールページ説明">
            目的・投資額・事業規模を選ぶだけで申請可能性の高い補助金トップ2と
            概算受給額を即判定。賃上げ加点も考慮した現実的な試算に。
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
                <label className="フィールドラベル">補助金を活用したい目的</label>
                <div className={styles.クイック群}>
                  {(["設備投資","IT導入","販路開拓","事業転換","省エネ","賃上げ"] as 目的種別[]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${目的 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set目的(v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">予定投資額（円）</label>
                <input type="number" className="数値入力" value={投資額}
                  onChange={(e) => set投資額(e.target.value)} min="0" step="500000" />
                <div className={styles.クイック群}>
                  {["500000","1000000","3000000","5000000","10000000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${投資額 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set投資額(v)}>{fmt万(parseInt(v))}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">事業規模</label>
                <div className={styles.クイック群}>
                  {(["小規模（5人以下）","中小（6〜50人）","中堅（51〜300人）"] as 事業規模[]).map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${規模 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set規模(v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">加点要素</label>
                <div className={styles.チェック群}>
                  {[
                    { label: "賃上げを実施予定（採択加点に直結）", val: 賃上げ予定, set: set賃上げ予定 },
                    { label: "認定経営革新等支援機関・商工会議所と連携済み", val: 支援機関連携, set: set支援機関連携 },
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
              <div className="結果見出し">申請可能性の高い補助金</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>最大補助金見込額（第1候補）</span>
                  <span className={styles.メイン値}>¥{fmt(最大補助額)}<span className={styles.メイン単位}>円</span></span>
                  <span className={styles.メインサブ}>{結果[0]?.名称}</span>
                </div>

                {結果.map((s, idx) => (
                  <div key={s.名称} className={styles.情報カード} style={{ borderColor: idx === 0 ? "rgba(16,185,129,0.3)" : undefined }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div className={styles.情報タイトル} style={{ margin: 0 }}>
                        {idx === 0 ? "🥇" : "🥈"} {s.名称}
                      </div>
                      <span className={styles.バッジ} style={{
                        background: `${難易度色[s.難易度]}22`,
                        color: 難易度色[s.難易度],
                      }}>難易度：{s.難易度}</span>
                    </div>
                    <div className={styles.内訳}>
                      {[
                        { label: "補助率", value: `${s.補助率}%` },
                        { label: "上限額", value: `¥${fmt万(s.上限額)}` },
                        { label: "補助金見込額", value: `¥${fmt(s.見込額)}` },
                        { label: `賃上げ加点後`, value: 賃上げ予定 ? `¥${fmt(s.加点見込)}` : "加点なし" },
                      ].map((row) => (
                        <div key={row.label} className={styles.内訳行}>
                          <span>{row.label}</span>
                          <span style={{ fontWeight: 700 }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.情報テキスト} style={{ marginTop: 6 }}>条件：{s.条件}</div>
                  </div>
                ))}
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
      <div className="広告ラッパー"><div className="広告ラベル">スポンサー</div><AdSlot 位置="bottom" /></div>
    </>
  );
}
