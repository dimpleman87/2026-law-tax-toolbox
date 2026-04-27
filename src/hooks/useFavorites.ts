/**
 * src/hooks/useFavorites.ts
 * お気に入りツールをLocalStorageで管理するフック
 */

"use client";

import { useState, useEffect, useCallback } from "react";

export interface FavoriteItem {
  slug: string;
  title: string;
  emoji: string;
  addedAt: number;
}

const STORAGE_KEY = "tfree_favorites";

function loadFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(items: FavoriteItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

/** ツールページ内で使用（お気に入りトグル） */
export function useFavorite(slug: string, title: string, emoji: string) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(loadFavorites().some((f) => f.slug === slug));
  }, [slug]);

  const toggle = useCallback(() => {
    const current = loadFavorites();
    if (current.some((f) => f.slug === slug)) {
      const next = current.filter((f) => f.slug !== slug);
      saveFavorites(next);
      setIsFav(false);
    } else {
      const next = [{ slug, title, emoji, addedAt: Date.now() }, ...current];
      saveFavorites(next);
      setIsFav(true);
    }
  }, [slug, title, emoji]);

  return { isFav, toggle };
}

/** トップページで使用（一覧取得） */
export function useFavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
    // storage イベントで他タブの変更も反映
    const handler = () => setFavorites(loadFavorites());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const remove = useCallback((slug: string) => {
    const next = loadFavorites().filter((f) => f.slug !== slug);
    saveFavorites(next);
    setFavorites(next);
  }, []);

  return { favorites, remove };
}
