import React from "react";

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Image skeleton */}
      <div
        className="skeleton-shimmer"
        style={{ height: "178px", flexShrink: 0 }}
      />

      {/* Body skeleton */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="skeleton-shimmer rounded" style={{ width: "80px", height: "20px" }} />
          <div className="skeleton-shimmer rounded" style={{ width: "50px", height: "20px" }} />
        </div>
        <div className="skeleton-shimmer rounded" style={{ width: "100%", height: "14px" }} />
        <div className="skeleton-shimmer rounded" style={{ width: "85%", height: "14px" }} />
        <div className="skeleton-shimmer rounded" style={{ width: "70%", height: "14px" }} />
        <div className="skeleton-shimmer rounded mt-1" style={{ width: "100%", height: "11px" }} />
        <div className="skeleton-shimmer rounded" style={{ width: "65%", height: "11px" }} />
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="skeleton-shimmer rounded" style={{ width: "90px", height: "18px" }} />
          <div className="skeleton-shimmer rounded" style={{ width: "55px", height: "24px" }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div
      className="skeleton-shimmer rounded-2xl"
      style={{ height: "500px", border: "1px solid rgba(255,255,255,0.06)" }}
    />
  );
}
