/**
 * src/lib/load-tools.ts
 * ツールサイト量産システム — ツール定義JSONの読み取り処理
 * 
 * fs/promises を使用し、サーバーサイド（ビルド時およびRSC）で動作します。
 */

import { promises as fs } from "fs";
import path from "path";
import { ツール定義型 } from "./types";

/** ツール定義ファイルが格納されているディレクトリ */
const ツールディレクトリ = path.join(process.cwd(), "src", "tools");

/**
 * すべてのツール定義JSONを読み込み、配列で返します（getTools）。
 * ビルド時の静的生成や、トップページのツール一覧で使用します。
 */
export async function 全ツール取得(): Promise<ツール定義型[]> {
  try {
    // ディレクトリ内のファイル一覧を取得
    const ファイル一覧 = await fs.readdir(ツールディレクトリ);
    const jsonファイル一覧 = ファイル一覧.filter((ファイル) => ファイル.endsWith(".json"));

    // 各ファイルを非同期で読み込み
    const ツール一覧 = await Promise.all(
      jsonファイル一覧.map(async (ファイル名) => {
        try {
          const ファイルパス = path.join(ツールディレクトリ, ファイル名);
          const 内容 = await fs.readFile(ファイルパス, "utf-8");
          const ツール = JSON.parse(内容) as ツール定義型;

          // スラッグが定義されていない場合はファイル名（拡張子なし）をスラッグとする
          if (!ツール.スラッグ) {
            ツール.スラッグ = ファイル名.replace(".json", "");
          }

          return ツール;
        } catch (エラー) {
          console.error(`ツール読み込み失敗 (${ファイル名}):`, エラー);
          return null;
        }
      })
    );

    // エラーで null になったものを除外し、型を確定させて返す
    return ツール一覧.filter((ツール): ツール is ツール定義型 => ツール !== null);
  } catch (エラー) {
    console.error("ツールディレクトリ読み込み失敗:", エラー);
    return [];
  }
}

/**
 * 指定されたスラッグに一致するツール定義を1件返します（getToolBySlug）。
 * 動的ルート [ツールスラッグ] 内で使用します。
 */
export async function ツール取得(スラッグ: string): Promise<ツール定義型 | null> {
  try {
    const デコード済みスラッグ = decodeURIComponent(スラッグ);
    const ファイルパス = path.join(ツールディレクトリ, `${デコード済みスラッグ}.json`);
    
    // ファイルの存在確認
    await fs.access(ファイルパス);
    
    const 内容 = await fs.readFile(ファイルパス, "utf-8");
    return JSON.parse(内容) as ツール定義型;
  } catch (エラー) {
    // ファイルが存在しない、または解析失敗の場合は null を返す
    return null;
  }
}

/**
 * 全ツールのスラッグ一覧を返します。
 * generateStaticParams での利用を想定しています。
 */
export async function 全スラッグ取得(): Promise<string[]> {
  const ツール一覧 = await 全ツール取得();
  return ツール一覧.map((ツール) => ツール.スラッグ);
}

/**
 * カテゴリ別にツールを整理して返します。
 */
export async function カテゴリ別ツール取得(): Promise<Record<string, ツール定義型[]>> {
  const ツール一覧 = await 全ツール取得();
  const カテゴリ別: Record<string, ツール定義型[]> = {};

  ツール一覧.forEach((ツール) => {
    const カテゴリ = ツール.カテゴリ || "その他";
    if (!カテゴリ別[カテゴリ]) {
      カテゴリ別[カテゴリ] = [];
    }
    カテゴリ別[カテゴリ].push(ツール);
  });

  return カテゴリ別;
}

/**
 * 指定されたカテゴリに属する他のツールを取得します（自分自身は除外）。
 */
export async function 同一カテゴリツール取得(対象スラッグ: string, カテゴリ: string): Promise<ツール定義型[]> {
  const ツール一覧 = await 全ツール取得();
  return ツール一覧
    .filter((ツール) => ツール.カテゴリ === カテゴリ && ツール.スラッグ !== 対象スラッグ)
    .slice(0, 4); // 最大4件表示
}
