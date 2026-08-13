import React, { useState, useEffect } from "react";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { IconLogin, IconWording } from "../../common/icon/IconDashboard";

const DashboardListViewModel = () => {
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [data, setData] = useState<any>([{}])
  const GetDashboard = async () => {
    try {
      let getuuri = "/cms/get-dashboard";
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
        let obj = [];
        datauser.data.map((row: any, index: any) => {
          if (row?.type == "number") {
            obj.push({
              title: row?.label,
              head: ["name", "data"],
              body: row?.list?.map((r: any) => {
                return {
                  name: r?.name,
                  data: r?.data,
                  textColor: "text-blue-500",
                };
              }),
              type: "number",
              span: row?.span,
            });
           
          } else if (row?.type == "chart") {
            obj.push({
              series: [
                {
                  name: row?.label,
                  data: row?.list.map((r: any) => r?.value),
                },
              ],
              options: {
                dataLabels: {
                  enabled: false,
                },
                xaxis: {
                  categories: row?.list.map((r: any) => r?.date),
                },
              },
              type: "chart",
              span: row?.span,
              title: row?.label,
            });
          } 
        });
        setData(obj);
      }

      console.log(datauser);
      console.log(data);
    } catch (error) {
    }
  };

  useEffect(() => {
    GetDashboard();
  }, []);
  


  const [sessionChart, setSessionChart] = useState();

  const [dayOfWeekChart, setDayOfWeekChart] = useState({
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
    ],
    options: {
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
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },

      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  const [chanelChart, setChanelChart] = useState({
    series: [76, 67, 61],
    options: {
      chart: {
        // height: 30,

        events: {
          mounted: (chart) => {
            chart.windowResizeHandler();
          },
        },
      },
      plotOptions: {
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
      colors: ["#845adf", "#23b7e5", "#f5b849"],
      labels: ["Vimeo", "Messenger", "Facebook"],
      legend: {
        show: true,

        floating: false,
        fontSize: "14px",
        // position: "right",
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
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
  });

  const [dashboardTable, setDashboardTable] = useState([
  
  ]);

  const [tableRecent, setTableRecent] = useState({
    head: ["Activity", "Time", "User", "IP"],
    body: [
      {
        key: 0,
        activity: "Login",
        name: "Anisa",
        time: "1 feb 14.00.00",
        icon: <IconLogin />,
        users: [
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
        ],
        ip: "192.189.20.10",
      },
      {
        key: 1,
        activity: "Login",
        name: "Anisa",
        icon: <IconWording />,
        time: "1 feb 14.00.00",
        users: [
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
        ],
        ip: "192.189.20.10",
      },
      {
        key: 2,
        activity: "Login",
        name: "Anisa",
        icon: <IconWording />,
        time: "1 feb 14.00.00",
        users: [
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
        ],
        ip: "192.189.20.10",
      },
      {
        key: 3,
        activity: "Login",
        name: "Anisa",
        icon: <IconWording />,
        time: "1 feb 14.00.00",
        users: [
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
          {
            image: "/assets/images/faces/1.jpg",
          },
        ],
        ip: "192.189.20.10",
      },
    ],
  });

  
  return {
    data,
  };
};

export default DashboardListViewModel;
