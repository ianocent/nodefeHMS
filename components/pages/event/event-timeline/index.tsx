import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt, GetQueryStr } from "../../../../components/helper";
import { useRouter } from "next/router";
import PaperBase from "../../../../components/common/paper/PaperBase";
import LayoutComponent from "../../../../components/common/layout/LayoutComponent";
import Seo from "../../../../components/common/seo";

const EventTimeline = () => {
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
  const [timelineData, setTimelineData] = useState([]);
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
    if (status === "Canceled") return `${base} bg-red-600`;
    return `${base} bg-gray-500`;
  };

  const timestamp = new Date().getTime();

  return (
    <LayoutComponent>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
    <div className="p-4 bg-white min-h-screen">
      <div className="p-2 border-b flex flex-wrap gap-5 items-end bg-white sticky top-0 z-20">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date From</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date To</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-7 py-3 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition"
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
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-100 z-10 min-w-[220px]"
                  >
                    Venue & Layout
                  </th>
                  {dates.map((date, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-4 py-3 text-center text-sm font-semibold text-gray-900 min-w-[160px]"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {timelineData.map((resource) => (
                  <tr key={resource.resource_id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white z-10 border-r">
                      <span className={resource.resource_type === 'venue' ? 'text-blue-700' : 'text-purple-700'}>
                        {resource.resource_name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({resource.resource_type === 'venue' ? 'Venue' : 'Layout'})
                      </span>
                    </td>

                    {dates.map((dateStr, idx) => {
                      const [day, monthStr, year] = dateStr.split(' ');
                      const monthMap = {
                        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                      };
                      const month = monthMap[monthStr] || '01'; // fallback
                      const dateKey = `${year}-${month}-${day.padStart(2, '0')}`;

                      const dayEvents = resource.days?.[dateKey] || [];

                      return (
                        <td key={idx} className="px-2 py-2 text-center border-l">
                          {dayEvents.length === 0 ? (
                            <div className="h-10 bg-gray-50 rounded-md flex items-center justify-center text-gray-500 text-xs">
                              Available
                            </div>
                          ) : (
                            <div className="space-y-1 min-h-[30px] flex flex-col justify-center">
                              {dayEvents.map((ev) => (
                                <div
                                  key={ev.id}
                                  className={`cursor-pointer ${getStatusStyle(ev.status)} py-1 px-2 rounded-md hover:shadow-md transition-shadow`}
                                  onClick={() => router.push(`/event/event-list?parent=1160&module=event-type&data=${ev.id}`)}
                                  title={
                                    `${(ev.title || 'Tidak ada judul').toUpperCase()}\n` +
                                    `Guest: ${(ev.guest || '-').toUpperCase()}\n` +
                                    `Venue: ${(ev.venue_name || '-').toUpperCase()}\n` +
                                    `Layout: ${(ev.layout_name || '-').toUpperCase()}\n` +
                                    `Jam: ${ev.start} – ${ev.end}\n` +
                                    `Durasi: ${ev.duration}\n` +
                                    `Status: ${(ev.status || '-').toUpperCase()}`
                                  }
                                >
                                  <div className="font-semibold truncate uppercase text-xs">
                                    {ev.title || 'Tidak ada judul'}
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
              </tbody>
            </table>
          </div>
        )}
    </div>
    </LayoutComponent>
  );
};

export default EventTimeline;