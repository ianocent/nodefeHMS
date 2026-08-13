import Image from "next/image";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FetchData, GetDecrypt } from "../../helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { IconSpiner } from "../icon/CardIcon";

export interface InputBaseProps {
  label: string;
  rest: InputHTMLAttributes<HTMLInputElement>;
  error: boolean;
  required?: boolean;
  clasCus?: string;
  widthCus?: string;
  uriAutoComp?: string;
  onchangeCus?: (e) => void;
  valEdit?: any;
}
const InputBase = (props: InputBaseProps) => {
  const {
    rest,
    label,
    error,
    required,
    clasCus = " ",
    widthCus = " ",
    uriAutoComp,
    onchangeCus,
    valEdit,
  } = props;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (files: any) => rest.onChange(files),
  });
  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const router = useRouter();
  const ref = useRef(null);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataguest, setdataguest] = useState<any>([]);
  const [loading, setloading] = useState(false);
  const [activeAuto, setactiveAuto] = useState(false);
  const [valOri, setValOri] = useState<any>(valEdit);

  const GetDataAutoComp = async (word) => {
    try {
      setloading(true);
      let getuuri = "";

      getuuri =
        uriAutoComp +
        (uriAutoComp.indexOf("?") == -1
          ? "?search=" + word
          : "&search=" + word);

      const data: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (data.code == 200) {
        setdataguest(data);
        setloading(false);
      }
      return;
    } catch (error) {
      console.log("debug", error);
      return;
    }
  };
  const ListTblGuest = () => {
    return (
      <>
        <div
          ref={ref}
          className="p-2 rounded-md w-full z-50 border-black border-b-[1px] border-r-[1px] border-l-[1px] absolute bg-white"
        >
          <>
            {!loading ? (
              <div className="table-responsive w-full">
                <table className={"shadow-lg table-auto w-full"}>
                  <thead>
                    <tr className="">
                      {dataguest?.table?.map((row: any, i: any) => (
                        <td
                          title={"Sort By " + row.label}
                          key={i}
                          className="bg-[#323A50] text-white p-2 font-bold cursor-pointer"
                        >
                          {row.label}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataguest?.data?.map((row: any, index) => (
                      <>
                        <tr
                          key={row?.id + "-" + index}
                          className={`${
                            index % 2 == 0 ? "bg-gray-300" : ""
                          } p-2 cursor-pointer focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] `}
                        >
                          {dataguest?.table?.map((item: any, a: any) => {
                            return item.row != 1 ? (
                              <td
                                key={item.key + "-" + a}
                                onClick={() => {
                                  onSelecteda(row);
                                  setactiveAuto(false);
                                }}
                              >
                                {typeof row[item.key] == "string" ||
                                typeof row[item.key] == "number" ||
                                typeof row[item.key] == "boolean" ? (
                                  row[item.key] == true &&
                                  typeof row[item.key] == "boolean" ? (
                                    <img
                                      src="/assets/images/apps/checklist.png"
                                      className="w-[20px]"
                                    />
                                  ) : row[item.key] == false &&
                                    typeof row[item.key] == "boolean" ? (
                                    <img
                                      src="/assets/images/apps/cross.png"
                                      className="w-[20px]"
                                    />
                                  ) : item?.is_html ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: row[item.key],
                                      }}
                                    />
                                  ) : (
                                    row[item.key]
                                  )
                                ) : Array.isArray(row[item.key]) ? (
                                  row[item.key]?.map((rw, i) => {
                                    return (
                                      <div
                                        className={
                                          row?.is_color
                                            ? row.color +
                                              " px-1 py-1 text-white rounded-md mt-1 text-center"
                                            : "bg-success px-1 py-1 text-white rounded-md mt-1 text-center"
                                        }
                                        key={i}
                                      >
                                        {rw?.en ?? rw?.label}
                                      </div>
                                    );
                                  })
                                ) : (
                                  row[item.key]?.en ?? row[item.key]?.label
                                )}
                              </td>
                            ) : (
                              <></>
                            );
                          })}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
                {/* {dataguest?.data?.length <= 0 ? (
                  isAdd ? (
                    <div className="flex w-full justify-center mt-2">
                      <ButtonSubmit
                        label="Add"
                        onCreate={() => {
                          setpopup(true);
                          setnamePopup(name);
                          setactAuto("-1");
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )} */}
              </div>
            ) : (
              <div className="flex w-full justify-center mt-2">
                <IconSpiner />
              </div>
            )}
          </>
        </div>
      </>
    );
  };
  const onSelecteda = (rw: any) => {
    var objinames = {
      label: rw?.name,
      value: rw?.id,
    };
    onchangeCus(objinames);
    setValOri(objinames);
  };
  return (
    <div
      className={
        (rest.type == "number" ? " " : " min-w-[70px] ") +
        "flex flex-col gap-1 "
      }
    >
      {label == "-" ? (
        <></>
      ) : (
        <label className="font-bold capitalize text-[14px] leading-[19px]">
          {label}{" "}
          {required ? <span className="text-red normal-case">*</span> : null}
        </label>
      )}

      {rest.type == "file" ? (
        <div className="w-full py-1  ">
          <div
            {...getRootProps({
              className: "",
            })}
            className=" flex flex-col items-center justify-center border-[#949eb7] border-dashed border rounded-md"
          >
            <input {...getInputProps()} />

            {files.length > 0 ? (
              <ul className="list-disc list-inside">{files}</ul>
            ) : (
              <div className="w-full border-dashed border  py-1 px-2 flex gap-2 items-center">
                Choose Image
                <img
                  width={24}
                  height={24}
                  alt=""
                  src={"/assets/imgUpload.png"}
                />
              </div>
            )}
          </div>
        </div>
      ) : // menambah input form document
      rest.type == "file_document" ? (
        <div className="w-full py-1  ">
          <div
            {...getRootProps({
              className: "",
            })}
            className=" flex flex-col items-center justify-center border-[#949eb7] border-dashed border rounded-md min-h-[30px]"
          >
            <input {...getInputProps()} />

            {files.length > 0 ? (
              <ul className="list-disc list-inside">{files}</ul>
            ) : (
              <div className="w-full border-dashed border  py-1 px-2 flex gap-2 items-center">
                <img
                  width={16}
                  height={16}
                  alt=""
                  src={
                    "/assets/iconfonts/bootstrap-icons/icons/icons/upload.svg"
                  }
                />
                Upload File
              </div>
            )}
          </div>
        </div>
      ) : rest.type == "date" ? (
        <input
          type="date"
          placeholder="dd/mm/yyyy"
          {...rest}
          className={
            `${widthCus} border  ${
              error ? "border-red focus:!border-red" : ""
            } border-dashed focus:!border-blue focus:border-dashed rounded-md py-1 focus:outline-0 focus:outline-dashed focus:ring-transparent ` +
            clasCus
          }
        />
      ) : rest.type == "autocomplete" ? (
        <div>
          <input
            type="text"
            placeholder={rest.placeholder}
            className={
              `${widthCus} border  ${
                error ? "border-red focus:!border-red" : ""
              } border-dashed focus:!border-blue focus:border-dashed rounded-md py-1 focus:outline-0 focus:outline-dashed focus:ring-transparent w-full ` +
              clasCus
            }
            onKeyUp={(e: any) => {
              // console.log("wdy", e.target?.value?.length);
              if (e.target?.value?.length > 1) {
                GetDataAutoComp(e.target?.value);
                setactiveAuto(true);
              }
              if (e.target?.value?.length > 0 && onchangeCus) {
                onchangeCus({ value: 0, label: 0 });
              }
              setValOri(e.target?.value);
            }}
            value={valOri?.label}
          />
          <div>
            <>{activeAuto && ListTblGuest()}</>
          </div>
        </div>
      ) : (
        <>
          <input
            {...rest}
            className={
              `${widthCus} border  ${
                error ? "border-red focus:!border-red" : ""
              } border-dashed focus:!border-blue focus:border-dashed rounded-md py-1 focus:outline-0 focus:outline-dashed focus:ring-transparent ` +
              clasCus +
              (rest.type == "text" && rest.name != "email"
                ? " uppercase "
                : " ")
            }
          />
        </>
      )}
    </div>
  );
};

export default InputBase;
