import React, { useState, useEffect } from "react";
// import { FiEye, FiEyeOff, FiInfo, FiMove } from "react-icons/fi";
import Select from "react-select";
import { FetchData, GetDecrypt, GetEncrypt } from "../../helper";
import AsyncSelect from "react-select/async";
import { Editor } from "@tinymce/tinymce-react";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
type Option = { label: string; value: any };
type FieldType =
  | "text"
  | "email"
  | "number"
  | "price"
  | "date"
  | "datetime-local"
  | "time"
  | "file"
  | "textarea"
  | "checkbox"
  | "switch"
  | "select-single"
  | "select-multi"
  | "hide"
  | "password"
  | "autocomplete"
  | "password-repassword"
  | "hide"
  | "text-editor"
  | "upload-fm"
  | "addRowTable"
  | "addRowCard";
type Props = {
  type: FieldType;
  label: string;
  name: string;
  value?: any;
  options?: Option[]; // fallback options
  fetchOptions?: (inputValue?: string) => Promise<Option[]>; // 🆕 fetch options from API
  onChange: (name: string, value: any, notCopy?: boolean) => void;
  formatOptionLabel?: (data: Option) => React.ReactNode;
  fieldAddRow?: any[];
  uriSelect?: string;
  disabled?: boolean;
  formValues?: Record<string, any>; // ⬅️ Tambahkan ini
  trigerValue?: string[];
  info?: string;
};

export default function InputField({
  type,
  label,
  name,
  value,
  options = [],
  fetchOptions,
  onChange,
  formatOptionLabel,
  fieldAddRow,
  uriSelect,
  disabled,
  formValues,
  trigerValue,
  info,
}: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectOptions, setSelectOptions] = useState<Option[]>(options);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [hasFetchedOptions, setHasFetchedOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expanded, setExpanded] = useState<number[]>([]);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const router = useRouter();
  const toggleExpand = (idx: number) => {
    setExpanded((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  // 🆕 Fetch options on mount if it's select and fetchOptions is provided
  useEffect(() => {
    if (
      (type === "select-single" || type === "select-multi") &&
      fetchOptions &&
      !hasFetchedOptions
    ) {
      setLoadingOptions(true);
      fetchOptions()
        .then((fetched) => {
          setSelectOptions(fetched);
          setHasFetchedOptions(true); // 🆕 jangan fetch ulang
        })
        .finally(() => setLoadingOptions(false));
    }
  }, [type, fetchOptions, hasFetchedOptions]);

  // Fungsi bertingkat: terima uri dulu, lalu return fungsi loadOptions
  const fetchOptionsData =
    (url: string, params: Record<string, any> = {}) =>
    async (inputValue: string) => {
      if (!url) return options;
      try {
        const searchParams = new URLSearchParams();
        if (inputValue) {
          searchParams.set("search", inputValue);
        }
        for (const key in params) {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key]);
          }
        }

        const response = await FetchData(
          `${url}?${searchParams.toString()}`,
          "GET",
          "",
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );
        return response?.data ?? [];
      } catch (err) {
        console.error("Error fetching options:", err);
        return [];
      }
    };

  return (
    <React.Fragment key={name}>
      {type != "hide" && (
        <div className="">
          {label != "" && (
            <div className="block mb-1 flex gap-2 items-center justify-between font-medium text-gray-700">
              <div className="flex items-center gap-2">{label}</div>
            </div>
          )}

          {type === "select-single" || type === "select-multi" ? (
            <AsyncSelect
              isMulti={type === "select-multi"}
              name={name}
              value={value}
              loadOptions={fetchOptionsData(
                uriSelect || "",
                (() => {
                  if (!trigerValue || !Array.isArray(trigerValue)) return {};

                  const params: Record<string, any> = {};
                  for (const trigName of trigerValue) {
                    const val = formValues?.[trigName];
                    if (typeof val === "object" && val?.value !== undefined) {
                      params[trigName] = val.value;
                    } else if (val !== undefined) {
                      params[trigName] = val;
                    }
                  }
                  return params;
                })()
              )}
              isLoading={loadingOptions}
              defaultOptions={true} // penting!
              onChange={(selected) => onChange(name, selected)}
              className="text-sm"
              formatOptionLabel={formatOptionLabel}
              isClearable
              isDisabled={disabled}
              // 🔽 Tambahkan ini
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              menuPosition="fixed" // ⬅️ ini penting
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </React.Fragment>
  );
}
