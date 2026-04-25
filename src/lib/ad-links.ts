/**
 * src/lib/ad-links.ts
 * アフィリエイトリンク・広告設定の一元管理
 *
 * ここを更新するだけで全コンポーネントのリンクが変わります。
 * カテゴリ別に分けて管理してください。
 */

/** Amazon アソシエイツ タグ */
export const AMAZON_TAG = "toolboxfree-22";

/** Amazon 検索リンク生成ヘルパー */
export const amz = (keyword: string) =>
  `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_TAG}`;

/** Amazon 個別商品リンク生成ヘルパー（ASIN指定） */
export const amzAsin = (asin: string) =>
  `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TAG}`;

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

  /** ドッグフード（Amazon） */
  dogfood: amz("ドッグフード 無添加"),

  /** ペット保険（Amazon比較本） */
  petInsuranceBook: amz("ペット保険 比較"),

  /** キャットフード（Amazon） */
  catfood: amz("キャットフード 国産"),

  /** ペット用品総合（Amazon） */
  petGoods: amz("ペット用品"),

  /** マイクロチップ関連（Amazon） */
  microchip: amz("犬 マイクロチップ リーダー"),
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

  /** 確定申告・税務書籍（Amazon） */
  taxBook: amz("確定申告 本 2026"),

  /** 会計ソフト比較本（Amazon） */
  accountingBook: amz("会計ソフト 比較 freee マネーフォワード"),

  /** 起業・会社設立本（Amazon） */
  startupBook: amz("会社設立 手続き 本"),

  /** 補助金・助成金申請本（Amazon） */
  subsidyBook: amz("補助金 申請 ものづくり IT導入"),

  /** freee 会計（Amazon 検索） */
  freee: amz("freee 会計 クラウド"),

  /** labol 資金調達支援（Amazon 検索） */
  labol: amz("補助金 助成金 申請代行"),
} as const;

// ============================================================
// IT / DX カテゴリ
// ============================================================

export const IT_AD_LINKS = {
  /** DX推進・デジタル化本（Amazon） */
  dxBook: amz("DX推進 中小企業 実践"),

  /** RPA・自動化本（Amazon） */
  rpaBook: amz("RPA 業務自動化 入門"),

  /** クラウド活用本（Amazon） */
  cloudBook: amz("AWS クラウド 入門"),

  /** セキュリティ対策本（Amazon） */
  securityBook: amz("情報セキュリティ 中小企業 対策"),

  /** SaaS活用本（Amazon） */
  saasBook: amz("SaaS 業務効率化"),

  /** テレワーク・リモートワーク本（Amazon） */
  teleworkBook: amz("テレワーク 導入 ツール"),
} as const;

// ============================================================
// Diet / Health カテゴリ
// ============================================================

export const DIET_AD_LINKS = {
  /** CLOUD GYM 遺伝子検査（A8.net） */
  cloudgym: "https://px.a8.net/svt/ejp?a8mat=4B1KXR+6F0C4I+4RUO+5Z6WY",

  /** RIZAP（リンク未取得 → 取得後に差し替え） */
  rizap: "https://www.rizap.jp/",

  /** 健康管理本（Amazon） */
  healthBook: amz("健康管理 セルフケア"),
} as const;

// ============================================================
// General（全ページ共通）
// ============================================================

export const GENERAL_AD_LINKS = {
  /** Amazon 汎用トップ */
  amazon: `https://www.amazon.co.jp/?tag=${AMAZON_TAG}`,

  /** ビジネス書総合（Amazon） */
  businessBooks: amz("ビジネス書 おすすめ 2026"),
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
