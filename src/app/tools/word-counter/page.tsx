"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import FavoriteButton from "@/components/FavoriteButton";
import RelatedTools from "@/components/RelatedTools";
import CalcHistory from "@/components/CalcHistory";
import ToolJsonLd from "@/components/ToolJsonLd";
import styles from "./word-counter.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "word-counter",
  タイトル: "文字数カウンター",
  説明: "テキストの文字数・行数・文節をリアルタイムカウント",
  カテゴリ: "テキスト解析",
  category: "Text",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["📝 文字数カウント。{result}の記事を書きました→"],
};

// Twitterは1文字=2バイト換算（全角）で140文字まで
function X文字数(text: string): number {
  let count = 0;
  for (const ch of text) {
    count += ch.charCodeAt(0) > 0x7F ? 2 : 1;
  }
  return Math.ceil(count / 2);
}

function バイト数UTF8(text: string): number {
  return new TextEncoder().encode(text).length;
}

export default function 文字数カウンターページ() {
  const [テキスト, setテキスト] = useState("");
  const [コピー完了, setコピー完了] = useState(false);

  const 結果 = useMemo(() => {
    const t = テキスト;
    const 全文字数 = t.length;
    const スペースなし = t.replace(/[\s\u3000]/g, "").length;
    const 改行なし = t.replace(/[\n\r]/g, "").length;
    const 行数 = t === "" ? 0 : t.split(/\r?\n/).length;
    const 段落数 = t === "" ? 0 : t.split(/\r?\n\s*\r?\n/).filter(p => p.trim().length > 0).length;
    const 語数 = t.trim() === "" ? 0 : t.trim().split(/\s+/).length;
    const バイト = バイト数UTF8(t);
    const X換算 = X文字数(t);

    // 読書時間（400文字/分）
    const 読書分 = Math.ceil(スペースなし / 400);
    const 読書秒 = Math.round(スペースなし / 400 * 60);

    // 文字種別カウント
    const 漢字 = (t.match(/[\u4E00-\u9FFF]/g) || []).length;
    const ひらがな = (t.match(/[\u3041-\u3096]/g) || []).length;
    const カタカナ = (t.match(/[\u30A1-\u30F6]/g) || []).length;
    const 英字 = (t.match(/[a-zA-Z]/g) || []).length;
    const 数字 = (t.match(/[0-9０-９]/g) || []).length;
    const 記号 = (t.match(/[^\u4E00-\u9FFF\u3041-\u3096\u30A1-\u30F6a-zA-Z0-9０-９\s]/g) || []).length;

    // SNS制限チェック
    const SNS制限 = [
      { 名前: "X（旧Twitter）", 制限: 140, 換算: X換算 },
      { 名前: "Instagram（説明文）", 制限: 2200, 換算: 全文字数 },
      { 名前: "Facebook（投稿）", 制限: 63206, 換算: 全文字数 },
      { 名前: "LINE（一括送信）", 制限: 1000, 換算: 全文字数 },
    ];

    return {
      全文字数, スペースなし, 改行なし, 行数, 段落数, 語数,
      バイト, X換算, 読書分, 読書秒,
      漢字, ひらがな, カタカナ, 英字, 数字, 記号,
      SNS制限,
    };
  }, [テキスト]);

  const テキストクリア = useCallback(() => setテキスト(""), []);
  const テキストコピー = useCallback(async () => {
    await navigator.clipboard.writeText(テキスト);
    setコピー完了(true);
    setTimeout(() => setコピー完了(false), 2000);
  }, [テキスト]);

  const 結果テキスト = `${結果.全文字数}文字（空白除く${結果.スペースなし}文字・${結果.行数}行）`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="word-counter" タイトル="文字数カウンター" 説明="テキストの文字数・行数・文節をリアルタイムカウント" カテゴリ="テキスト解析" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-text">テキスト解析</Link></li>
              <li aria-hidden="true">›</li>
              <li>文字数カウンター</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">📝 文字数カウンター</h1>
          <FavoriteButton slug="word-counter" title="文字数カウンター" emoji="📝" />
          <p className="ツールページ説明">
            テキストを入力するだけでリアルタイムカウント。文字数・行数・バイト数・X（旧Twitter）換算・読書時間・文字種別まで一括表示。
            記事執筆・SNS投稿・入稿規定の確認に。
          </p>
        </div>
      </div>

      <main className="ツールページメイン">
        <div className="ツールページコンテナ">
          <div className="広告ラッパー" style={{ padding: 0, marginBottom: "var(--スペース-lg)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="top" />
          </div>

          {/* テキストエリア */}
          <div className={styles.エディタラッパー}>
            <div className={styles.エディタヘッダー}>
              <span className={styles.文字数バッジ}>{結果.全文字数}文字</span>
              <div className={styles.エディタボタン群}>
                <button className={styles.エディタボタン} onClick={テキストコピー} disabled={テキスト.length === 0}>
                  {コピー完了 ? "✅ コピー完了" : "📋 コピー"}
                </button>
                <button className={styles.エディタボタン} onClick={テキストクリア} disabled={テキスト.length === 0}>
                  🗑 クリア
                </button>
              </div>
            </div>
            <textarea
              className={styles.テキストエリア}
              value={テキスト}
              onChange={(e) => setテキスト(e.target.value)}
              placeholder="ここにテキストを入力またはペーストしてください...&#10;&#10;リアルタイムで文字数・行数・バイト数が計算されます。"
              rows={12}
              spellCheck={false}
            />
            <div className={styles.エディタフッター}>
              <span>{結果.行数}行</span>
              <span>{結果.段落数}段落</span>
              <span>{結果.バイト}バイト</span>
              <span>X換算 {結果.X換算}文字</span>
            </div>
          </div>

          {/* メインスタッツ */}
          <div className={styles.スタッツグリッド}>
            {[
              { label: "全文字数", value: 結果.全文字数.toLocaleString(), color: "var(--カラー-プライマリ輝き)", big: true },
              { label: "空白・改行を除く", value: 結果.スペースなし.toLocaleString(), color: "#10b981", big: false },
              { label: "改行を除く", value: 結果.改行なし.toLocaleString(), color: "#06b6d4", big: false },
              { label: "行数", value: 結果.行数.toLocaleString(), color: "#6366f1", big: false },
              { label: "段落数", value: 結果.段落数.toLocaleString(), color: "#f59e0b", big: false },
              { label: "UTF-8バイト数", value: 結果.バイト.toLocaleString(), color: "#f25acc", big: false },
            ].map((s) => (
              <div key={s.label} className={`${styles.スタッツカード} ${s.big ? styles.スタッツカード大 : ""}`}>
                <span className={styles.スタッツ値} style={{ color: s.color }}>{s.value}</span>
                <span className={styles.スタッツラベル}>{s.label}</span>
              </div>
            ))}
          </div>


          <ToolGuide slug="word-counter" />
          <div className="広告ラッパー" style={{ padding: 0, marginTop: "var(--スペース-xl)", marginBottom: "var(--スペース-xl)" }}>
            <div className="広告ラベル">スポンサー</div>
            <AdSlot 位置="middle" />
          </div>

          <div className={styles.下部グリッド}>
            {/* 読書時間 */}
            <div className={styles.読書カード}>
              <div className={styles.セクションタイトル}>📖 読書時間の目安</div>
              <div className={styles.読書行}>
                <span>一般読者（400文字/分）</span>
                <span className={styles.読書値}>{結果.読書分}分{結果.読書秒 % 60}秒</span>
              </div>
              <div className={styles.読書行}>
                <span>速読（800文字/分）</span>
                <span className={styles.読書値}>{Math.ceil(結果.スペースなし / 800)}分</span>
              </div>
            </div>

            {/* 文字種別 */}
            <div className={styles.文字種カード}>
              <div className={styles.セクションタイトル}>🔤 文字種別</div>
              {[
                { label: "漢字", value: 結果.漢字, color: "#f59e0b" },
                { label: "ひらがな", value: 結果.ひらがな, color: "#10b981" },
                { label: "カタカナ", value: 結果.カタカナ, color: "#06b6d4" },
                { label: "英字", value: 結果.英字, color: "#6366f1" },
                { label: "数字", value: 結果.数字, color: "#f25acc" },
                { label: "記号・その他", value: 結果.記号, color: "var(--カラー-テキスト薄)" },
              ].map((item) => (
                <div key={item.label} className={styles.文字種行}>
                  <span>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 700 }}>{item.value.toLocaleString()}字</span>
                </div>
              ))}
            </div>

            {/* SNSチェック */}
            <div className={styles.SNSカード}>
              <div className={styles.セクションタイトル}>📱 SNS文字数制限チェック</div>
              {結果.SNS制限.map((sns) => {
                const pct = Math.min(100, (sns.換算 / sns.制限) * 100);
                const over = sns.換算 > sns.制限;
                return (
                  <div key={sns.名前} className={styles.SNS行}>
                    <div className={styles.SNSヘッダ}>
                      <span>{sns.名前}</span>
                      <span className={over ? styles.SNSオーバー : styles.SNSOk}>
                        {sns.換算}/{sns.制限}
                        {over ? " ⚠️ 超過" : " ✅"}
                      </span>
                    </div>
                    <div className={styles.SNSバー}>
                      <div className={styles.SNSバー塗り}
                        style={{ width: `${pct}%`, background: over ? "#ef4444" : "var(--グラデ-プライマリ)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {テキスト && <>
              <AffiliateSlot カテゴリ="general" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
              </>
              }

        </div>
      </main>

      <div className="広告ラッパー">
        <div className="広告ラベル">スポンサー</div>
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
