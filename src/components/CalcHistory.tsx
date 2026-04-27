/**
 * src/components/CalcHistory.tsx
 * ツール別 計算履歴表示コンポーネント
 * LocalStorageから直近10件を表示
 */

"use client";

import { useCalcHistory } from "@/hooks/useCalcHistory";

interface CalcHistoryProps {
  toolSlug: string;
  toolName: string;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function CalcHistory({ toolSlug, toolName }: CalcHistoryProps) {
  const { history, clearHistory } = useCalcHistory(toolSlug, toolName);

  if (history.length === 0) return null;

  return (
    <div style={wrapStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>🕐 計算履歴（直近{history.length}件）</span>
        <button onClick={clearHistory} style={clearBtnStyle}>
          履歴をクリア
        </button>
      </div>
      <div style={listStyle}>
        {history.map((item, i) => (
          <div key={item.id} style={{ ...rowStyle, ...(i === 0 ? latestStyle : {}) }}>
            <span style={timeStyle}>{formatDate(item.timestamp)}</span>
            <span style={resultStyle}>{item.resultText}</span>
            {i === 0 && <span style={badgeStyle}>最新</span>}
          </div>
        ))}
      </div>
      <p style={hintStyle}>履歴はこのデバイスのブラウザにのみ保存されます。</p>
    </div>
  );
}

const wrapStyle: React.CSSProperties = {
  marginTop: "var(--スペース-xl)",
  padding: "var(--スペース-md)",
  background: "rgba(255,255,255,0.015)",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "var(--角丸-md)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--カラー-テキスト薄)",
  letterSpacing: "0.04em",
};

const clearBtnStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "var(--カラー-テキスト薄)",
  background: "transparent",
  border: "1px solid var(--カラー-ボーダー)",
  borderRadius: "4px",
  padding: "2px 8px",
  cursor: "pointer",
  fontFamily: "var(--フォント-本文)",
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 8px",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "var(--角丸-sm)",
  fontSize: "12px",
};

const latestStyle: React.CSSProperties = {
  background: "rgba(16,185,129,0.06)",
  border: "1px solid rgba(16,185,129,0.2)",
};

const timeStyle: React.CSSProperties = {
  flexShrink: 0,
  fontSize: "10px",
  color: "var(--カラー-テキスト薄)",
  minWidth: "70px",
};

const resultStyle: React.CSSProperties = {
  flex: 1,
  color: "var(--カラー-テキスト薄)",
  fontSize: "11px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const badgeStyle: React.CSSProperties = {
  flexShrink: 0,
  fontSize: "9px",
  fontWeight: 700,
  color: "#10b981",
  background: "rgba(16,185,129,0.15)",
  padding: "2px 6px",
  borderRadius: "4px",
};

const hintStyle: React.CSSProperties = {
  fontSize: "9px",
  color: "var(--カラー-テキスト薄)",
  marginTop: "8px",
  opacity: 0.6,
};
