"use client";

/**
 * Sticky bottom action bar (§3.3 `components/mobile/form/MobileActionBar`).
 * Primary + secondary actions, full-width, ≥48px targets.
 */
import React from "react";

interface MobileActionBarProps {
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "primary" | "danger";
  /** "full" (default, pill) or "md" (6px). Pool pakai "md". */
  radius?: "full" | "md";
  /** label saat loading; default bahasa lama biar modul lain tetap */
  loadingLabel?: string;
}

const MobileActionBar: React.FC<MobileActionBarProps> = ({
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  disabled,
  loading,
  tone = "primary",
  radius = "full",
  loadingLabel = "Menyimpan...",
}) => {
  if (!primaryLabel && !secondaryLabel) return null;
  const primaryColor =
    tone === "danger" ? "bg-red-600" : "bg-[rgb(132,90,223)]";
  const radiusCls = radius === "md" ? "rounded-md" : "rounded-full";
  return (
    <div
      className="border-t border-gray-200 bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-3"
      style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.04)" }}
    >
      <div className={`flex gap-2 ${secondaryLabel ? "" : ""}`}>
        {secondaryLabel && (
          <button
            type="button"
            onClick={onSecondary}
            className={`h-12 flex-1 ${radiusCls} border border-gray-300 text-[15px] font-semibold text-gray-700 active:bg-gray-50`}
          >
            {secondaryLabel}
          </button>
        )}
        {primaryLabel && (
          <button
            type="button"
            onClick={onPrimary}
            disabled={disabled || loading}
            className={`h-12 flex-1 ${radiusCls} text-[15px] font-semibold text-white active:opacity-80 disabled:opacity-40 ${primaryColor}`}
          >
            {loading ? loadingLabel : primaryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileActionBar;
