"use client";

import { useState } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import styles from "./qr-generator.module.css";

const ツール定義 = {
  スラッグ: "qr-generator",
  タイトル: "QRコード生成ツール",
  説明: "URLや文字列を即QRコードに変換",
  カテゴリ: "IT・DX推進",
  category: "IT",
  ロジック種別: "generator" as const,
  入力フィールド: [],
  出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [],
  キーワード: [],
  本文: "",
  socialPostTemplates: ["QRコードを生成しました→"],
};

const サイズ選択肢 = [
  { ラベル: "小（150px）", 値: 150 },
  { ラベル: "中（250px）", 値: 250 },
  { ラベル: "大（400px）", 値: 400 },
];

const エラー訂正選択肢 = [
  { ラベル: "L（低・小サイズ）", 値: "L" },
  { ラベル: "M（中・標準）", 値: "M" },
  { ラベル: "H（高・耐久性）", 値: "H" },
];

export default function QRコード生成ページ() {
  const [入力値, set入力値] = useState("");
  const [サイズ, setサイズ] = useState(250);
  const [エラー訂正, setエラー訂正] = useState("M");
  const [生成済みURL, set生成済みURL] = useState("");
  const [生成済み入力, set生成済み入力] = useState("");

  function 生成() {
    if (!入力値.trim()) return;
    const encoded = encodeURIComponent(入力値.trim());
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${サイズ}x${サイズ}&data=${encoded}&ecc=${エラー訂正}&margin=10&format=png`;
    set生成済みURL(url);
    set生成済み入力(入力値.trim());
  }

  function ダウンロード() {
    if (!生成済みURL) return;
    const a = document.createElement("a");
    a.href = 生成済みURL;
    a.download = "qrcode.png";
    a.target = "_blank";
    a.click();
  }

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li>QRコード生成</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">QRコード生成ツール</h1>
          <p className="ツールページ説明">
            URLやテキストを入力するだけで、即座にQRコードを生成します。サイズ・エラー訂正レベル選択可能。
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
            {/* 入力パネル */}
            <div className="入力セクション">
              <div className="フィールドグループ">
                <label className="フィールドラベル">QRコードに変換するURL・テキスト</label>
                <textarea
                  className="テキストエリア"
                  rows={4}
                  value={入力値}
                  onChange={(e) => set入力値(e.target.value)}
                  placeholder="https://toolbox-free.com"
                  spellCheck={false}
                />
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">サイズ</label>
                <div className={styles.選択肢グループ}>
                  {サイズ選択肢.map((opt) => (
                    <button
                      key={opt.値}
                      className={`${styles.選択ボタン} ${サイズ === opt.値 ? styles.選択ボタンアクティブ : ""}`}
                      onClick={() => setサイズ(opt.値)}
                    >
                      {opt.ラベル}
                    </button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">エラー訂正レベル</label>
                <div className={styles.選択肢グループ}>
                  {エラー訂正選択肢.map((opt) => (
                    <button
                      key={opt.値}
                      className={`${styles.選択ボタン} ${エラー訂正 === opt.値 ? styles.選択ボタンアクティブ : ""}`}
                      onClick={() => setエラー訂正(opt.値)}
                    >
                      {opt.ラベル}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={styles.生成ボタン}
                onClick={生成}
                disabled={!入力値.trim()}
              >
                🔲 QRコードを生成
              </button>
            </div>

            {/* 結果パネル */}
            <div className="結果セクション">
              <div className="結果見出し">生成されたQRコード</div>

              {生成済みURL ? (
                <div className={styles.QR表示領域}>
                  <div className={styles.QR画像ラッパー}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={生成済みURL}
                      alt={`QRコード: ${生成済み入力}`}
                      className={styles.QR画像}
                      width={サイズ}
                      height={サイズ}
                    />
                  </div>
                  <p className={styles.QRデータ表示}>
                    <span className={styles.QRデータラベル}>データ:</span>
                    <span className={styles.QRデータ値}>
                      {生成済み入力.length > 50 ? 生成済み入力.slice(0, 50) + "…" : 生成済み入力}
                    </span>
                  </p>
                  <button className={styles.ダウンロードボタン} onClick={ダウンロード}>
                    ⬇ PNG形式でダウンロード
                  </button>
                  <p className={styles.注意書き}>
                    ※ダウンロードできない場合は画像を右クリック→「名前を付けて保存」
                  </p>
                </div>
              ) : (
                <div className={styles.QRプレースホルダー}>
                  <div className={styles.QRプレースホルダーアイコン}>🔲</div>
                  <p className="プレースホルダーメッセージ" style={{ padding: 0, marginTop: "8px" }}>
                    URLを入力して生成ボタンを押してください
                  </p>
                </div>
              )}
            </div>
          </div>

          {生成済みURL && (
            <ShareButtons
              ツール={ツール定義}
              結果テキスト="QRコードを生成しました"
            />
          )}
        </div>
      </main>
    </>
  );
}
