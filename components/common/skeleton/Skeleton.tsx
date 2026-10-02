import React from "react";

type SkeletonProps = {
  className?: string;
  /** Stagger the sweep, in ms. */
  delay?: number;
  style?: React.CSSProperties;
};

/**
 * Base shimmer block. Colours come from the plain Tailwind gray ramp because
 * the app's custom `defaultbackground` / `listhoverfocusbg` tokens are declared
 * as CSS vars that are not defined anywhere in the theme.
 */
const base = "relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700/70";

const highlight =
  "absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10";

export const Skeleton = ({ className = "", delay, style }: SkeletonProps) => (
  <div className={`${base} ${className}`} style={style}>
    <div
      className={highlight}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    />
  </div>
);

export const SkeletonText = ({
  lines = 3,
  className = "",
}: SkeletonProps & { lines?: number }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        // Last line is shorter so the block reads as a paragraph, not a grid.
        className={`h-3 ${i === lines - 1 ? "w-2/5" : "w-full"}`}
      />
    ))}
  </div>
);

export const SkeletonCircle = ({
  size = "h-10 w-10",
  className = "",
}: SkeletonProps & { size?: string }) => (
  <Skeleton className={`rounded-full ${size} ${className}`} />
);

export const SkeletonTitle = ({ className = "" }: SkeletonProps) => (
  <Skeleton className={`h-5 w-48 ${className}`} />
);

export const SkeletonCard = ({ className = "" }: SkeletonProps) => (
  <div
    className={`flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700 ${className}`}
  >
    <div className="flex items-center gap-3">
      <SkeletonCircle size="h-9 w-9" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable = ({
  rows = 8,
  columns = 6,
  className = "",
}: SkeletonProps & { rows?: number; columns?: number }) => (
  <div
    className={`animate-pop-in origin-top overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
  >
    <div className="flex gap-4 border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        className="flex items-center gap-4 border-b border-gray-100 p-3 last:border-0 dark:border-gray-800"
      >
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton
            key={c}
            className="h-3 flex-1"
            // Stagger so the table fills in top-down instead of blinking as one
            // solid block.
            delay={Math.min(r, 8) * 45 + c * 20}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({
  fields = 8,
  className = "",
}: SkeletonProps & { fields?: number }) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" delay={Math.min(i, 8) * 40} />
        <Skeleton className="h-9 w-full" delay={Math.min(i, 8) * 40} />
      </div>
    ))}
  </div>
);

/**
 * Skeleton shaped like the app's datatables: dark header bar plus zebra rows.
 * Used in place of the centred spinner inside the shared table renderers.
 */
export const TableSkeleton = ({
  rows = 10,
  columns = 7,
  className = "",
}: SkeletonProps & { rows?: number; columns?: number }) => (
  <div className={`w-full overflow-hidden animate-pop-in origin-top ${className}`}>
    <div className="flex gap-3 rounded-t-lg bg-[#232020] px-3 py-2">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-2.5 flex-1 !bg-white/25"
          delay={i * 40}
        />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        className={`flex items-center gap-3 px-3 py-2.5 ${
          r % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-gray-50 dark:bg-gray-900/40"
        }`}
      >
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton
            key={c}
            className="h-2.5 flex-1"
            // Width variance keeps it from reading as a plain striped grid.
            style={{
              width: `${[92, 78, 85, 64, 88, 71, 80][(r + c) % 7]}%`,
            }}
            delay={Math.min(r, 8) * 40 + c * 15}
          />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Compact block for loading states that live *inside* an existing panel or form
 * (reservation sub-widgets, drag panels) rather than replacing a whole page.
 */
export const PanelSkeleton = ({
  rows = 3,
  className = "",
}: SkeletonProps & { rows?: number }) => (
  <div className={`flex w-full flex-col gap-2 py-2 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-8"
        style={{ width: `${[100, 92, 76][i % 3]}%` }}
        delay={i * 60}
      />
    ))}
  </div>
);

/**
 * Inline indicator for buttons and small controls. Keeps the button's own
 * height instead of injecting a block, and reads smoother than a spinning SVG.
 */
export const InlinePulse = ({ className = "" }: SkeletonProps) => (
  <span
    role="status"
    aria-label="Loading"
    className={`inline-flex items-center gap-1 align-middle ${className}`}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="block h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-70"
        style={{ animationDelay: `${i * 160}ms` }}
      />
    ))}
  </span>
);

/**
 * Placeholder for a single dashboard widget. Rendered once per card configured
 * in the role's `list_dashboard` so the grid keeps its real shape and column
 * spans while each card is still fetching.
 */
export const DashboardCardSkeleton = ({
  span = 12,
  type = "number",
  className = "",
}: SkeletonProps & { span?: number; type?: string }) => {
  const colSpan = `col-span-1 md:col-span-${span} xl:col-span-${span}`;
  // Chart / donut widgets are mostly empty space, so mirror that instead of
  // drawing rows where a chart will be.
  const isChart = type === "chart" || type === "chart-bar" || type === "donut";

  return (
    <div className={`${colSpan} mb-4 xl:mb-0 animate-pop-in origin-top ${className}`}>
      <div className="h-full overflow-hidden rounded-xl bg-white shadow flex flex-col">
        <div className="px-6 pt-6">
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="px-6 pb-6 pt-4">
          {isChart ? (
            <div className="flex h-[300px] items-end gap-3">
              {[55, 80, 40, 68, 92, 60, 74].map((h, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${h}%` }}
                  delay={i * 50}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-3 flex-1" delay={i * 45} />
                  <Skeleton className="h-3 w-20" delay={i * 45 + 15} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Placeholder for one card in the choose-property grid: a tall media block for
 * the property logo, two text lines and a full-width action button. Mirrors
 * `PropertyListView`'s card so the grid keeps its height and column count while
 * the properties are still loading.
 */
export const PropertyCardSkeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white animate-pop-in origin-top ${className}`}
  >
    <div className="flex min-h-[180px] flex-1 items-center justify-center bg-gray-50 p-6">
      <Skeleton className="h-[120px] w-[120px] !rounded-lg" />
    </div>
    <div className="flex flex-col gap-2 px-4 pt-3">
      <Skeleton className="h-3.5 w-2/3" />
      <Skeleton className="h-3 w-1/2" delay={60} />
    </div>
    <div className="px-4 pb-4 pt-3">
      <Skeleton className="h-9 w-full !rounded-lg" delay={120} />
    </div>
  </div>
);

export default Skeleton;
