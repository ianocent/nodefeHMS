"use client";

/**
 * useListQuery (§3.3 `components/mobile/data/useListQuery`).
 *
 * Thin mobile wrapper above `FetchData` (the existing AES envelope client) —
 * no new HTTP layer (rule §3.4 #3). Normalizes both paging shapes the node API
 * emits (`pagging` Laravel-style / `pagination` DPR-style) the same way
 * `components/common/table-edit/index.tsx:147-167` does.
 *
 * Returns rows for card rendering + refresh + loadMore for infinite scroll.
 */
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetEncrypt } from "../../helper";

export interface NormalizedPaging {
  total_data: number;
  limit_data: number;
  start_paging: number;
  end_paging: number;
  next: number;
}

export interface UseListQueryOptions {
  uri: string;
  /** extra query string appended as-is, e.g. "&module=room-status" */
  query?: string;
  limit?: number;
  method?: "GET" | "POST";
  body?: any;
  /** suppress FetchData toasts (e.g. background polls) */
  isNotToast?: boolean;
}

export const useListQuery = (options: UseListQueryOptions) => {
  const { uri, query = "", limit = 20, method = "GET", body, isNotToast } = options;
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);

  const token = (() => {
    try {
      return isLogin
        ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? ""
        : "";
    } catch {
      return "";
    }
  })();

  const [rows, setRows] = useState<any[]>([]);
  const [paging, setPaging] = useState<NormalizedPaging>({
    total_data: 0,
    limit_data: limit,
    start_paging: 1,
    end_paging: 1,
    next: 0,
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryStr, setQueryStr] = useState<string>(query);

  // Guards against out-of-order responses (refresh racing with loadMore).
  const inFlightRef = useRef(0);

  const normalizePaging = (raw: any, fallbackPage: number): NormalizedPaging => {
    const p = raw?.pagging ?? raw?.pagination ?? {};
    const totalData = Number(p.total_data ?? p.total ?? 0);
    const limitData = Number(p.limit_data ?? p.per_page ?? limit) || limit;
    const lastPage = Number(
      p.end_paging ?? p.last_page ?? (limitData ? Math.ceil(totalData / limitData) : 1)
    );
    const currentPage = Number(p.start_paging ?? p.current_page ?? fallbackPage);
    return {
      total_data: totalData,
      limit_data: limitData,
      start_paging: currentPage,
      end_paging: lastPage,
      next: currentPage < lastPage ? currentPage + 1 : 0,
    };
  };

  const fetchPage = useCallback(
    async (page: number, mode: "replace" | "append") => {
      const flight = ++inFlightRef.current;
      if (mode === "append") setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await FetchData(
          `${uri}?page=${page}&limit=${limit}&${queryStr}`,
          method,
          method === "GET" ? "" : (body == null ? "" : GetEncrypt(JSON.stringify(body))),
          false,
          token,
          router,
          "",
          isNotToast
        );
        if (inFlightRef.current !== flight) return; // stale
        if (res?.code == "200") {
          const next: any[] = Array.isArray(res?.data) ? res.data : [];
          if (mode === "append") {
            setRows((prev) => {
              const seen = new Set(prev.map((r) => String(r?.id)));
              return [...prev, ...next.filter((r) => !seen.has(String(r?.id)))];
            });
          } else {
            setRows(next);
          }
          const norm = normalizePaging(res, page);
          setPaging(norm);
        } else if (mode === "replace") {
          setRows([]);
          setPaging((p) => ({ ...p, total_data: 0, next: 0 }));
        }
      } catch (e: any) {
        if (inFlightRef.current !== flight) return;
        setError(e?.message ?? "Gagal memuat data");
        if (mode === "replace") setRows([]);
      } finally {
        if (inFlightRef.current === flight) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [uri, limit, queryStr, method, token, router, isNotToast]
  );

  const refresh = useCallback(() => fetchPage(1, "replace"), [fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore) return;
    if (!paging.next) return;
    return fetchPage(paging.next, "append");
  }, [fetchPage, loading, loadingMore, paging.next]);

  const hasMore = Boolean(paging.next) && rows.length < (paging.total_data || Infinity);

  const applyQuery = useCallback(
    (qs: string) => {
      setQueryStr(qs);
      // Caller should refresh(); explicit to allow batched filter updates.
    },
    []
  );

  return {
    rows,
    paging,
    loading,
    loadingMore,
    hasMore,
    error,
    queryStr,
    setQuery: applyQuery,
    refresh,
    loadMore,
  };
};

export default useListQuery;
