import React from "react";

type FadeType =
  | "fade-in"
  | "fade-in-up"
  | "fade-in-down"
  | "fade-in-left"
  | "fade-in-right"
  | "scale-in";

type FadeInProps = {
  children: React.ReactNode;
  /** Tailwind keyframe name, see tailwind.config.js `theme.animation`. */
  type?: FadeType;
  delay?: number;
  className?: string;
};

/**
 * Tailwind JIT only emits classes it can see as complete literals, so the
 * variants are mapped explicitly instead of interpolated as `animate-${type}`.
 */
const classes: Record<FadeType, string> = {
  "fade-in": "animate-fade-in",
  "fade-in-up": "animate-fade-in-up",
  "fade-in-down": "animate-fade-in-down",
  "fade-in-left": "animate-fade-in-left",
  "fade-in-right": "animate-fade-in-right",
  "scale-in": "animate-scale-in",
};

/**
 * CSS-only entrance wrapper. Deliberately no JS state gate: the keyframes use
 * `animation-fill-mode: both`, so the browser animates straight from first paint
 * and the wrapper cannot get stuck at opacity 0 when hydration is slow or JS
 * fails. Route changes replay the animation by remounting the wrapper with a
 * changing `key` at the call site.
 *
 * WARNING: every type except `fade-in` animates `transform`, which makes this
 * wrapper the containing block for all `position: fixed` descendants. Never wrap
 * page content (or anything holding `.overlay` modals / `fixed bottom-0` action
 * bars) in a transform variant — use `fade-in` there.
 */
const FadeIn = ({
  children,
  type = "fade-in-up",
  delay = 0,
  className = "",
}: FadeInProps) => (
  <div
    className={`${classes[type]} ${className}`}
    style={delay ? { animationDelay: `${delay}ms` } : undefined}
  >
    {children}
  </div>
);

export default FadeIn;
