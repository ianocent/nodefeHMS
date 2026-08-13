import React, { useState } from "react";
import { dataForm } from "../data";

const AddPermissionAdministratorViewModel = () => {
  const [form, setForm] = useState([
    {
      user: [
        {
          label: "Name",
          type: "text",
          typeInput: "base",
          value: "",
          error: false,
          required: true,
          style: "col-span-6",
          placeholder: "",
        },
        {
          label: "Email",
          type: "email",
          typeInput: "base",
          value: "",
          error: false,
          required: true,
          style: "col-span-6",
          placeholder: "",
        },
      ],
      authentification: {
        password: {
          label: "password",
          type: "password",
          typeInput: "password",
          value: "",
          error: false,
          required: true,
          style: "col-span-6",
          placeholder: "",
        },
        confirmPassword: {
          label: "Confirm Password",
          type: "password",
          typeInput: "password",
          value: "",
          error: false,
          required: true,
          style: "col-span-6",
          placeholder: "",
        },
      },

      authorization: {
        role: {
          label: "Role",
          type: "email",
          typeInput: "select",
          value: "",
          error: false,
          required: true,
          style: "col-span-6",
          placeholder: "",
          options: [
            {
              value: "1",
              label: "admin",
            },
            {
              value: "2",
              label: "users",
            },
          ],
        },

        permission: {
          value: [""],
          isAllChecked: false,
          options: [
            {
              label: "test-1",

              value: "test-1",
            },
            {
              label: "test-2",

              value: "test-2",
            },
            {
              label: "test-3",

              value: "test-3",
            },
            {
              label: "test-4",

              value: "test-4",
            },
            {
              label: "test-5",

              value: "test-5",
            },
            {
              label: "test-6",

              value: "test-6",
            },
          ],
        },
      },

      status: {
        value: "",
        options: [
          {
            label: "active",

            id: "status-active",
            value: "active",
          },
          {
            label: "in active",

            id: "in-status-active",
            value: "in-active",
          },
        ],
      },
    },
  ]);
  function addSection() {
    let tempForm = [...form, dataForm];
    setForm([...tempForm]);
  }

  function onChangeUser(value: string, indexForm: number, indexInput: number) {
    let tempForm = [...form];
    tempForm[indexForm].user[indexInput].value = value;
    setForm([...tempForm]);
  }

  function onChangePassword(
    value: string,
    indexForm: number,
    type: "password" | "confirmPassword"
  ) {
    let tempForm = [...form];
    tempForm[indexForm].authentification[type].value = value;
    setForm([...tempForm]);
  }

  function onChangeRole(value: any, indexForm: number) {
    let tempForm = [...form];
    tempForm[indexForm].authorization.role.value = value;
    setForm([...tempForm]);
  }

  function onSelectAllPermision(checked: boolean, index: number, data: any) {
    let tempForm = [...form];
    let tempValue: any = [];
    if (checked) {
      data.authorization.permission.options.map((optionPermission: any) => {
        tempValue.push(optionPermission.value);
      });
      tempForm[index].authorization.permission.isAllChecked = true;
      tempForm[index].authorization.permission.value = [...tempValue];
    } else {
      tempForm[index].authorization.permission.isAllChecked = false;
      tempForm[index].authorization.permission.value = [...tempValue];
    }
    setForm([...tempForm]);
  }

  function onChangePermission(
    row: any,
    valueInputPermission: any,
    index: number
  ) {
    let tempForm = [...form];
    let checkedSwith =
      row.authorization.permission.value.indexOf(valueInputPermission) != -1;
    console.log(checkedSwith);
    if (checkedSwith) {
      let tempFilter = row.authorization.permission.value.filter(
        (fil: any) => fil != valueInputPermission
      );
      tempForm[index].authorization.permission.value = [...tempFilter];
      tempForm[index].authorization.permission.isAllChecked = false;
      setForm([...tempForm]);
    } else {
      let tempDataPermission = row.authorization.permission.value.filter(
        (fil: any) => fil !== ""
      );
      tempForm[index].authorization.permission.value = [
        ...tempDataPermission,
        valueInputPermission,
      ];

      if (
        tempDataPermission.length + 1 ==
        row.authorization.permission.options.length
      ) {
        tempForm[index].authorization.permission.isAllChecked = true;
      }

      setForm([...tempForm]);
    }
  }

  return {
    form,
    setForm,
    addSection,
    onChangeUser,
    onChangePassword,
    onChangeRole,
    onSelectAllPermision,
    onChangePermission,
  };
};

export default AddPermissionAdministratorViewModel;
