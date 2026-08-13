import React from "react";
import { IconSpiner } from "../icon/CardIcon";
interface ButtonAddInputProps {
  activeStep: number;
  stepper: number;
  next: () => void;
  previous: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isprimary?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
const ButtonAddInput = (props: ButtonAddInputProps) => {
  const {
    activeStep,
    next,
    previous,
    stepper,
    onSubmit,
    onCancel,
    isprimary = true,
    loading = false,
    disabled = false,
  } = props;
  return (
    <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0">
      <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
        {activeStep > 0 && (
          <button
            className="border-black  border-2 px-4 py-2  rounded-md"
            onClick={() => {
              previous();
            }}
          >
            Previous
          </button>
        )}
        {activeStep < stepper && (
          <button
            className="bg-primary px-4 py-2 text-white rounded-md"
            onClick={() => {
              next();
            }}
          >
            Next
          </button>
        )}
        {activeStep == stepper && (
          <>
            {loading ? (
              <button
                className={
                  isprimary
                    ? "ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                    : "bg-[#E0E0E0] px-4 py-2 rounded-md"
                }
              >
                <IconSpiner />
                {"Loading..."}
              </button>
            ) : (
              <button
                disabled={disabled}
                className={
                  isprimary
                    ? "ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                    : "bg-[#E0E0E0] px-4 py-2 rounded-md"
                }
                onClick={() => {
                  onSubmit();
                }}
              >
                {"Save Changes"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ButtonAddInput;
