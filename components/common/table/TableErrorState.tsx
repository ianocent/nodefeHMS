import React from "react";

type TableErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/**
 * Rendered instead of "Not Data" when a table request failed.
 *
 * "Not Data" is only true when the server answered and the result set is empty.
 * A dropped connection, a 500, a rejected request and a genuinely empty folio
 * used to render the exact same sentence, which trained staff to read a
 * transport failure as "zero records". Never share a branch between the two.
 */
const TableErrorState = ({
  message = "Gagal memuat data. Koneksi ke server terputus atau permintaan ditolak.",
  onRetry,
  retryLabel = "Coba lagi",
}: TableErrorStateProps) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-8 flex flex-col items-center gap-3 px-4 text-center"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10 text-[20px] text-red"
      >
        !
      </span>
      <p className="max-w-md text-[13px] font-medium text-red">{message}</p>
      <p className="max-w-md text-[12px] text-gray-500">
        Data di bawah ini tidak dimuat. Jangan dianggap sebagai data kosong.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="ti-btn ti-btn-primary !bg-primary !text-white !font-medium !px-4 !py-1"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
};

export default TableErrorState;
