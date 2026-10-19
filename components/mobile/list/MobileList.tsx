"use client";

/**
 * Generic mobile list (§3.3 `components/mobile/list/MobileList`).
 * useListQuery above + IntersectionObserver infinite scroll + pull states.
 * renderItem decides the card shape per module; this component owns
 * loading / empty / error rendering.
 */
import React, { useEffect, useRef } from "react";
import useListQuery from "../data/useListQuery";
import { MobileEmptyState, MobileSkeleton } from "./MobileEmptyState";

interface MobileListProps {
  uri: string;
  query?: string;
  limit?: number;
  body?: any;
  renderItem: (item: any, index: number) => React.ReactNode;
  keyOf?: (item: any) => string | number;
  /** shown under empty state, e.g. "+ Buat Roster" */
  emptyAction?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  header?: React.ReactNode;
  /** extra content below the list, always rendered while rows exist */
  footer?: React.ReactNode;
  /** auto-fetch on mount (default true) */
  autoLoad?: boolean;
  onLoaded?: (rows: any[]) => void;
}

const MobileList: React.FC<MobileListProps> = ({
  uri,
  query,
  limit,
  body,
  renderItem,
  keyOf,
  emptyAction,
  emptyTitle,
  emptyDescription,
  header,
  footer,
  autoLoad = true,
  onLoaded,
}) => {
  const { rows, loading, loadingMore, hasMore, error, refresh, loadMore } =
    useListQuery({ uri, query, limit, body });

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (autoLoad && !loadedRef.current) {
      loadedRef.current = true;
      refresh();
    }
  }, [autoLoad, refresh]);

  useEffect(() => {
    onLoaded?.(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // Infinite scroll sentinel.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore?.();
        }
      },
      { rootMargin: "240px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {header}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {header && <div className="h-1" />}
        {loading && !rows.length ? (
          <MobileSkeleton />
        ) : error && !rows.length ? (
          <MobileEmptyState
            title="Gagal memuat"
            description={error}
            action={
              <button
                type="button"
                onClick={refresh}
                className="rounded-full bg-[rgb(132,90,223)] px-5 py-2.5 text-sm font-semibold text-white active:opacity-80"
              >
                Coba lagi
              </button>
            }
          />
        ) : rows.length === 0 ? (
          <MobileEmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        ) : (
          <div className="px-4 pt-3">
            {rows.map((item, i) => (
              <React.Fragment key={keyOf ? keyOf(item) : item?.id ?? i}>
                {renderItem(item, i)}
              </React.Fragment>
            ))}
            <div ref={sentinelRef} />
            {loadingMore && (
              <p className="pb-4 text-center text-xs text-gray-400">Memuat...</p>
            )}
            {!hasMore && rows.length > 0 && (
              <p className="pb-5 pt-1 text-center text-xs text-gray-400">
                Semua data tampil
              </p>
            )}
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileList;
export type { MobileListProps };
