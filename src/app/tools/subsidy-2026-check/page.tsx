"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./subsidy-2026-check.module.css";

const ツール定義 = {
  スラッグ: "subsidy-2026-check",
  タイトル: "2026年度補助金適性チェッカー",
  説明: "中小企業向け主要補助金の受給要件を簡易チェック",
  カテゴリ: "ビジネス・経営",
  category: "business",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["💰 2026年度補助金チェック。自社が受給できる可能性を診断→"],
};

type 補助金名 = "ものづくり補助金" | "IT導入補助金" | "小規模事業者持続化補助金" | "事業再構築補助金" | "省エネ補助金";

const 補助金情報: Record<補助金名, {
  上限: number; 補助率: number; 要件: string[];
  ポイント: string; 申請難易度: string;
}> = {
  "ものづくり補助金": {
    上限: 12500000,
    補助率: 50,
    要件: ["中小企業・小規模事業者", "付加価値額+3%/年以上", "給与支給総額+1.5%/年以上", "最低賃金+30円以上"],
    ポイント: "設備投資・システム構築に最適。革新的な製品・サービス開発が対象",
    申請難易度: "高",
  },
  "IT導入補助金": {
    上限: 4500000,
    補助率: 75,
    要件: ["中小企業・小規模事業者", "ITツール導入（認定ベンダー経由）", "業務効率化・DX推進目的"],
    ポイント: "インボイス対応ソフト・会計ツール・ECサイト構築など幅広く対象",
    申請難易度: "低",
  },
  "小規模事業者持続化補助金": {
    上限: 2000000,
    補助率: 66.7,
    要件: ["小規模事業者（従業員5〜20人以下）", "販路開拓・業務効率化が目的", "商工会議所等の確認書取得"],
    ポイント: "チラシ・ウェブサイト制作・広告費など販促費用に使いやすい",
    申請難易度: "低",
  },
  "事業再構築補助金": {
    上限: 150000000,
    補助率: 50,
    要件: ["新分野展開・業態転換・事業転換など", "売上減少要件あり（コロナ影響等）", "認定経営革新等支援機関の確認必須", "付加価値額+3.5%/年以上"],
    ポイント: "大規模な事業転換に最大1.5億円。難易度は高いが金額インパクト大",
    申請難易度: "高",
  },
  "省エネ補助金": {
    上限: 150000000,
    補助率: 33,
    要件: ["省エネルギー効果10%以上", "中小企業向け優遇あり", "工場・店舗の設備更新が対象"],
    ポイント: "空調・照明・生産設備の更新で電力コスト削減と補助金を同時達成",
    申請難易度: "中",
  },
};

const 難易度色: Record<string, string> = {
  "低": "#10b981", "中": "#f59e0b", "高": "#f25acc",
};

function fmt万(n: number) {
  return n >= 10000 ? `${Math.round(n/10000)}万` : `${n.toLocaleString("ja-JP")}`;
}

export default function 補助金適性チェッカーページ() {
  const [選択補助金, set選択補助金] = useState<補助金名>("IT導入補助金");
  const [投資額, set投資額] = useState("1000000");
  const [従業員数, set従業員数] = useState("10");
  const [売上減少, set売上減少] = useState(false);
  const [認定支援機関, set認定支援機関] = useState(false);
  const [商工会確認, set商工会確認] = useState(false);

  const info = 補助金情報[選択補助金];

  const 結果 = useMemo(() => {
    const 投資 = parseInt(投資額) || 0;
    const 補助額見込 = Math.min(投資 * (info.補助率/100), info.上限);
    const 自己負担 = 投資 - 補助額見込;
    const 実質補助率 = 投資 > 0 ? (補助額見込 / 投資) * 100 : 0;
    return { 補助額見込, 自己負担, 実質補助率 };
  }, [投資額, 選択補助金, info]);

  const 結果テキスト = `${選択補助金}：投資額に対し補助金見込¥${Math.round(結果.補助額見込).toLocaleString("ja-JP")}（補助率${info.補助率}%）`;

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
              <li>2026年度補助金適性チェッカー</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">💰 2026年度補助金適性チェッカー</h1>
          <p className="ツールページ説明">
            主要5補助金の要件・補助率・上限額を一覧比較。投資額を入力すると
            補助金見込額と自己負担額をリアルタイム算出。申請前の目安に。
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
                <label className="フィールドラベル">補助金を選択</label>
                <div className={styles.クイック群}>
                  {(Object.keys(補助金情報) as 補助金名[]).map((k) => (
                    <button key={k}
                      className={`${styles.クイックボタン} ${選択補助金 === k ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set選択補助金(k)}>{k}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "投資予定額（円）", val: 投資額, set: set投資額, step: "100000" },
                { label: "従業員数（人）", val: 従業員数, set: set従業員数, step: "1" },
              ].map((f) => (
                <div key={f.label} className="フィールドグループ">
                  <label className="フィールドラベル">{f.label}</label>
                  <input type="number" className="数値入力" value={f.val}
                    onChange={(e) => f.set(e.target.value)} min="0" step={f.step} />
                </div>
              ))}

              <div className="フィールドグループ">
                <label className="フィールドラベル">該当状況チェック</label>
                <div className={styles.チェック群}>
                  {[
                    { label: "売上が一定期間減少した", val: 売上減少, set: set売上減少 },
                    { label: "認定経営革新等支援機関と連携済み", val: 認定支援機関, set: set認定支援機関 },
                    { label: "商工会議所の確認書を取得済み", val: 商工会確認, set: set商工会確認 },
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
              <div className="結果見出し">{選択補助金} 試算</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード}>
                  <span className={styles.メインラベル}>補助金見込額</span>
                  <span className={styles.メイン値}>
                    ¥{結果.補助額見込.toLocaleString("ja-JP")}<span className={styles.メイン単位}>円</span>
                  </span>
                  <span className={styles.メインサブ}>自己負担 ¥{Math.round(結果.自己負担).toLocaleString("ja-JP")}円</span>
                </div>

                <div className="結果グリッド">
                  {[
                    { label: "補助率", value: `${info.補助率}%`, color: "#10b981" },
                    { label: "上限額", value: `¥${fmt万(info.上限)}`, color: "#06b6d4" },
                    { label: "実質補助率", value: `${結果.実質補助率.toFixed(1)}%`, color: "#f59e0b" },
                    { label: "申請難易度", value: info.申請難易度, color: 難易度色[info.申請難易度] },
                  ].map((item) => (
                    <div key={item.label} className="結果カード">
                      <span className="結果ラベル">{item.label}</span>
                      <span className="結果値" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.情報カード}>
                  <div className={styles.情報タイトル}>活用ポイント</div>
                  <div className={styles.情報テキスト}>{info.ポイント}</div>
                  <div className={styles.情報タイトル} style={{ marginTop: 10 }}>主な要件</div>
                  <ul className={styles.要件リスト}>
                    {info.要件.map((r) => <li key={r}>{r}</li>)}
                  </ul>
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
      <div className="広告ラッパー"><div className="広告ラベル">スポンサー</div><AdSlot 位置="bottom" /></div>
    </>
  );
}
