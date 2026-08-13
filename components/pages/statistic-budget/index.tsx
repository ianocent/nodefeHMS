import React, { useContext, useEffect, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import Select from 'react-select'
import { useRouter } from "next/router";
import { GetQueryStr } from "../../helper";
// interface IProps {

interface IProps {
  type: string;
}

const StatisticBudget = (props: IProps) => {
  const GLOBALURI = "/cms/post-code-budget";
  const routers = useRouter();
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [loading, setloading] = useState(false);
  const [dataDate, setdataDate] = useState(new Date().getFullYear());
  const [listYear, setListYear] = useState([]);
  const handleYearSelect = (year: any) => {
    setdataDate(year);
    routers.replace({
      pathname: window.location.pathname,
      query: {
        parent: GetQueryStr("parent"),
        data: GetQueryStr("data"),
        year : year
      },
    });
  };
  useEffect(() => {
    let obj = [];
    for (let i = 2020; i <= new Date().getFullYear(); i++) {
      obj.push({ value: i, label: i });
    }
    setListYear(obj);
  }, []);
  function RouteInit() {
    return (
      <>
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <Select 
            className="w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" 
            options={listYear}
            onChange={(e) => handleYearSelect(e.value)} 
            value={{ value: dataDate, label: dataDate }}
          />
         </div>
        
        <div className="mt-2 min-w-full table-auto">
          <TableView 
              groups={groups} 
              uri={GLOBALURI}
              isBtnAdd={false}
              isBtnEdit={true}
              queryString={
                "&type=" + props.type + "&year=" + dataDate
              }
              isEditTable={true} />
        </div>
      </>
    );
  }
  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}
    </>
  );
};

export default StatisticBudget;
