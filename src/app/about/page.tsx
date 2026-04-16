/**
 * src/app/about/page.tsx
 * 運営者情報ページ（AdSense審査対応）
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営者情報 | ToolBox - 無料オンラインツール集",
  description: "ToolBox（toolbox-free.com）の運営者情報、サイトの目的、提供サービスについてご案内します。",
};

export default function 運営者情報ページ() {
  return (
    <div className="固定ページセクション">
      <div className="固定ページコンテナ">
        <h1 className="固定ページタイトル">運営者情報</h1>

        <section className="ポリシーセクション">
          <h2>サイト概要</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
            <tbody>
              {[
                ["サイト名", "ToolBox（ツールボックス）"],
                ["URL", "https://www.toolbox-free.com"],
                ["運営開始", "2026年"],
                ["運営者", "個人運営"],
                ["所在地", "鳥取県境港市"],
                ["お問い合わせ", "サイト内のお問い合わせフォームよりご連絡ください"],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding: "10px 16px", color: "rgba(148,163,184,0.8)", fontSize: "14px", whiteSpace: "nowrap" }}>{label}</td>
                  <td style={{ padding: "10px 16px", color: "rgba(226,232,240,0.9)", fontSize: "14px" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="ポリシーセクション">
          <h2>サイトの目的</h2>
          <p>
            当サイト「ToolBox」は、日常生活やビジネスで役立つ計算・変換・分析ツールを無料で提供することを目的として運営しています。
          </p>
          <p>
            税金の計算、投資シミュレーション、ビジネス収支の試算、ペットのケアコスト管理など、専門知識がなくても直感的に使えるツールを50種類以上用意しています。
          </p>
        </section>

        <section className="ポリシーセクション">
          <h2>提供サービス</h2>
          <p>
            当サイトでは以下のカテゴリのツールを無料で提供しています。
          </p>
          <ul style={{ paddingLeft: "20px", lineHeight: "2", color: "rgba(226,232,240,0.85)", fontSize: "15px" }}>
            <li>金融・投資（複利計算、NISA・確定申告シミュレーション等）</li>
            <li>ビジネス・経理（消費税、減価償却、補助金チェック等）</li>
            <li>士業・法務（相続税、印紙税、建設業許可チェック等）</li>
            <li>IT・DX推進（クラウド移行コスト、RPA効果、AI電力コスト等）</li>
            <li>生活・計算（BMI、高額療養費、ペット医療費等）</li>
            <li>テキスト解析（文字数カウント等）</li>
            <li>ペット（犬の年齢換算、ペット保険比較等）</li>
          </ul>
        </section>

        <section className="ポリシーセクション">
          <h2>収益化について</h2>
          <p>
            当サイトは、以下の方法により運営費用を賄っています。
          </p>
          <ul style={{ paddingLeft: "20px", lineHeight: "2", color: "rgba(226,232,240,0.85)", fontSize: "15px" }}>
            <li>Google AdSense（第三者配信広告）</li>
            <li>各種アフィリエイトプログラム（A8.net、Amazon アソシエイト、楽天アフィリエイト等）</li>
          </ul>
          <p>
            アフィリエイトリンクを経由してご購入いただいた場合、当サイトに一定の報酬が発生することがあります。ただし、掲載する商品・サービスの選定にあたっては、ユーザーにとっての有益性を最優先としています。
          </p>
        </section>

        <section className="ポリシーセクション">
          <h2>免責事項</h2>
          <p>
            当サイトのツールが提供する計算結果は、一般的な情報提供を目的としたシミュレーションです。
            税務・法務・医療・投資等に関する専門的な判断は、必ず各分野の専門家（税理士・弁護士・医師・ファイナンシャルプランナー等）にご相談ください。
          </p>
        </section>

        <div className="ポリシー最終更新">
          2026年4月 作成
        </div>
      </div>
    </div>
  );
}
