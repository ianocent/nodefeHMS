import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Seo from "../../../../../components/common/seo";
import { env } from "../../../../../next.config";
import { setDatas, setLogin, setPermissions, setRoles } from "../../../../../redux/auth/authSlice";
import { mapPermissions } from "../../../../../redux/auth/permissionHelper";
import { BookingEngineLauncher } from "../../../BookingEngineLauncher";
import ButtonSubmit from "../../../button/ButtonSubmit";
// `resources/` lives outside `public/`, so it has no URL of its own. A static import
// lets Next emit the file and hand back a working path.
import anyamanLogo from "../../../../../resources/icon.png";

import {
  FetchData,
  GetEncrypt,
  GetQueryParam
} from "../../../../helper";

// Entrance choreography. Four timed steps instead of a single fade: the brand block
// leads, the card follows, then the fields, then the actions — so the eye is walked
// down the form instead of everything appearing at once.
const ENTER_STYLES = `
@keyframes hmsRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes hmsFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hmsDrift { 0% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(2%, -2%, 0) scale(1.06); } 100% { transform: translate3d(0,0,0) scale(1); } }
@keyframes hmsSweep { from { transform: translateX(-120%); } to { transform: translateX(220%); } }
.hms-enter-rise { animation: hmsRise 620ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.hms-enter-fade { animation: hmsFade 520ms ease both; }
.hms-drift { animation: hmsDrift 26s ease-in-out infinite; }
.hms-drift-slow { animation: hmsDrift 38s ease-in-out infinite reverse; }
.hms-sweep::after {
  content: ""; position: absolute; inset: 0 auto 0 -40%; width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
  animation: hmsSweep 5.5s ease-in-out infinite;
}
/* Arch mask. Changed to a moon/circle shape per user request. */
.hms-arch {
  -webkit-mask-image: radial-gradient(circle at 0% 50%, #000 80%, transparent 81%);
  mask-image: radial-gradient(circle at 0% 50%, #000 80%, transparent 81%);
}
/* Mobile dome: elliptical top corners, flat bottom, bleeds to screen edges. */
.hms-dome {
  border-top-left-radius: 50% 28%;
  border-top-right-radius: 50% 28%;
}
@media (prefers-reduced-motion: reduce) {
  .hms-enter-rise, .hms-enter-fade, .hms-drift, .hms-drift-slow, .hms-sweep::after { animation: none !important; }
}
`;

const step = (ms: number) => ({ animationDelay: `${ms}ms` });

interface BrandBanner {
  id: string;
  property_id: string;
  property_name: string | null;
  property_slug: string | null;
  name: string | null;
  url: string | null;
  image: string | null;
}

// GET /middleware/branding/banners answers plain JSON, not the AES envelope every
// FetchData() caller expects, so this bypasses the helper on purpose.
const fetchBrandBanners = async (): Promise<BrandBanner[]> => {
  const res = await fetch(`${env.uriApi}/middleware/branding/banners`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (String(json?.code) !== "200") throw new Error(json?.message ?? "bad code");
  return Array.isArray(json?.data) ? json.data : [];
};

/**
 * Crossfading banner backdrop.
 *
 * Every image is mounted for the whole session and only its opacity changes, so
 * there is no decode flash on each transition and no layout shift. Two layers are
 * kept mounted because a single-layer crossfade would blank the panel for one
 * frame every interval.
 */
const BannerBackdrop = ({
  banners,
  active,
  reducedMotion,
}: {
  banners: BrandBanner[];
  active: number;
  reducedMotion: boolean;
}) => {
  if (!banners.length) return null;

  return (
    <>
      {banners.map((b, i) => (
        <div
          key={b.id}
          aria-hidden={i !== active}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${env.uriApi}${b.image}")`,
            opacity: i === active ? 1 : 0,
            // Slow zoom on the live slide only. The outgoing slide keeps still so the
            // two never scale against each other mid-crossfade.
            transform: i === active ? "scale(1.04)" : "scale(1)",
            transitionProperty: "opacity, transform",
            transitionDuration: reducedMotion ? "0ms" : "1600ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      ))}
    </>
  );
};

const LoginPage = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const dispatch = useDispatch();
  let navigate = useRouter();
  const [passwordshow1, setpasswordshow1] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setloading] = useState(false);
  const [isforgot, setforgot] = useState(false);
  const [forgotSucces, setForgotSucces] = useState(false);
  const [alert, setalert] = useState(false);
  const [msgalert, setmsgalert] = useState("");
  useEffect(() => {
    setReady(true);
    // console.log(macAddr);
  }, []);

  const [banners, setBanners] = useState<BrandBanner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    // A failed fetch must not block sign-in, so the panel simply keeps its base
    // gradient instead of surfacing an error on the login screen.
    fetchBrandBanners()
      .then((rows) => setBanners(rows))
      .catch((e) => console.warn("login banners unavailable:", e?.message));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (banners.length < 2 || reducedMotion) return;
    const timer = setInterval(
      () => setBannerIndex((i) => (i + 1) % banners.length),
      6500
    );
    return () => clearInterval(timer);
  }, [banners.length, reducedMotion]);

  // The list can arrive after the timer starts (or shrink on refetch), so clamp
  // rather than trusting the stored index.
  const activeBanner =
    banners.length > 0 ? banners[bannerIndex % banners.length] : null;
  const [err, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = data;
  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };
  const Login = async () => {
    setalert(false);
    setmsgalert("");
    const raw = JSON.stringify({
      email: email,
      password: password,
    });
    // console.log("debug", raw);
    var uripost = "/cms/login";
    if (isforgot) {
      uripost = "/cms/forget-password";
    }
    const aesraw = GetEncrypt(raw);
    const data = FetchData(uripost, "POST", aesraw, false, "", navigate, "");
    const datajson = await data;
    const parsed = datajson;
    const mapped = mapPermissions(parsed?.data?.permissions || []);
    dispatch(setPermissions(mapped));
    if (datajson?.code == "200") {
      if (isforgot) {
        setForgotSucces(true);
      } else {
        const mapped = mapPermissions(parsed?.data?.permissions || []);
        const rolesData = parsed?.data?.role || parsed?.data?.roles || [];
        const roleNames = Array.isArray(rolesData)
          ? rolesData.map((r: any) => r?.name || r?.label || String(r)).filter(Boolean)
          : typeof rolesData === "string" ? [rolesData] : [];

        dispatch(setLogin(GetEncrypt(JSON.stringify(parsed))));
        dispatch(setDatas(parsed?.data));
        dispatch(setPermissions(mapped));
        dispatch(setRoles(roleNames));

        setTimeout(() => {
          window.location.assign("/choose-property");
        }, 600);
      }
    } else {
      setloading(false);
    }
  };
  useEffect(() => {
    if (GetQueryParam(0) != "dashboard") {
      window.location.assign("/dashboard");
    }
  }, []);

  return (
    <Fragment>
      <Seo title={"Content Management System"} />
      <style>{ENTER_STYLES}</style>
      {ready ? (
        <div className="flex min-h-screen w-full flex-col bg-[#f7f4ee] lg:grid lg:grid-cols-[55%_45%]">
          {/* ── Brand / guest-facing panel ───────────────────────────── */}
          <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between p-10 xl:p-14">
            {/* The circular masked background covering the whole left panel */}
            <div className="absolute inset-0 hms-arch bg-slate-200">
                <BannerBackdrop
                  banners={banners}
                  active={banners.length ? bannerIndex % banners.length : 0}
                  reducedMotion={reducedMotion}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,14,28,0.5)_0%,rgba(3,14,28,0.2)_40%,rgba(4,18,34,0.7)_100%)]"
                />
            </div>
            {/* 
              Photo stage is removed since we want the background to be full bleed masked.
            */}
            <div className="relative flex min-h-0 flex-1 flex-col justify-between">
              <div className="hms-enter-rise relative z-10 mb-6 shrink-0" style={step(60)}>
                <div className="flex items-center gap-4">
                  <img
                    src={(anyamanLogo as any).src ?? (anyamanLogo as any)}
                    alt="Anyaman"
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain drop-shadow-[0_2px_12px_rgba(212,175,110,0.35)]"
                  />
                  <div className="leading-tight">
                    <p className="text-base font-semibold text-white drop-shadow-md">Anyaman</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/80 drop-shadow-md">
                      Hotel Management
                    </p>
                  </div>
                </div>
              </div>

              {/* Empty flex-1 to push the text to the bottom */}
              <div className="flex-1" />

              <div className="relative mt-7 shrink-0">
                <h1
                  className="hms-enter-rise max-w-md text-[2.4rem] font-semibold leading-[1.12] text-white xl:text-[2.75rem]"
                  style={step(140)}
                >
                  One Solution.
                  <span className="block text-white/55">
                    for hotels, villas and resorts.
                  </span>
                </h1>

                {/* Names the property currently on screen, so the panel reads as the
                    collection it actually is instead of one anonymous hotel. */}
                {activeBanner?.property_name && (
                  <p
                    className="hms-enter-fade mt-4 flex items-center gap-2 text-sm font-medium text-white/70"
                    style={step(260)}
                  >
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9b97a]" />
                    <span className="text-white/45 shadow-md">Now showing</span>
                    <span className="truncate text-white/85">
                      {activeBanner.property_name}
                    </span>
                  </p>
                )}

                <div className="hms-enter-rise mt-7 max-w-[16rem]" style={step(340)}>
                  <BookingEngineLauncher
                    variant="panel"
                    title="Open Guest Portal"
                    subtitle="by Anyaman"
                  />
                </div>
              </div>
            </div>

          </aside>

          {/* ── Sign-in ──────────────────────────────────────────────── */}
          <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#f7f4ee] via-[#f7f4ee] to-[#f7f4ee] px-6 pb-8 pt-14 lg:flex-none lg:py-14">
            <div className="w-full max-w-[26rem]">
              <div className="hms-enter-rise flex items-center gap-3 lg:hidden" style={step(60)}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#04121f]">
                  <img
                    src={(anyamanLogo as any).src ?? (anyamanLogo as any)}
                    alt="Anyaman"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">Anyaman</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Hotel Management
                  </p>
                </div>
              </div>

              <div className="hms-enter-rise mt-8 lg:mt-0" style={step(140)}>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {isforgot
                    ? forgotSucces
                      ? "Send Email"
                      : "Forgot Password"
                    : "Sign In"}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  {isforgot
                    ? "Enter your email and we will send a reset link."
                    : "Enter your email or username to continue."}
                </p>
              </div>

              <div className="mt-7 space-y-4">
                <div className="hms-enter-rise" style={step(220)}>
                  <label
                    htmlFor="signin-email"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500"
                  >
                    {isforgot ? "Email" : "Username"}
                  </label>
                  {forgotSucces ? (
                    <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">
                      Check your inbox — we have sent a password reset link.
                    </p>
                  ) : (
                    <input
                      type="text"
                      name="email"
                      id="signin-email"
                      autoComplete="username"
                      placeholder={isforgot ? "you@hotel.com" : "e.g. frontdesk"}
                      onChange={changeHandler}
                      value={email}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5
                                 text-sm text-slate-900 outline-none transition
                                 placeholder:text-slate-400
                                 focus:border-[#065299] focus:ring-2 focus:ring-[#065299]/15"
                    />
                  )}
                </div>

                {!isforgot && (
                  <div className="hms-enter-rise" style={step(280)}>
                    <label
                      htmlFor="signin-password"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        id="signin-password"
                        autoComplete="current-password"
                        type={passwordshow1 ? "text" : "password"}
                        value={password}
                        onChange={changeHandler}
                        placeholder="••••••••"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            setloading(true);
                            Login();
                            return;
                          }
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-11
                                   text-sm text-slate-900 outline-none transition
                                   placeholder:text-slate-400
                                   focus:border-[#065299] focus:ring-2 focus:ring-[#065299]/15"
                      />
                      <button
                        onClick={() => setpasswordshow1(!passwordshow1)}
                        aria-label={passwordshow1 ? "Hide password" : "Show password"}
                        type="button"
                        className="absolute inset-y-0 right-0 grid w-11 place-items-center
                                   text-slate-400 transition hover:text-slate-700"
                      >
                        <i
                          className={`${
                            passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                          } align-middle text-base`}
                        ></i>
                      </button>
                    </div>
                  </div>
                )}

                <div className="hms-enter-rise pt-1" style={step(340)}>
                  {!forgotSucces && (
                    <ButtonSubmit
                      onCreate={() => {
                        Login();
                        setloading(true);
                      }}
                      loading={loading}
                      label={isforgot ? "Submit" : "Login"}
                      alert={alert}
                      msgalert={msgalert}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (isforgot) {
                        setforgot(false);
                        setForgotSucces(false);
                      } else {
                        setforgot(true);
                      }
                    }}
                    className="mt-3 block w-full text-center text-xs font-medium text-slate-500
                               underline-offset-4 transition hover:text-[#065299] hover:underline"
                  >
                    {isforgot ? "Back to sign in" : "Forgot password?"}
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* ── Mobile dome: image at bottom + readable glass launcher ── */}
          <section
            className="hms-dome hms-enter-fade relative mt-4 h-[22rem] w-full shrink-0 overflow-hidden bg-slate-300 lg:hidden"
            style={step(420)}
          >
            <BannerBackdrop
              banners={banners}
              active={banners.length ? bannerIndex % banners.length : 0}
              reducedMotion={reducedMotion}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,14,28,0.05)_0%,rgba(3,14,28,0.25)_45%,rgba(4,18,34,0.75)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8">
              {activeBanner?.property_name && (
                <p className="mb-3 flex max-w-full items-center gap-2 text-xs font-medium text-white/80">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9b97a]" />
                  <span className="text-white/55">Now showing</span>
                  <span className="truncate text-white/90">{activeBanner.property_name}</span>
                </p>
              )}
              <div className="w-full max-w-sm">
                <BookingEngineLauncher
                  variant="panel"
                  title="Open Guest Portal"
                  subtitle="by Anyaman"
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default LoginPage;