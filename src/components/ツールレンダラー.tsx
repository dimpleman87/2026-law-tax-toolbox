/**
 * src/components/ツールレンダラー.tsx
 * JSONのロジック種別に基づいた動的UIレンダリングコンポーネント
 *
 * ツール定義JSONの `ロジック種別` を読み取り、適切なUIを動的に生成します。
 * 新しいロジック種別を追加する場合は、このファイルにcaseを追加してください。
 */

"use client";

import { useState, useCallback } from "react";
import { ツール定義型 } from "@/lib/types";
import ShareButtons from "@/components/ShareButtons";

interface ツールレンダラーProps {
  ツール: ツール定義型;
}

/** 
 * 計算結果に応じたAIアドバイスを表示するサブコンポーネント 
 */
function AIAdvice({ ツール, 結果 }: { ツール: ツール定義型, 結果: Record<string, any> }) {
  let アドバイス = ツール.アドバイス || "結果を参考に、次のステップを検討しましょう。";

  // 特定のツールに対する動的ロジック（簡易版）
  if (ツール.スラッグ === "bmi-calculator" && 結果["BMI値"]) {
    const bmi = parseFloat(結果["BMI値"]);
    if (bmi >= 25) アドバイス = "適度な有酸素運動（ウォーキング等）を週2〜3回から始めてみましょう。";
    else if (bmi < 18.5) アドバイス = "栄養バランスの良い食事を心がけ、筋肉量を増やす運動を取り入れましょう。";
    else アドバイス = "理想的な体型を維持しています。今の生活習慣を継続しましょう！";
  } else if (ツール.スラッグ === "word-counter" && 結果["文字数"]) {
    const count = 結果["文字数"];
    if (count > 2000) アドバイス = "長文作成お疲れ様です！適度に休憩を挟んで目を休めてください。";
    else アドバイス = "サクサク執筆が進んでいますね。この調子で書き進めましょう！";
  }

  return (
    <div className="AIアドバイスエリア">
      <div className="アドバイスラベル">
        <span className="アイコン">💡</span> AIツール診断
      </div>
      <p className="アドバイス本文">{アドバイス}</p>
    </div>
  );
}

// ============================================================
// ロジック別の計算・変換ロジック
// ============================================================

/** テキスト入力分析の結果を計算します */
function テキスト分析計算(テキスト: string, 出力項目: string[]): Record<string, string | number> {
  const 結果: Record<string, string | number> = {};
  const トリム済み = テキスト.trim();

  for (const 項目 of 出力項目) {
    switch (項目) {
      case "文字数（全体）":
      case "文字数":
        結果[項目] = テキスト.length;
        break;
      case "文字数（空白・改行除く）":
      case "空白除く文字数":
        結果[項目] = テキスト.replace(/\s/g, "").length;
        break;
      case "単語数":
        結果[項目] = トリム済み ? トリム済み.split(/\s+/).length : 0;
        break;
      case "行数":
        結果[項目] = テキスト ? テキスト.split("\n").length : 0;
        break;
      case "段落数":
        結果[項目] = トリム済み ? トリム済み.split(/\n\s*\n/).filter(Boolean).length : 0;
        break;
      case "バイト数（UTF-8）":
        結果[項目] = new TextEncoder().encode(テキスト).length;
        break;
      default:
        結果[項目] = "-";
    }
  }
  return 結果;
}

// ============================================================
// サブコンポーネント — ロジック種別別のUI
// ============================================================

/** テキスト入力分析UI（例：文字数カウンター） */
function テキスト入力分析UI({ ツール }: { ツール: ツール定義型 }) {
  const [テキスト, setテキスト] = useState("");
  const 結果 = テキスト分析計算(テキスト, ツール.出力項目);

  return (
    <div className="ツールUI">
      {/* 入力エリア */}
      <div className="入力セクション">
        {ツール.入力フィールド.map((フィールド, インデックス) => (
          <div key={インデックス} className="フィールドグループ">
            <label htmlFor={`input-${インデックス}`} className="フィールドラベル">
              {フィールド.ラベル}
            </label>
            <textarea
              id={`input-${インデックス}`}
              className="テキストエリア"
              value={テキスト}
              onChange={(e) => setテキスト(e.target.value)}
              placeholder={フィールド.プレースホルダー || ""}
              rows={10}
              aria-label="Input area"
            />
            <div className="文字カウント表示">
              リアルタイム文字数: <strong>{テキスト.length}</strong> 文字
            </div>
          </div>
        ))}
        <button
          className="クリアボタン"
          onClick={() => setテキスト("")}
          aria-label="Clear text"
        >
          クリア
        </button>
      </div>

      {/* 結果エリア */}
      <div className="結果セクション" aria-live="polite" aria-label="Analysis results">
        <h2 className="結果見出し">解析結果</h2>
        <div className="結果グリッド">
          {ツール.出力項目.map((項目, インデックス) => (
            <div key={インデックス} className="結果カード">
              <span className="結果ラベル">{項目}</span>
              <span className="結果値">
                {typeof 結果[項目] === "number"
                  ? 結果[項目].toLocaleString("ja-JP")
                  : 結果[項目]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AIアドバイス */}
      <AIAdvice ツール={ツール} 結果={結果} />

      {/* SNSシェアボタン */}
      <ShareButtons
        ツール={ツール}
        結果テキスト={
          typeof 結果["文字数"] === "number"
            ? `${結果["文字数"].toLocaleString("ja-JP")}文字`
            : typeof 結果["文字数（全体）"] === "number"
            ? `${結果["文字数（全体）"].toLocaleString("ja-JP")}文字`
            : undefined
        }
      />
    </div>
  );
}

/** 数値計算UI（例：BMI計算機） */
function 数値計算UI({ ツール }: { ツール: ツール定義型 }) {
  const [値, set値] = useState<Record<string, string>>({});

  const handleChange = useCallback((ラベル: string, 新しい値: string) => {
    set値((前の値) => ({ ...前の値, [ラベル]: 新しい値 }));
  }, []);

  return (
    <div className="ツールUI">
      <div className="入力セクション">
        {ツール.入力フィールド.map((フィールド, インデックス) => (
          <div key={インデックス} className="フィールドグループ">
            <label htmlFor={`num-${インデックス}`} className="フィールドラベル">
              {フィールド.ラベル}
              {フィールド.単位 && <span className="単位表示">（{フィールド.単位}）</span>}
            </label>
            <input
              id={`num-${インデックス}`}
              type="number"
              className="数値入力"
              value={値[フィールド.ラベル] || ""}
              onChange={(e) => handleChange(フィールド.ラベル, e.target.value)}
              min={フィールド.最小値}
              max={フィールド.最大値}
              placeholder={フィールド.プレースホルダー || "0"}
              aria-label="Numerical input"
            />
          </div>
        ))}
      </div>
      <div className="結果セクション" aria-live="polite">
        <h2 className="結果見出し">計算結果</h2>
        <p className="プレースホルダーメッセージ">
          値を入力すると結果が表示されます
        </p>
      </div>

      {/* AIアドバイス（プレースホルダー的な位置づけ） */}
      <AIAdvice ツール={ツール} 結果={値} />

      {/* SNSシェアボタン */}
      <ShareButtons ツール={ツール} />
    </div>
  );
}

/** 日付計算UI（例：年齢計算機） */
function 日付計算UI({ ツール }: { ツール: ツール定義型 }) {
  const [日付値, set日付値] = useState<Record<string, string>>({});

  return (
    <div className="ツールUI">
      <div className="入力セクション">
        {ツール.入力フィールド.map((フィールド, インデックス) => (
          <div key={インデックス} className="フィールドグループ">
            <label htmlFor={`date-${インデックス}`} className="フィールドラベル">
              {フィールド.ラベル}
            </label>
            <input
              id={`date-${インデックス}`}
              type="date"
              className="日付入力"
              value={日付値[フィールド.ラベル] || ""}
              onChange={(e) => set日付値((prev) => ({ ...prev, [フィールド.ラベル]: e.target.value }))}
              aria-label="Date input"
            />
          </div>
        ))}
      </div>
      <div className="結果セクション" aria-live="polite">
        <h2 className="結果見出し">計算結果</h2>
        <p className="プレースホルダーメッセージ">
          日付を選択すると結果が表示されます
        </p>
      </div>

      {/* SNSシェアボタン */}
      <ShareButtons ツール={ツール} />
    </div>
  );
}

/** 未対応ロジック種別のフォールバックUI */
function 未対応UI({ ロジック種別 }: { ロジック種別: string }) {
  return (
    <div className="未対応メッセージ" role="alert">
      <span>⚠️ ロジック種別「{ロジック種別}」は現在開発中です。</span>
    </div>
  );
}

// ============================================================
// メインコンポーネント — ロジック種別に応じてUIを切り替え
// ============================================================

export default function ツールレンダラー({ ツール }: ツールレンダラーProps) {
  switch (ツール.ロジック種別) {
    case "text-analysis":
      return <テキスト入力分析UI ツール={ツール} />;
    case "calculation":
      return <数値計算UI ツール={ツール} />;
    case "date-calculation":
      return <日付計算UI ツール={ツール} />;
    case "conversion":
      return <未対応UI ロジック種別={ツール.ロジック種別} />;
    case "generator":
      return <未対応UI ロジック種別={ツール.ロジック種別} />;
    default:
      return <未対応UI ロジック種別={ツール.ロジック種別} />;
  }
}
