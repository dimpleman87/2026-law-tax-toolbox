/**
 * src/components/ヘッダー.tsx
 * グローバルナビゲーションヘッダー（強化版）
 */

import Link from "next/link";

export default function ヘッダー() {
  return (
    <header className="グローバルヘッダー" role="banner">
      <div className="ヘッダーコンテナ">
        {/* ロゴ */}
        <Link href="/" className="ロゴリンク" aria-label="ToolBox トップへ">
          <span className="ロゴアイコン" aria-hidden="true">⚡</span>
          <span className="ロゴテキスト">ToolBox</span>
          <span className="ロゴサブテキスト">無料オンラインツール集</span>
        </Link>

        {/* 統計（PC only） */}
        <div className="ヘッダー統計" aria-hidden="true">
          <span className="ヘッダー統計アイテム">51 ツール</span>
          <span className="ヘッダー統計区切り">·</span>
          <span className="ヘッダー統計アイテム">完全無料</span>
          <span className="ヘッダー統計区切り">·</span>
          <span className="ヘッダー統計アイテム">登録不要</span>
        </div>

        {/* ナビゲーション */}
        <nav className="グローバルナビ" aria-label="メインナビゲーション">
          <Link href="/" className="ナビリンク">ホーム</Link>
          <Link href="/#category-list" className="ナビリンク">ツール一覧</Link>
          <Link href="/#cat-business" className="ナビリンク">ビジネス</Link>
          <Link href="/#cat-finance" className="ナビリンク">金融</Link>
          <Link href="/#popular-heading" className="ナビリンク ナビリンクハイライト">人気ツール</Link>
        </nav>
      </div>
    </header>
  );
}
