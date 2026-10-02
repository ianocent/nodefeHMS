import React from "react";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonTitle,
} from "../skeleton/Skeleton";

type LoadInPageProps = {
  /** `table` mirrors the datatable pages, `cards` the dashboard widgets. */
  variant?: "table" | "cards" | "block";
  rows?: number;
  columns?: number;
};

/**
 * Suspense fallback for the whole app (see LayoutComponent). Replaces the old
 * centred spinner — a skeleton that matches the incoming layout reads as
 * "content is arriving" instead of a detached spinning icon.
 */
const LoadInPage = ({ variant = "table", rows = 10, columns = 6 }: LoadInPageProps) => {
  if (variant === "cards") {
    return (
      <div className="flex flex-col gap-4 pt-2">
        <SkeletonTitle />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "block") {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <SkeletonTitle />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 w-full"
            delay={i * 70}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between gap-4">
        <SkeletonTitle />
        <Skeleton className="h-8 w-28" />
      </div>
      <SkeletonTable rows={rows} columns={columns} />
    </div>
  );
};

export default LoadInPage;
