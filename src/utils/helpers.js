import { BREAKING_KEYWORDS, PLACEHOLDER_IMAGE } from "./constants";

/**
 * Returns a human-readable "time ago" string from an ISO date string.
 */
export function timeAgo(dateStr) {
  if (!dateStr) return "Unknown";
  const now = new Date();
  const date = new Date(dateStr);
  if (isNaN(date)) return "Unknown";
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Returns true if the article appears to be breaking / emergency news.
 */
export function isBreaking(article) {
  const text = (
    (article.title || "") + " " + (article.description || "")
  ).toLowerCase();
  return BREAKING_KEYWORDS.some((k) => text.includes(k));
}

/**
 * Returns a safe image URL — falls back to placeholder on error.
 */
export function safeImage(url) {
  if (!url || url.includes("removed") || url.includes("null")) {
    return PLACEHOLDER_IMAGE;
  }
  return url;
}

/**
 * Truncates text to maxLen characters.
 */
export function truncate(text, maxLen = 120) {
  if (!text) return "";
  return text.length > maxLen ? text.substring(0, maxLen) + "…" : text;
}

/**
 * Formats a date to a readable string.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
