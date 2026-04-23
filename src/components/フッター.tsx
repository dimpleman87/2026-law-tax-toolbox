/**
 * src/components/フッター.tsx
 * グローバルフッター（強化版）
 */

import Link from "next/link";
import RakutenWidget from "@/components/RakutenWidget";

const カテゴリリンク = [
  { label: "💰 金融・投資",    href: "/#cat-finance"  },
  { label: "💼 ビジネス・経理", href: "/#cat-business" },
  { label: "⚖️ 士業・法務",    href: "/#cat-legal"    },
  { label: "🚀 IT・DX推進",    href: "/#cat-it"       },
  { label: "📝 テキスト解析",  href: "/#cat-text"     },
  { label: "🛠️ 生活・計算",    href: "/#cat-life"     },
  { label: "🐾 ペット",        href: "/#cat-pet"      },
];

const 人気ツールリンク = [
  { label: "MEO伸びしろ診断",         href: "/tools/meo-checker"        },
  { label: "ROAS・ROI計算機",         href: "/tools/roas-calculator"    },
  { label: "フリーランス手取り試算",   href: "/tools/freelance-tax"      },
  { label: "文字数カウンター",         href: "/tools/word-counter"       },
  { label: "QRコード生成",             href: "/tools/qr-generator"       },
  { label: "パスワード生成",           href: "/tools/password-generator" },
];

export default function フッター() {
  const 現在年 = new Date().getFullYear();

  return (
    <footer className="グローバルフッター" role="contentinfo">
      <div className="フッターコンテナ">
        <div className="フッターグリッド新">
          {/* ブランド */}
          <div className="フッターブランド">
            <Link href="/" className="フッターロゴリンク">
              <span className="フッターロゴアイコン">⚡</span>
              <span className="フッターロゴ">ToolBox</span>
            </Link>
            <p className="フッター説明">
              ビジネス・金融・DX・テキスト解析まで62種類の無料オンラインツール集。
              登録不要・完全無料でブラウザ上からすぐ使えます。
            </p>
            <div className="フッターバッジ群">
              <span className="フッターバッジ">✓ 完全無料</span>
              <span className="フッターバッジ">✓ 登録不要</span>
              <span className="フッターバッジ">✓ 62種類</span>
            </div>
          </div>

          {/* カテゴリ */}
          <div className="フッターリンク群">
            <h3 className="フッター見出し">カテゴリ</h3>
            <nav aria-label="カテゴリナビ">
              <ul className="フッターリスト">
                {カテゴリリンク.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="フッターリンク">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 人気ツール */}
          <div className="フッターリンク群">
            <h3 className="フッター見出し">人気ツール</h3>
            <nav aria-label="人気ツールナビ">
              <ul className="フッターリスト">
                {人気ツールリンク.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="フッターリンク">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* サイト情報 */}
          <div className="フッターリンク群">
            <h3 className="フッター見出し">サイト情報</h3>
            <nav aria-label="サイト情報ナビ">
              <ul className="フッターリスト">
                <li><Link href="/about"   className="フッターリンク">運営者情報</Link></li>
                <li><Link href="/privacy" className="フッターリンク">プライバシーポリシー</Link></li>
                <li><Link href="/contact" className="フッターリンク">お問い合わせ</Link></li>
                <li>
                  <a
                    href="https://forms.gle/Zvgd2adx4JJHvo14A"
                    className="フッターリンク"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    不備・改善要望
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* 楽天ウィジェット */}
        <div className="フッター楽天">
          <RakutenWidget className="mx-auto" />
        </div>

        {/* コピーライト */}
        <div className="フッター下部">
          <p className="コピーライト">© {現在年} ToolBox — 無料オンラインツール集</p>
          <p className="免責事項">本サービスは情報提供を目的としています。計算結果の正確性について保証するものではありません。</p>
        </div>
      </div>
    </footer>
  );
}
