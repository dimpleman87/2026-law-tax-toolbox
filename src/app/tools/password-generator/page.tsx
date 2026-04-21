"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import styles from "./password-generator.module.css";

const ツール定義 = {
  スラッグ: "password-generator",
  タイトル: "パスワード生成ツール",
  説明: "安全な強力パスワードをワンクリックで作成",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["強力パスワードを生成しました。安全なパスワード管理を→"],
};

const 文字セット = {
  大文字: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  小文字: "abcdefghijklmnopqrstuvwxyz",
  数字: "0123456789",
  記号: "!@#$%^&*()-_=+[]{}|;:,.<>?",
};

function パスワード強度判定(pw: string): { ラベル: string; レベル: number; color: string } {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { ラベル: "弱い", レベル: 1, color: "#f25acc" };
  if (score <= 3) return { ラベル: "普通", レベル: 2, color: "#fbbf24" };
  if (score <= 4) return { ラベル: "強い", レベル: 3, color: "#38bdf8" };
  return { ラベル: "非常に強い", レベル: 4, color: "#26d9ca" };
}

export default function パスワード生成ページ() {
  const [長さ, set長さ] = useState(16);
  const [使用文字, set使用文字] = useState({
    大文字: true,
    小文字: true,
    数字: true,
    記号: false,
  });
  const [パスワード, setパスワード] = useState("");
  const [履歴, set履歴] = useState<string[]>([]);
  const [コピー済み, setコピー済み] = useState(false);

  const 生成 = useCallback(() => {
    const pool = Object.entries(使用文字)
      .filter(([, on]) => on)
      .map(([key]) => 文字セット[key as keyof typeof 文字セット])
      .join("");

    if (!pool) return;

    const array = new Uint32Array(長さ);
    crypto.getRandomValues(array);
    const pw = Array.from(array, (n) => pool[n % pool.length]).join("");
    setパスワード(pw);
    set履歴((prev) => [pw, ...prev].slice(0, 5));
    setコピー済み(false);
  }, [長さ, 使用文字]);

  function コピー() {
    if (!パスワード) return;
    navigator.clipboard.writeText(パスワード).then(() => {
      setコピー済み(true);
      setTimeout(() => setコピー済み(false), 2000);
    });
  }

  const 強度 = パスワード ? パスワード強度判定(パスワード) : null;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>パスワード生成</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">パスワード生成ツール</h1>
          <p className="ツールページ説明">
            文字種と文字数を指定して、暗号学的に安全なランダムパスワードを生成します。ブラウザ内で完結するため外部送信ゼロ。
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
            {/* 設定パネル */}
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">
                  文字数: <strong style={{ color: "var(--カラー-プライマリ輝き)" }}>{長さ}</strong> 文字
                </label>
                <input
                  type="range"
                  min={6}
                  max={64}
                  value={長さ}
                  onChange={(e) => set長さ(Number(e.target.value))}
                  className={styles.スライダー}
                />
                <div className={styles.スライダー目盛}>
                  <span>6</span><span>16</span><span>32</span><span>64</span>
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">使用する文字種</label>
                <div className={styles.チェックグループ}>
                  {(Object.keys(使用文字) as (keyof typeof 使用文字)[]).map((key) => (
                    <label key={key} className={styles.チェックラベル}>
                      <input
                        type="checkbox"
                        checked={使用文字[key]}
                        onChange={(e) =>
                          set使用文字((prev) => ({ ...prev, [key]: e.target.checked }))
                        }
                        className={styles.チェックボックス}
                      />
                      <span>{key}</span>
                      <span className={styles.チェックサンプル}>
                        {key === "大文字" ? "ABC" : key === "小文字" ? "abc" : key === "数字" ? "123" : "!@#"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                className={styles.生成ボタン}
                onClick={生成}
                disabled={!Object.values(使用文字).some(Boolean)}
              >
                🔐 パスワードを生成
              </button>
            </div>

            {/* 結果パネル */}
            <div className="結果セクション">
              <div className="結果見出し">生成結果</div>

              {パスワード ? (
                <>
                  <div className={styles.パスワード表示}>
                    <code className={styles.パスワードコード}>{パスワード}</code>
                  </div>

                  {強度 && (
                    <div className={styles.強度表示}>
                      <div className={styles.強度バー外枠}>
                        {[1, 2, 3, 4].map((lv) => (
                          <div
                            key={lv}
                            className={styles.強度バーセグメント}
                            style={{
                              background: lv <= 強度.レベル ? 強度.color : "rgba(255,255,255,0.07)",
                            }}
                          />
                        ))}
                      </div>
                      <span className={styles.強度ラベル} style={{ color: 強度.color }}>
                        強度: {強度.ラベル}
                      </span>
                    </div>
                  )}

                  <button className={styles.コピーボタン} onClick={コピー}>
                    {コピー済み ? "✓ コピーしました" : "📋 クリップボードにコピー"}
                  </button>
                  <button className={styles.再生成ボタン} onClick={生成}>
                    🔄 別のパスワードを生成
                  </button>

                  {履歴.length > 1 && (
                    <div className={styles.履歴}>
                      <div className={styles.履歴見出し}>生成履歴（直近5件）</div>
                      {履歴.slice(1).map((pw, i) => (
                        <div key={i} className={styles.履歴アイテム}>
                          <code className={styles.履歴コード}>{pw}</code>
                          <button
                            className={styles.履歴コピー}
                            onClick={() => navigator.clipboard.writeText(pw)}
                          >
                            コピー
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="プレースホルダーメッセージ">
                  設定を選んで「生成」ボタンを押してください
                </p>
              )}
            </div>
          </div>

          {パスワード && (
            <ShareButtons
              ツール={ツール定義}
              結果テキスト="強力なパスワードを生成しました"
            />
          )}
        </div>
      </main>
    </>
  );
}
