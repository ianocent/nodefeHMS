"use client";

/** Empty state + skeleton primitives (§3.3). */
import React, { ReactNode } from "react";

export const MobileEmptyState: React.FC<{
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
}> = ({ title = "Belum ada data", description, action }) => (
  <div className="flex flex-col items-center justify-center px-8 py-14 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6M9 13h6M9 17h3" />
      </svg>
    </div>
    <p className="text-[15px] font-semibold text-gray-700">{title}</p>
    {description && <p className="mt-1 text-[13px] text-gray-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const MobileSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="px-4 pt-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="mb-2.5 h-[88px] animate-shimmer rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
      />
    ))}
  </div>
);

export default MobileSkeleton;
