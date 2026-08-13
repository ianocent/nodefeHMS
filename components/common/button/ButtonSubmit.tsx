import React, { useEffect } from "react";
import { IconSpiner } from "../icon/CardIcon";
import { ToastContainer, toast } from "react-toastify";

interface ButtonSubmitProps {
  onCreate: () => void;
  label?: string;
  loading?: boolean;
  alert?: boolean;
  msgalert?: string;
  isprimary?: boolean;
  disabled?: boolean;
  ClassCustome?: string;
  ClassPrimary?: string;
  isdanger?: boolean;
  isBtnAdd?: boolean;
}
const ButtonSubmit = (props: ButtonSubmitProps) => {
  const {
    onCreate,
    label = "Submit",
    loading = false,
    alert = false,
    msgalert = "Wrong Server, Please Contact Your Administrator!",
    isprimary = true,
    disabled = false,
    ClassCustome = " !px-2 !py-1",
    ClassPrimary = "ti-btn ti-btn-primary !bg-primary !text-white !font-medium",
    isBtnAdd = true
  } = props;

  if (!isBtnAdd) return null;

  const baseBtn = "px-4 py-2 rounded-md font-medium flex items-center justify-center";
  const dangerBtn = "px-4 py-2 rounded-md font-medium flex items-center justify-center";

  return loading ? (
    <button
      className={
        (isprimary
          ? "bg-primary text-white"
          : "bg-[#E0E0E0] text-black") +
        " " +
        baseBtn
      }
    >
      <IconSpiner />
    </button>
  ) : (
    <button
      disabled={disabled}
      // className={
      //   (isprimary
      //     ? "bg-primary text-white"
      //     : "bg-[#E0E0E0] text-black") +
      //   " " +
      //   baseBtn
      // }
      className={
        (props.isdanger
          ? "bg-red text-white"
          : isprimary
          ? "bg-primary text-white"
          : "bg-[#E0E0E0] text-black") +
        " " +
        baseBtn
      }
      onClick={onCreate}
    >
      {label}
    </button>
  );
};

export default ButtonSubmit;
