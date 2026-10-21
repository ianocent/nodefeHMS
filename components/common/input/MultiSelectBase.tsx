import React, {
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";

// IMPORTANT: the dynamic import MUST live at module scope. Creating it inside
// the component body produced a NEW component type on every render, so
// react-select remounted whenever the parent re-rendered (e.g. after
// onMenuOpen/setIsOpen) — the menu closed itself before an option could be
// clicked, which made the cancel-reservation Reason dropdown unclickable.
const Select = dynamic(() => import("react-select"), { ssr: false });

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
      try {
        const root: any = ref.current;
        if (root && event?.target && root.contains(event.target)) return;
        // Menu may render in a portal/outside root; keep it open when the click
        // lands on this select's own menu.
        const cls = String(event?.target?.className ?? "");
        if (cls.indexOf("Select2__") !== -1) return;
        setIsOpen(false);
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
        // Render with fixed positioning so long option lists are never clipped
        // by the popup's overflow-y-auto/max-h scroll containers — inside those
        // containers the inline menu was cut off and the visible options were
        // unclickable.
        menuPosition="fixed"
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
