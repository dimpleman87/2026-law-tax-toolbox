"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ShareButtons from "@/components/ShareButtons";
import AffiliateSlot from "@/components/AffiliateSlot";
import FavoriteButton from "@/components/FavoriteButton";
import RelatedTools from "@/components/RelatedTools";
import CalcHistory from "@/components/CalcHistory";
import ToolJsonLd from "@/components/ToolJsonLd";
import styles from "./construction-permit-check.module.css";
import ToolGuide from "@/components/ToolGuide";

const ツール定義 = {
  スラッグ: "construction-permit-check",
  タイトル: "建設業許可要件チェック",
  説明: "許可取得・更新の主要5要件を簡易判定",
  カテゴリ: "士業・法務",
  category: "Legal",
  ロジック種別: "calculation" as const,
  入力フィールド: [], 出力項目: [],
  広告配置: ["top", "middle", "bottom"] as ("top" | "middle" | "bottom")[],
  関連ツール: [], キーワード: [], 本文: "",
  socialPostTemplates: ["🏗️ 建設業許可の取得要件をチェック。5要件の充足状況を診断→"],
};

export default function 建設業許可チェックページ() {
  const [経営経験年数, set経営経験年数] = useState("5");
  const [専任技術者, set専任技術者] = useState<"資格あり" | "実務10年" | "なし">("資格あり");
  const [純資産万, set純資産万] = useState("500");
  const [欠格事由, set欠格事由] = useState(false);
  const [社会保険, set社会保険] = useState(true);

  const 結果 = useMemo(() => {
    const 経営 = parseInt(経営経験年数) || 0;
    const 純資産 = parseInt(純資産万) || 0;

    const 要件判定 = [
      {
        名称: "経営業務の管理責任者",
        充足: 経営 >= 5,
        説明: 経営 >= 5
          ? `${経営}年の経験あり（要件：5年以上）`
          : `経験${経営}年（要件：5年以上、あと${5 - 経営}年不足）`,
      },
      {
        名称: "専任技術者",
        充足: 専任技術者 !== "なし",
        説明: 専任技術者 === "資格あり"
          ? "国家資格保有者あり"
          : 専任技術者 === "実務10年"
          ? "実務経験10年以上あり"
          : "要件未充足（国家資格または10年実務経験が必要）",
      },
      {
        名称: "財産的基礎（一般建設業）",
        充足: 純資産 >= 500,
        説明: 純資産 >= 500
          ? `純資産${純資産}万円（要件：500万円以上）`
          : `純資産${純資産}万円（要件：500万円以上、¥${(500 - 純資産).toLocaleString("ja-JP")}万円不足）`,
      },
      {
        名称: "誠実性（欠格事由なし）",
        充足: !欠格事由,
        説明: 欠格事由
          ? "欠格事由に該当する可能性あり（許可不可）"
          : "欠格事由に該当なし",
      },
      {
        名称: "社会保険加入",
        充足: 社会保険,
        説明: 社会保険
          ? "社会保険加入済み"
          : "社会保険未加入（2020年10月から必須要件）",
      },
    ];

    const 充足数 = 要件判定.filter((r) => r.充足).length;
    const 取得可能 = 充足数 === 5;

    return { 要件判定, 充足数, 取得可能 };
  }, [経営経験年数, 専任技術者, 純資産万, 欠格事由, 社会保険]);

  const 結果テキスト = `建設業許可要件：${結果.充足数}/5項目充足${結果.取得可能 ? "（取得可能）" : "（要件不足あり）"}`;

  return (
    <>
      <div className="ツールページヘッダー">
        <div className="ツールページコンテナ">
          <ToolJsonLd スラッグ="construction-permit-check" タイトル="建設業許可要件チェック" 説明="許可取得・更新の主要5要件を簡易判定" カテゴリ="士業・法務" />
          <nav className="パンくずリスト" aria-label="breadcrumb">
            <ol>
              <li><Link href="/">ホーム</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/#cat-legal">士業・法務</Link></li>
              <li aria-hidden="true">›</li>
              <li>建設業許可要件チェック</li>
            </ol>
          </nav>
          <h1 className="ツールページタイトル">🏗️ 建設業許可要件チェック</h1>
          <FavoriteButton slug="construction-permit-check" title="建設業許可要件チェック" emoji="🏗️" />
          <p className="ツールページ説明">
            経営経験年数・専任技術者・財産的基礎など主要5要件を入力するだけで
            建設業許可（一般建設業）の取得可能性を簡易診断。申請前の確認に。
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
                <label className="フィールドラベル">経営業務の管理責任者としての経験年数</label>
                <input type="number" className="数値入力" value={経営経験年数}
                  onChange={(e) => set経営経験年数(e.target.value)} min="0" max="30" step="1" />
                <div className={styles.クイック群}>
                  {["3","5","7","10"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${経営経験年数 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set経営経験年数(v)}>{v}年</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">専任技術者</label>
                <div className={styles.クイック群}>
                  {[["資格あり","国家資格保有"],["実務10年","実務経験10年以上"],["なし","該当者なし"]].map(([v, l]) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${専任技術者 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set専任技術者(v as "資格あり" | "実務10年" | "なし")}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">純資産額（万円）</label>
                <input type="number" className="数値入力" value={純資産万}
                  onChange={(e) => set純資産万(e.target.value)} min="0" step="50" />
                <div className={styles.クイック群}>
                  {["200","500","1000","2000"].map((v) => (
                    <button key={v}
                      className={`${styles.クイックボタン} ${純資産万 === v ? styles.クイックボタンアクティブ : ""}`}
                      onClick={() => set純資産万(v)}>{v}万</button>
                  ))}
                </div>
              </div>

              <div className="フィールドグループ">
                <label className="フィールドラベル">状況確認</label>
                <div className={styles.チェック群}>
                  {[
                    { label: "欠格事由に該当する（禁錮以上の刑・許可取消から5年以内等）", val: 欠格事由, set: set欠格事由 },
                    { label: "社会保険（健康保険・厚生年金）に加入している", val: 社会保険, set: set社会保険 },
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
              <div className="結果見出し">許可要件チェック結果</div>

              <div className={styles.結果コンテンツ}>
                <div className={styles.メインカード} style={{
                  background: 結果.取得可能
                    ? "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)"
                    : "linear-gradient(135deg, rgba(242,90,204,0.12) 0%, rgba(245,158,11,0.08) 100%)",
                  borderColor: 結果.取得可能 ? "rgba(16,185,129,0.3)" : "rgba(242,90,204,0.3)",
                }}>
                  <span className={styles.メインラベル}>充足要件数</span>
                  <span className={styles.メイン値} style={{ color: 結果.取得可能 ? "#10b981" : "#f25acc" }}>
                    {結果.充足数}<span className={styles.メイン単位}>/5項目</span>
                  </span>
                  <span className={styles.メインサブ} style={{ color: 結果.取得可能 ? "#10b981" : "#f59e0b" }}>
                    {結果.取得可能 ? "✓ 許可取得の目安を満たしています" : "⚠️ 不足要件があります（目安）"}
                  </span>
                </div>

                <div className={styles.内訳}>
                  <div className={styles.内訳タイトル}>5要件の判定結果（目安）</div>
                  {結果.要件判定.map((req) => (
                    <div key={req.名称} className={styles.判定行}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--カラー-テキスト)" }}>{req.名称}</div>
                        <div style={{ fontSize: 11, marginTop: 2 }}>{req.説明}</div>
                      </div>
                      <span className={styles.バッジ} style={{
                        background: req.充足 ? "rgba(16,185,129,0.15)" : "rgba(242,90,204,0.15)",
                        color: req.充足 ? "#10b981" : "#f25acc",
                      }}>
                        {req.充足 ? "充足" : "不足"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.情報カード}>
                  <div className={styles.情報タイトル}>注意事項</div>
                  <div className={styles.情報テキスト}>
                    この判定は概算目安です。実際の許可申請には都道府県の建設業許可窓口での確認、
                    または行政書士へのご相談をお勧めします。
                  </div>
                </div>
              </div>

              <AffiliateSlot カテゴリ="business" />
              <ShareButtons ツール={ツール定義} 結果テキスト={結果テキスト} />
            </div>
          </div>


          <ToolGuide slug="construction-permit-check" />
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
