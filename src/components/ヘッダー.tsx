/**
 * src/components/ヘッダー.tsx
 * グローバルナビゲーションヘッダー
 */

import Link from "next/link";

export default function ヘッダー() {
  return (
    <header className="グローバルヘッダー" role="banner">
      <div className="ヘッダーコンテナ">
        <Link href="/" className="ロゴリンク" aria-label="Back to home">
          <span className="ロゴアイコン" aria-hidden="true">⚡</span>
          <span className="ロゴテキスト">ToolBox</span>
          <span className="ロゴサブテキスト">無料オンラインツール集</span>
        </Link>

        <nav className="グローバルナビ" aria-label="Main navigation">
          <Link href="/" className="ナビリンク">ツール一覧</Link>
          <Link href="/#category-list" className="ナビリンク">カテゴリ</Link>
        </nav>
      </div>
    </header>
  );
}
