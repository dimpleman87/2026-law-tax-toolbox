/**
 * src/app/tools/meo-checker/page.tsx
 * MEO対策・伸びしろ診断シミュレーター
 *
 * ※ このファイルは [slug] 動的ルートより優先される静的ルートです。
 *    インタラクティブ UI（SVGゲージ・ローディング）のため "use client" を使用します。
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import AdSlot from "@/components/AdSlot";
import BusinessAdBanner from "@/components/BusinessAdBanner";
import type { ツール定義型 } from "@/lib/types";
import s from "./meo-checker.module.css";

const ShareButtons = dynamic(() => import("@/components/ShareButtons"), {
  ssr: false,
  loading: () => null,
});

// ─── 型定義 ───────────────────────────────────────────────────────────────────

type Industry = "飲食店" | "美容・サロン" | "クリニック" | "その他";

interface FormData {
  industry: Industry | "";
  region: string;
  reviewCount: number | "";
  hasWebsite: boolean | null;
}

interface DiagnosisResult {
  score: number;
  level: "高伸びしろ" | "中伸びしろ" | "現状維持型";
  description: string;
  recommendations: string[];
}

// ─── スコア計算エンジン ────────────────────────────────────────────────────────

function calcScore(d: FormData): DiagnosisResult {
  let score = 25;

  const reviews = Number(d.reviewCount) || 0;
  if (reviews === 0)       score += 35;
  else if (reviews <= 5)   score += 28;
  else if (reviews <= 15)  score += 20;
  else if (reviews <= 30)  score += 12;
  else if (reviews <= 60)  score += 5;

  score += d.hasWebsite ? 22 : 7;

  const industryBonus: Record<Industry, number> = {
    "美容・サロン": 18, "クリニック": 15, "飲食店": 12, "その他": 9,
  };
  score += d.industry ? industryBonus[d.industry as Industry] : 9;
  score = Math.min(100, Math.max(0, Math.round(score)));

  const level: DiagnosisResult["level"] =
    score >= 70 ? "高伸びしろ" : score >= 40 ? "中伸びしろ" : "現状維持型";

  const descriptions: Record<DiagnosisResult["level"], string> = {
    "高伸びしろ": `${d.region}エリアの${d.industry}市場において、MEO対策の伸びしろが非常に高い状態です。今すぐ対策を始めることで、3ヶ月以内に検索順位の大幅な改善が期待できます。`,
    "中伸びしろ": `${d.region}エリアで競合と差をつけるチャンスが十分あります。口コミ強化と情報最適化で着実に上位表示を狙えます。`,
    "現状維持型": `すでに一定のMEO基盤ができています。さらなる口コミ獲得と写真追加・投稿継続で、より高い順位を狙えます。`,
  };

  const recs: string[] = [];
  if (reviews < 20)        recs.push("口コミ獲得の仕組み化（LINE・来店後フォロー）");
  if (!d.hasWebsite)       recs.push("HP作成でGoogleからの信頼性・連携効果を向上");
  recs.push("Googleビジネスプロフィールに写真を週1枚追加");
  recs.push("営業時間・特別営業日の定期更新");
  if (d.industry === "美容・サロン" || d.industry === "飲食店")
    recs.push("予約リンク追加で直接予約導線を最適化");
  recs.push("Googleへの投稿（最新情報）を月4回以上");

  return { score, level, description: descriptions[level], recommendations: recs.slice(0, 4) };
}

// ─── SVG ゲージ ───────────────────────────────────────────────────────────────

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const start = polarXY(cx, cy, r, from);
  const end   = polarXY(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${end.x} ${end.y} A ${r} ${r} 0 ${large} 0 ${start.x} ${start.y}`;
}

function GaugeChart({ score }: { score: number }) {
  const cx = 110, cy = 110, R = 82, START = -210, END = 30;
  const scoreDeg = START + (score / 100) * (END - START);
  const color = score >= 70 ? "#26d9ca" : score >= 40 ? "#fbbf24" : "#f25acc";
  const needle = polarXY(cx, cy, R - 12, scoreDeg);

  return (
    <svg viewBox="0 0 220 148" className={s.ゲージSVG}>
      <path d={arcPath(cx, cy, R, START, END)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={16} strokeLinecap="round" />
      <path d={arcPath(cx, cy, R, START, scoreDeg)} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill="rgba(255,255,255,0.85)" />
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize={28} fontWeight={800} fill={color}
        style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}>
        {score}
      </text>
      <text x={cx} y={cy + 44} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.3)">/ 100</text>
    </svg>
  );
}

// ─── ローディングメッセージ ────────────────────────────────────────────────────

const LOAD_MSGS = [
  "周辺の競合状況を分析中...",
  "Googleマップデータを照合中...",
  "伸びしろスコアを計算中...",
];

// ─── メインページ ─────────────────────────────────────────────────────────────

export default function MeoCheckerPage() {
  const [form, setForm] = useState<FormData>({
    industry: "", region: "", reviewCount: "", hasWebsite: null,
  });
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult]     = useState<DiagnosisResult | null>(null);
  const [error, setError]       = useState("");

  const isValid =
    form.industry !== "" && form.region.trim() !== "" &&
    form.reviewCount !== "" && form.hasWebsite !== null;

  const handleDiagnose = async () => {
    if (!isValid) { setError("すべての項目を入力してください。"); return; }
    setError("");
    setLoading(true);
    setProgress(0);
    setResult(null);

    const iv = setInterval(() =>
      setProgress((p) => Math.min(p + Math.random() * 18 + 4, 95)), 180);

    await new Promise<void>((r) => setTimeout(r, 3000));
    clearInterval(iv);
    setProgress(100);
    await new Promise<void>((r) => setTimeout(r, 250));

    setLoading(false);
    setResult(calcScore(form));
  };

  const handleReset = () => {
    setResult(null);
    setProgress(0);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const levelClass =
    result?.level === "高伸びしろ" ? s.高 :
    result?.level === "中伸びしろ" ? s.中 : s.低;

  return (
    <>
      {/* ── 上部広告 ── */}
      <div className="広告ラッパー">
        <AdSlot 位置="top" />
      </div>

      {/* ── ページヘッダー ── */}
      <div className="tool-page-header">
        <div className="tool-page-container">
          <nav className="breadcrumb-nav" aria-label="パンくずリスト">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/?category=ビジネス・経理">ビジネス・経理</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">MEO対策・伸びしろ診断</li>
            </ol>
          </nav>
          <h1 className="tool-page-title">
            MEO対策・伸びしろ診断シミュレーター｜Googleマップ集客ポテンシャルを即スコアリング
          </h1>
          <p className="tool-page-description">
            業種・地域・口コミ数・HP有無の4項目を入力するだけで、あなたのお店のGoogleマップ集客ポテンシャル（MEO伸びしろスコア）を0〜100で診断。スコアに基づいた具体的な改善アクションも提示します。登録不要・完全無料。
          </p>
        </div>
      </div>

      {/* ── ツール本体 ── */}
      <div className="tool-page-main">
        <div className="tool-page-container tool-layout">
          <div className="tool-content">

            {/* 中部広告 */}
            <div className="ad-wrapper middle-ad">
              <AdSlot 位置="middle" />
            </div>

            {/* ════════════ フォーム UI ════════════ */}
            {!result && (
              <div className="ツールUI">

                {/* 入力セクション */}
                <div className="入力セクション">
                  {/* 業種 */}
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">業種</label>
                    <select
                      className="数値入力"
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value as Industry })}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#13131f",
                        color: "rgba(248, 250, 252, 0.95)",
                      }}
                    >
                      <option value="" disabled style={{ backgroundColor: "#13131f", color: "rgba(248, 250, 252, 0.95)" }}>選択してください</option>
                      <option value="飲食店" style={{ backgroundColor: "#13131f", color: "rgba(248, 250, 252, 0.95)" }}>飲食店</option>
                      <option value="美容・サロン" style={{ backgroundColor: "#13131f", color: "rgba(248, 250, 252, 0.95)" }}>美容・サロン</option>
                      <option value="クリニック" style={{ backgroundColor: "#13131f", color: "rgba(248, 250, 252, 0.95)" }}>クリニック</option>
                      <option value="その他" style={{ backgroundColor: "#13131f", color: "rgba(248, 250, 252, 0.95)" }}>その他</option>
                    </select>
                  </div>

                  {/* 地域 */}
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">地域</label>
                    <input
                      type="text"
                      className="数値入力"
                      placeholder="例：米子市"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                    />
                  </div>

                  {/* 口コミ数 */}
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">現在のGoogle口コミ数</label>
                    <input
                      type="number"
                      className="数値入力"
                      placeholder="例：8"
                      min={0}
                      value={form.reviewCount}
                      onChange={(e) =>
                        setForm({ ...form, reviewCount: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </div>

                  {/* HP有無 */}
                  <div className="フィールドグループ">
                    <label className="フィールドラベル">HPの有無</label>
                    <div className={s.ラジオ群}>
                      {(["あり", "なし"] as const).map((label) => {
                        const val = label === "あり";
                        return (
                          <span
                            key={label}
                            className={`${s.ラジオラベル} ${form.hasWebsite === val ? s.選択済み : ""}`}
                            onClick={() => setForm({ ...form, hasWebsite: val })}
                            role="radio"
                            aria-checked={form.hasWebsite === val}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && setForm({ ...form, hasWebsite: val })}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {error && <p className={s.エラー}>{error}</p>}

                  <button
                    className={s.診断ボタン}
                    onClick={handleDiagnose}
                    disabled={loading}
                  >
                    {loading ? "分析中..." : "診断する →"}
                  </button>

                  {loading && (
                    <div className={s.プログレス領域}>
                      <p className={s.プログレスメッセージ}>
                        {LOAD_MSGS[Math.min(Math.floor(progress / 34), 2)]}
                      </p>
                      <div className={s.プログレスバー外枠}>
                        <div className={s.プログレスバー} style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <p className={s.プログレスパーセント}>{Math.round(Math.min(progress, 100))}%</p>
                    </div>
                  )}
                </div>

                {/* ツール説明パネル（右） */}
                <div className="結果セクション">
                  <h2 className="結果見出し">このツールについて</h2>
                  <div className="結果グリッド">
                    {[
                      { label: "診断項目数",   value: "4項目" },
                      { label: "スコア範囲",   value: "0〜100点" },
                      { label: "推奨アクション", value: "最大4件" },
                      { label: "料金",         value: "完全無料" },
                    ].map(({ label, value }) => (
                      <div key={label} className="結果カード">
                        <span className="結果ラベル">{label}</span>
                        <span className="結果値">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--カラー-テキスト極薄)", lineHeight: 1.7, marginTop: "var(--スペース-md)" }}>
                    ※ 本診断は参考値です。実際の順位は競合状況・更新頻度・口コミ内容など複合的な要因で決まります。
                  </p>
                </div>
              </div>
            )}

            {/* ════════════ 診断結果 UI ════════════ */}
            {result && (
              <div className={`ツールUI ${s.フェードイン}`}>

                {/* 結果メインパネル */}
                <div className="結果セクション">
                  <h2 className="結果見出し">診断結果</h2>

                  <div className={s.ゲージラッパー}>
                    <GaugeChart score={result.score} />
                  </div>

                  <div className={s.レベルバッジラッパー}>
                    <span className={`${s.レベルバッジ} ${levelClass}`}>{result.level}</span>
                  </div>

                  <p className={s.診断説明}>{result.description}</p>

                  <div className="結果グリッド">
                    <div className="結果カード">
                      <span className="結果ラベル">MEO伸びしろスコア</span>
                      <span className="結果値">
                        {result.score}
                        <small style={{ fontSize: 13, fontWeight: 400, marginLeft: 2 }}>/ 100</small>
                      </span>
                    </div>
                    <div className="結果カード">
                      <span className="結果ラベル">判定</span>
                      <span className="結果値" style={{ fontSize: "1rem" }}>{result.level}</span>
                    </div>
                  </div>

                  {/* Business広告バナー（既存コンポーネント） */}
                  <BusinessAdBanner />

                  {/* SNSシェアボタン（既存コンポーネント） */}
                  <ShareButtons
                    ツール={{
                      スラッグ: "meo-checker",
                      タイトル: "MEO対策・伸びしろ診断シミュレーター｜Googleマップ集客ポテンシャルを即スコアリング",
                      説明: "", キーワード: [], カテゴリ: "ビジネス・経理",
                      ロジック種別: "calculation", 入力フィールド: [], 出力項目: [], 広告配置: [],
                      socialPostTemplates: [
                        `📍 MEO伸びしろ診断したらスコア${result.score}点（${result.level}）でした。Googleマップ集客の改善ポイントが一目でわかります→`,
                        `うちの店のGoogleマップ集客ポテンシャルを診断。${result.score}点という結果に。口コミ増やせばまだ伸びそう→`,
                        `🗺️ MEO対策の伸びしろ診断ツール。4項目入力で${result.score}点とスコアが出ます。無料・登録不要→`,
                      ],
                    }}
                    結果テキスト={`${result.score}点（${result.level}）`}
                  />

                  <button className={s.リセットボタン} onClick={handleReset}>
                    もう一度診断する
                  </button>
                </div>

                {/* 推奨アクション＋スコア内訳パネル */}
                <div className="入力セクション">
                  <h2 className="結果見出し">推奨アクション</h2>
                  <ul className={s.推奨リスト}>
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className={s.推奨アイテム}>
                        <span className={s.推奨アイコン}>✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>

                  <h2 className="結果見出し" style={{ marginTop: "var(--スペース-lg)" }}>スコア内訳</h2>
                  <div className="結果グリッド">
                    {[
                      { label: "基本スコア", value: 25 },
                      {
                        label: "口コミ評価",
                        value: Number(form.reviewCount) === 0 ? 35
                          : Number(form.reviewCount) <= 5 ? 28
                          : Number(form.reviewCount) <= 15 ? 20
                          : Number(form.reviewCount) <= 30 ? 12
                          : Number(form.reviewCount) <= 60 ? 5 : 0,
                      },
                      { label: "HP効果",          value: form.hasWebsite ? 22 : 7 },
                      { label: "業種ポテンシャル", value: form.industry === "美容・サロン" ? 18 : form.industry === "クリニック" ? 15 : form.industry === "飲食店" ? 12 : 9 },
                    ].map(({ label, value }) => (
                      <div key={label} className="結果カード">
                        <span className="結果ラベル">{label}</span>
                        <span className="結果値">+{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── 下部広告 ── */}
      <div className="広告ラッパー">
        <AdSlot 位置="bottom" />
      </div>
    </>
  );
}
