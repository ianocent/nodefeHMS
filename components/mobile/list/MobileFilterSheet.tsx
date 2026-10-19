"use client";

/**
 * Filter bottom sheet (§3.3 `components/mobile/list/MobileFilterSheet`).
 * Sheet + generic active-chip row. Children = filter form fields.
 */
import React, { ReactNode } from "react";
import MobileSheet from "../form/MobileSheet";
import { IconClose } from "../shell/icons";

export interface ActiveFilter {
  key: string;
  label: string;
}

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (key: string) => void;
  children: ReactNode;
  /** sticky footer, typically a Terapkan button */
  footer?: ReactNode;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  open,
  onClose,
  activeFilters = [],
  onRemoveFilter,
  children,
  footer,
}) => (
  <MobileSheet
    open={open}
    onClose={onClose}
    title="Filter"
    footer={
      footer ?? (
        <button
          type="button"
          onClick={onClose}
          className="h-12 w-full rounded-full bg-[rgb(132,90,223)] text-[15px] font-semibold text-white active:opacity-80"
        >
          Terapkan
        </button>
      )
    }
  >
    {activeFilters.length > 0 && onRemoveFilter && (
      <div className="mb-3 flex flex-wrap gap-2">
        {activeFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onRemoveFilter(f.key)}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
          >
            {f.label}
            <IconClose width={12} height={12} />
          </button>
        ))}
      </div>
    )}
    {children}
  </MobileSheet>
);

export default MobileFilterSheet;
