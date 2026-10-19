"use client";

/** Debounced value hook (§3.3 `useDebouncedSearch`). */
import { useEffect, useState } from "react";

const useDebouncedSearch = <T,>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export default useDebouncedSearch;
