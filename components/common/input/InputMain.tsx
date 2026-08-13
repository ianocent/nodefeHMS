import React, {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import InputBase from "./InputBase";
import TextareaBase from "./TextareaBase";
import SelectBase from "./SelectBase";
import FileInputBase from "./FileInputBase";
import dynamic from "next/dynamic";
import MultiSelectBAse from "./MultiSelectBase";
import CheckBoxBase from "./CheckBoxBase";
import { onChange } from "react-toastify/dist/core/store";
import ImageInput from "./ImageInput";
// import RichEditorBase from "./RichEditorBase";

interface InputBaseProps {
  label: string;
  rest?: InputHTMLAttributes<HTMLInputElement>;
  restArea?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  restSelect?: SelectHTMLAttributes<HTMLSelectElement>;
  error: boolean;
  required?: boolean;
  typeInput: "base" | "textarea" | "select" | "file-image" | string;
  options?: {
    label: string;
    value: string;
  }[];
  onChangeFiles?: (e: any) => void;
  onChangeRichEditor?: (e: any) => void;
  valueRichEditor?: any;
  onChangeSel?: any;
  onMenuOpenSell?: any;
  onMenuCloseSell?: any;
  valueSel?: any;
  isMulti?: boolean;
  placeholder?: string;
  key?: string;
  valuename?: string;
  colspan?: string;
  clasCus?: string;
  isAll?: boolean;
  valMulti?: {};
  defaultChecked?: boolean;
  disabled?: boolean;
  widthCus?: string;
  uriAutoComp?: string;
  useFileObject?: boolean;
}
const RichEditorBase = dynamic(() => import("./RichEditorBase"), {
  ssr: false,
  loading: () => <div>loading...</div>,
});

const InputMain = (props: InputBaseProps) => {
  const {
    error,
    label,
    rest,
    restArea,
    required = false,
    typeInput,
    restSelect,
    options,
    onChangeFiles,
    onChangeRichEditor,
    valueRichEditor,
    onChangeSel,
    valueSel,
    isMulti,
    placeholder,
    onMenuCloseSell,
    onMenuOpenSell,
    key,
    valuename,
    colspan,
    clasCus,
    isAll,
    valMulti,
    defaultChecked,
    disabled,
    widthCus,
    uriAutoComp,
    useFileObject,
  } = props;
  switch (typeInput) {
    case "base":
      return (
        <InputBase
          error={error}
          label={label}
          rest={rest}
          required={required}
          clasCus={clasCus ?? " "}
          widthCus={widthCus ?? " "}
          uriAutoComp={uriAutoComp}
          onchangeCus={onChangeSel}
          valEdit={valueSel}
        />
      );
    case "textarea":
      return (
        <TextareaBase
          error={error}
          label={label}
          rest={restArea}
          required={required}
        />
      );
    case "select":
      return (
        <SelectBase
          error={error}
          label={label}
          required={required}
          rest={restSelect}
          options={options}
          onChange={onChangeSel}
          value={valueSel}
        />
      );
    case "select-multi":
      return (
        <MultiSelectBAse
          disabled={disabled}
          error={error}
          label={label}
          required={required}
          options={options}
          onChange={onChangeSel}
          value={valueSel}
          ismulti={isMulti}
          placeholder={placeholder}
          onMenuClose={onMenuCloseSell}
          onMenuOpen={onMenuOpenSell}
          key={key}
        />
      );
    case "file-image":
      return (
        <FileInputBase
          label={label}
          onChangeFiles={onChangeFiles ? onChangeFiles : () => {}}
          required={required}
          urlImg={valueSel}
        />
      );
    case "image":
      return (
        <ImageInput
          label={label}
          onChange={onChangeFiles ? onChangeFiles : () => {}}
          required={required}
          urlImg={valueSel}
          useFileObject={useFileObject}
        />
      );
    case "checkbox":
      return (
        <CheckBoxBase
          keys={valuename}
          error={error}
          label={label}
          required={required}
          options={options}
          onChange={onChangeSel}
          value={valuename}
          valuesel={valueSel}
          ismulti={isMulti}
          placeholder={placeholder}
          colspan={colspan}
          isAll={isAll}
          valMulti={valMulti}
          defaultchecked={defaultChecked}
          dissabled={disabled}
        />
      );
    case "rich-editor":
      return (
        <RichEditorBase
          label={label}
          required={required}
          value={valueRichEditor}
          onChange={onChangeRichEditor ? onChangeRichEditor : () => {}}
        />
      );
    default:
      return;
  }
};

export default InputMain;
