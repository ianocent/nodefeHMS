import React, { useContext, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import TableActivity from "./components/TableActivity";
import TableView from "../../../components/common/table-edit";
import Seo from "../../common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
  formatAmount,
  svgType,
  sleep
} from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ModalNotedComponent from "../../common/modal/ModalNoted";
import { IconSpiner } from "../../common/icon/CardIcon";
import { IconHome } from "../../common/icon/SidebarIcon";
import MapBase from "../../common/map/MapBase";
import { AnyAaaaRecord } from "dns";
import { get } from "http";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const DashboardListView = () => {
  const [popup, setpopup] = useState(false);
  const [uriPopupData, setUriPopupData] = useState("");
  const [titlePopupData, setTitlePopupData] = useState("");

  const ref = useRef(null);
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [data, setData] = useState<any>([{}]);
  const [property, setProperty] = useState<any>({});
  const [listDashboard, setListDashboard] = useState<any>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setloading] = useState(true);
  const [messagePopup, setmessagePopup] = useState({
    title: "",
    text: "",
  });
  const [IsOpenModal, setIsOpenModal] = useState(false);
  const GetDashboard = async () => {
    let query = "";
    if (endDate != "" && startDate != "") {
      query = "?start_date=" + startDate + "&end_date=" + endDate;
    }

    let getuuri = "/cms/get-dashboard" + query;
    const datauser: any = await FetchData(
      getuuri,
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    if (datauser?.code == "200") {
      setloading(false);
      await Promise.all(
        datauser.data.map((key, index) =>
          GetDashboardDetail(
            datauser.start_date,
            datauser.end_date,
            datauser.dateLog,
            key,
            index
          )
        )
      );
      
      setProperty(datauser?.property);
    }
  };

  const GetDashboardDetail = async (startDate: any,endDate:any,dateLog:any,code:any,index:any) => {
    let query = code?.type || code;
    query = query + "?dateLog=" + dateLog + "&start_date=" + startDate + "&end_date=" + endDate;

    let getuuri = "/cms/get-dashboard/" + query;
    const datauser: any = await FetchData(
      getuuri,
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    let obj = [];
    if (datauser?.code == "200") {
      datauser.data.map((row: any) => {
        if (row?.type == "number") {
          obj.push({
            title: row?.label,
            head: row?.header,
            body: row?.list?.map((r: any) => ({
              ...r,                         
              name: r?.name || r?.Room || r?.room,
            })),
            type: "number",
            span: row?.span,
            link: row?.link,
            is_total: row?.is_total,
          });
        } else if (row?.type == "table-dashboard") {
          obj.push({
            title: row?.label,
            head: row?.header,
            body: row?.list,
            type: "table-dashboard",
            span: row?.span,
            link: row?.link,
            is_total: row?.is_total,
          });
        } else if (row?.type == "chart") {
          obj.push({
            series: row?.list.data.map((r: any, index: any) => {
              return {
                name: r?.name,
                data: r?.data.map((rw: any) => rw?.data),
              };
            }),
            // [
            //   {
            //     name: row?.label,
            //     data: row?.list.map((r: any) => r?.data),
            //     // format money
  
            //   },
            // ],
            options: {
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                categories: row?.list.date.map((r: any) => r),
              },
              yaxis: {
                labels: {
                  formatter: (value) => {
                    return formatAmount(value.toString());
                  },
                },
              },
            },
            type: "chart",
            span: row?.span,
            title: row?.label,
            link: row?.link,
          });
        } else if (row?.type == "chart-bar") {
          obj.push({
            data: [
              {
                name: row?.label,
                data: row?.list.map((r: any) => r?.data),
              },
            ],
            name: {
              chart: {
                height: 350,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  endingShape: "rounded",
                  colors: {
                    ranges: [
                      {
                        from: 0,
                        to: 100,
                        color: "#845adf",
                      },
                    ],
                  },
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 1,
                    gradientToColors: ["#800080"],
                    // inverseColors: true,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100],
                  },
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
              },
              xaxis: {
                categories: row?.list.map((r: any) => r?.name),
              },
  
              fill: {
                opacity: 1,
              },
              tooltip: {
                x: {
                  format: "yy-MM-dd",
                },
              },
            },
            // name: row?.list.map((r: any) => r?.name),
            // data: row?.list.map((r: any) => r?.data),
            type: "chart-bar",
            span: row?.span,
            title: row?.label,
            link: row?.link,
          });
        } else if (row?.type == "number-only") {
          obj.push({
            title: row?.label,
            value: row?.data,
            type: "number-only",
            span: row?.span,
            link: row?.link,
            isPopup: row?.is_popup,
            uriSource: row?.url,
            svg: row?.svg,
          });
        } else if (row?.type == "maps") {
          obj.push({
            title: row?.label,
            type: "maps",
            span: row?.span,
          });
        } else if (row?.type == "table") {
          obj.push({
            url: row?.url,
            type: "table",
            title: row?.label,
          });
        } else if (row?.type == "donut") {
          obj.push({
            series: row?.list.map((r: any) => r?.data),
            options: {
              chart: {
                events: {
                  mounted: (chart) => {
                    chart.windowResizeHandler();
                  },
                  dataPointMouseEnter: ({ target }, ctx) => {
                    if (target.getAttribute("data:pieClicked") !== "true") {
                      const sliceIndex = parseInt(target.attributes.j.value);
                      ctx.pie.pieClicked(sliceIndex);
                    }
                  },
                  dataPointMouseLeave: ({ target }, ctx) => {
                    if (target.getAttribute("data:pieClicked") === "true") {
                      const sliceIndex = parseInt(target.attributes.j.value);
                      ctx.pie.pieClicked(sliceIndex);
                    }
                  },
                },
                dropShadow: {
                  enabled: true,
                  enabledOnSeries: [0],
                  top: 0,
                  left: 4,
                  blur: 3,
                  color: "#000",
                  opacity: 0.35,
                },
              },
              plotOptions: {
                expandOnClick: true,
                radialBar: {
                  // offsetY: 0,
                  // startAngle: 0,
                  // endAngle: 270,
                  // hollow: {
                  //   margin: 5,
                  //   size: "30%",
                  //   background: "transparent",
                  //   image: undefined,
                  // },
  
                  dataLabels: {
                    name: {
                      show: false,
                    },
                    value: {
                      show: false,
                    },
                  },
                },
              },
              colors: row?.list.map((r: any) => r?.color),
              labels: row?.list.map((r: any) => r?.name),
              legend: {
                show: true,
  
                floating: false,
                fontSize: "14px",
                labels: {
                  useSeriesColors: true,
                },
                formatter: function (seriesName, opts) {
                  return (
                    seriesName +
                    ":  " +
                    formatAmount(
                      opts.w.globals.series[opts.seriesIndex].toString()
                    )
                  );
                },
                itemMargin: {
                  vertical: 3,
                },
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      show: false,
                    },
                  },
                },
              ],
            },
            title: row?.label,
            head: row?.header,
            type: "donut",
            total: row?.total,
            span: row?.span,
            link: row?.link,
          });
        } else if (row?.type === "notification-list") {
            obj.push({
                type: "notification-list",
                title: row?.label || "Notifications",
                span: row?.span || 4,
                count: row?.count || 0,
                items: row?.items || [],
                url: row?.url || "",
            });
        } else if (row?.type === "guest-request-list") {
          const itemsSource = row?.items || row?.data || row?.list || [];  // coba semua kemungkinan
      
          obj.push({
              type: "guest-request-list",
              title: row?.label || "Guest Requests",
              span: row?.span || 4,
              count: row?.count || row?.pendingCount || 0,
              items: itemsSource,
              url: row?.url || "",
          });
      }
      });
    }
    if (obj.length > 0) {
      setListDashboard((listDashboard) => ({
        ...listDashboard,
        [index]: obj[0]
      }));
    }

  };

  useEffect(() => {
    GetDashboard();
  }, [startDate, endDate]);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        if (popup) {
          setpopup(false);
        }
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await FetchData(
        `/cms/task/${notificationId}/read`,
        "PUT",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      setListDashboard((prev: any) => {
        const next: any = {};
      
        Object.keys(prev).forEach((key) => {
          const block = prev[key];
      
          if (block?.type !== "notification-list") {
            next[key] = block;
            return;
          }
      
          const newItems = block.items.map((item: any) =>
            item.id === notificationId
              ? { ...item, is_read: true }
              : item
          );
      
          next[key] = {
            ...block,
            items: newItems,
            count: newItems.filter((i: any) => !i.is_read).length,
          };
        });
      
        return next;
      });
      refreshNotification();
    } catch (e) {
      console.error(e);
    }
  };

  const markGuestPreferenceAsDone = async (preferenceId: number | string) => {
    try {
      const response = await FetchData(
        `/cms/profile/guest-preference/${preferenceId}/done`,
        "POST",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (String(response?.code) !== "200") {
        alert("Gagal menandai selesai: " + (response?.message || "Unknown error"));
        return;
      }
  
      setListDashboard((prev: any) => {
        const next: any = {};
  
        Object.keys(prev).forEach((key) => {
          const block = prev[key];
  
          if (block?.type !== "guest-request-list") {
            next[key] = block;
            return;
          }
  
          const newItems = block.items.map((item: any) =>
            item.id === preferenceId
              ? { ...item, status: "done" }
              : item
          );
  
          next[key] = {
            ...block,
            items: newItems,
            count: newItems.filter(
              (i: any) => i.status?.toLowerCase() !== "done"
            ).length,
          };
        });
  
        return next;
      });
    } catch (err) {
      console.error("Error marking preference as done:", err);
      alert("Terjadi kesalahan saat menandai selesai");
    }
  };
  
  const refreshNotification = async () => {
      try {
          const res = await FetchData(
              "/cms/helper/task-notification",
              "GET",
              "",
              false,
              datalocal?.data?.access_token,
              router,
              ""
          );

          if (res?.code === 200) {
              setListDashboard(prev => {
                  const next = { ...prev };
                  Object.keys(next).forEach(key => {
                      if (next[key]?.type === "notification-list") {
                          next[key] = {
                              ...next[key],
                              count: res.data.count || 0,
                              items: res.data.items || [],
                          };
                      }
                  });
                  return next;
              });
          }
      } catch (e) {
          console.error(e);
      }
  };

  const currentUserName = datalocal?.data?.name 
      || datalocal?.data?.username 
      || datalocal?.data?.full_name 
      || "Current User";   // fallback

  const currentUserId = datalocal?.data?.id 
    || datalocal?.data?.user_id 
    || null;
  

  useEffect(() => {
      refreshNotification();
      const interval = setInterval(refreshNotification, 25000); // 25 detik
      return () => clearInterval(interval);
  }, []);
  

  return (
    <>
      <Seo title={"Dashboard"} />
      <ModalNotedComponent
        text={messagePopup.text}
        title={messagePopup.title}
        IsOpenModel={IsOpenModal}
        ChangeonClose={(e) => {
          setIsOpenModal(e);
        }}
      />
      {popup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            ref={ref}
            className="w-full max-w-3xl max-h-[85vh] bg-white rounded-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-center py-3 px-4 border-b shrink-0">
              <h4 className="font-semibold text-base">{titlePopupData}</h4>
            </div>

            {/* Body — scroll di sini */}
            <div className="flex-1 overflow-auto p-4">
              <TableView groups={""} uri={uriPopupData} isEditTable={false} />
            </div>

            {/* Footer */}
            <div className="shrink-0 px-4 py-3 border-t flex justify-end">
              <button
                onClick={() => setpopup(false)}
                className="rounded-md bg-[#dfd9e2] hover:bg-[#ccc8cf] px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* <div className="ml-2 md:ml-[10px] px-2 md:px-0 overflow-x-hidden"> */}
      <div className="px-2 md:px-4 overflow-x-hidden">
        <div className="font-bold text-md uppercase mb-2.5 flex gap-2">
          <IconHome/>{property ? property?.name : ""}{" "}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-12 mt-8 flex justify-center">
              <IconSpiner />
            </div>
          ) : (
            <>
              {Object.values(listDashboard).length > 0 && Object.values(listDashboard).map((row: any, index: any) => {
                  // const colSpan = `col-span-1 md:col-span-${row?.span ?? 12} xl:col-span-${row?.span ?? 12}`;
                  const effectiveSpan = 
                    (row?.type === "notification-list" || row?.type === "guest-request-list" || row?.type === "donut")
                      ? 6
                      : (row?.span ?? 12);
                  const colSpan = `col-span-1 md:col-span-${effectiveSpan} xl:col-span-${effectiveSpan}`;
                  const boxClasses = `h-full rounded-xl bg-white shadow flex flex-col overflow-hidden min-w-0`;
                  const boxBodyClasses = `px-6 pb-6`;

                  const formatIDR = (val: any): string => {
                    if (val == null || val === "") return "0,00";
                    const clean = String(val).replace(/[^\d,-]/g, "").replace(",", ".");
                    const num = parseFloat(clean);
                    return isNaN(num) ? "0,00" : num.toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  };

                  const formatInt = (val: any): string => {
                    const num = parseInt(String(val).replace(/[^\d]/g, ""), 10);
                    return isNaN(num) ? "0" : num.toString();
                  };

                  switch (row?.type) {
                    case "chart":
                      return (
                        <div key={index} className={`${colSpan} mb-4 xl:mb-0`}>
                          <div className={`${boxClasses} !m-0 flex flex-col h-full`}>
                            <div className="rounded-xl relative flex items-center justify-between px-6 pt-6 text-sm font-semibold text-gray-700">{row?.title}</div>
                            <div className="box-body px-6 pb-6 w-full overflow-hidden">
                              <ReactApexChart
                                options={row?.options}
                                series={row?.series}
                                type="area"
                                height={370}
                                width="100%"
                              />
                            </div>
                          </div>
                        </div>
                      );

                    case "table-dashboard":
                    case "number":
                      return (
                        <div key={index} className={`${colSpan} mb-4 xl:mb-0`}>
                          <div className={boxClasses}>
                            <div className="rounded-xl relative flex items-center justify-between px-6 pt-6 text-sm font-semibold text-gray-700">
                              {row.title}
                            </div>
                            <div className={boxBodyClasses}>
                              <div className="bg-white p-2 overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      {row.head.map((head: string, hIdx: number) => (
                                        <th
                                          key={hIdx}
                                          className="font-bold p-1 text-left text-xs uppercase tracking-wider text-gray-600"
                                        >
                                          {head.replace(/_/g, " ")}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.body.map((rowBody: any, indexRowBody: number) => (
                                      <tr
                                        className={
                                          indexRowBody === row.body.length - 1 && row?.is_total
                                            ? "border-t-2 border-gray-200"
                                            : ""
                                        }
                                        key={indexRowBody}
                                      >
                                        {row.head.map((rowHead: string, hIdx: number) => {
                                          const normalizedHead = String(rowHead).trim().toLowerCase();

                                          const keys = Object.keys(rowBody || {});

                                          const findKey = () => {
                                            let k = keys.find(key => key.toLowerCase() === normalizedHead);
                                            if (k) return k;

                                            const headUnderscore = normalizedHead.replace(/\s+/g, "_");
                                            k = keys.find(key => key.toLowerCase() === headUnderscore);
                                            if (k) return k;

                                            k = keys.find(key => key.toLowerCase().includes(normalizedHead));
                                            if (k) return k;

                                            k = keys.find(key => normalizedHead.includes(key.toLowerCase()));
                                            if (k) return k;

                                            if (keys[hIdx]) return keys[hIdx];

                                            return keys[0];
                                          };

                                          const dataKey = findKey();
                                          let value = (dataKey ? rowBody[dataKey] : undefined);

                                          if (value == null || value === "") {
                                            value = "-";
                                          } else {
                                          }

                                          return (
                                            <td
                                              key={hIdx}
                                              className={`p-2 bg-white font-bold ${
                                                indexRowBody === row.body.length - 1 ? "rounded-bl-lg-lg" : ""
                                              }`}
                                            >
                                              {value}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      );

                    case "chart-bar":
                      return (
                        <div key={index} className={`${colSpan} mb-4 xl:mb-0`}>
                        <div className={`${boxClasses} !m-0 flex flex-col h-full`}>
                            <div className="rounded-xl relative flex items-center justify-between px-6 pt-6 text-sm font-semibold text-gray-700">{row?.title}</div>
                            <div className="box-body px-6 pb-6">
                              <ReactApexChart
                                options={row?.name}
                                series={row?.data}
                                type="bar"
                                height={370}
                                width="100%"
                              />
                            </div>
                          </div>
                        </div>
                      );

                      case "number-only":
                        return (
                          <div key={index} className={`${colSpan} flex flex-col gap-4 md:gap-5`}>
                            {(row?.title || []).map((title: string, idx: number) => {
                              const raw = row?.value?.[idx] || "0";
                              const formatted = formatIDR(raw);

                              return (
                                <div key={idx} className={`${boxClasses} min-h-[135px] md:min-h-[160px]`}>
                                  <div className="px-5 pt-5 text-sm font-semibold text-gray-700">
                                    {title}
                                  </div>
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 gap-3">
                                    <div
                                      className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-rose-500 text-white flex items-center justify-center text-2xl flex-shrink-0"
                                      dangerouslySetInnerHTML={{
                                        __html: svgType(row?.svg || "money"),
                                      }}
                                    />
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-right sm:text-right flex-1 break-words leading-tight">
                                      {formatted}
                                    </h2>
                                  </div>
                                  <div className="px-5 pb-5 mt-auto">
                                    <button
                                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                      onClick={() => {
                                        setpopup(true);
                                        setUriPopupData(row?.uriSource?.[idx] || "");
                                        setTitlePopupData(title);
                                      }}
                                    >
                                      View more...
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );

                      case "donut":
                        const desktopOptions = {
                          ...row?.options,
                          chart: { ...row?.options?.chart, width: '100%' },
                          legend: {
                            ...row?.options?.legend,
                            position: 'bottom',
                            fontSize: '12px',
                          },
                        };

                        return (
                          <div key={index} className={`${colSpan} mb-4 xl:mb-0`}>
                            <div className={`${boxClasses} flex flex-col h-full`}>
                              <div className="px-6 pt-6 pb-2 text-sm font-semibold text-gray-700">
                                {row?.title}
                              </div>
                              <div className="px-3 md:px-6 pb-4 md:pb-6 flex flex-col items-center justify-center flex-1">
                                {/* Desktop */}
                                <div className="w-full hidden md:block">
                                  <ReactApexChart
                                    options={desktopOptions}
                                    series={row?.series}
                                    type="pie"
                                    height={500}
                                    width="100%"
                                  />
                                </div>
                                {/* Mobile */}
                                <div className="w-full block md:hidden">
                                  <ReactApexChart
                                    options={desktopOptions}
                                    series={row?.series}
                                    type="pie"
                                    height={260}
                                    width="100%"
                                  />
                                </div>
                                <p className="mt-2 text-center text-sm font-semibold">Total {row?.title}</p>
                                <div className="flex items-center justify-center gap-3 px-4 pb-4">
                                  <div
                                    className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-rose-500 text-white flex items-center justify-center"
                                    dangerouslySetInnerHTML={{ __html: svgType("money") }}
                                  />
                                  <h2 className="text-2xl md:text-3xl font-bold text-center">
                                    {formatIDR(row?.total)}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        );

                    case "table":
                      return (
                        <div key={index} className={`${colSpan}`}>
                          <div className={boxClasses}>
                            <div className="rounded-xl relative flex items-center justify-between px-6 pt-6 text-sm font-semibold text-gray-700">
                              {row.title}
                            </div>
                            <div className={boxBodyClasses}>
                              <TableView
                                groups={""}
                                uri={row?.url}
                                isEditTable={false}
                                headRow={row?.url === "/cms/hotel-competitor" ? 2 : 0}
                              />
                            </div>
                          </div>
                        </div>
                      );

                    case "maps":
                      return (
                        <div key={index} className={`${colSpan}`}>
                          <div className={boxClasses}>
                            <div className="relative px-6 pt-6 text-sm font-semibold text-gray-700">
                              {row?.title}
                            </div>
                            <div className={boxBodyClasses}>
                              <MapBase />
                            </div>
                          </div>
                        </div>
                      );

                      case "notification-list":
                        return (
                          <div key={index} className={`${colSpan} mb-4 xl:mb-0`}>
                            <div className={boxClasses}>
                              <div className="px-6 pt-6 pb-2 text-sm font-semibold text-gray-700 flex justify-between items-center">
                                <span>{row.title}</span>
                                {row.count > 0 && (
                                  <span className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full">
                                    {row.count} New
                                  </span>
                                )}
                              </div>

                              <div className="px-6 pb-6">
                                <div className="space-y-2 md:space-y-3 max-h-[300px] overflow-y-auto">
                                  {row.items?.length > 0 ? (
                                    row.items.map((item: any, i: number) => {
                                      // Tambahkan Engineering di sini
                                      const isSpecialType = 
                                        item.type === 'housekeeper_assignment' || 
                                        item.type === 'inspection_required' ||
                                        item.type === 'engineering_assignment';

                                      const isEngineering = item.type === 'engineering_assignment';

                                      return (
                                        <div
                                          key={item.id || i}
                                          className={`p-2.5 md:p-3 rounded border-l-4 cursor-pointer hover:shadow transition-all ${
                                            item.is_read
                                              ? "border-gray-300 bg-gray-50"
                                              : isSpecialType
                                                ? "border-orange-400 bg-orange-50"   // warna khusus HK & Engineering
                                                : "border-blue-400 bg-blue-50"
                                          }`}
                                          onClick={() => {
                                            if (item.link) {
                                              window.location.href = item.link;
                                            } else if (!isSpecialType && item.id) {
                                              // Hanya task biasa yang bisa di-mark read dari dashboard
                                              markNotificationAsRead(item.id);
                                            }
                                          }}
                                        >
                                          <div className="font-medium line-clamp-2">
                                            {item.message}
                                          </div>
                                          
                                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>
                                              {item.room_number 
                                                ? `Room ${item.room_number}` 
                                                : item.from}
                                            </span>
                                            {isEngineering && (
                                              <span className="text-orange-600 font-medium">Engineering</span>
                                            )}
                                          </div>

                                          {/* Tombol Mark as Read - Hanya untuk Task biasa */}
                                          {!isSpecialType && !item.is_read && (
                                            <button
                                              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                markNotificationAsRead(item.id);
                                              }}
                                            >
                                              Mark as read
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                      No new notifications
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="px-6 pb-2 pt-2 border-t mt-auto">
                                <button
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                  onClick={() => {
                                    setpopup(true);
                                    setUriPopupData(row.url || "/cms/task");
                                    setTitlePopupData(row.title);
                                  }}
                                >
                                  View more...
                                </button>
                              </div>
                            </div>
                          </div>
                        );

                        case "guest-request-list":
                          const isGuestRequest = row.type === "guest-request-list";
                          const listItems = row?.items || row?.data || [];

                          return (
                            <div key={index} className={`${colSpan} mb-4 xl:mb-0`}>
                              <div className={boxClasses}>
                                <div className="px-6 pt-6 pb-2 text-sm font-semibold text-gray-700 flex justify-between items-center">
                                  <span>{row.title || (isGuestRequest ? "Guest Requests" : "Notifications")}</span>
                                  {row.count > 0 && (
                                    <span className={`text-white text-xs px-2.5 py-1 rounded-full ${isGuestRequest ? "bg-amber-500" : "bg-red-500"}`}>
                                      {row.count} {isGuestRequest ? "Pending" : "New"}
                                    </span>
                                  )}
                                </div>

                                <div className="px-6 pb-6">
                                  <div className="space-y-2 md:space-y-3 max-h-[300px] overflow-y-auto">
                                    {listItems.length > 0 ? (
                                      listItems.map((item: any, i: number) => (
                                        <div
                                          key={item.id || i}
                                          className={`p-2.5 md:p-3 rounded text-sm border-l-4 ${
                                            isGuestRequest
                                              ? item.status?.toLowerCase() === 'done'
                                                ? "bg-green-50/70 border-green-500"
                                                : "bg-amber-50/60 border-amber-400"
                                              : item.is_read
                                                ? "bg-gray-50/70 border-gray-300"
                                                : "bg-red-50/60 border-red-400"
                                          }`}
                                        >
                                          <p className="font-medium line-clamp-2 break-words">
                                            {isGuestRequest ? item.request || item.message || item.remark : item.message}
                                          </p>

                                          <div className="flex justify-between items-center text-xs mt-1.5 text-gray-600">
                                            <div>
                                              {isGuestRequest ? (
                                                <>
                                                  <span>Guest: {item.guest || "-"}</span>
                                                  <span className="ml-2">
                                                    Status: <strong>{item.status}</strong>
                                                  </span>
                                                </>
                                              ) : (
                                                <>
                                                  <span>{item.type || "Task"}</span> from <strong>{item.from || "-"}</strong>
                                                </>
                                              )}
                                            </div>
                                            <span>{item.time || item.created_at || "-"}</span>
                                          </div>

                                          {!isGuestRequest && !item.is_read && (
                                            <button
                                              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
                                              onClick={() => markNotificationAsRead(item.id)}
                                            >
                                              Mark as read
                                            </button>
                                          )}

                                          {isGuestRequest && item.status?.toLowerCase() !== 'done' && (
                                            <button
                                              className="mt-2 text-xs text-green-700 hover:text-green-900 underline"
                                              onClick={() => {
                                                if (confirm("Yakin tandai selesai?")) markGuestPreferenceAsDone(item.id);
                                              }}
                                            >
                                              Mark as Done
                                            </button>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="py-10 text-center text-gray-400 text-sm">
                                        No {isGuestRequest ? "pending requests" : "new notifications"}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="px-6 pb-2 pt-2 border-t mt-auto">
                                  <button
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                                    onClick={() => {
                                      setpopup(true);
                                      setUriPopupData(row.url || "");
                                      setTitlePopupData(row.title || (isGuestRequest ? "Guest Requests" : "Notifications"));
                                    }}
                                  >
                                    View more...
                                  </button>
                                </div>
                              </div>
                            </div>
                          );

                    default:
                      return <></>;
                  }
                })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardListView;
