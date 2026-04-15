/**
 * src/lib/ad-links.ts
 * アフィリエイトリンク・広告設定の一元管理
 *
 * ここを更新するだけで全コンポーネントのリンクが変わります。
 * カテゴリ別に分けて管理してください。
 */

// ============================================================
// Pet カテゴリ
// ============================================================

export const PET_AD_LINKS = {
  /** Furbo ドッグカメラ（A8.net） */
  furbo: "https://px.a8.net/svt/ejp?a8mat=3HN4J2+64AJ8I+3SUY+5YJRM",

  /** わんマッチ DNA診断（リンク未取得 → 取得後に差し替え） */
  wannmatch: "https://wan-match.jp/",

  /** オーツーペット 酸素室レンタル（リンク未取得 → 取得後に差し替え） */
  o2pet: "https://www.o2-pet.com/",

  /** ドッグフード（Amazon汎用 → 専用リンク取得後に差し替え） */
  dogfood: "https://amzn.to/4cao6n8",
} as const;

// ============================================================
// Business / Creative カテゴリ
// ============================================================

export const BUSINESS_AD_LINKS = {
  /** マネーフォワード 確定申告（A8.net） */
  moneyforward: "https://px.a8.net/svt/ejp?a8mat=4B1KXN+B5AB4Y+4JGQ+BX3J6",

  /** Square 決済（A8.net） */
  square: "https://px.a8.net/svt/ejp?a8mat=3H9Y52+GEM5IA+3O4Y+626XU",

  /** Movie Hacks 動画編集（A8.net） */
  moviehacks: "https://px.a8.net/svt/ejp?a8mat=4B1LPO+B5AB4Y+4K3S+5YRHE",

  /** labol 資金調達（リンク未取得 → 取得後に差し替え） */
  labol: "https://labol.co.jp/",

  /** freee 会計（リンク未取得 → 取得後に差し替え） */
  freee: "https://www.freee.co.jp/",
} as const;

// ============================================================
// Diet / Health カテゴリ
// ============================================================

export const DIET_AD_LINKS = {
  /** CLOUD GYM 遺伝子検査（A8.net） */
  cloudgym: "https://px.a8.net/svt/ejp?a8mat=4B1KXR+6F0C4I+4RUO+5Z6WY",

  /** RIZAP（リンク未取得 → 取得後に差し替え） */
  rizap: "https://www.rizap.jp/",
} as const;

// ============================================================
// General（全ページ共通）
// ============================================================

export const GENERAL_AD_LINKS = {
  /** Amazon Fire TV Stick 等（汎用） */
  amazon: "https://amzn.to/4cao6n8",
} as const;

// ============================================================
// 楽天 モーションウィジェット設定（JS形式）
// ============================================================

/** フッター共通の楽天 300x250 ウィジェット設定 */
export const RAKUTEN_WIDGET_CONFIG = {
  design: "slide",
  affiliateId: "09432c2b.3b80bf27.1154261c.108c477c",
  items: "ctsmatch",
  genreId: "0",
  size: "300x250",
  target: "_blank",
  theme: "gray",
  border: "off",
  autoMode: "on",
  genreTitle: "off",
  recommend: "on",
  ts: "1776235044367",
} as const;
