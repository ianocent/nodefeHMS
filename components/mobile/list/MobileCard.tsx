"use client";

/** Card primitives (§3.3 `components/mobile/list/MobileCard`). */
import React, { ReactNode } from "react";
import Link from "next/link";
import { IconChevronRight } from "../shell/icons";

/** Base touchable card. Touch target ≥44px, 16px padding, 1px hairline. */
export const MobileCard: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  chevron?: boolean;
}> = ({ children, onClick, href, className = "", chevron }) => {
  const cls = `relative mb-2.5 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left ${
    onClick || href ? "active:bg-gray-50" : ""
  } ${className}`;
  const inner = (
    <>
      {children}
      {chevron && (
        <span className="flex h-11 w-11 items-center justify-center text-gray-300">
          <IconChevronRight width={18} height={18} />
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link className={`flex items-center ${cls}`} href={href}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={`flex items-center ${cls}`} onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <div className={`${cls}`}>{inner}</div>;
};

/** Small labeled field inside a card (label-then-value stack). */
export const MobileCardField: React.FC<{
  label?: string;
  children: ReactNode;
  className?: string;
}> = ({ label, children, className = "" }) => (
  <div className={`min-w-0 ${className}`}>
    {label && (
      <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
    )}
    <div className="truncate text-[14px] text-gray-800">{children}</div>
  </div>
);

/** Pill chip used for status / time ranges on cards. */
export const MobileChip: React.FC<{
  children: ReactNode;
  tone?: "gray" | "primary" | "green" | "amber" | "red";
  className?: string;
}> = ({ children, tone = "gray", className = "" }) => {
  const tones: Record<string, string> = {
    gray: "bg-gray-100 text-gray-600",
    primary: "bg-[rgb(132,90,223)] bg-opacity-10 text-[rgb(132,90,223)]",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export default MobileCard;
