import React, { InputHTMLAttributes } from "react";
interface InputBaseProps {
  label: string;
  rest: InputHTMLAttributes<HTMLInputElement>;
  error: boolean;
  required?: boolean;
}
const InputPassword = (props: InputBaseProps) => {
  const { rest, label, error, required } = props;
  return (
    <div className="flex flex-col gap-1">
      <label className="font-bold capitalize text-[14px] leading-[19px]">
        {label}{" "}
        {required ? <span className="text-red normal-case ">*</span> : null}
      </label>
      <input
        type="password"
        {...rest}
        className={`border-0  bg-white rounded-md`}
      />
    </div>
  );
};

export default InputPassword;
