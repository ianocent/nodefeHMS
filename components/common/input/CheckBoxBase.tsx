import React, { SelectHTMLAttributes, useEffect } from "react";
import dynamic from "next/dynamic";
interface SelectBaseProps {
  label: string;
  keys?: string;
  error: boolean;
  required?: boolean;
  placeholder?: string;
  rest?: SelectHTMLAttributes<HTMLSelectElement>;
  options?: {
    label: string;
    value: string | number;
  }[];
  onChange?: (e: any) => void;
  onMenuClose?: () => void;
  onMenuOpen?: () => void;
  ismulti?: boolean;
  value?: string;
  valuesel?: boolean;
  dissabled?: boolean;
  colspan?: string;
  isAll?: boolean;
  valMulti?: {};
  defaultchecked?: boolean;
}
const CheckBoxBase = (props: SelectBaseProps) => {
  const {
    error,
    rest,
    label,
    required,
    options,
    onChange,
    ismulti = false,
    value,
    placeholder = "",
    valuesel = false,
    onMenuClose,
    onMenuOpen,
    keys,
    dissabled = false,
    colspan = "col-span-6",
    isAll = true,
    valMulti = {},
    defaultchecked = false,
  } = props;
  useEffect(() => {
    //console.log("val", valMulti);
  }, [valMulti]);
  return (
    <div>
      {!ismulti ? (
        <div className="custom-toggle-switch toggle-sm flex items-center flex">
          <input
            id={keys + "id"}
            name={label}
            type="checkbox"
            defaultChecked={defaultchecked}
            checked={valuesel}
            value={value}
            onChange={onChange}
            disabled={dissabled}
          />
          <label htmlFor={keys + "id"} className="label-primary mt-2"></label>
          <span className="uppercase">{label}</span>
        </div>
      ) : options.length > 0 ? (
        <>
          <div className="flex gap-2 mb-2">
            {label == "" ? (
              <></>
            ) : (
              <>
                <label className="font-bold uppercase text-[13px] leading-[19px]">
                  {label}{" "}
                  {required ? (
                    <span className="text-red normal-case">*</span>
                  ) : null}
                </label>
              </>
            )}

            {isAll ? (
              <div className="custom-toggle-switch toggle-sm flex items-center flex ">
                <input
                  id={keys}
                  name={"head_" + keys}
                  type="checkbox"
                  checked={valMulti["head_" + keys]}
                  value={value}
                  onChange={onChange}
                  disabled={dissabled}
                />
                <label
                  htmlFor={keys}
                  className="label-primary mt-2 !w-[100px]"
                ></label>
                <span className="ms-1">{""}</span>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="grid grid-cols-12 gap-2">
            {options.map((row: any, index) =>
              row?.label ? (
                <div
                  className={
                    "custom-toggle-switch toggle-sm " +
                    (colspan == "0" ? "col-span-6" : colspan) +
                    " items-center lg:flex "
                  }
                >
                  <input
                    id={keys + "" + row?.value}
                    name={row?.label}
                    type="checkbox"
                    value={row?.value}
                    checked={valMulti[keys + "_" + row?.value]}
                    onClick={onChange}
                    disabled={dissabled}
                  />
                  <label
                    htmlFor={keys + "" + row?.value}
                    className="label-primary mt-2 !w-[2.1rem]"
                  ></label>
                  <span className="text-[12px] uppercase">
                    {row?.label.substring(0, 17)}
                  </span>
                </div>
              ) : (
                <></>
              )
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CheckBoxBase;
