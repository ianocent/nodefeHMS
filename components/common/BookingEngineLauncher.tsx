import { env } from "../../next.config";

// Opens the guest-facing Booking Engine, which is a separate app
// (hmsBookingEngine/frontend). Front desk / owner / GM stay on the HMS and use this
// as a jump-off point, while a walk-in guest goes straight to /loyalty.
//
// The origin comes from next.config.js, which reads NEXT_PUBLIC_BOOKING_ENGINE_URL
// with a localhost default — so switching to booking-node.anyaman.id is a `.env`
// edit, not a code edit.
//   local        http://localhost:3002
//   production   https://booking-node.anyaman.id
export const BOOKING_ENGINE_URL = (env.bookingEngineUrl ||
  "https://booking-node.anyaman.id") as string;

export const bookingEngineHref = (path = "/loyalty"): string =>
  `${BOOKING_ENGINE_URL.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

type Variant = "panel" | "button";

type Props = {
  variant?: Variant;
  path?: string;
  title?: string;
  subtitle?: string;
};

/**
 * Booking Engine hand-off.
 *
 * `panel` is the wide card used on the login screen; `button` is the compact header
 * control used inside the HMS once a user is signed in.
 */
export const BookingEngineLauncher = ({
  variant = "button",
  path = "/loyalty",
  title = "Booking Engine",
  subtitle = "Guest portal & loyalty",
}: Props) => {
  const href = bookingEngineHref(path);

  if (variant === "panel") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="group block rounded-2xl border border-white/15 bg-white/[0.06] p-5
                   backdrop-blur-sm transition duration-300
                   hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.11]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Guest Experience
            </p>
            <p className="mt-1.5 text-lg font-semibold text-white">{title}</p>
            <p className="mt-0.5 text-sm text-white/65">{subtitle}</p>
          </div>
          <span
            aria-hidden
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full
                       bg-white/10 text-white/80 transition duration-300
                       group-hover:translate-x-0.5 group-hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M7 17 17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={subtitle}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white
                 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
                 transition duration-200 hover:border-[#065299]/40 hover:text-[#065299]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#065299]/50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 20V8l8-4 8 4v12M9 20v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {title}
    </a>
  );
};

export default BookingEngineLauncher;