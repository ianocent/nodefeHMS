import React, { SelectHTMLAttributes } from "react";
interface SelectBaseProps {
  label: string;
  rest?: SelectHTMLAttributes<HTMLSelectElement>;
  error: boolean;
  required?: boolean;
  options?: {
    label: string;
    value: string | number;
  }[];
  onChange?: (e: any) => void;
  value?: any;
}
const SelectBase = (props: SelectBaseProps) => {
  const { error, label, rest, required, options, onChange, value } = props;

  return (
    <div className="flex flex-col gap-1">
      {label !== "" && (
        <label className="font-bold text-[14px] leading-[19px]">
          {label}{" "}
          {required ? <span className="text-red normal-case">*</span> : null}
        </label>
      )}
      <select
        {...rest}
        className={`border ${
          error ? "border-red focus:!border-red" : ""
        } rounded-md py-1 focus:!border-blue`}
        onChange={onChange}
        value={value}
      >
        {label == "Status" ? (
          <></>
        ) : (
          <option value="" className="opacity-40 text-gray-300 ">
            {rest?.["aria-placeholder"]}
          </option>
        )}

        {options?.map((row, index) => (
          <option value={row.value} key={row.label + index}>
            {row.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBase;
