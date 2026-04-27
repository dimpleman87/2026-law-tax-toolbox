/**
 * src/hooks/useCalcHistory.ts
 * 計算履歴をLocalStorageに保存・取得するフック
 * 直近10件をツール別に管理
 */

"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  toolSlug: string;
  toolName: string;
  resultText: string;
  timestamp: number;
}

const STORAGE_KEY = "tfree_calc_history";
const MAX_ITEMS = 10;

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded etc. - ignore
  }
}

export function useCalcHistory(toolSlug: string, toolName: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // hydration後に読み込み
  useEffect(() => {
    const all = loadHistory();
    setHistory(all.filter((h) => h.toolSlug === toolSlug));
  }, [toolSlug]);

  /** 新しい計算結果を保存 */
  const addHistory = useCallback((resultText: string) => {
    if (!resultText || resultText === "◯◯") return;
    const all = loadHistory();
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      toolSlug,
      toolName,
      resultText,
      timestamp: Date.now(),
    };
    // 同一結果の重複は追加しない
    if (all.length > 0 && all[0].resultText === resultText && all[0].toolSlug === toolSlug) return;

    const updated = [newItem, ...all].slice(0, MAX_ITEMS * 5); // 全ツール合計で50件まで
    saveHistory(updated);
    setHistory(updated.filter((h) => h.toolSlug === toolSlug).slice(0, MAX_ITEMS));
  }, [toolSlug, toolName]);

  /** このツールの履歴をクリア */
  const clearHistory = useCallback(() => {
    const all = loadHistory().filter((h) => h.toolSlug !== toolSlug);
    saveHistory(all);
    setHistory([]);
  }, [toolSlug]);

  return { history, addHistory, clearHistory };
}
