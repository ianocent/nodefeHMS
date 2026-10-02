import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
interface TextareaBaseProps {
  label: string;
  rest: TextareaHTMLAttributes<HTMLTextAreaElement>;
  error: boolean;
  required?: boolean;
}
const TextareaBase = (props: TextareaBaseProps) => {
  const { rest, label, error, required } = props;
  return (
    <div className="flex flex-col gap-1">
      <label className="font-bold capitalize text-[14px] leading-[19px]">
        {label}
        {required ? <span className="text-red normal-case">*</span> : null}
      </label>
      <textarea
        {...rest}
        className={`border uppercase  ${
          error ? "border-red focus:!border-red" : ""
        } border-dashed focus:border-dashed rounded-md py-1 px-3 border-[#949eb7] `}
      ></textarea>
    </div>
  );
};

export default TextareaBase;
