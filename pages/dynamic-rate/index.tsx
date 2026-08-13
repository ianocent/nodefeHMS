import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import PaperBase from "../../components/common/paper/PaperBase";
import Seo from "../../components/common/seo";
import TableView from "../../components/common/table-edit";
import { FetchData, formatAmount, GetDecrypt, GetEncrypt, GFormatDate } from "../../components/helper";
const ReactApexChart = dynamic(() => import("react-apexcharts").then((mod) => mod.default), { ssr: false });
interface IConfig {
  id: number;
  name: string;
  forecast_method: string;
  gdp_growth_rate: number;
  inflation_rate: number;
  adjustment_sensitivity: number;
  min_adjustment_percent: number;
  max_adjustment_percent: number;
  target_occupancy: number;
  lookback_days: number;
  forecast_days: number;
  is_active: boolean;
  auto_apply: boolean;
}

interface IResult {
  date: string;
  room_type_id: { value: number; label: string };
  historical_adr: number;
  forecasted_occupancy: number;
  base_rate: number;
  suggested_rate_one_adult: number;
  suggested_rate_two_adult: number;
  adjustment_percent: number;
  gdp_impact: number;
  inflation_impact: number;
  seasonality_factor: number;
  occupancy_factor: number;
  confidence_score: number;
  is_applied: boolean;
}

const DynamicRateManagement = () => {
  const router = useRouter();
  const GLOBALURI = "/cms/dynamic-rate";
  const { isLogin } = useSelector((state: any) => state?.auth);
  const token: string = isLogin ? JSON.parse(GetDecrypt(isLogin))?.data?.access_token ?? "" : "";

  const [activeTab, setActiveTab] = useState<"config" | "results" | "stats">("config");
  const [configs, setConfigs] = useState<IConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<IConfig | null>(null);
  const [results, setResults] = useState<IResult[]>([]);
  const [loadingCalc, setLoadingCalc] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsTotal, setResultsTotal] = useState(0);
  const RESULTS_LIMIT = 30;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [roomTypeOptions, setRoomTypeOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedRoomTypeIds, setSelectedRoomTypeIds] = useState<number[]>([]);

  const fetchConfigs = useCallback(async () => {
    const res = await FetchData(`${GLOBALURI}?limit=100`, "GET", "", false, token, router, "");
    if (res?.code == 200 && res?.data) {
      setConfigs(res.data.map((d: any) => d));
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const onCalculate = async (configId: number) => {
    setLoadingCalc(true);
    setMessage("");
    try {
      const payload: any = {};
      if (selectedRoomTypeIds.length > 0) {
        payload.room_type_ids = selectedRoomTypeIds;
      }
      const aesraw = GetEncrypt(JSON.stringify(payload));
      const res = await FetchData(`${GLOBALURI}/${configId}/calculate`, "POST", aesraw, false, token, router, "");
      if (res?.code == 200) {
        setMessage("Calculation complete. " + (res.data?.results_count ?? 0) + " results generated.");
        fetchResults(configId);
      } else {
        setMessage("Calculation failed: " + (res?.message ?? "Unknown error"));
      }
    } catch (e) {
      setMessage("Calculation error.");
    }
    setLoadingCalc(false);
  };

  const fetchRoomTypeOptions = async (configId: number) => {
    try {
      const res = await FetchData(`${GLOBALURI}/${configId}/results?limit=1`, "GET", "", false, token, router, "");
      if (res?.table) {
        const rtCol = res.table.find((c: any) => c.key === "room_type_id");
        if (rtCol?.options) {
          setRoomTypeOptions(rtCol.options);
        }
      }
    } catch (e) {}
  };

  const fetchResults = async (configId: number, start?: string, end?: string, roomTypeId?: string, page: number = 1) => {
    let url = `${GLOBALURI}/${configId}/results?limit=${RESULTS_LIMIT}&page=${page}`;
    if (start) url += `&start_date=${start}`;
    if (end) url += `&end_date=${end}`;
    if (roomTypeId) url += `&room_type_id=${roomTypeId}`;
    const res = await FetchData(url, "GET", "", false, token, router, "");
    if (res?.code == 200) {
      if (res?.data) setResults(res.data);
      if (res?.table) {
        const rtCol = res.table.find((c: any) => c.key === "room_type_id");
        if (rtCol?.options) setRoomTypeOptions(rtCol.options);
      }
      if (res?.pagging) {
        setResultsTotal(res.pagging.total_data);
        setResultsPage(res.pagging.start_paging);
      }
      setActiveTab("results");
    }
  };

  const fetchStats = async (configId: number) => {
    setActiveTab("stats");
    setMessage("");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      const apiUrl = (process.env.uriApi || "") + `${GLOBALURI}/${configId}/statistics`;
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      });
      const text = await res.text();
      const datajson = JSON.parse(GetDecrypt(text));
      if (datajson?.code == 200 && datajson?.data) {
        setStats(datajson.data);
      } else {
        setStats(null);
        setMessage("Statistics not available.");
      }
    } catch (e: any) {
      console.log("stats error:", e);
      setStats(null);
      setMessage("Stats fetch error: " + (e?.message || "unknown"));
    }
  };

  const onApply = async () => {
    if (!selectedConfig || !startDate) {
      setMessage("Select config and start date.");
      return;
    }
    setLoadingApply(true);
    setMessage("");
    try {
      const body = JSON.stringify({
        start_date: startDate,
        end_date: endDate || startDate,
      });
      const aesraw = GetEncrypt(body);
      const res = await FetchData(
        `${GLOBALURI}/${selectedConfig.id}/apply`,
        "POST",
        aesraw,
        false,
        token,
        router,
        ""
      );
      if (res?.code == 200) {
        setMessage(res?.message ?? "Applied successfully.");
        if (selectedConfig?.id) fetchResults(selectedConfig.id, startDate, endDate);
      } else {
        setMessage("Apply failed: " + (res?.message ?? "Unknown error"));
      }
    } catch (e) {
      setMessage("Apply error.");
    }
    setLoadingApply(false);
  };

  const onSync = async () => {
    if (!selectedConfig) return;
    setLoadingSync(true);
    setMessage("");
    try {
      const payload: any = {};
      if (selectedRoomTypeIds.length > 0) {
        payload.room_type_ids = selectedRoomTypeIds;
      }
      const aesraw = GetEncrypt(JSON.stringify(payload));
      const res = await FetchData(`${GLOBALURI}/${selectedConfig.id}/sync`, "POST", aesraw, false, token, router, "");
      if (res?.code == 200) {
        setMessage(res?.message ?? "Sync complete.");
        fetchResults(selectedConfig.id);
      } else {
        setMessage("Sync failed: " + (res?.message ?? "Unknown error"));
      }
    } catch (e) {
      setMessage("Sync error.");
    }
    setLoadingSync(false);
  };

  const forecastMethodLabel = (m: string) => {
    const map: Record<string, string> = {
      moving_average: "Moving Average",
      exponential_smoothing: "Exponential Smoothing",
      linear_regression: "Linear Regression",
      seasonal_decomposition: "Seasonal Decomposition",
      holt_winters: "Holt-Winters",
    };
    return map[m] ?? m;
  };

  const chartOptions = (title: string, data: any[], color: string): any => ({
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { width: 2, curve: "smooth" },
    colors: [color],
    xaxis: {
      categories: data.map((d) => GFormatDate(d.name)),
      labels: { rotate: -45, style: { fontSize: "10px" } },
    },
    yaxis: { labels: { formatter: (v: number) => v.toLocaleString("id-ID") } },
    title: { text: title, style: { fontSize: "13px", fontWeight: "bold" } },
    tooltip: { y: { formatter: (v: number) => v.toLocaleString("id-ID") } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f1f1f1" },
  });

  return (
    <>
      <Seo title="Dynamic Rate Management" />

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        {(["config", "results", "stats"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              if (t === "stats" && selectedConfig && !stats) {
                fetchStats(selectedConfig.id);
              }
              if (t === "results" && selectedConfig && results.length === 0) {
                fetchResults(selectedConfig.id);
              }
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t
                ? "border-[#845ADF] text-[#845ADF]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "config" ? "Configurations" : t === "results" ? "Results" : "Statistics"}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200">
          {message}
        </div>
      )}

      {/* Config Tab */}
      {activeTab === "config" && (
        <div>
          <div className="flex gap-3 mb-4 flex-wrap items-center bg-gray-50 p-3 rounded-lg border">
            <Select
              className="w-56 text-sm"
              placeholder="Select config..."
              options={configs.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(e: any) => {
                const cfg = configs.find((c) => c.id === e?.value) ?? null;
                setSelectedConfig(cfg);
                setSelectedRoomTypeIds([]);
                if (cfg) fetchRoomTypeOptions(cfg.id);
              }}
              value={
                selectedConfig
                  ? { value: selectedConfig.id, label: selectedConfig.name }
                  : null
              }
              isClearable
            />
            {roomTypeOptions.length > 0 && (
              <Select
                className="w-56 text-sm"
                placeholder="All room types..."
                options={roomTypeOptions}
                onChange={(e: any) => {
                  setSelectedRoomTypeIds(e ? e.map((o: any) => o.value) : []);
                }}
                isMulti
                isClearable
              />
            )}
            {selectedConfig && (
              <>
                <span className="text-gray-300 mx-1">|</span>
                <button
                  onClick={() => onCalculate(selectedConfig.id)}
                  disabled={loadingCalc}
                  className="px-4 py-2 bg-[#845ADF] text-white rounded-md text-sm hover:bg-[#6a46c9] disabled:opacity-50 font-medium"
                >
                  {loadingCalc ? "..." : "Run Forecast"}
                </button>
                <button
                  onClick={onSync}
                  disabled={loadingSync}
                  className="px-4 py-2 bg-success text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 font-semibold"
                >
                  {loadingSync ? "..." : "Sync & Apply"}
                </button>
                <span className="text-gray-300 mx-1">|</span>
                <button
                  onClick={() => fetchResults(selectedConfig.id)}
                  className="px-4 py-2 bg-warning text-white rounded-md text-sm hover:bg-warning/80 font-medium"
                >
                  View Results
                </button>
                <button
                  onClick={() => fetchStats(selectedConfig.id)}
                  className="px-4 py-2 bg-warning/80 text-white rounded-md text-sm hover:bg-warning/60 font-medium"
                >
                  Statistics
                </button>
              </>
            )}
            <span className="flex-1" />
            <button
              onClick={fetchConfigs}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              title="Refresh config list"
            >
              &#x21bb; Refresh
            </button>
          </div>

          {selectedConfig && (
            <PaperBase>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Method</span><div className="font-semibold mt-2">{forecastMethodLabel(selectedConfig.forecast_method)}</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">GDP Growth</span><div className="font-semibold mt-2">{parseFloat(String(selectedConfig.gdp_growth_rate ?? 0).replace(/\./g, '').replace(',', '.')).toFixed(2)}%</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Inflation</span><div className="font-semibold mt-2">{parseFloat(String(selectedConfig.inflation_rate ?? 0).replace(/\./g, '').replace(',', '.')).toFixed(2)}%</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Target Occupancy</span><div className="font-semibold mt-2">{parseFloat(String(selectedConfig.target_occupancy ?? 0).replace(/\./g, '').replace(',', '.')).toFixed(1)}%</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Sensitivity</span><div className="font-semibold mt-2">{parseFloat(String(selectedConfig.adjustment_sensitivity ?? 0).replace(/\./g, '').replace(',', '.')).toFixed(2)}</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Adjustment Range</span><div className="font-semibold mt-2">{parseFloat(String(selectedConfig.min_adjustment_percent ?? 0).replace(/\./g, '').replace(',', '.')).toFixed(0)}% ~ {parseFloat(String(selectedConfig.max_adjustment_percent ?? 0).replace(/\./g, '').replace(',', '.')).toFixed(0)}%</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Lookback / Forecast</span><div className="font-semibold mt-2">{selectedConfig.lookback_days}d / {selectedConfig.forecast_days}d</div></div>
                <div><span className="text-gray-700 text-xs bg-gray-300 rounded-md p-2">Auto Apply</span><div className="font-semibold mt-2">{selectedConfig.auto_apply ? <span className="text-green-600">ON</span> : <span className="text-gray-400">OFF</span>}</div></div>
              </div>
            </PaperBase>
          )}

          <div className="mt-4">
            <TableView
              groups=""
              uri={GLOBALURI}
              isEditTable={true}
              btnCustome={() => (
                <button
                  onClick={fetchConfigs}
                  className="px-3 py-2 bg-gray-400 text-gray-700 rounded-md text-sm hover:bg-gray-200 border"
                >
                  Load Configs
                </button>
              )}
            />
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && selectedConfig && (
        <div>
          <div className="flex gap-3 mb-4 flex-wrap items-center bg-gray-50 p-3 rounded-lg border">
            <span className="text-sm font-semibold text-gray-700">{selectedConfig.name}</span>
            <span className="text-gray-300">|</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-2 py-1.5 rounded text-sm"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-2 py-1.5 rounded text-sm"
            />
            {roomTypeOptions.length > 0 && (
              <select
                className="border px-2 py-1.5 rounded text-sm"
                onChange={(e) => {
                  const v = e.target.value;
                  fetchResults(selectedConfig.id, startDate, endDate, v || undefined);
                }}
                defaultValue=""
              >
                <option value="">All room types</option>
                {roomTypeOptions.map((rt) => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => fetchResults(selectedConfig.id, startDate, endDate)}
              className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary/80"
            >
              Filter
            </button>
            <span className="flex-1" />
            <button
              onClick={() => onCalculate(selectedConfig.id)}
              disabled={loadingCalc}
              className="px-3 py-1.5 bg-[#845ADF] text-white rounded-md text-sm disabled:opacity-50"
            >
              {loadingCalc ? "..." : "Recalculate"}
            </button>
            <button
              onClick={onApply}
              disabled={loadingApply}
              className="px-4 py-1.5 bg-success hover:bg-success/80 text-white rounded-md text-sm font-semibold disabled:opacity-50"
            >
              {loadingApply ? "..." : "Apply Rates"}
            </button>
          </div>

          <PaperBase>
            <div className="overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left">Date</th>
                    <th className="px-2 py-2 text-left">Room Type</th>
                    <th className="px-2 py-2 text-right">Hist ADR</th>
                    <th className="px-2 py-2 text-right">Base Rate</th>
                    <th className="px-2 py-2 text-right">Suggest</th>
                    <th className="px-2 py-2 text-right">Adj %</th>
                    <th className="px-2 py-2 text-right">Occ %</th>
                    <th className="px-2 py-2 text-right">Confidence</th>
                    <th className="px-2 py-2 text-center">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-4 text-gray-400">No results. Run forecast first.</td></tr>
                  ) : (
                    results.map((r, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="px-2 py-1.5">{GFormatDate(r.date)}</td>
                        <td className="px-2 py-1.5">{r.room_type_id?.label ?? "-"}</td>
                        <td className="px-2 py-1.5 text-right">{formatAmount(r.historical_adr)}</td>
                        <td className="px-2 py-1.5 text-right">{formatAmount(r.base_rate)}</td>
                        <td className="px-2 py-1.5 text-right font-semibold text-[#845ADF]">{formatAmount(r.suggested_rate_one_adult)}</td>
                        <td className="px-2 py-1.5 text-right">
                          {(() => {
                            const v = parseFloat(String(r.adjustment_percent).replace(/\./g, '').replace(',', '.'));
                            const sign = v > 0 ? '+' : '';
                            return (
                              <span className={v >= 0 ? "text-green-600" : "text-red-600"}>
                                {sign}{r.adjustment_percent}%
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-2 py-1.5 text-right">{r.forecasted_occupancy}%</td>
                        <td className="px-2 py-1.5 text-right">{r.confidence_score}</td>
                        <td className="px-2 py-1.5 text-center">
                          {r.is_applied ? (
                            <span className="text-green-600 font-bold">&#10003;</span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </div>
          </PaperBase>
          {resultsTotal > RESULTS_LIMIT && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                onClick={() => fetchResults(selectedConfig.id, startDate, endDate, undefined, resultsPage - 1)}
                disabled={resultsPage <= 1}
                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-30 hover:bg-gray-100"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500">
                Page {resultsPage} of {Math.ceil(resultsTotal / RESULTS_LIMIT)}
              </span>
              <button
                onClick={() => fetchResults(selectedConfig.id, startDate, endDate, undefined, resultsPage + 1)}
                disabled={resultsPage >= Math.ceil(resultsTotal / RESULTS_LIMIT)}
                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-30 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === "stats" && (
        <div>
          {!stats ? (
            <PaperBase>
              <div className="text-center py-8 text-gray-400">Loading statistics...</div>
            </PaperBase>
          ) : (
            <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <PaperBase>
              <div className="text-xs text-gray-500">Total Rooms</div>
              <div className="text-xl font-bold">{stats.total_rooms}</div>
            </PaperBase>
            <PaperBase>
              <div className="text-xs text-gray-500">Room Types</div>
              <div className="text-xl font-bold">{stats.total_room_types}</div>
            </PaperBase>
            <PaperBase>
              <div className="text-xs text-gray-500">Suggestions</div>
              <div className="text-xl font-bold">{stats.total_suggestions}</div>
            </PaperBase>
            <PaperBase>
              <div className="text-xs text-gray-500">Applied</div>
              <div className="text-xl font-bold">{stats.application_rate}%</div>
            </PaperBase>
          </div>

          {stats.forecast_period?.start && (
            <div className="text-sm text-gray-500 mb-3 ml-1">
              Forecast period: {GFormatDate(stats.forecast_period.start)} ~ {GFormatDate(stats.forecast_period.end)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {stats?.time_series && stats.time_series.length > 0 && (
              <PaperBase>
                <ReactApexChart
                  options={chartOptions("Avg Suggested Rate", stats.time_series.map((d: any) => ({ name: d.date, data: d.avg_adr })), "#845ADF")}
                  series={[{ name: "Suggested Rate", data: stats.time_series.map((d: any) => d.avg_adr) }]}
                  type="line"
                  height={250}
                />
              </PaperBase>
            )}
            {stats?.time_series && stats.time_series.length > 0 && (
              <PaperBase>
                <ReactApexChart
                  options={chartOptions("Forecasted Occupancy", stats.time_series.map((d: any) => ({ name: d.date, data: d.avg_occupancy })), "#22c55e")}
                  series={[{ name: "Occupancy %", data: stats.time_series.map((d: any) => d.avg_occupancy) }]}
                  type="line"
                  height={250}
                />
              </PaperBase>
            )}
          </div>

          {stats?.time_series && stats.time_series.length > 0 && (
            <PaperBase>
              <ReactApexChart
                options={chartOptions("Rate Adjustment %", stats.time_series.map((d: any) => ({ name: d.date, data: d.avg_adjustment })), "#f97316")}
                series={[{ name: "Adjustment %", data: stats.time_series.map((d: any) => d.avg_adjustment) }]}
                type="bar"
                height={250}
              />
            </PaperBase>
          )}

          {stats?.by_room_type && stats.by_room_type.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <PaperBase>
                <ReactApexChart
                  options={{
                    chart: { type: "bar", toolbar: { show: false } },
                    colors: ["#22c55e"],
                    xaxis: {
                      categories: stats.by_room_type.map((rt: any) => rt.room_type_name),
                      labels: { style: { fontSize: "11px" } },
                    },
                    yaxis: { labels: { formatter: (v: number) => v + "%" } },
                    title: { text: "Occupancy by Room Type", style: { fontSize: "13px", fontWeight: "bold" } },
                    dataLabels: { enabled: true, formatter: (v: number) => v + "%", style: { fontSize: "10px" } },
                    tooltip: { y: { formatter: (v: number) => v + "%" } },
                    grid: { borderColor: "#f1f1f1" },
                  }}
                  series={[{ name: "Occupancy", data: stats.by_room_type.map((rt: any) => Number(rt.avg_occupancy ?? 0)) }]}
                  type="bar"
                  height={280}
                />
              </PaperBase>
              <PaperBase>
                <ReactApexChart
                  options={{
                    chart: { type: "bar", toolbar: { show: false } },
                    colors: ["#845ADF"],
                    xaxis: {
                      categories: stats.by_room_type.map((rt: any) => rt.room_type_name),
                      labels: { style: { fontSize: "11px" } },
                    },
                    yaxis: { labels: { formatter: (v: number) => v.toLocaleString("id-ID") } },
                    title: { text: "Avg Rate by Room Type", style: { fontSize: "13px", fontWeight: "bold" } },
                    dataLabels: { enabled: true, formatter: (v: number) => v.toLocaleString("id-ID"), style: { fontSize: "10px" } },
                    tooltip: { y: { formatter: (v: number) => v.toLocaleString("id-ID") } },
                    grid: { borderColor: "#f1f1f1" },
                  }}
                  series={[{ name: "Avg Rate", data: stats.by_room_type.map((rt: any) => Number(rt.avg_suggested_rate ?? 0)) }]}
                  type="bar"
                  height={280}
                />
              </PaperBase>
            </div>
          )}

          {stats?.by_room_type && stats.by_room_type.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 ml-1">By Room Type</h4>
              <PaperBase>
                <div className="overflow-hidden rounded-lg">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Room Type</th>
                      <th className="px-3 py-2 text-right">Avg Suggested Rate</th>
                      <th className="px-3 py-2 text-right">Avg Occupancy</th>
                      <th className="px-3 py-2 text-right">Avg Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.by_room_type.map((rt: any, i: number) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-1.5">{rt.room_type_name}</td>
                        <td className="px-3 py-1.5 text-right">{formatAmount(String(rt.avg_suggested_rate ?? 0))}</td>
                        <td className="px-3 py-1.5 text-right">{isNaN(rt.avg_occupancy) ? '-' : Number(rt.avg_occupancy).toFixed(1)}%</td>
                        <td className="px-3 py-1.5 text-right">{isNaN(rt.avg_confidence) ? '-' : Number(rt.avg_confidence).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </PaperBase>
            </div>
          )}
          </>
          )}
        </div>
      )}
    </>
  );
};

export default DynamicRateManagement;
