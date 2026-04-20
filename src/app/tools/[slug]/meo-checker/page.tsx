"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Industry = "飲食店" | "美容・サロン" | "クリニック" | "その他";

interface FormData {
  industry: Industry | "";
  region: string;
  reviewCount: number | "";
  hasWebsite: boolean | null;
}

interface DiagnosisResult {
  score: number;
  level: string;
  description: string;
  recommendations: string[];
}

// ─── Scoring Logic ────────────────────────────────────────────────────────────

function calculateScore(data: FormData): DiagnosisResult {
  let score = 25; // base

  // 口コミ数：少ないほど伸びしろ大
  const reviews = Number(data.reviewCount) || 0;
  if (reviews === 0) score += 35;
  else if (reviews <= 5) score += 28;
  else if (reviews <= 15) score += 20;
  else if (reviews <= 30) score += 12;
  else if (reviews <= 60) score += 5;
  else score += 0;

  // HP：あるほど検索エンジンからの信頼性・連携効果が高い
  if (data.hasWebsite === true) score += 22;
  else score += 7;

  // 業種別加算（競合密度・需要）
  const industryBonus: Record<Industry, number> = {
    "美容・サロン": 18,
    "クリニック": 15,
    "飲食店": 12,
    "その他": 9,
  };
  score += data.industry ? industryBonus[data.industry as Industry] : 9;

  score = Math.min(100, Math.max(0, Math.round(score)));

  const level =
    score >= 70 ? "高伸びしろ" : score >= 40 ? "中伸びしろ" : "現状維持型";

  const descriptionMap: Record<string, string> = {
    "高伸びしろ": `${data.region}エリアの${data.industry}市場において、MEO対策の伸びしろが非常に高い状態です。今すぐ対策を始めることで、3ヶ月以内に検索順位の大幅な改善が期待できます。`,
    "中伸びしろ": `${data.region}エリアで競合と差をつけるチャンスが十分あります。口コミ強化と情報最適化で着実に上位表示を狙えます。`,
    "現状維持型": `すでに一定のMEO基盤ができています。さらなる口コミ獲得と写真追加・投稿の継続で、より高い順位を狙えます。`,
  };

  const recs: string[] = [];
  if (reviews < 20) recs.push("口コミ獲得の仕組み化（LINE・来店後フォロー）");
  if (!data.hasWebsite) recs.push("HP作成でGoogleからの信頼性・連携効果を向上");
  recs.push("Googleビジネスプロフィールに写真を週1枚追加");
  recs.push("営業時間・特別営業日の定期更新");
  if (data.industry === "美容・サロン" || data.industry === "飲食店") {
    recs.push("予約リンク追加で直接予約導線を最適化");
  }
  recs.push("Googleへの投稿（最新情報）を月4回以上");

  return {
    score,
    level,
    description: descriptionMap[level],
    recommendations: recs.slice(0, 4),
  };
}

// ─── SVG Gauge ───────────────────────────────────────────────────────────────

function GaugeChart({ score }: { score: number }) {
  const cx = 110;
  const cy = 110;
  const R = 85;
  const SW = 18;

  // Arc from -210° to +30° (240° sweep)
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const polarXY = (deg: number) => ({
    x: cx + R * Math.cos(toRad(deg)),
    y: cy + R * Math.sin(toRad(deg)),
  });

  const arc = (from: number, to: number) => {
    const s = polarXY(from);
    const e = polarXY(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${e.x} ${e.y} A ${R} ${R} 0 ${large} 0 ${s.x} ${s.y}`;
  };

  const startDeg = -210;
  const endDeg = 30;
  const scoreDeg = startDeg + (score / 100) * (endDeg - startDeg);

  const scoreColor =
    score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";

  const needle = polarXY(scoreDeg);

  return (
    <svg viewBox="0 0 220 150" className="w-full max-w-[280px] mx-auto select-none">
      {/* Track */}
      <path
        d={arc(startDeg, endDeg)}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={SW}
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={arc(startDeg, scoreDeg)}
        fill="none"
        stroke={scoreColor}
        strokeWidth={SW}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s ease-out" }}
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needle.x}
        y2={needle.y}
        stroke="#1f2937"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill="#1f2937" />
      {/* Labels */}
      <text x={cx} y={cy + 28} textAnchor="middle" style={{ fontSize: 30, fontWeight: 700, fill: scoreColor }}>
        {score}
      </text>
      <text x={cx} y={cy + 44} textAnchor="middle" style={{ fontSize: 11, fill: "#9ca3af" }}>
        / 100
      </text>
    </svg>
  );
}

// ─── SmartAd (Business) ──────────────────────────────────────────────────────

const AD_DATA = [
  {
    brand: "Square",
    tagline: "無料POSレジで売上を一元管理",
    body: "初期費用0円・月額0円。飲食店・サロンに選ばれる決済ソリューション。",
    gradient: "from-sky-600 to-blue-800",
    cta: "無料で始める",
    href: "https://squareup.com/jp/ja",
  },
  {
    brand: "マネーフォワード",
    tagline: "クラウド会計で経営をシンプルに",
    body: "小規模事業者向けの請求書・確定申告自動化。30日間無料。",
    gradient: "from-teal-500 to-emerald-700",
    cta: "無料体験を始める",
    href: "https://biz.moneyforward.com",
  },
  {
    brand: "Movie Hacks",
    tagline: "短尺動画でGoogleマップを制す",
    body: "Googleビジネスプロフィールに動画を追加し、閲覧数・来店数を底上げ。",
    gradient: "from-orange-500 to-rose-600",
    cta: "詳しく見る",
    href: "#",
  },
];

function SmartAd() {
  // Stable random selection on mount (avoids hydration mismatch with lazy init)
  const [idx] = useState(() => Math.floor(Math.random() * AD_DATA.length));
  const ad = AD_DATA[idx];

  return (
    <div className="mt-8">
      <p className="text-[10px] text-gray-400 text-center mb-2 tracking-wider uppercase">
        Sponsored
      </p>
      <div className={`bg-gradient-to-r ${ad.gradient} rounded-2xl p-5 text-white`}>
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold opacity-75 uppercase tracking-wide">
              {ad.brand}
            </p>
            <h3 className="text-base font-bold mt-0.5 leading-snug">{ad.tagline}</h3>
            <p className="text-xs mt-1.5 opacity-85 leading-relaxed">{ad.body}</p>
          </div>
          <a
            href={ad.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white/90 hover:bg-white text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-sm"
          >
            {ad.cta}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Loading Overlay ─────────────────────────────────────────────────────────

function LoadingBar({ progress }: { progress: number }) {
  const messages = [
    "周辺の競合状況を分析中...",
    "Googleマップデータを照合中...",
    "伸びしろスコアを計算中...",
  ];
  const msgIdx = Math.min(Math.floor(progress / 34), messages.length - 1);

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500 mb-3 h-5 transition-all">{messages[msgIdx]}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">{Math.round(Math.min(progress, 100))}%</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MeoCheckerPage() {
  const [form, setForm] = useState<FormData>({
    industry: "",
    region: "",
    reviewCount: "",
    hasWebsite: null,
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");

  const isValid =
    form.industry !== "" &&
    form.region.trim() !== "" &&
    form.reviewCount !== "" &&
    form.hasWebsite !== null;

  const handleDiagnose = async () => {
    if (!isValid) {
      setError("すべての項目を入力してください。");
      return;
    }
    setError("");
    setLoading(true);
    setProgress(0);
    setResult(null);

    // Simulate progressive loading over ~3 seconds
    const tick = () => {
      setProgress((prev) => {
        const next = prev + Math.random() * 18 + 4;
        return next >= 95 ? 95 : next;
      });
    };
    const interval = setInterval(tick, 180);

    await new Promise<void>((res) => setTimeout(res, 3000));
    clearInterval(interval);
    setProgress(100);

    await new Promise<void>((res) => setTimeout(res, 250));
    setLoading(false);
    setResult(calculateScore(form));
  };

  const handleReset = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="max-w-md mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3.5 py-1 rounded-full tracking-wide mb-3">
            無料診断ツール
          </span>
          <h1 className="text-[1.65rem] font-extrabold text-gray-900 leading-tight">
            MEO対策・伸びしろ診断
          </h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Googleマップ集客ポテンシャルを
            <br />
            4項目で即スコアリング
          </p>
        </div>

        {/* ── Form Card ── */}
        {!result && (
          <div className="bg-white rounded-3xl shadow-xl p-8">

            {/* 業種 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                業種
              </label>
              <select
                value={form.industry}
                onChange={(e) =>
                  setForm({ ...form, industry: e.target.value as Industry })
                }
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  選択してください
                </option>
                <option value="飲食店">飲食店</option>
                <option value="美容・サロン">美容・サロン</option>
                <option value="クリニック">クリニック</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* 地域 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                地域
              </label>
              <input
                type="text"
                placeholder="例：米子市"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-gray-800 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* 口コミ数 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                現在のGoogle口コミ数
              </label>
              <input
                type="number"
                placeholder="例：8"
                min={0}
                value={form.reviewCount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reviewCount:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-gray-800 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* HP有無 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                HPの有無
              </label>
              <div className="flex gap-3">
                {(
                  [
                    { label: "あり", value: true },
                    { label: "なし", value: false },
                  ] as const
                ).map((opt) => (
                  <label
                    key={String(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer border-2 text-sm font-semibold transition-all select-none ${
                      form.hasWebsite === opt.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="hasWebsite"
                      className="sr-only"
                      checked={form.hasWebsite === opt.value}
                      onChange={() =>
                        setForm({ ...form, hasWebsite: opt.value })
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
            )}

            {/* CTA */}
            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-emerald-200"
            >
              {loading ? "分析中..." : "診断する →"}
            </button>

            {/* Progress */}
            {loading && <LoadingBar progress={progress} />}
          </div>
        )}

        {/* ── Result Card ── */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
            {/* Title */}
            <div className="text-center mb-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                診断結果
              </p>
              <p className="text-sm text-gray-500">
                {form.region}・{form.industry}
              </p>
            </div>

            {/* Gauge */}
            <div className="my-4">
              <GaugeChart score={result.score} />
            </div>

            {/* Badge */}
            <div className="text-center mb-5">
              <span
                className={`inline-block text-sm font-bold px-5 py-1.5 rounded-full ${
                  result.score >= 70
                    ? "bg-emerald-100 text-emerald-700"
                    : result.score >= 40
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {result.level}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed text-center mb-6">
              {result.description}
            </p>

            {/* Recommendations */}
            <div className="bg-gray-50 rounded-2xl p-5 shadow-inner">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                推奨アクション
              </p>
              <ul className="space-y-2.5">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-0.5 text-emerald-500 font-bold shrink-0">✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* SmartAd */}
            <SmartAd />

            {/* Re-diagnose */}
            <button
              onClick={handleReset}
              className="w-full mt-6 border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 font-semibold py-3 rounded-2xl text-sm transition-all"
            >
              もう一度診断する
            </button>
          </div>
        )}

        <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
          ※ 本診断は参考値です。実際の順位は競合状況により異なります。
        </p>
      </div>
    </div>
  );
}