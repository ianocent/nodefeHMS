"use client";

/**
 * Bottom sheet primitive (§3.3 `components/mobile/form/MobileSheet`).
 * Slide-up panel over a dim overlay. Tapping the overlay closes.
 * Used by filter sheets, action sheets, and future mobile forms.
 */
import React, { ReactNode } from "react";
import { IconClose } from "../shell/icons";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Optional sticky footer (e.g. action bar), rendered inside the sheet. */
  footer?: ReactNode;
  /* Max height as CSS value. Default 85% of viewport. */
  height?: string;
}

const MobileSheet: React.FC<MobileSheetProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  height = "85%",
}) => {
  if (!open) return null;
  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-[1000] bg-black bg-opacity-55"
        onClick={onClose}
        aria-hidden
      />
      {/* panel */}
      <div
        className="animate-fade-in-up fixed inset-x-0 bottom-0 z-[1001] mx-auto flex max-h-[85vh] w-full max-w-[520px] flex-col rounded-t-2xl bg-white shadow-2xl"
        style={{ height }}
        role="dialog"
        aria-modal="true"
      >
        {/* drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        {(title) && (
          <div className="flex items-center justify-between px-4 pb-2 pt-1">
            <h2 className="text-base font-semibold text-gray-900">
              {title ?? ""}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
            >
              <IconClose width={20} height={20} />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
          {children}
        </div>
        {footer && (
          <div
            className="border-t border-gray-200 bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-3"
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default MobileSheet;
