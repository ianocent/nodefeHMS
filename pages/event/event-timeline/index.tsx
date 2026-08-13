import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetQueryStr } from "../../../components/helper";
import { useRouter } from "next/router";
import PaperBase from "../../../components/common/paper/PaperBase";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import Seo from "../../../components/common/seo";

const EventTimeline = () => {
  interface TimelineResource {
    resource_id: string;
    resource_name: string;
    resource_type: "venue" | "layout";
    venue_id?: number;
    days: Record<string, any[]>;
  }
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal = React.useMemo(() => {
    try {
      const decrypted = GetDecrypt(isLogin);
      return decrypted ? JSON.parse(decrypted) : null;
    } catch (error) {
      return null;
    }
  }, [isLogin]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timelineData, setTimelineData] = useState<TimelineResource[]>([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const GLOBALURI = "/cms/event-timeline/timeline";

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const query = `?start=${startDate || ""}&end=${endDate || ""}`;
      const res = await FetchData(
        `/cms/event-timeline/timeline${query}`,
        "GET",
        null,
        false,
        datalocal?.data?.access_token,
        router,
        "",
        true
      );

      if (res?.code === 200) {
        setDates(res.dates || []);
        setTimelineData(res.timeline || []);
        if (!startDate && res.default_start) setStartDate(res.default_start);
        if (!endDate && res.default_end) setEndDate(res.default_end);
      }
    } catch (err) {
      console.error("Error fetching timeline:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handleSearch = () => {
    fetchTimeline();
  };

  const getStatusStyle = (status) => {
    const base = "px-2 py-1 text-xs font-medium rounded-md text-white text-center";
    if (status === "Fix" || status === "Definitely") return `${base} bg-success`;
    if (status === "Tentative") return `${base} bg-amber-500`;
    if (status === "Canceled") return `${base} bg-red`;
    return `${base} bg-gray-500`;
  };

  const timestamp = new Date().getTime();

  const groupedTimeline = React.useMemo(() => {
    const venues: Record<string, TimelineResource & { layouts: TimelineResource[] }> = {};
    const layouts: Record<string, TimelineResource> = {};

    timelineData.forEach((item) => {
      if (item.resource_type === "venue") {
        venues[item.resource_id] = { ...item, layouts: [] };
      } else if (item.resource_type === "layout") {
        layouts[item.resource_id + "-" + item.venue_id] = item;
      }
    });

    Object.values(layouts).forEach((layout) => {
      if (layout.venue_id && venues["venue-" + layout.venue_id]) {
        venues["venue-" + layout.venue_id].layouts.push(layout);
      }
    });

    return Object.values(venues);
  }, [timelineData]);

  return (
    <LayoutComponent>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      <div className="p-2 sm:p-4 bg-white min-h-screen">
        {/* CHANGED: filter bar - flex-col on mobile, flex-row on sm+ */}
        <div className="border-b flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-5 items-start sm:items-end bg-white sticky top-0 z-20 pb-3">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Date From</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full sm:w-auto border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Date To</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full sm:w-auto border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-7 py-3 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading timeline...</div>
        ) : dates.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No data available. Please select date range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sticky left-0 bg-gray-100 z-10 min-w-[140px] sm:min-w-[220px]"
                  >
                    Venue & Layout
                  </th>
                  {dates.map((date, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-semibold text-gray-900 min-w-[120px] sm:min-w-[160px]"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {groupedTimeline.map((venue) => (
                  <React.Fragment key={venue.resource_id}>
                    <tr className="bg-gray-200 border-t-4 border-gray-300">
                      <td className="px-2 py-1 sticky left-0 bg-gray-200 z-10 border-r font-semibold text-gray-800 text-xs uppercase">
                        {venue.resource_name}
                        <span className="ml-2 text-xs text-gray-500">(Venue)</span>
                      </td>
                      {dates.map((_, idx) => (
                        <td key={idx}></td>
                      ))}
                    </tr>

                    {venue.layouts.map((resource) => (
                      <tr key={resource.resource_id} className="hover:bg-gray-50">
                        <td className="px-2 py-1 sticky left-0 bg-white z-10 border-r text-purple-700 text-[11px]">
                          {resource.resource_name}
                          <span className="ml-2 text-xs text-gray-500">(Layout)</span>
                        </td>

                        {dates.map((dateStr, idx) => {
                          const [day, monthStr, year] = dateStr.split(" ");

                          const monthMap = {
                            Jan: "01", Feb: "02", Mar: "03", Apr: "04",
                            May: "05", Jun: "06", Jul: "07", Aug: "08",
                            Sep: "09", Oct: "10", Nov: "11", Dec: "12"
                          };

                          const month = monthMap[monthStr] || "01";
                          const dateKey = `${year}-${month}-${day.padStart(2, "0")}`;

                          const dayEvents = Array.isArray(resource.days?.[dateKey])
                            ? resource.days[dateKey]
                            : [];

                          return (
                            <td key={idx} className="px-2 py-2 text-center border-l">
                              {dayEvents.length === 0 ? (
                                <div className="h-6 bg-gray-50 rounded flex items-center justify-center text-gray-700 text-xs">
                                  Available
                                </div>
                              ) : (
                                <div className="space-y-1 min-h-[30px] flex flex-col justify-center">
                                  {dayEvents.map((ev) => (
                                    <div
                                      key={ev.id}
                                      className={`cursor-pointer ${getStatusStyle(ev.status)} py-[2px] px-1 rounded`}
                                      onClick={() =>
                                        router.push(
                                          `/event/event-list?parent=1160&module=event-type&data=${ev.id}`
                                        )
                                      }
                                    >
                                      <div className="font-semibold truncate uppercase text-xs">
                                        {ev.title || "Tidak ada judul"}
                                      </div>
                                      <div className="text-xs opacity-90 font-bold">
                                        {ev.start} – {ev.end}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center text-xs mt-2">
          <span className="font-semibold text-gray-700">Legend:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-success"></span>
            Fix / Definitely
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            Tentative
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red"></span>
            Canceled
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-400"></span>
            Available
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default EventTimeline;
