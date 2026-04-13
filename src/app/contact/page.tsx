/**
 * src/app/contact/page.tsx
 * お問い合わせページ
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "当サイトに関するご意見、ご要望、不具合報告などはこちらからお送りください。",
};

export default function お問い合わせページ() {
  return (
    <div className="固定ページセクション">
      <div className="固定ページコンテナ">
        <h1 className="固定ページタイトル">お問い合わせ</h1>
        
        <p className="お問い合わせ導入文">
          当サイトの計算ツールに関するご意見、ご要望、またはデータの誤り等の報告がございましたら、以下のフォームよりご連絡ください。
        </p>

        <div className="お問い合わせフォームラッパー">
          {/* 本来はAPIエンドポイントへと送信しますが、ここではUIのみ作成します */}
          <form className="お問い合わせフォーム">
            <div className="フォームグループ">
              <label htmlFor="name">お名前</label>
              <input type="text" id="name" name="name" required placeholder="山田 太郎" />
            </div>

            <div className="フォームグループ">
              <label htmlFor="email">メールアドレス</label>
              <input type="email" id="email" name="email" required placeholder="example@mail.com" />
            </div>

            <div className="フォームグループ">
              <label htmlFor="subject">お問い合わせ項目</label>
              <select id="subject" name="subject">
                <option value="feedback">ツールの要望・感想</option>
                <option value="bug">不具合・計算ミスの報告</option>
                <option value="ads">広告・ビジネスに関するお問い合わせ</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div className="フォームグループ">
              <label htmlFor="message">お問い合わせ内容</label>
              <textarea id="message" name="message" rows={8} required placeholder="こちらにお問い合わせ内容を入力してください。"></textarea>
            </div>

            <div className="フォーム送信エリア">
              <button type="submit" className="送信ボタン">
                送信する
              </button>
            </div>
          </form>
          
          <div className="フォーム注釈">
            <p>※ 全ての項目への回答を保証するものではありませんので、あらかじめご了承ください。</p>
            <p>※ 入力された個人情報は、お問い合わせへの回答目的以外には使用いたしません。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
