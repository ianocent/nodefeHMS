"use client";

/**
 * Mobile shell header (§3.3 `components/mobile/shell/MobileHeader`).
 * Sticky top bar: optional back button, title, optional right action slot.
 * Hamburger opens MobileDrawer (own state — shell does not know pages).
 */
import React, { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { IconBack, IconHamburger } from "./icons";
import MobileDrawer from "./MobileDrawer";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  /** Default back behavior: router.back() */
  onBack?: () => void;
  hideBack?: boolean;
  /** Show hamburger drawer toggle (default true) */
  showMenu?: boolean;
  /** Extra right-side action(s) rendered after the hamburger */
  right?: ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  onBack,
  hideBack,
  showMenu = true,
  right,
}) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-[500] border-b border-gray-200 bg-white bg-opacity-95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex h-14 items-center px-1.5">
          {/* leading */}
          <div className="flex items-center">
            {!hideBack && (
              <button
                type="button"
                aria-label="Kembali"
                onClick={onBack ?? (() => router.back())}
                className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 active:bg-gray-100"
              >
                <IconBack />
              </button>
            )}
            {showMenu && (
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setDrawerOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 active:bg-gray-100"
              >
                <IconHamburger />
              </button>
            )}
          </div>

          {/* title */}
          <div className="min-w-0 flex-1 pl-1">
            <h1 className="truncate text-[17px] font-semibold leading-tight text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-xs text-gray-500">{subtitle}</p>
            )}
          </div>

          {/* trailing */}
          <div className="flex items-center gap-1">{right}</div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default MobileHeader;
