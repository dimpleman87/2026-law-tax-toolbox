/** 全ツールの静的インデックス（カテゴリ・関連ツール取得に使用） */
export interface ToolMeta {
  slug: string;
  title: string;
  category: string;
  emoji: string;
}

export const ALL_TOOLS: ToolMeta[] = [
  { slug: "age-calculator", title: "年齢計算機", category: "Life", emoji: "📅" },
  { slug: "ai-infra-energy-cost", title: "AI基盤電力・インフラコスト計算機", category: "IT", emoji: "⚡" },
  { slug: "ai-power-cost", title: "AI・データセンター電力コストシミュレーター", category: "IT", emoji: "⚡" },
  { slug: "bmi-calculator", title: "BMI計算機", category: "Life", emoji: "⚖️" },
  { slug: "cloud-migration-cost", title: "クラウド移行コスト計算機", category: "IT", emoji: "☁️" },
  { slug: "company-setup-cost", title: "会社設立コストシミュレーター", category: "Business", emoji: "🏢" },
  { slug: "compound-interest", title: "複利計算シミュレーター", category: "Finance", emoji: "📈" },
  { slug: "construction-permit-check", title: "建設業許可要件チェック", category: "Legal", emoji: "🏗️" },
  { slug: "consumption-tax-calc", title: "インボイス対応 消費税計算機", category: "Finance", emoji: "🧾" },
  { slug: "consumption-tax-reverse", title: "消費税 逆算・内税外税計算機", category: "Business", emoji: "💰" },
  { slug: "content-certified-mail", title: "内容証明郵便 料金計算機", category: "Legal", emoji: "📮" },
  { slug: "corporate-tax-estimate", title: "法人税概算シミュレーター", category: "Finance", emoji: "💼" },
  { slug: "crypto-tax-2026", title: "暗号資産税金シミュレーター2026", category: "Finance", emoji: "₿" },
  { slug: "data-transfer-calc", title: "データ転送量・帯域計算機", category: "IT", emoji: "📡" },
  { slug: "depreciation-calc", title: "減価償却費計算機", category: "Finance", emoji: "📊" },
  { slug: "digital-sign-saving", title: "電子署名・電子契約コスト削減計算機", category: "IT", emoji: "✍️" },
  { slug: "dog-age-calculator", title: "犬の年齢換算ツール", category: "Pet", emoji: "🐶" },
  { slug: "employment-insurance-calc", title: "雇用保険料計算機", category: "Business", emoji: "💼" },
  { slug: "freelance-tax", title: "フリーランス手取りシミュレーター", category: "Finance", emoji: "💸" },
  { slug: "furusato-nozei", title: "ふるさと納税 控除上限額計算機", category: "Finance", emoji: "🏠" },
  { slug: "gift-tax-calc", title: "贈与税 計算機", category: "Legal", emoji: "💰" },
  { slug: "gx-carbon-levy-calc", title: "GX炭素賦課金コスト計算機", category: "IT", emoji: "🌍" },
  { slug: "high-cost-medical-2026", title: "高額療養費2026年改正シミュレーター", category: "Life", emoji: "🏥" },
  { slug: "hourly-wage-calc", title: "時給・年収換算計算機", category: "Business", emoji: "⏰" },
  { slug: "inheritance-tax", title: "相続税シミュレーター", category: "Legal", emoji: "📋" },
  { slug: "invoice-tax-calc", title: "インボイス制度 消費税計算機", category: "Business", emoji: "📋" },
  { slug: "logistics-fare-pass-through", title: "物流費値上げ転嫁シミュレーター", category: "business", emoji: "🚛" },
  { slug: "meo-checker", title: "MEO対策・伸びしろ診断シミュレーター", category: "general", emoji: "🔧" },
  { slug: "mortgage-calculator", title: "住宅ローン計算機", category: "Finance", emoji: "🏠" },
  { slug: "national-health-insurance", title: "国民健康保険料 計算機", category: "Life", emoji: "💊" },
  { slug: "paperless-saving-calc", title: "ペーパーレス化コスト削減計算機", category: "IT", emoji: "📄" },
  { slug: "password-generator", title: "パスワード生成ツール", category: "IT", emoji: "パスワード生成ツール" },
  { slug: "pension-simulator", title: "年金受給額シミュレーター", category: "Life", emoji: "📊" },
  { slug: "pet-2024-logistics-impact", title: "ペットホテル・トリミングサロン 2024年問題コスト転嫁シミュレーター", category: "business", emoji: "🐶" },
  { slug: "pet-annual-cost", title: "ペット年間飼育費シミュレーター", category: "Life", emoji: "🐾" },
  { slug: "pet-funeral-cost", title: "ペット葬儀費用シミュレーター", category: "Life", emoji: "🌸" },
  { slug: "pet-insurance-check", title: "ペット保険 損益分岐シミュレーター", category: "Life", emoji: "🐶" },
  { slug: "pet-lifetime-care-cost", title: "ペット生涯飼育コスト計算機", category: "pet", emoji: "🐾" },
  { slug: "pet-medical-cost", title: "ペット高額医療費シミュレーター", category: "Life", emoji: "🏥" },
  { slug: "pet-medical-high-cost", title: "犬猫 高額獣医療 自己負担シミュレーター", category: "pet", emoji: "🏥" },
  { slug: "pet-microchip-registration", title: "ペットマイクロチップ費用計算機", category: "pet", emoji: "🐾" },
  { slug: "pet-senior-medical", title: "ペット老後医療費積立シミュレーター", category: "pet", emoji: "🐾" },
  { slug: "pet-shop-legal-compliance", title: "動物愛護法改正 施設基準対応コスト試算ツール", category: "pet", emoji: "🐾" },
  { slug: "qr-generator", title: "QRコード生成ツール", category: "IT", emoji: "QRコード生成ツール" },
  { slug: "real-estate-yield", title: "不動産投資利回り計算機", category: "Finance", emoji: "🏠" },
  { slug: "resignation-pay-estimate", title: "退職金概算シミュレーター", category: "Business", emoji: "💼" },
  { slug: "retirement-pay-calc", title: "退職金 手取り計算機", category: "Business", emoji: "💼" },
  { slug: "roas-calculator", title: "ROAS・ROI計算機", category: "IT", emoji: "📊" },
  { slug: "rpa-time-saving", title: "RPA導入削減時間計算機", category: "IT", emoji: "🤖" },
  { slug: "saas-roi-calc", title: "SaaS導入ROI計算機", category: "IT", emoji: "💻" },
  { slug: "salary-calculator", title: "給与手取り計算機", category: "Business", emoji: "💴" },
  { slug: "security-investment-roi", title: "セキュリティ投資ROI計算機（ROSI）", category: "IT", emoji: "🛡️" },
  { slug: "side-job-tax", title: "副業 確定申告チェッカー", category: "Business", emoji: "💡" },
  { slug: "stamp-duty-calc", title: "印紙税計算機", category: "Legal", emoji: "📄" },
  { slug: "storage-cost-predict", title: "ストレージコスト予測計算機", category: "IT", emoji: "💾" },
  { slug: "subsidies-reverse-lookup-2026", title: "2026年版 補助金・給付金「逆引き」判定ツール", category: "business", emoji: "💰" },
  { slug: "subsidy-2026-check", title: "2026年度補助金適性チェッカー", category: "business", emoji: "💰" },
  { slug: "system-maintenance-fee", title: "システム保守費用計算機", category: "IT", emoji: "🔧" },
  { slug: "take-home-reverse", title: "手取り逆算計算機", category: "Life", emoji: "💰" },
  { slug: "telework-cost-benefit", title: "テレワーク導入効果シミュレーター", category: "IT", emoji: "🏠" },
  { slug: "url-encoder", title: "URLエンコード・デコードツール", category: "IT", emoji: "URLエンコード・デコードツール" },
  { slug: "withholding-tax-calc", title: "源泉徴収税額計算機", category: "Finance", emoji: "💼" },
  { slug: "word-counter", title: "文字数カウンター", category: "Text", emoji: "📝" },
  { slug: "year-end-tax-adj", title: "年末調整 還付金・追徴額 計算機", category: "Business", emoji: "💴" },
];

export function getRelatedTools(currentSlug: string, category: string, limit = 3): ToolMeta[] {
  return ALL_TOOLS
    .filter((t) => t.category === category && t.slug !== currentSlug)
    .slice(0, limit);
}

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}