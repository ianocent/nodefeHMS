import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LayoutComponent from "../../components/common/layout/LayoutComponent";
import Seo from "../../components/common/seo";
import TableView from "../../components/common/table-edit";
import { FetchData, GetDecrypt } from "../../components/helper";
import { LayoutContext } from "../../context/LayoutContext";
import { env } from "../../next.config";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Filters {
  gender: string;
  min_age: string;
  max_age: string;
  stay_operator: string;
  stay_value: string;
  nationality_id: string;
  country_id: string;
  city_id: string;
  last_checkout_date: string;
  dob_filter_type: "none" | "year" | "month_year" | "month" | "month_range";
  dob_year: string;
  dob_month: string;
  dob_from_month: string;
  dob_to_month: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GLOBAL_URI = "/cms/guest/guest-listing-report";

const AVAILABLE_COLUMNS = [
  { label: "Account No.", value: "account" },
  { label: "Guest Name", value: "name_combine" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "DOB", value: "birth_of_date" },
  { label: "Stay", value: "stay" },
  { label: "Last Check-out", value: "last_checkout_date" },
  { label: "Phone Number", value: "telp" },
  { label: "Email", value: "email" },
  { label: "Address", value: "address" },
  { label: "City", value: "city" },
  { label: "Nationality", value: "nationality" },
  { label: "Country", value: "country" },
];

const DEFAULT_COLUMNS = [
  "account",
  "name_combine",
  "nationality",
  "country",
  "city",
  "last_checkout_date",
  "gender",
  "age",
  "stay",
  "birth_of_date",
  "telp",
  "email",
  "address",
];

const DEFAULT_FILTERS: Filters = {
  gender: "all",
  min_age: "",
  max_age: "",
  stay_operator: ">",
  stay_value: "",
  nationality_id: "",
  country_id: "",
  city_id: "",
  last_checkout_date: "",
  dob_filter_type: "none",
  dob_year: "",
  dob_month: "",
  dob_from_month: "",
  dob_to_month: "",
};

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// ─── Helper: build URLSearchParams ────────────────────────────────────────────
/**
 * Single source of truth for query params.
 * Both TableView and PDF download use the exact same output from this function,
 * eliminating any mismatch between what's displayed and what's downloaded.
 */
function buildReportParams(columns: string[], filters: Filters): string {
  const params = new URLSearchParams();

  // Columns
  if (columns.length > 0) {
    params.append("columns", columns.join(","));
  }

  // Gender
  if (filters.gender && filters.gender !== "all") {
    params.append("gender", filters.gender);
  }

  // Age range
  if (filters.min_age) params.append("min_age", filters.min_age);
  if (filters.max_age) params.append("max_age", filters.max_age);

  // Stay
  if (filters.stay_value && !isNaN(Number(filters.stay_value))) {
    params.append("stay_operator", filters.stay_operator);
    params.append("stay_value", filters.stay_value);
  }

  // Location
  if (filters.nationality_id) params.append("nationality_id", filters.nationality_id);
  if (filters.country_id) params.append("country_id", filters.country_id);
  if (filters.city_id) params.append("city_id", filters.city_id);

  // Last checkout date
  if (filters.last_checkout_date) {
    params.append("last_checkout_date", filters.last_checkout_date);
  }

  // DOB filters
  if (filters.dob_filter_type !== "none") {
    params.append("dob_filter_type", filters.dob_filter_type);

    // Month only
    if (
      filters.dob_filter_type === "month" &&
      filters.dob_month
    ) {
      params.append("dob_month", filters.dob_month);
    }

    // Year only
    if (
      filters.dob_filter_type === "year" &&
      filters.dob_year
    ) {
      params.append("dob_year", filters.dob_year);
    }

    // Month + Year
    if (filters.dob_filter_type === "month_year") {
      if (filters.dob_month) {
        params.append("dob_month", filters.dob_month);
      }

      if (filters.dob_year) {
        params.append("dob_year", filters.dob_year);
      }
    }
    if (
      filters.dob_filter_type === "month_range" &&
      filters.dob_from_month &&
      filters.dob_to_month
    ) {
      params.append("dob_from_month", filters.dob_from_month);
      params.append("dob_to_month", filters.dob_to_month);
    }
  }

  return params.toString();
}

// ─── Component ────────────────────────────────────────────────────────────────

const ListView = () => {
  const { isLogin } = useSelector((state: any) => state?.auth);
  const router = useRouter();
  const layout = useContext(LayoutContext);

  const datalocal: any = React.useMemo(() => {
    try {
      return JSON.parse(GetDecrypt(isLogin ?? ""));
    } catch {
      return null;
    }
  }, [isLogin]);

  const accessToken = datalocal?.data?.access_token ?? "";

  // ── Applied state (drives the table & download) ──
  // These are only updated when user clicks "Apply" — never mid-edit.
  const [appliedParams, setAppliedParams] = useState("");
  const [appliedColumns, setAppliedColumns] = useState<string[]>([]);
  const [didApplyFilter, setDidApplyFilter] = useState(false);

  // ── Modal draft state (user is still editing) ──
  const [showModal, setShowModal] = useState(false);
  const [draftColumns, setDraftColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS);

  // ── Location dropdowns ──
  const [nationalities, setNationalities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Fetch countries/nationalities once modal opens
  useEffect(() => {
    if (!showModal || nationalities.length > 0) return;
    const fetch = async () => {
      try {
        const resp: any = await FetchData(
          "/cms/master/countries?region=all",
          "GET",
          "",
          false,
          accessToken,
          router,
          ""
        );
        if (resp.code === 200) {
          setNationalities(resp.data || []);
          setCountries(resp.data || []);
        }
      } catch {
        setNationalities([]);
        setCountries([]);
      }
    };
    fetch();
  }, [showModal]);

  // Fetch cities when selected country changes
  useEffect(() => {
    if (!selectedCountry || !showModal) {
      setCities([]);
      return;
    }
    const fetch = async () => {
      try {
        const resp: any = await FetchData(
          `/cms/cityByCountry?country=${selectedCountry}`,
          "GET",
          "",
          false,
          accessToken,
          router,
          ""
        );
        if (resp.code === 200) setCities(resp.data || []);
      } catch {
        setCities([]);
      }
    };
    fetch();
  }, [selectedCountry, showModal]);

  // ── When modal opens, seed drafts from applied state ──
  const handleOpenModal = () => {
    // Pre-populate draft with whatever was last applied
    if (appliedColumns.length > 0) setDraftColumns(appliedColumns);
    setShowModal(true);
  };

  // ── Apply: commit draft → applied ──
  const handleApply = () => {
    if (draftColumns.length === 0) {
      alert("Select at least one column.");
      return;
    }

    const params = buildReportParams(draftColumns, draftFilters);
    setAppliedParams(params);
    setAppliedColumns([...draftColumns]);
    setDidApplyFilter(true);
    setShowModal(false);
  };

  // ── Reset: clear everything ──
  const handleReset = () => {
    setDraftFilters({ ...DEFAULT_FILTERS });
    setDraftColumns([...DEFAULT_COLUMNS]);
    setSelectedNationality("");
    setSelectedCountry("");
    setCountries(nationalities);
    setCities([]);
    // Also reset applied state so table resets
    setAppliedParams("");
    setAppliedColumns([]);
    setDidApplyFilter(false);
    alert("Filter Data has been reset");
  };

  // ── Download: use the SAME appliedParams already shown in the table ──
  const handleDownload = async () => {
    if (!appliedParams) {
      alert("Please apply a filter first.");
      return;
    }
    try {
      const url = `${env.uriApi}/cms/report/batch/frontoffice/guest-listing-report?${appliedParams}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      
      // Deteksi otomatis tipe file (Excel atau PDF) dari Backend
      let extension = "pdf";
      if (
        blob.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        blob.type === "application/vnd.ms-excel"
      ) {
        extension = "xlsx";
      }

      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = `Guest-Listing-${Date.now()}.${extension}`;
      link.click();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // ── Helpers ──
  const setFilter = (partial: Partial<Filters>) =>
    setDraftFilters((prev) => ({ ...prev, ...partial }));

  const toggleColumn = (val: string, checked: boolean) => {
    setDraftColumns((prev) =>
      checked ? [...prev, val] : prev.filter((v) => v !== val)
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <LayoutComponent>
      <Seo
        title={GLOBAL_URI.replaceAll("/cms/", " ").replaceAll("-", " ")}
      />

      <div>
        {/* Top bar */}
        <div className="flex justify-end mb-4 gap-3">
          <button
            onClick={handleOpenModal}
            className="px-5 py-2 bg-secondary text-white rounded-md"
          >
            Setup Report
          </button>
          <button
            onClick={handleDownload}
            disabled={!appliedParams}
            className="px-5 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Download Report
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Generate Guest Listing Report</h2>

              {/* ── Column Selector ── */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-sm">Filter Report</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_COLUMNS.map((col) => (
                    <label key={col.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draftColumns.includes(col.value)}
                        onChange={(e) => toggleColumn(col.value, e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Filter Data ── */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-sm">Filter Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      value={draftFilters.gender}
                      onChange={(e) => setFilter({ gender: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="all">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Age Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        min="0"
                        value={draftFilters.min_age}
                        onChange={(e) => setFilter({ min_age: e.target.value })}
                        className="w-1/2 border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        min="0"
                        value={draftFilters.max_age}
                        onChange={(e) => setFilter({ max_age: e.target.value })}
                        className="w-1/2 border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Stay */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Stay</label>
                    <div className="flex gap-2">
                      <select
                        value={draftFilters.stay_operator}
                        onChange={(e) => setFilter({ stay_operator: e.target.value })}
                        className="border rounded px-2 py-2"
                      >
                        <option value=">">More than</option>
                        <option value="<">Less than</option>
                        <option value=">=">More or equal to</option>
                        <option value="<=">Less or equal to</option>
                        <option value="=">Equal to</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="Amount"
                        value={draftFilters.stay_value}
                        onChange={(e) => setFilter({ stay_value: e.target.value })}
                        className="w-1/2 border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Nationality</label>
                    <select
                      value={draftFilters.nationality_id}
                      onChange={(e) => {
                        setFilter({ nationality_id: e.target.value, country_id: "", city_id: "" });
                        setSelectedNationality(e.target.value);
                        setSelectedCountry("");
                        setCities([]);
                      }}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">All</option>
                      {nationalities.map((n) => (
                        <option key={n.id ?? n.value} value={n.id ?? n.value}>
                          {n.name ?? n.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <select
                      value={draftFilters.country_id}
                      onChange={(e) => {
                        setFilter({ country_id: e.target.value, city_id: "" });
                        setSelectedCountry(e.target.value);
                      }}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">All</option>
                      {countries.map((c) => (
                        <option key={c.id ?? c.value} value={c.id ?? c.value}>
                          {c.name ?? c.label}
                        </option>
                      ))}
                    </select>
                    {!selectedNationality && (
                      <p className="text-xs text-gray-500 mt-1">Select Nationality First</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <select
                      value={draftFilters.city_id}
                      onChange={(e) => setFilter({ city_id: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      disabled={!selectedCountry}
                    >
                      <option value="">All</option>
                      {cities.map((c) => (
                        <option key={c.id ?? c.value} value={c.id ?? c.value}>
                          {c.name ?? c.label}
                        </option>
                      ))}
                    </select>
                    {!selectedCountry && (
                      <p className="text-xs text-gray-500 mt-1">Select Country First</p>
                    )}
                  </div>

                  {/* Last Checkout Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Checkout Date</label>
                    <input
                      type="date"
                      value={draftFilters.last_checkout_date}
                      onChange={(e) => setFilter({ last_checkout_date: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  {/* DOB FILTER */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Filter Date of Birth
                    </label>

                    <select
                      value={draftFilters.dob_filter_type}
                      onChange={(e) =>
                        setFilter({
                          dob_filter_type:
                            e.target.value as Filters["dob_filter_type"],

                          dob_year: "",
                          dob_month: "",
                          dob_from_month: "",
                          dob_to_month: "",
                        })
                      }
                      className="w-full border rounded px-3 py-2 mb-2"
                    >
                      <option value="none">Not Filtered</option>
                      <option value="month">By Month</option>
                      <option value="year">By Year</option>
                      <option value="month_year">By Month & Year</option>
                      <option value="month_range">By Month Range</option>
                    </select>

                    {/* MONTH */}
                    {draftFilters.dob_filter_type === "month" && (
                      <select
                        value={draftFilters.dob_month}
                        onChange={(e) =>
                          setFilter({ dob_month: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select Month</option>

                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* YEAR */}
                    {draftFilters.dob_filter_type === "year" && (
                      <input
                        type="number"
                        placeholder="Year"
                        value={draftFilters.dob_year}
                        onChange={(e) =>
                          setFilter({ dob_year: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    )}

                    {/* MONTH + YEAR */}
                    {draftFilters.dob_filter_type === "month_year" && (
                      <div className="flex gap-2">
                        <select
                          value={draftFilters.dob_month}
                          onChange={(e) =>
                            setFilter({ dob_month: e.target.value })
                          }
                          className="w-1/2 border rounded px-3 py-2"
                        >
                          <option value="">Select Month</option>

                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          placeholder="Year"
                          value={draftFilters.dob_year}
                          onChange={(e) =>
                            setFilter({ dob_year: e.target.value })
                          }
                          className="w-1/2 border rounded px-3 py-2"
                        />
                      </div>
                    )}

                    {/* MONTH RANGE */}
                    {draftFilters.dob_filter_type === "month_range" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">From Month</p>

                          <select
                            value={draftFilters.dob_from_month}
                            onChange={(e) =>
                              setFilter({ dob_from_month: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select From Month</option>

                            {MONTHS.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">To Month</p>

                          <select
                            value={draftFilters.dob_to_month}
                            onChange={(e) =>
                              setFilter({ dob_to_month: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select To Month</option>

                            {MONTHS.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Footer buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
                >
                  Reset Filter
                </button>
                <button
                  onClick={handleApply}
                  className="px-6 py-2 rounded-md bg-primary text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="min-w-full table-auto">
          <TableView
            groups=""
            key={appliedParams}           // re-mounts only when applied params change
            uri={GLOBAL_URI}
            queryString={appliedParams}   // ← exact same string used for PDF download
            onDataLoaded={(data) => {
              if (didApplyFilter && Array.isArray(data) && data.length === 0) {
                toast.error("Data tidak ditemukan", {
                  position: "bottom-center",
                  autoClose: 6000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }
            }}
            isEditTable={false}
            isClickAbled={false}
            isBtnEdit={false}
            isBtnAdd={false}
          />
        </div>
      </div>
    </LayoutComponent>
  );
};

export default ListView;
