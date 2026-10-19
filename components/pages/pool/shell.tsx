'use client';
/**
 * M10 — Shell desktop Pool (`/house-keeping/pool/*`).
 * Wrapper tipis: PaperBase + strip tab antar sub-modul Pool.
 * Endpoint isi = sama dengan mobile M9; file existing desktop tidak disentuh.
 */
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PaperBase from '../../common/paper/PaperBase';

const TABS = [
  { slug: 'attendance', label: 'Pool Attendance' },
  { slug: 'usage', label: 'Pool Usage' },
  { slug: 'setup', label: 'Pool Setup' },
  { slug: 'area', label: 'Pool Area' },
  { slug: 'recap', label: 'Pool Recap' },
];

interface PoolShellProps {
  active?: string;
  children: ReactNode;
}

export const PoolShell = ({ active, children }: PoolShellProps) => {
  const router = useRouter();
  const current = React.useMemo(() => {
    if (active) return active;
    const seg = String(router?.pathname ?? '').split('/').pop() ?? '';
    return TABS.some((t) => t.slug === seg) ? seg : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, router?.pathname]);

  return (
    <PaperBase>
      <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-gray-200 pb-1">
        {TABS.map((t) => (
          <Link
            key={t.slug}
            href={`/house-keeping/pool/${t.slug}`}
            className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
              current === t.slug
                ? 'border-b-2 border-[rgb(132,90,223)] bg-[rgb(132,90,223)]/10 text-[rgb(132,90,223)]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      {children}
    </PaperBase>
  );
};

export default PoolShell;
