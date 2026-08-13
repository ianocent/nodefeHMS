import React, {
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
interface SelectBaseProps {
  label: string;
  key?: string;
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
  // value?: [];
  value?: { label: string; value: string | number }[] | null;
  disabled?: boolean;
}
const MultiSelectBAse = (props: SelectBaseProps) => {
  const {
    error,
    rest,
    label,
    required,
    options,
    onChange,
    ismulti = true,
    value = [],
    placeholder = "",
    onMenuClose = () => {},
    onMenuOpen = () => {},
    key,
    disabled,
  } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const Select = dynamic(() => import("react-select"), { ssr: false });
  let optionsAdd = [];
  let optionMerge = [];

  try {
    optionMerge = options
      ? !ismulti && label != "Billing to"
        ? [...optionsAdd, ...options]
        : options
      : optionsAdd;
  } catch (error) {
    optionMerge = options;
  }
  let defaultValue = [];
  try {
    // defaultValue =
    //   !ismulti && value.length == 0
    //     ? [{ value: "", label: "Select " + label }]
    //     : value;
    defaultValue = !ismulti && value.length == 0 ? [] : value;
  } catch (error) {
    defaultValue = value;
  }
  useEffect(() => {
    const handleOutSideClick = (event) => {
      // console.log(event.target.className.split(" ")[0]);
      try {
        if (
          event?.target?.className?.split(" ")[0] !=
            "Select2__input-container" &&
          event?.target?.className?.split(" ")[0] !=
            "Select2__value-container" &&
          event?.target?.className?.split(" ")[0] != "Select2__indicator" &&
          event?.target?.className?.split(" ")[0] != "Select2__placeholder"
        ) {
          // console.log(event.target.className);
          setIsOpen(false);
          // console.log(event.target.className);
          // setoverflow(true);
        }
      } catch (error) {}
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);
  return (
    <div className="flex flex-col gap-1 min-w-max" ref={ref}>
      {label !== "" && (
        <label className="font-bold text-[14px] leading-[19px]">
          {label}{" "}
          {required ? <span className="text-red normal-case">*</span> : null}
        </label>
      )}
      <Select
        key={key}
        isMulti={ismulti}
        name={key}
        isDisabled={disabled}
        options={optionMerge}
        className="basic-multi-select min-w-[120px] "
        id="choices-multiple-default"
        menuPlacement="auto"
        classNamePrefix="Select2"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onMenuClose={() => {
          onMenuClose();
          setIsOpen(false);
        }}
        onMenuOpen={() => {
          onMenuOpen();
          setIsOpen(true);
        }}
        onBlur={() => {
          setIsOpen(false);
        }}
        menuIsOpen={isOpen}
        onChange={onChange}
        openMenuOnClick={true}
        styles={{
          menuList: (baseStyle, state) => ({
            ...baseStyle,
            background: "#fff",
            minWidth: "max-content",
            textTransform: "uppercase",
            // zIndex: 99999999,
          }),
          menuPortal: (baseStyle, state) => ({
            ...baseStyle,
            zIndex: 99999999,
            textTransform: "uppercase",
          }),
          menu: (baseStyle, state) => ({
            ...baseStyle,
            zIndex: 99999999,
            // position: "static",
            textTransform: "uppercase",
          }),
          valueContainer: (baseStyle, state) => ({
            ...baseStyle,
            width: "50px",
            // position: "static",
            textTransform: "uppercase",
          }),
        }}
        isClearable={false}
        isSearchable={true}
        // components={{DropdownIndicator:}}
      />
    </div>
  );
};

export default MultiSelectBAse;
