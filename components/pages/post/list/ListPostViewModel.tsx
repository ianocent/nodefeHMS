import { useRouter } from "next/router";
import React, { useState } from "react";

const ListPostViewModel = () => {
  const router=useRouter()
  const [filter, setFilter] = useState([
    {
      label: "",
      type: "text",
      typeInput: "select",
      value: undefined,
      options: [
        {
          label: "testing",
          value: "testing",
        },
        {
          label: "testing2",
          value: "testing",
        },
        {
          label: "testing3",
          value: "testing",
        },
      ],
      error: false,
      required: true,
      style: "",
      placeholder: "Choose Product",
    },
    {
      label: "",
      type: "text",
      typeInput: "select",
      value: undefined,
      options: [
        {
          label: "testing",
          value: "testing",
        },
        {
          label: "testing2",
          value: "testing",
        },
        {
          label: "testing3",
          value: "testing",
        },
      ],
      error: false,
      required: true,
      style: "cols-span-12  md:col-span-6",
      placeholder: "Choose Category",
    },
    {
      label: "",
      type: "text",
      typeInput: "select",
      value: undefined,
      options: [
        {
          label: "testing",
          value: "testing",
        },
        {
          label: "testing2",
          value: "testing",
        },
        {
          label: "testing3",
          value: "testing",
        },
      ],
      error: false,
      required: true,
      style: "cols-span-12  md:col-span-6",
      placeholder: "Choose Sub Category ",
    },
    {
      label: "",
      type: "text",
      typeInput: "select",
      value: undefined,
      options: [
        {
          label: "testing",
          value: "testing",
        },
        {
          label: "testing2",
          value: "testing",
        },
        {
          label: "testing3",
          value: "testing",
        },
      ],
      error: false,
      required: true,
      style: "cols-span-12  md:col-span-6",
      placeholder: "Status",
    },
    {
      label: "",
      type: "text",
      typeInput: "select",
      value: undefined,
      options: [
        {
          label: "testing",
          value: "testing",
        },
        {
          label: "testing2",
          value: "testing",
        },
        {
          label: "testing3",
          value: "testing",
        },
      ],
      error: false,
      required: true,
      style: "cols-span-12  md:col-span-6",
      placeholder: "Price",
    },
  ]);
  const [table, setTable] = useState({
    head: ["No", "Name", "Template", "Sort", "Status", "Action"],
    body: [
      {
        no: "1",
        name: "content 1",
        template: "category 1",
        sort: 1,
        status: "active",
      },
      {
        no: "2",
        name: "content 2",
        template: "category 2",
        sort: 2,
        status: "active",
      },
      {
        no: "3",
        name: "content 3",
        template: "category 3",
        sort: 3,
        status: "active",
      },
      {
        no: "4",
        name: "content 4",
        template: "category 4",
        sort: 4,
        status: "active",
      },
    ],
  });
  const [pagination,setPagination]=useState({
    totalPage:10,
    totalData:20,
    options:[
      {
        label:"10",
        value:10
      },
      {
        label:"20",
        value:20
      },
      {
        label:"30",
        value:30
      }
    ],
    page:1
  })
  function goToAddView(){
    router.push('/post/add')
  }
  return { filter ,table,goToAddView,pagination};
};

export default ListPostViewModel;
