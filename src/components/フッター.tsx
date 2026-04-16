/**
 * src/components/フッター.tsx
 * グローバルフッター
 */

import Link from "next/link";
import RakutenWidget from "@/components/RakutenWidget";

export default function フッター() {
  const 現在年 = new Date().getFullYear();

  return (
    <footer className="グローバルフッター" role="contentinfo">
      <div className="フッターコンテナ">
        <div className="フッターグリッド">
          <div className="フッターブランド">
            <span className="フッターロゴ">ToolBox</span>
            <p className="フッター説明">
              無料で使えるWeb便利ツール集。
              テキスト処理・計算・変換など多数のツールを提供しています。
            </p>
          </div>

          <div className="フッターリンク群">
            <h3 className="フッター見出し">ツールカテゴリ</h3>
            <nav aria-label="Footer navigation">
              <ul className="フッターリスト">
                <li><Link href="/#cat-0" className="フッターリンク">金融・投資</Link></li>
                <li><Link href="/#cat-1" className="フッターリンク">ビジネス</Link></li>
                <li><Link href="/#cat-2" className="フッターリンク">士業・法務</Link></li>
                <li><Link href="/#cat-3" className="フッターリンク">IT・DX推進</Link></li>
                <li><Link href="/about" className="フッターリンク">運営者情報</Link></li>
                <li><Link href="/privacy" className="フッターリンク">プライバシー・免責事項</Link></li>
                <li><Link href="/contact" className="フッターリンク">お問い合わせ</Link></li>
                <li>
                  <a
                    href="https://forms.gle/Zvgd2adx4JJHvo14A"
                    className="フッターリンク"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    不備報告・お問い合わせ
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* 楽天アフィリエイトウィジェット */}
        <div style={{ padding: "24px 0 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <RakutenWidget className="mx-auto" />
        </div>

        <div className="フッター下部">
          <p className="コピーライト">
            {現在年} ToolBox - 無料オンラインツール集
          </p>
          <p className="免責事項">
            本サービスは情報提供を目的としています。計算結果の正確性について保証するものではありません。
          </p>
     