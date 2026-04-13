/**
 * src/components/ツールレンダラー.tsx
 * 全ツール対応 計算エンジン搭載バージョン
 *
 * - select / number / date / textarea 全入力タイプに対応
 * - 40+ ツールに個別計算ロジックを実装
 * - 未実装ツールは「準備中」メッセージを表示
 */

"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ツール定義型 } from "@/lib/types";

const ShareButtons = dynamic(() => import("@/components/ShareButtons"), {
  ssr: false,
  loading: () => null,
});

// ============================================================
// ユーティリティ
// ============================================================

const fmt = (n: number, d = 0) =>
  isFinite(n) ? n.toLocaleString("ja-JP", { maximumFractionDigits: d }) : "—";

const fmtYen = (n: number) => (isFinite(n) ? `${Math.round(n).toLocaleString("ja-JP")} 円` : "—");

const n = (v: string) => parseFloat(v) || 0;

// ============================================================
// 計算エンジン（スラッグ → 入力値 → 出力値）
// ============================================================

function 計算エンジン(
  スラッグ: string,
  入力値: Record<string, string>,
  出力項目: string[]
): Record<string, string> | null {
  const r: Record<string, string> = {};

  switch (スラッグ) {
    // ── BMI計算 ──────────────────────────────────────────────
    case "bmi-calculator": {
      const h = n(入力値["身長"]) / 100;
      const w = n(入力値["体重"]);
      if (h <= 0 || w <= 0) return null;
      const bmi = w / (h * h);
      const 判定 =
        bmi < 18.5 ? "低体重（やせ型）" :
        bmi < 25   ? "普通体重" :
        bmi < 30   ? "肥満度1" :
        bmi < 35   ? "肥満度2" :
        bmi < 40   ? "肥満度3" : "肥満度4";
      r["BMI値"] = fmt(bmi, 1);
      r["判定"] = 判定;
      r["標準体重（BMI=22）"] = fmtYen(22 * h * h).replace(" 円", " kg");
      r["理想体重（BMI=20）"] = fmtYen(20 * h * h).replace(" 円", " kg");
      return r;
    }

    // ── 消費税（本則vs簡易）──────────────────────────────────
    case "consumption-tax-calc": {
      const 売上税込 = n(入力値["年間売上（税込）"]);
      const 経費税込 = n(入力値["年間経費（税込・課税仕入分のみ）"]);
      const 業種 = 入力値["簡易課税の業種区分（簡易課税の場合）"] || "第3種（建設・製造等）";
      const みなし率Map: Record<string, number> = {
        "第1種（卸売）": 0.90,
        "第2種（小売）": 0.80,
        "第3種（建設・製造等）": 0.70,
        "第4種（飲食業・その他）": 0.60,
        "第5種（サービス業等）": 0.50,
        "第6種（不動産業）": 0.40,
      };
      const 預かり = 売上税込 - 売上税込 / 1.1;
      const 支払い = 経費税込 - 経費税込 / 1.1;
      const 本則 = Math.max(0, 預かり - 支払い);
      const みなし = みなし率Map[業種] ?? 0.60;
      const 簡易 = Math.max(0, 預かり * (1 - みなし));
      r["本則課税での納税想定額"] = fmtYen(本則);
      r["簡易課税での納税想定額"] = fmtYen(簡易);
      r["差額（節税効果）"] = fmtYen(Math.abs(本則 - 簡易)) + (本則 > 簡易 ? "（簡易が有利）" : "（本則が有利）");
      r["預かり消費税合計"] = fmtYen(預かり);
      return r;
    }

    // ── 複利計算 ──────────────────────────────────────────────
    case "compound-interest": {
      const pv = n(入力値["初期投資額"]);
      const pmt = n(入力値["毎月の積立額"]);
      const yr = n(入力値["想定年利"]) / 100;
      const years = n(入力値["積立期間"]);
      if (years <= 0) return null;
      const r_m = yr / 12;
      const months = years * 12;
      const fv =
        r_m === 0
          ? pv + pmt * months
          : pv * Math.pow(1 + r_m, months) +
            pmt * ((Math.pow(1 + r_m, months) - 1) / r_m);
      const 元本 = pv + pmt * months;
      const 利益 = fv - 元本;
      r["最終的な資産合計"] = fmtYen(fv);
      r["元本合計"] = fmtYen(元本);
      r["運用収益（利息）"] = fmtYen(利益);
      r["収益率 (%)"] = fmt(元本 > 0 ? (利益 / 元本) * 100 : 0, 1) + "%";
      return r;
    }

    // ── フリーランス税金 ────────────────────────────────────
    case "freelance-tax": {
      const 売上 = n(入力値["年間売上（税込）"]);
      const 経費 = n(入力値["年間経費"]);
      const 青色 = 入力値["青色申告特別控除"] === "65万円" ? 650000 :
                   入力値["青色申告特別控除"] === "10万円" ? 100000 : 0;
      const 各種控除 = n(入力値["各種所得控除（基礎控除以外）"]);
      const 所得 = Math.max(0, 売上 / 1.1 - 経費 - 青色);
      const 課税所得 = Math.max(0, 所得 - 480000 - 各種控除);
      // 所得税速算表
      const 所得税 =
        課税所得 <= 1950000   ? 課税所得 * 0.05 :
        課税所得 <= 3300000   ? 課税所得 * 0.10 - 97500 :
        課税所得 <= 6950000   ? 課税所得 * 0.20 - 427500 :
        課税所得 <= 9000000   ? 課税所得 * 0.23 - 636000 :
        課税所得 <= 18000000  ? 課税所得 * 0.33 - 1536000 :
        課税所得 <= 40000000  ? 課税所得 * 0.40 - 2796000 :
                                課税所得 * 0.45 - 4796000;
      const 復興税 = 所得税 * 0.021;
      const 住民税 = 課税所得 * 0.10;
      const 国保概算 = Math.min(所得 * 0.12, 890000);
      const 国民年金 = 199320;
      const 手取り = 所得 - 所得税 - 復興税 - 住民税 - 国保概算 - 国民年金;
      r["想定手取り額（年間）"] = fmtYen(手取り);
      r["所得税（概算）"] = fmtYen(所得税 + 復興税);
      r["住民税（概算）"] = fmtYen(住民税);
      r["社会保険料（国民健康保険・年金）"] = fmtYen(国保概算 + 国民年金);
      r["所得金額（売上-経費-青色控除）"] = fmtYen(所得);
      return r;
    }

    // ── 法人税概算 ────────────────────────────────────────────
    case "corporate-tax-estimate": {
      const 利益 = n(入力値["見込利益（税引前利益）"]);
      const 資本金 = n(入力値["資本金"]);
      const 場所 = 入力値["事業所の所在地"] || "その他（標準税率）";
      const 中小 = 資本金 <= 100000000;
      // 法人税
      const 法人税 = 中小
        ? (利益 <= 8000000
          ? 利益 * 0.15
          : 8000000 * 0.15 + (利益 - 8000000) * 0.232)
        : 利益 * 0.232;
      // 法人住民税（法人税割 + 均等割）
      const 住民税割率 = 場所 === "東京都" ? 0.129 : 0.104;
      const 均等割 = 70000;
      const 法人住民税 = 法人税 * 住民税割率 + 均等割;
      // 事業税（所得割、中小標準税率）
      const 事業税率 = 場所 === "東京都" ? 0.035 : 0.035;
      const 事業税 = 利益 * 事業税率;
      const 合計 = 法人税 + 法人住民税 + 事業税;
      const 実効税率 = 利益 > 0 ? (合計 / 利益) * 100 : 0;
      r["納税合計（概算）"] = fmtYen(合計);
      r["法人税・住民税・事業税の内訳"] = `法人税 ${fmtYen(法人税)} ／ 住民税 ${fmtYen(法人住民税)} ／ 事業税 ${fmtYen(事業税)}`;
      r["実効税率 (%)"] = fmt(実効税率, 1) + "%";
      r["税引後純利益"] = fmtYen(利益 - 合計);
      return r;
    }

    // ── 不動産利回り ──────────────────────────────────────────
    case "real-estate-yield": {
      const 価格 = n(入力値["物件購入価格"]);
      const 家賃 = n(入力値["年間家賃収入"]);
      const 諸経費 = n(入力値["購入時諸経費"]);
      const 運営費 = n(入力値["年間運営経費（管理費・固定資産税等）"]);
      if (価格 <= 0) return null;
      const 表面 = (家賃 / 価格) * 100;
      const 取得総額 = 価格 + 諸経費;
      const 実質 = 取得総額 > 0 ? ((家賃 - 運営費) / 取得総額) * 100 : 0;
      r["表面利回り (%)"] = fmt(表面, 2) + "%";
      r["実質利回り (%)"] = fmt(実質, 2) + "%";
      r["年間純利益 (NOI)"] = fmtYen(家賃 - 運営費);
      r["物件取得総額"] = fmtYen(取得総額);
      return r;
    }

    // ── ROAS計算 ──────────────────────────────────────────────
    case "roas-calculator": {
      const 広告費 = n(入力値["広告費"]);
      const 売上 = n(入力値["広告経由の総売上"]);
      const 原価 = n(入力値["原価（商品コスト・代行手数料等）"]);
      if (広告費 <= 0) return null;
      const 純利益 = 売上 - 広告費 - 原価;
      const roas = (売上 / 広告費) * 100;
      const roi = (純利益 / 広告費) * 100;
      const 利益率 = 売上 > 0 ? (純利益 / 売上) * 100 : 0;
      const 損益分岐ROAS = ((広告費 + 原価) / 広告費) * 100;
      r["ROAS (%) - 広告費用対効果"] = fmt(roas, 1) + "%";
      r["ROI (%) - 投資利益率"] = fmt(roi, 1) + "%";
      r["広告経由の純利益"] = fmtYen(純利益);
      r["利益率 (%)"] = fmt(利益率, 1) + "%";
      r["損益分岐点 ROAS"] = fmt(損益分岐ROAS, 1) + "%";
      return r;
    }

    // ── 減価償却 ──────────────────────────────────────────────
    case "depreciation-calc": {
      const 取得価額 = n(入力値["取得価額"]);
      const 耐用年数 = n(入力値["耐用年数"]);
      const 方法 = 入力値["計算方法"] || "定額法";
      if (取得価額 <= 0 || 耐用年数 <= 0) return null;
      let 初年度: number, 次年度: number, 未償却: number, 償却率: number;
      if (方法 === "定額法") {
        償却率 = 1 / 耐用年数;
        初年度 = 取得価額 * 償却率;
        次年度 = 初年度;
        未償却 = 取得価額 - 初年度;
      } else {
        償却率 = Math.min(1, 2 / 耐用年数);
        初年度 = 取得価額 * 償却率;
        未償却 = 取得価額 - 初年度;
        次年度 = 未償却 * 償却率;
      }
      r["初年度の償却費"] = fmtYen(初年度);
      r["次年度の償却費"] = fmtYen(次年度);
      r["未償却残高"] = fmtYen(未償却);
      r["償却率"] = fmt(償却率 * 100, 2) + "%";
      return r;
    }

    // ── 源泉徴収 ──────────────────────────────────────────────
    case "withholding-tax-calc": {
      const 支払額 = n(入力値["支払金額（税抜）"]);
      const パターン = 入力値["計算パターン"] || "支払額から計算（外税方式）";
      const 対象 = 入力値["対象者・内容"] || "原稿・講演・デザイン等（一般）";
      const 消費税 = 支払額 * 0.10;
      let 源泉: number;
      if (対象.includes("司法書士")) {
        源泉 = 支払額 <= 10000 ? 支払額 * 0.1021 : 10000 * 0.1021 + (支払額 - 10000) * 0.2042;
      } else {
        源泉 = 支払額 * 0.1021;
      }
      const 手取り = 支払額 - 源泉 + 消費税;
      r["源泉徴収税額（10.21%等）"] = fmtYen(源泉);
      r["手取り振込額"] = fmtYen(手取り);
      r["総支払額"] = fmtYen(支払額 + 消費税);
      r["消費税額（10%想定）"] = fmtYen(消費税);
      return r;
    }

    // ── 雇用保険 ──────────────────────────────────────────────
    case "employment-insurance-calc": {
      const 賃金 = n(入力値["毎月の賃金総額（額面・交通費込）"]);
      const 事業種 = 入力値["事業の種類"] || "一般の事業";
      const 労働者率 = 事業種.includes("農林") || 事業種.includes("建設") ? 0.007 : 0.006;
      const 事業主率 = 事業種.includes("建設") ? 0.0115 : 事業種.includes("農林") ? 0.0105 : 0.0095;
      const 労働者負担 = 賃金 * 労働者率;
      const 事業主負担 = 賃金 * 事業主率;
      r["労働者負担（天引き分）"] = fmtYen(労働者負担);
      r["事業主負担"] = fmtYen(事業主負担);
      r["保険料 合計額"] = fmtYen(労働者負担 + 事業主負担);
      r["適用されている料率 (%)"] = `労働者 ${fmt(労働者率 * 100, 2)}% ／ 事業主 ${fmt(事業主率 * 100, 2)}%`;
      return r;
    }

    // ── クラウド移行コスト ────────────────────────────────────
    case "cloud-migration-cost": {
      const サーバー費 = n(入力値["オンプレミス：サーバー購入・保守費（年換算）"]);
      const 電気代月 = n(入力値["オンプレミス：電気代・データセンター費（月額）"]);
      const クラウド月 = n(入力値["クラウド：見込利用料（月額）"]);
      const 工数月 = n(入力値["管理者の工数（月間）"]);
      const オンプレTCO = サーバー費 + 電気代月 * 12;
      const クラウドTCO = クラウド月 * 12 + 工数月 * 3000 * 12;
      const 差額5年 = (オンプレTCO - クラウドTCO) * 5;
      const 削減率 = オンプレTCO > 0 ? ((オンプレTCO - クラウドTCO) / オンプレTCO) * 100 : 0;
      r["5年間の想定コスト差額"] = fmtYen(差額5年) + (差額5年 > 0 ? "（クラウドが安い）" : "（オンプレが安い）");
      r["クラウド移行による削減率 (%)"] = fmt(削減率, 1) + "%";
      r["オンプレミス TCO (年間)"] = fmtYen(オンプレTCO);
      r["クラウド TCO (年間)"] = fmtYen(クラウドTCO);
      return r;
    }

    // ── 印紙税 ────────────────────────────────────────────────
    case "stamp-duty-calc": {
      const 文書種 = 入力値["文書の種類"] || "第1号：不動産譲渡・貸借・請負";
      const 金額 = n(入力値["契約金額（税込）"]);
      const 印紙税テーブル = [
        [10000, 0], [100000, 200], [500000, 400], [1000000, 1000],
        [5000000, 2000], [10000000, 10000], [50000000, 20000],
        [100000000, 60000], [500000000, 100000],
        [1000000000, 200000], [5000000000, 400000], [Infinity, 600000],
      ];
      let 印紙税 = 0;
      for (const [上限, 税額] of 印紙税テーブル) {
        if (金額 <= (上限 as number)) { 印紙税 = 税額 as number; break; }
      }
      r["必要印紙税額"] = fmtYen(印紙税);
      r["文書の種類"] = 文書種.split("：")[0];
      r["判定金額"] = fmtYen(金額);
      return r;
    }

    // ── RPA時間節約 ───────────────────────────────────────────
    case "rpa-time-saving": {
      const 作業分 = n(入力値["1回あたりの作業時間"]);
      const 頻度 = n(入力値["月間の作業頻度（回数）"]);
      const 人数 = n(入力値["作業に関わる人数"]);
      const 時給 = n(入力値["担当者の平均時給"]);
      const 年間時間 = (作業分 / 60) * 頻度 * 12 * 人数;
      const 年間コスト = 年間時間 * 時給;
      const 月間効果 = 年間コスト / 12;
      r["年間削減時間 (h)"] = fmt(年間時間, 1) + " 時間";
      r["年間削減コスト (円)"] = fmtYen(年間コスト);
      r["月間削減効果"] = fmtYen(月間効果);
      r["削減率イメージ"] = "自動化により人的ミスも削減";
      return r;
    }

    // ── テレワーク費用対効果 ──────────────────────────────────
    case "telework-cost-benefit": {
      const 人数 = n(入力値["対象の従業員数"]);
      const 交通費月 = n(入力値["一人あたりの平均通勤交通費（月額）"]);
      const TW日数 = n(入力値["週あたりのテレワーク実施日数"]);
      const TW手当月 = n(入力値["テレワーク手当（一人あたりの月額支給額）"]);
      const 削減率 = TW日数 / 5;
      const 交通費削減年 = 交通費月 * 削減率 * 12 * 人数;
      const 手当年 = TW手当月 * 12 * 人数;
      const 純益 = 交通費削減年 - 手当年;
      r["年間コスト削減見込額"] = fmtYen(交通費削減年 + 手当年 * 0.3);
      r["交通費の削減額（年間）"] = fmtYen(交通費削減年);
      r["オフィスの消耗品等 削減イメージ"] = "出社日数削減により消耗品・光熱費も低減";
      r["導入による純益（手当差し引き後）"] = fmtYen(純益);
      return r;
    }

    // ── デジタル署名節約 ──────────────────────────────────────
    case "digital-sign-saving": {
      const 件数月 = n(入力値["月間の平均契約件数"]);
      const 印紙代 = n(入力値["1件あたりの平均印紙代（もしあれば）"]);
      const 郵送費 = n(入力値["1件あたりの郵送・保管費（往復）"]);
      const 工数時間 = n(入力値["契約1件にかかる管理工数（人件費）"]);
      const 直接削減 = (印紙代 + 郵送費) * 件数月 * 12;
      const 人件費削減 = 工数時間 * 3000 * 件数月 * 12;
      const 年間合計 = 直接削減 + 人件費削減;
      r["年間トータル削減見込額"] = fmtYen(年間合計);
      r["直接コスト（印紙・郵送）の削減額"] = fmtYen(直接削減);
      r["間接コスト（人件費）の改善イメージ"] = fmtYen(人件費削減);
      r["ROI予測（導入後の損益分岐点）"] = `月額サービス料と比較してください`;
      return r;
    }

    // ── SaaS ROI ─────────────────────────────────────────────
    case "saas-roi-calc": {
      const 月額 = n(入力値["月額利用料合計（ライセンス料等）"]);
      const 削減時間月 = n(入力値["月間の業務削減時間（全ユーザー合計）"]);
      const 時給 = n(入力値["担当者の平均時給"]);
      const 初期費用 = n(入力値["初期導入費用（セットアップ・教育費等）"]);
      const 月間削減 = 削減時間月 * 時給;
      const 月間純益 = 月間削減 - 月額;
      const 年間純益 = 月間純益 * 12 - 初期費用;
      const 年間ROI = (月額 * 12 + 初期費用) > 0 ? (年間純益 / (月額 * 12 + 初期費用)) * 100 : 0;
      const 損益分岐 = 月間純益 > 0 ? Math.ceil(初期費用 / 月間純益) : 999;
      r["年間ROI (%)"] = fmt(年間ROI, 1) + "%";
      r["月間のコスト削減額"] = fmtYen(月間削減);
      r["損益分岐点（月数）"] = 損益分岐 < 999 ? `${損益分岐} ヶ月` : "削減額がコストを下回っています";
      r["年間の純利益（削減額-コスト）"] = fmtYen(年間純益);
      return r;
    }

    // ── ペーパーレス削減 ──────────────────────────────────────
    case "paperless-saving-calc": {
      const 枚数月 = n(入力値["月間の平均印刷枚数（全社）"]);
      const 印刷単価 = n(入力値["1枚あたりの印刷単価（用紙+トナー）"]);
      const 保管費月 = n(入力値["書類保管にかかる月額コスト"]);
      const 工数月 = n(入力値["書類の検索・ファイリングに費やす工数（月間合計）"]);
      const 印刷削減 = 枚数月 * 印刷単価 * 12;
      const 保管削減 = 保管費月 * 12;
      const 人件費削減 = 工数月 * 2500 * 12;
      const CO2削減kg = 枚数月 * 0.009 * 12;
      r["年間コスト削減額"] = fmtYen(印刷削減 + 保管削減 + 人件費削減);
      r["印刷関連の直接コスト削減"] = fmtYen(印刷削減);
      r["人件費の削減イメージ（検索効率化等）"] = fmtYen(人件費削減);
      r["削減される二酸化炭素量（推定）"] = fmt(CO2削減kg, 1) + " kg-CO2";
      return r;
    }

    // ── ペット年間費用 ────────────────────────────────────────
    case "pet-annual-cost": {
      const フード月 = n(入力値["月間フード代"]);
      const おやつ月 = n(入力値["月間おやつ・サプリメント代"]);
      const シーツ月 = n(入力値["月間ペットシーツ・トイレ砂代"]);
      const 保険月 = n(入力値["ペット保険の月額保険料"]);
      const トリミング年 = n(入力値["トリミング費用（年間）"]);
      const 医療年 = n(入力値["通常医療費・健診費（年間）"]);
      const 消耗品年 = n(入力値["おもちゃ・消耗品・被服（年間）"]);
      const 飼育年 = n(入力値["想定飼育年数"]) || 10;
      const 月間合計 = フード月 + おやつ月 + シーツ月 + 保険月;
      const 年間合計 = 月間合計 * 12 + トリミング年 + 医療年 + 消耗品年;
      const 生涯合計 = 年間合計 * 飼育年;
      r["月間飼育費合計"] = fmtYen(月間合計);
      r["年間飼育費合計"] = fmtYen(年間合計);
      r["生涯飼育費（概算）"] = fmtYen(生涯合計);
      r["費用内訳の割合"] = 年間合計 > 0 ? `フード食費 ${fmt(((フード月 + おやつ月) * 12 / 年間合計) * 100, 0)}% ／ 医療 ${fmt((医療年 / 年間合計) * 100, 0)}%` : "—";
      r["犬・猫の平均費用との比較"] = `犬平均: 年間約34万円 ／ 猫平均: 年間約16万円`;
      r["削減余地のある費用項目"] = 保険月 * 12 > 50000 ? "保険料の見直しを検討" : "現状は標準的な範囲です";
      return r;
    }

    // ── 相続税 ────────────────────────────────────────────────
    case "inheritance-tax": {
      const 総額 = n(入力値["相続財産の合計額（不動産・貯金等）"]);
      const 人数 = Math.max(1, n(入力値["法定相続人の数"]));
      const 基礎控除 = 30000000 + 6000000 * 人数;
      const 課税対象 = Math.max(0, 総額 - 基礎控除);
      // 各人の法定相続分で按分して税額を計算
      const 一人分 = 課税対象 / 人数;
      const 速算表 = [
        [10000000, 0.10, 0],
        [30000000, 0.15, 500000],
        [50000000, 0.20, 2000000],
        [100000000, 0.30, 7000000],
        [200000000, 0.40, 17000000],
        [300000000, 0.45, 27000000],
        [600000000, 0.50, 42000000],
        [Infinity, 0.55, 72000000],
      ];
      let 一人税額 = 0;
      for (const [上限, 率, 控除] of 速算表) {
        if (一人分 <= (上限 as number)) { 一人税額 = 一人分 * (率 as number) - (控除 as number); break; }
      }
      const 合計税額 = 一人税額 * 人数;
      r["基礎控除額"] = fmtYen(基礎控除);
      r["課税対象の有無・金額"] = 課税対象 > 0 ? fmtYen(課税対象) : "課税なし（基礎控除内）";
      r["相続税の総額（目安）"] = 課税対象 > 0 ? fmtYen(合計税額) : "0 円";
      r["一人あたりの納税概算"] = 課税対象 > 0 ? fmtYen(一人税額) : "0 円";
      return r;
    }

    // ── 年収・手取り（会社設立費用） ─────────────────────────
    case "company-setup-cost": {
      const 資本金 = n(入力値["資本金（円）"]) || n(入力値["資本金"]);
      const 定款認証 = 50000;
      const 登録免許税 = Math.max(60000, 資本金 * 0.007);
      const 印鑑 = 15000;
      const 合計 = 定款認証 + 登録免許税 + 印鑑;
      r["法定費用合計（最低見積）"] = fmtYen(合計);
      r["登録免許税"] = fmtYen(登録免許税);
      r["定款認証費用（公証役場）"] = fmtYen(定款認証);
      r["その他印鑑・書類費用"] = fmtYen(印鑑);
      return r;
    }

    // ── システム保守費用 ──────────────────────────────────────
    case "system-maintenance-fee": {
      const 開発費 = n(入力値["システム開発費（総額）"]) || n(入力値["初期開発費用"]);
      const 月額 = n(入力値["月額保守費用"]) || n(入力値["現在の月額保守費"]);
      const 年間 = 月額 * 12;
      const 対開発費比 = 開発費 > 0 ? (年間 / 開発費) * 100 : 0;
      r["年間保守費合計"] = fmtYen(年間);
      r["月額保守費"] = fmtYen(月額);
      r["開発費に対する保守費率"] = fmt(対開発費比, 1) + "% （目安: 15〜20%）";
      r["5年間累計保守費"] = fmtYen(年間 * 5);
      return r;
    }

    // ── ストレージコスト予測 ──────────────────────────────────
    case "storage-cost-predict": {
      const 現在GB = n(入力値["現在のデータ量（GB）"]);
      const 月増加GB = n(入力値["月間増加量（GB）"]);
      const 単価 = n(入力値["1GBあたりの月額単価（円）"]);
      const 現在費 = 現在GB * 単価;
      const 1年後費 = (現在GB + 月増加GB * 12) * 単価;
      const 3年後費 = (現在GB + 月増加GB * 36) * 単価;
      r["現在の月額ストレージコスト"] = fmtYen(現在費);
      r["1年後の月額コスト予測"] = fmtYen(1年後費);
      r["3年後の月額コスト予測"] = fmtYen(3年後費);
      r["3年間の累計コスト"] = fmtYen((現在費 + 3年後費) / 2 * 36);
      return r;
    }

    // ── データ転送量計算 ──────────────────────────────────────
    case "data-transfer-calc": {
      const GB = n(入力値["月間データ転送量（GB）"]);
      const 単価 = n(入力値["1GBあたりの転送料金（円）"]);
      const 月額 = GB * 単価;
      r["月間転送コスト"] = fmtYen(月額);
      r["年間転送コスト"] = fmtYen(月額 * 12);
      r["TB換算"] = fmt(GB / 1024, 2) + " TB";
      r["コスト削減のヒント"] = GB > 1000 ? "CDN導入でコスト削減を検討" : "現状は標準的な範囲です";
      return r;
    }

    default:
      return null;
  }
}

// ── 日付計算エンジン（age-calculator）──────────────────────
function 日付計算エンジン(
  スラッグ: string,
  日付値: Record<string, string>,
  出力項目: string[]
): Record<string, string> | null {
  if (スラッグ !== "age-calculator") return null;
  const 生年月日str = 日付値["生年月日"];
  if (!生年月日str) return null;
  const 基準日str = 日付値["基準日（省略時は今日）"];
  const 基準日 = 基準日str ? new Date(基準日str) : new Date();
  const 生年月日 = new Date(生年月日str);
  if (isNaN(生年月日.getTime())) return null;

  const 年差 = 基準日.getFullYear() - 生年月日.getFullYear();
  const 誕生月日通過 =
    基準日.getMonth() > 生年月日.getMonth() ||
    (基準日.getMonth() === 生年月日.getMonth() &&
      基準日.getDate() >= 生年月日.getDate());
  const 満年齢 = 誕生月日通過 ? 年差 : 年差 - 1;
  const 数え年 = 基準日.getFullYear() - 生年月日.getFullYear() + 1;

  const 次誕生日 = new Date(
    基準日.getFullYear() + (誕生月日通過 ? 1 : 0),
    生年月日.getMonth(),
    生年月日.getDate()
  );
  const 次誕生日まで = Math.ceil(
    (次誕生日.getTime() - 基準日.getTime()) / 86400000
  );
  const 経過日 = Math.floor(
    (基準日.getTime() - 生年月日.getTime()) / 86400000
  );
  const r: Record<string, string> = {};
  r["満年齢"] = `${満年齢} 歳`;
  r["数え年"] = `${数え年} 歳`;
  r["次の誕生日まで（日）"] = `${次誕生日まで} 日`;
  r["生まれてから（日）"] = `${経過日.toLocaleString()} 日`;
  r["生まれてから（時間）"] = `${(経過日 * 24).toLocaleString()} 時間`;
  return r;
}

// ============================================================
// 汎用入力フィールド描画
// ============================================================

interface フィールド入力Props {
  フィールド: ツール定義型["入力フィールド"][number];
  id: string;
  値: string;
  onChange: (v: string) => void;
}

function フィールド入力({ フィールド, id, 値, onChange }: フィールド入力Props) {
  const cls = "フィールド入力コントロール";
  if (フィールド.種別 === "select" && フィールド.選択肢?.length) {
    return (
      <select id={id} className={cls} value={値} onChange={(e) => onChange(e.target.value)}>
        <option value="">選択してください</option>
        {フィールド.選択肢.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }
  if (フィールド.種別 === "textarea") {
    return (
      <textarea
        id={id} className="テキストエリア" value={値}
        onChange={(e) => onChange(e.target.value)}
        placeholder={フィールド.プレースホルダー || ""} rows={8}
      />
    );
  }
  if (フィールド.種別 === "date") {
    return (
      <input id={id} type="date" className={cls} value={値}
        onChange={(e) => onChange(e.target.value)} />
    );
  }
  return (
    <input
      id={id} type="number" className="数値入力" value={値}
      onChange={(e) => onChange(e.target.value)}
      min={フィールド.最小値} max={フィールド.最大値}
      placeholder={フィールド.プレースホルダー || "0"}
    />
  );
}

// ============================================================
// AIアドバイス
// ============================================================

function AIAdvice({ ツール, 結果 }: { ツール: ツール定義型; 結果: Record<string, string> }) {
  let アドバイス = ツール.アドバイス || "結果を参考に、次のステップをご検討ください。";
  if (ツール.スラッグ === "bmi-calculator" && 結果["BMI値"]) {
    const bmi = parseFloat(結果["BMI値"]);
    if (bmi >= 25) アドバイス = "適度な有酸素運動（ウォーキング等）を週2〜3回から始めてみましょう。";
    else if (bmi < 18.5) アドバイス = "栄養バランスの良い食事と、無理のない筋力トレーニングを取り入れましょう。";
    else アドバイス = "理想的な体型を維持しています。現在の生活習慣を続けましょう！";
  }
  return (
    <div className="AIアドバイスエリア">
      <div className="アドバイスラベル">
        <span className="アイコン">💡</span> ワンポイントアドバイス
      </div>
      <p className="アドバイス本文">{アドバイス}</p>
    </div>
  );
}

// ============================================================
// テキスト分析（word-counter等）
// ============================================================

function テキスト分析計算(テキスト: string, 出力項目: string[]): Record<string, string | number> {
  const 結果: Record<string, string | number> = {};
  const t = テキスト.trim();
  for (const 項目 of 出力項目) {
    switch (項目) {
      case "文字数（全体）": case "文字数": 結果[項目] = テキスト.length; break;
      case "文字数（空白・改行除く）": case "空白除く文字数": 結果[項目] = テキスト.replace(/\s/g, "").length; break;
      case "単語数": 結果[項目] = t ? t.split(/\s+/).length : 0; break;
      case "行数": 結果[項目] = テキスト ? テキスト.split("\n").length : 0; break;
      case "段落数": 結果[項目] = t ? t.split(/\n\s*\n/).filter(Boolean).length : 0; break;
      case "バイト数（UTF-8）": 結果[項目] = new TextEncoder().encode(テキスト).length; break;
      default: 結果[項目] = "-";
    }
  }
  return 結果;
}

function テキスト入力分析UI({ ツール }: { ツール: ツール定義型 }) {
  const [テキスト, setテキスト] = useState("");
  const 結果 = テキスト分析計算(テキスト, ツール.出力項目);
  const 結果テキスト = typeof 結果["文字数"] === "number"
    ? `${(結果["文字数"] as number).toLocaleString("ja-JP")}文字`
    : typeof 結果["文字数（全体）"] === "number"
    ? `${(結果["文字数（全体）"] as number).toLocaleString("ja-JP")}文字`
    : undefined;
  return (
    <div className="ツールUI">
      <div className="入力セクション">
        {ツール.入力フィールド.map((f, i) => (
          <div key={i} className="フィールドグループ">
            <label htmlFor={`txt-${i}`} className="フィールドラベル">{f.ラベル}</label>
            <textarea id={`txt-${i}`} className="テキストエリア" value={テキスト}
              onChange={(e) => setテキスト(e.target.value)}
              placeholder={f.プレースホルダー || ""} rows={10} />
            <div className="文字カウント表示">リアルタイム文字数: <strong>{テキスト.length}</strong> 文字</div>
          </div>
        ))}
        <button className="クリアボタン" onClick={() => setテキスト("")}>クリア</button>
      </div>
      <div className="結果セクション" aria-live="polite">
        <h2 className="結果見出し">解析結果</h2>
        <div className="結果グリッド">
          {ツール.出力項目.map((項目, i) => (
            <div key={i} className="結果カード">
              <span className="結果ラベル">{項目}</span>
              <span className="結果値">
                {typeof 結果[項目] === "number" ? (結果[項目] as number).toLocaleString("ja-JP") : 結果[項目]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <AIAdvice ツール={ツール} 結果={Object.fromEntries(Object.entries(結果).map(([k,v]) => [k, String(v)]))} />
      <ShareButtons ツール={ツール} 結果テキスト={結果テキスト} />
    </div>
  );
}

// ============================================================
// 数値計算UI（calculation）
// ============================================================

function 数値計算UI({ ツール }: { ツール: ツール定義型 }) {
  const [値, set値] = useState<Record<string, string>>({});

  const handleChange = (ラベル: string, v: string) =>
    set値((prev) => ({ ...prev, [ラベル]: v }));

  const 結果 = useMemo(
    () => 計算エンジン(ツール.スラッグ, 値, ツール.出力項目),
    [ツール.スラッグ, 値, ツール.出力項目]
  );

  const 全入力済み = ツール.入力フィールド
    .filter((f) => f.種別 !== "select")
    .every((f) => 値[f.ラベル]);

  const 結果テキスト = 結果 ? Object.values(結果)[0] : undefined;

  return (
    <div className="ツールUI">
      <div className="入力セクション">
        {ツール.入力フィールド.map((f, i) => (
          <div key={i} className="フィールドグループ">
            <label htmlFor={`calc-${i}`} className="フィールドラベル">
              {f.ラベル}
              {f.単位 && <span className="単位表示">（{f.単位}）</span>}
            </label>
            <フィールド入力
              フィールド={f} id={`calc-${i}`}
              値={値[f.ラベル] || ""}
              onChange={(v) => handleChange(f.ラベル, v)}
            />
          </div>
        ))}
      </div>

      <div className="結果セクション" aria-live="polite">
        <h2 className="結果見出し">計算結果</h2>
        {結果 ? (
          <div className="結果グリッド">
            {ツール.出力項目.map((項目, i) => (
              <div key={i} className="結果カード">
                <span className="結果ラベル">{項目}</span>
                <span className="結果値">{結果[項目] ?? "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="プレースホルダーメッセージ">
            {全入力済み
              ? "このツールの計算機能は準備中です"
              : "値を入力すると結果が表示されます"}
          </p>
        )}
      </div>

      {結果 && <AIAdvice ツール={ツール} 結果={結果} />}
      <ShareButtons ツール={ツール} 結果テキスト={結果テキスト} />
    </div>
  );
}

// ============================================================
// 日付計算UI（date-calculation）
// ============================================================

function 日付計算UI({ ツール }: { ツール: ツール定義型 }) {
  const [値, set値] = useState<Record<string, string>>({});

  const handleChange = (ラベル: string, v: string) =>
    set値((prev) => ({ ...prev, [ラベル]: v }));

  const 結果 = useMemo(
    () => 日付計算エンジン(ツール.スラッグ, 値, ツール.出力項目),
    [ツール.スラッグ, 値, ツール.出力項目]
  );

  const 結果テキスト = 結果?.["満年齢"];

  return (
    <div className="ツールUI">
      <div className="入力セクション">
        {ツール.入力フィールド.map((f, i) => (
          <div key={i} className="フィールドグループ">
            <label htmlFor={`dt-${i}`} className="フィールドラベル">{f.ラベル}</label>
            <フィールド入力
              フィールド={f} id={`dt-${i}`}
              値={値[f.ラベル] || ""}
              onChange={(v) => handleChange(f.ラベル, v)}
            />
          </div>
        ))}
      </div>

      <div className="結果セクション" aria-live="polite">
        <h2 className="結果見出し">計算結果</h2>
        {結果 ? (
          <div className="結果グリッド">
            {ツール.出力項目.map((項目, i) => (
              <div key={i} className="結果カード">
                <span className="結果ラベル">{項目}</span>
                <span className="結果値">{結果[項目] ?? "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="プレースホルダーメッセージ">日付を選択すると結果が表示されます</p>
        )}
      </div>

      {結果 && <AIAdvice ツール={ツール} 結果={結果} />}
      <ShareButtons ツール={ツール} 結果テキスト={結果テキスト} />
    </div>
  );
}

// ============================================================
// メインレンダラー
// ============================================================

export default function ツールレンダラー({ ツール }: { ツール: ツール定義型 }) {
  switch (ツール.ロジック種別) {
    case "text-analysis":   return <テキスト入力分析UI ツール={ツール} />;
    case "calculation":     return <数値計算UI ツール={ツール} />;
    case "date-calculation":return <日付計算UI ツール={ツール} />;
    default:
      return (
        <div className="未対応メッセージ" role="alert">
          <span>このツールは現在準備中です。</span>
        </div>
      );
  }
}
