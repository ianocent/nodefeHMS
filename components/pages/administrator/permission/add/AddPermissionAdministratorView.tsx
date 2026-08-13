import InputBase from "../../../../../components/common/input/InputBase";
import InputPassword from "../../../../../components/common/input/InputPassword";
import SelectBase from "../../../../../components/common/input/SelectBase";
import PaperBase from "../../../../../components/common/paper/PaperBase";
import { Switch } from "@material-tailwind/react";
import React from "react";
import AddPermissionAdministratorViewModel from "./AddPermissionAdministratorViewModel";
import ButtonCreate from "../../../../../components/common/button/ButtonCreate";

const AddPermissionAdministratorView = () => {
  const {
    form,
    setForm,
    addSection,
    onChangeUser,
    onChangePassword,
    onChangeRole,
    onSelectAllPermision,
    onChangePermission,
  } = AddPermissionAdministratorViewModel();
  return (
    <PaperBase>
      <div className="flex gap-4 justify-between">
        <h2 className="text-lg font-bold">User Form</h2>
        <button
          onClick={() => addSection()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          + Add Permission
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {form.map((row, index) => (
          <div key={"form" + "-" + index} className="border-b-2 pb-4">
            <div className="sm:grid grid-cols-1  md:grid-cols-2 gap-4">
              {row.user.map((userInput, indexUserInput) => (
                <InputBase
                  error={userInput.error}
                  label={userInput.label}
                  rest={{
                    value: userInput.value,
                    onChange: (e) => {
                      onChangeUser(e.target.value, index, indexUserInput);
                    },
                  }}
                  required={userInput.required}
                />
              ))}
            </div>

            <div className="col-span-2 bg-[#F2F2F2] p-4 rounded-md mt-4">
              <h3 className="text-lg font-bold">Authentification</h3>
              <div className="sm:grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <InputPassword
                    error={row.authentification.password.error}
                    label={row.authentification.password.label}
                    rest={{
                      value: row.authentification.password.value,
                      onChange: (e) => {
                        onChangePassword(e.target.value, index, "password");
                      },
                    }}
                    required={row.authentification.password.required}
                  />
                  <p className="text-xs mt-2">
                    Your password must be 8 - 20 characters long, contain
                    uppercase and lowercase letters, number and special
                    characters
                  </p>
                </div>
                <InputPassword
                  error={row.authentification.confirmPassword.error}
                  label={row.authentification.confirmPassword.label}
                  rest={{
                    value: row.authentification.confirmPassword.value,
                    onChange: (e) => {
                      onChangePassword(
                        e.target.value,
                        index,
                        "confirmPassword"
                      );
                    },
                  }}
                  required={row.authentification.confirmPassword.required}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold my-4">Authorization</h3>
              <SelectBase
                error={row.authorization.role.error}
                label={row.authorization.role.label}
                options={row.authorization.role.options}
                rest={{
                  value: row.authorization.role.value,
                  onChange: (e) => {
                    onChangeRole(e.target.value, index);
                  },
                }}
              />
            </div>

            <div className="flex justify-between gap-4 mt-4">
              <h3 className="text-[14px] leading-[19px] font-bold">
                Permission
              </h3>
              <div className="custom-toggle-switch flex items-center mb-4">
                <input
                  id={"toggleswitchPrimary-selectAll"}
                  name="toggleswitch001"
                  type="checkbox"
                  checked={row.authorization.permission.isAllChecked}
                  onChange={(e) => {
                    onSelectAllPermision(e.target.checked, index, row);
                  }}
                />
                <label
                  htmlFor="toggleswitchPrimary-selectAll"
                  className="label-primary"
                ></label>
                <span
                  className="ms-3 cursor-pointer"
                  onClick={() => {
                    onSelectAllPermision(
                      !row.authorization.permission.isAllChecked,
                      index,
                      row
                    );
                  }}
                >
                  Select All
                </span>
              </div>
            </div>
            <div className="sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
              {row.authorization.permission.options.map(
                (inputPermision, indexPermission) => (
                  <div className="custom-toggle-switch flex items-center mb-4">
                    <input
                      id={"toggleswitchPrimary" + indexPermission}
                      // name="toggleswitch001"
                      type="checkbox"
                      checked={
                        row.authorization.permission.value.indexOf(
                          inputPermision.value
                        ) != -1
                      }
                      onChange={(e) => {
                        onChangePermission(row, inputPermision.value, index);
                      }}
                    />
                    <label
                      htmlFor={"toggleswitchPrimary" + indexPermission}
                      className="label-primary"
                    ></label>
                    <span
                      className="ms-3 cursor-pointer"
                      onClick={() => {
                        onChangePermission(row, inputPermision.value, index);
                      }}
                    >
                      {inputPermision.label}
                    </span>
                    {/* <span className="ms-3">Primary</span> */}
                  </div>
                )
              )}
            </div>

            <div className="mt-4">
              <label className="text-[14px] leading-[19px] font-bold">
                Status
              </label>
              <div className=" flex gap-4 items-center">
                {row.status.options.map((inputStatus) => (
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      onChange={(e) => {
                        let tempForm = [...form];
                        tempForm[index].status.value = e.target.value;
                        setForm(tempForm);
                      }}
                      id={inputStatus.id}
                      value={inputStatus.value}
                      checked={inputStatus.value == row.status.value}
                    />

                    <label className="capitalize" htmlFor={inputStatus.id}>
                      {inputStatus.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ButtonCreate onCancel={() => {}} onCreate={() => {}} />
    </PaperBase>
  );
};

export default AddPermissionAdministratorView;
