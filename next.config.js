/**@type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const suriFe = process.env.NEXT_PUBLIC_FRONTEND_URL || "";
const suriApi = process.env.NEXT_PUBLIC_API_URL || process.env.URI_API || "http://localhost:3001";
const sPassAes = process.env.NEXT_PUBLIC_AES_KEY || "lbwyBzfgzUIvXZFShJuikaWvLJhIVq36";
const nextConfig = {
  //output: "export",
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    // Lint is clean (0 errors / 0 warnings as of 2026-08-23) — keep it enforced
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: ["@nextui-org/react", "framer-motion", "apexcharts", "@tinymce/tinymce-react", "@ckeditor/ckeditor5-react"],
  },
  env: {
    uriFe: suriFe,
    uriApi: suriApi,
    passAes: sPassAes,
  },
  images: {
    loader: "imgix",
    path: "/",
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", ".next/**"],
      };
    }
    return config;
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/",
          destination: "/dashboard",
        },
        {
          source: "/user/form/:aliasSlug*",
          destination: "/user/form/",
        },
        {
          source: "/user/view/:aliasSlug*",
          destination: "/user/view/",
        },
        {
          source: "/role/form/:aliasSlug*",
          destination: "/role/form/",
        },
        {
          source: "/role/view/:aliasSlug*",
          destination: "/role/view/",
        },
        {
          source: "/permission/form/:aliasSlug*",
          destination: "/permission/form/",
        },
        {
          source: "/navigation-menu/form/:aliasSlug*",
          destination: "/navigation-menu/form/",
        },
        {
          source: "/property/form/:aliasSlug*",
          destination: "/property/form/",
        },
        {
          source: "/property/view/:aliasSlug*",
          destination: "/property/view/",
        },
        {
          source: "/company/form/:aliasSlug*",
          destination: "/company/form/",
        },
        {
          source: "/company/view/:aliasSlug*",
          destination: "/company/view/",
        },
        {
          source: "/room/form/:aliasSlug*",
          destination: "/room/form/",
        },
        {
          source: "/room/view/:aliasSlug*",
          destination: "/room/view/",
        },
        {
          source: "/room-type/form/:aliasSlug*",
          destination: "/room-type/form/",
        },
        {
          source: "/room-type/view/:aliasSlug*",
          destination: "/room-type/view/",
        },
        {
          source: "/room-configuration/form/:aliasSlug*",
          destination: "/room-configuration/form/",
        },
        {
          source: "/room-configuration/view/:aliasSlug*",
          destination: "/room-configuration/view/",
        },
        {
          source: "/room-type-grouping/form/:aliasSlug*",
          destination: "/room-type-grouping/form/",
        },
        {
          source: "/room-type-grouping/view/:aliasSlug*",
          destination: "/room-type-grouping/view/",
        },
        {
          source: "/city/form/:aliasSlug*",
          destination: "/city/form/",
        },
        {
          source: "/city/view/:aliasSlug*",
          destination: "/city/view/",
        },
        {
          source: "/country/form/:aliasSlug*",
          destination: "/country/form/",
        },
        {
          source: "/country/view/:aliasSlug*",
          destination: "/country/view/",
        },
        {
          source: "/setup/view/:aliasSlug*",
          destination: "/setup/view/",
        },
        {
          source: "/setup/form/:aliasSlug*",
          destination: "/setup/form/",
        },
        {
          source: "/code-gls/view/:aliasSlug*",
          destination: "/code-gls/view/",
        },
        {
          source: "/code-gls/form/:aliasSlug*",
          destination: "/code-gls/form/",
        },
        {
          source: "/code-billing/view/:aliasSlug*",
          destination: "/code-billing/view/",
        },
        {
          source: "/code-billing/form/:aliasSlug*",
          destination: "/code-billing/form/",
        },
        {
          source: "/code-post/view/:aliasSlug*",
          destination: "/code-post/view/",
        },
        {
          source: "/code-post/form/:aliasSlug*",
          destination: "/code-post/form/",
        },
        {
          source: "/code-item/view/:aliasSlug*",
          destination: "/code-item/view/",
        },
        {
          source: "/code-item/form/:aliasSlug*",
          destination: "/code-item/form/",
        },
        {
          source: "/accounting/:path*",
          destination: "/accounting",
        },
        {
          source: "/master-setup/:path*",
          destination: "/master-setup",
        },
        {
          source: "/profile/:path*",
          destination: "/profile",
        },
        {
          source: "/concierge/:path*",
          destination: "/concierge",
        },
        {
          source: "/rate-management/:path*",
          destination: "/rate-management",
        },
        {
          source: "/reservation/:path*",
          destination: "/reservation",
        },
        {
          source: "/house-keeping/:path*",
          destination: "/house-keeping",
        },
        {
          source: "/house-keeping/:path*",
          destination: "/house-keeping",
        },
        {
          source: "/reporting/:path*",
          destination: "/reporting",
        },
        {
          source: "/utility/:path*",
          destination: "/utility",
        },
        {
          source: "/content/:path*",
          destination: "/content",
        },
        {
          source: "/module/:path*",
          destination: "/module",
        },
        {
          source: "/event/:path*",
          destination: "/event",
        },
        {
          source: "/guest-listing-report/:path*",
          destination: "/guest-listing-report",
        },
        {
          source: "/staah/:path*",
          destination: "/staah",
        },
        {
          source: "/dynamic-rate/:path*",
          destination: "/dynamic-rate",
        },

      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
