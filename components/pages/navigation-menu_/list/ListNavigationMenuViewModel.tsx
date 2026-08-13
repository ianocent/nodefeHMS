import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

const ListNavigationMenuViewModel = () => {
  const router = useRouter();
  const [table, setTable] = useState({
    head: ["", "No", "Name", "template", "sort", "status", "action", ""],
    body: [
      {
        no: "1",

        name: "content 1",

        template: "category 1",
        sort: 1,
        show: true,
        status: (
          <div className="px-4 py-2 rounded-md bg-[#03AF00]  text-center w-fit text-white capitalize">
            active
          </div>
        ),
        children: [
          {
            name: "content 1.A",
            template: "sub category 1.a",
            sort: "1A",
            status: (
              <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
                active
              </div>
            ),
          },
        ],
      },
      {
        no: "2",

        name: "content 2",
        show: true,
        template: "category 2",
        sort: 2,
        status: (
          <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
            active
          </div>
        ),
        children: [],
      },
      {
        no: "3",

        name: "content 3",
        show: true,
        template: "category 3",
        sort: 3,
        status: (
          <div className="px-4 py-2 rounded-md bg-[#03AF00]  text-center w-fit text-white">
            active
          </div>
        ),
        children: [],
      },
      {
        no: "4",

        name: "content 4",
        show: true,
        template: "category 4",
        sort: 4,
        status: (
          <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
            active
          </div>
        ),
        children: [],
      },
      {
        no: "5",

        name: "content 5",
        show: true,
        template: "category 5",
        sort: 5,
        status: (
          <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
            active
          </div>
        ),
        children: [
          {
            name: "content 5.A",
            template: "sub category 5.a",
            sort: "5A",
            status: (
              <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
                active
              </div>
            ),
          },
          {
            name: "content 5.B",
            template: "sub category 5.b",
            sort: "5B",
            status: (
              <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
                active
              </div>
            ),
          },
        ],
      },
    ],
  });

  const [tableBody, setTableBody] = useState([
    {
      no: "1",

      name: "content 1",

      template: "category 1",
      sort: 1,
      show: true,
      status: (
        <div className="px-4 py-2 rounded-md bg-[#03AF00]  text-center w-fit text-white capitalize">
          active
        </div>
      ),
      children: [
        {
          name: "content 1.A",
          template: "sub category 1.a",
          sort: "1A",
          status: (
            <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
              active
            </div>
          ),
        },
      ],
    },
    {
      no: "2",

      name: "content 2",
      show: true,
      template: "category 2",
      sort: 2,
      status: (
        <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
          active
        </div>
      ),
      children: [],
    },
    {
      no: "3",

      name: "content 3",
      show: true,
      template: "category 3",
      sort: 3,
      status: (
        <div className="px-4 py-2 rounded-md bg-[#03AF00]  text-center w-fit text-white">
          active
        </div>
      ),
      children: [],
    },
    {
      no: "4",

      name: "content 4",
      show: true,
      template: "category 4",
      sort: 4,
      status: (
        <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
          active
        </div>
      ),
      children: [],
    },
    {
      no: "5",

      name: "content 5",
      show: true,
      template: "category 5",
      sort: 5,
      status: (
        <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
          active
        </div>
      ),
      children: [
        {
          name: "content 5.A",
          template: "sub category 5.a",
          sort: "5A",
          status: (
            <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
              active
            </div>
          ),
        },
        {
          name: "content 5.B",
          template: "sub category 5.b",
          sort: "5B",
          status: (
            <div className="px-4 py-2 rounded-md bg-[#03AF00] text-center w-fit text-white capitalize">
              active
            </div>
          ),
        },
      ],
    },
  ]);
  const [pagination, setPagination] = useState({
    totalPage: 10,
    totalData: 20,
    options: [
      {
        label: "10",
        value: 10,
      },
      {
        label: "20",
        value: 20,
      },
      {
        label: "30",
        value: 30,
      },
    ],
    page: 1,
  });

  const dragItem: any = useRef();
  const dragOverItem: any = useRef();

  const dragStart = (e: any, position: any) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e: any, position: any) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const drop = (e: any) => {
    const copyListItems = [...tableBody];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTableBody(copyListItems);
  };
  const dropChildren = (e: any, index: any) => {
    const tempTableBody = [...tableBody];
    const copyListItems = tempTableBody[index].children;
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTableBody(tempTableBody);
  };

  function showChildren(index:number){
    let tempData=[...tableBody]
    tempData[index].show=!tempData[index].show
    setTableBody([...tempData])
  }

  return {
    table,
    dragEnter,
    dragStart,
    drop,
    tableBody,
    dropChildren,
    router,
    pagination,
    showChildren
  };
};

export default ListNavigationMenuViewModel;
