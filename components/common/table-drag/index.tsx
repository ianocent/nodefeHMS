import React, { useEffect, useRef, useState } from "react";
import favicon from "../../../public/favicon.ico";
import ListViewModel from "../../pages/user/list/ListPostViewModel";
import { useRouter } from "next/router";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryStr,
  RouteChange,
} from "../../helper";
import PaginationTable from "../pagination/PaginationTable";
import { IconSpiner } from "../icon/CardIcon";
import InputMain from "../input/InputMain";
import { useSelector } from "react-redux";
import { IconAcccourdion } from "../icon/SidebarIcon";
import ButtonSubmit from "../button/ButtonSubmit";
import ModalConfirmationComponent from "../modal/ModalConfirmation";
interface TableViewProps {
  data?: any;
  descfield?: string;
  uri?: string;
  ascfield?: string;
  uriview?: string;
  uriedit?: string;
  uriisactive?: string;
  uriisdelete?: string;
  uriapprove?: string;
  urireject?: string;
  loading?: boolean;
  isBtnView?: boolean;
  isBtnEdit?: boolean;
  isBtnDelete?: boolean;
  isBtnAdd?: boolean;

  prevJump: () => void;
  prev: () => void;
  nextJump: () => void;
  next: () => void;
  refresDat?: (e) => void;
  del?: (e) => void;
}
const TableView = (props: TableViewProps) => {
  const {
    data,
    loading = false,
    uri,
    prevJump,
    prev,
    nextJump,
    next,
    del,
    isBtnAdd = true,
    isBtnView = true,
    isBtnEdit = true,
    isBtnDelete = true,
  } = props;
  const isview = data?.permission?.view;
  const isedit = data?.permission?.edit;
  const isdeleted = data?.permission?.delete;
  const GLOBALURI = uri
  const router = useRouter();
  const path = router.pathname;
  const fullpath = router.asPath;
  const [tableBody, setTableBody] = useState(data?.data ?? []);
  const dragItem: any = useRef();
  const dragOverItem: any = useRef();
  const sdragId: any = useRef();
  const sdragVis: any = useRef();
  const sdragParent: any = useRef();
  const edragId: any = useRef();
  const edragVis: any = useRef();
  const edragParent: any = useRef();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [parentshow, setparentshow] = useState(-99);
  const [parentshowa, setparentshowa] = useState(-99);
  const [parentshowb, setparentshowb] = useState(-99);
  const [parentshowc, setparentshowc] = useState(-99);
  const [idparent, setidparent] = useState("");
  const [datatable, setdatatable] = useState<any>({});
  const [datavalsrc, setDatasrc] = useState<any>({
    status: { value: "-1", label: "ALL" },
  });
  const changeHandlerSrc = (e: any, b?: boolean, name?: string) => {
    // console.log("widy", e);
    var fieldsrc = "";
    var valsrc = "";
    var namecur = "";
    if (!b) {
      setDatasrc({ ...datavalsrc, [e.target.name]: e.target.value });
      if (e.target.name != "search") {
        fieldsrc = e.target.name + ";";
        valsrc = e.target.value + ";";
      } else {
        router.query = { ...router.query, search: e.target.value };
      }

      namecur = e.target.name;
    } else {
      setDatasrc({ ...datavalsrc, [name]: e });
      fieldsrc = name + ";";
      valsrc = e.value + ";";
      namecur = name;
      // console.log(name);
    }

    Object.keys(datavalsrc)?.map((rw) => {
      var minsatu = false;
      if (rw != namecur) {
        if (
          typeof datavalsrc[rw] == "object" &&
          datavalsrc[rw]?.value == "-1"
        ) {
          minsatu = true;
        }
        if (e?.target?.name == "search") {
          minsatu = true;
        }
        if (!minsatu) {
          if (rw != "search") {
            fieldsrc += rw + ";";
            valsrc +=
              (typeof datavalsrc[rw] == "object"
                ? datavalsrc[rw]?.value
                : datavalsrc[rw]) + ";";
          } else {
            router.query = { ...router.query, search: datavalsrc[rw] };
          }
        }
      }
    });
    // console.log("logaja", window.location.href);
    router.query = { ...router.query, search_field: fieldsrc };
    if (GetQueryStr("body")) {
      router.query = { ...router.query, body: GetQueryStr("body") };
      router.query = { ...router.query, src: GetQueryStr("src") };
    }
    router.query = { ...router.query, search_value: valsrc };
  };

  const dragStart = (
    e: any,
    position: any,
    id: any,
    vis: any,
    parentid: any
  ) => {
    dragItem.current = position;
    sdragId.current = id;
    sdragParent.current = parentid;
    sdragVis.current = vis;
    // console.log("drag-start", e.target.innerHTML);
    // console.log("pos-start", id + "-" + vis + "-" + parentid + "-" + position);
  };

  const dragEnter = (
    e: any,
    position: any,
    id: any,
    vis: any,
    parentid: any
  ) => {
    dragOverItem.current = position;
    edragId.current = id;
    edragParent.current = parentid;
    edragVis.current = vis;
    // console.log("drag-enter", e.target.innerHTML);
    // console.log("pos-enter", id + "-" + vis + "-" + parentid + "-" + position);
  };

  const drop = (e: any) => {
    if (
      sdragParent.current == edragParent.current &&
      sdragVis.current == edragVis.current
    ) {
      UpdateSort(
        sdragId.current,
        dragItem.current,
        sdragParent.current,
        sdragVis.current,
        edragId.current,
        dragOverItem.current,
        edragParent.current,
        edragVis.current
      );
      console.log("wdylogItem", dragItem.current);
      // console.log("wdylogOverItem", dragOverItem.current);
      const tempTableBody = [...tableBody];
      // console.log("wdylog", tempTableBody[dragOverItem.current]);
      const dragItemContent = tempTableBody[dragItem.current];
      tempTableBody.splice(dragItem.current, 1);
      tempTableBody.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      // console.log("wdylogARR", tempTableBody);
      setTableBody(tempTableBody);
    } else {
      const tempTableBody = [...tableBody];
      const dragItemContent = tempTableBody[dragItem.current];
      console.log("dragItem", dragItem.current);
      console.log("dragOverItem", dragOverItem.current);
      console.log("dragItemContent", dragItemContent);
    }
  };
  const dropChildren = (e: any, index: any, indexs?: any, indexss?: any) => {
    if (
      sdragParent.current == edragParent.current &&
      sdragVis.current == edragVis.current
    ) {
      UpdateSort(
        sdragId.current,
        dragItem.current,
        sdragParent.current,
        sdragVis.current,
        edragId.current,
        dragOverItem.current,
        edragParent.current,
        edragVis.current
      );
      console.log("wdylogItem", dragItem.current);
      console.log("wdylogOverItem", dragOverItem.current);

      const tempTableBody = [...tableBody];
      console.log("wdylog", tempTableBody[index].relation.children);
      let copyListItems = tempTableBody[index].relation.children;
      if (indexs != -1) {
        copyListItems =
          tempTableBody[index].relation.children[indexs].relation.children;
      }
      if (indexss != -1) {
        copyListItems =
          tempTableBody[index].relation.children[indexs].relation.children[
            indexss
          ].relation.children;
      }
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setTableBody(tempTableBody);
    }
  };
  const UpdateSort = async (
    sid: any,
    ssort: any,
    sparent: any,
    svis: any,
    eid: any,
    esort: any,
    eparent: any,
    evis: any
  ) => {
    try {
      let urisave = uri.split("?")[1]
        ? uri.split("?")[0] + "/sort?" + uri.split("?")[1]
        : uri + "/sort";
      let mth = "PUT";

      const raw = JSON.stringify({
        order: [
          {
            id: sid,
            sort: esort + 1,
            parent_id: sparent,
            visibility: svis,
          },
          {
            id: eid,
            sort: ssort + 1,
            parent_id: eparent,
            visibility: evis,
          },
        ],
      });

      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        // setloading(false);
        // refresDat(true);
      } else {
        // setloading(false);
      }
      return;
    } catch (error) {
      return;
    }
  };
  const onDeleted = async (id: any) => {
    try {
      let getuuri = GLOBALURI + "/" + id;

      const datauser: any = await FetchData(
        getuuri,
        "DELETE",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      // if (datauser?.code == "200") {
      //   console.log("Deleted successfully");
      //   props?.refresDat(true);
      // }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    setTableBody(data?.data);
  }, [data?.data]);
  // useEffect(() => {
  //   console.log("Parent", parentshow);
  // }, [parentshow]);

  return (
    <>
      {tableBody?.length > 0 ? (
        <>
          {tableBody.length > 0 || loading ? (
            <>
              <div className="w-full overflow-x-auto shadow-lg rounded-xl">
                <table className="table-auto min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="">
                      <td className="bgmaincolor w-[50px] px-2 py-1 font-bold rounded-tl-xl">
                        {""}
                      </td>
                      {data?.table?.map((row: any, i: any) => (
                        <td
                          key={i}
                          className={
                            "bgmaincolor text-white px-2 py-1 font-bold " +
                            (i === (data?.table?.length ?? 0) - 1 ? "rounded-tr-xl" : "")
                          }
                        >
                          {row.label}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableBody?.map((row: any, index: any) => (
                    <>
                      <tr
                        className={
                          (parentshow == row?.parent_id ? "hidden" : "") +
                          " focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc] cursor-pointer "
                        }
                        key={index}
                        onDragStart={(e) =>
                          dragStart(
                            e,
                            index,
                            row?.id,
                            row?.visibility,
                            row?.parent_id
                          )
                        }
                        onDragEnter={(e) =>
                          dragEnter(
                            e,
                            index,
                            row?.id,
                            row?.visibility,
                            row?.parent_id
                          )
                        }
                        onDragEnd={drop}
                        draggable
                      >
                        <td
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } px-1 py-0.5 border-b border-gray-100 text-xs`}
                        >
                          <div className="flex gap-1">
                            {isdeleted ? (
                              <>
                                <ModalConfirmationComponent
                                  onCheck={(e) => {
                                    if (e) {
                                      onDeleted(row?.id);
                                    }
                                  }}
                                />
                              </>
                            ) : (
                              <></>
                            )}
                            {isview ? (
                              <>
                                {isBtnView && (
                                  <button
                                    className="w-[21px] "
                                    onClick={() => {
                                      window.location.assign(
                                        window.location.search
                                          ? window.location.pathname +
                                              "" +
                                              window.location.search +
                                              "&data=" +
                                              row?.id
                                          : window.location.pathname +
                                              "" +
                                              "?data=" +
                                              row?.id
                                      );
                                    }}
                                  >
                                    <img
                                      src="/assets/images/apps/research.png"
                                      className="w-[21px]"
                                    />
                                  </button>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                            {isedit ? (
                              <>
                                {isBtnEdit && (
                                  <button
                                    className="w-[21px]"
                                    onClick={() => {
                                      window.location.assign(
                                        window.location.search
                                          ? window.location.pathname +
                                              "" +
                                              window.location.search +
                                              "&data=" +
                                              row?.id
                                          : window.location.pathname +
                                              "" +
                                              "?data=" +
                                              row?.id
                                      );
                                    }}
                                  >
                                    <img
                                      src="/assets/images/apps/edit.png"
                                      className="w-[21px]"
                                    />
                                  </button>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                            {row?.relation?.children ? (
                              <>
                                <div
                                  className={`cursor-pointer flex justify-center w-fit ${
                                    parentshow != row?.id ? "rotate-180" : ""
                                  }`}
                                  onClick={(e) => {
                                    if (parentshow == row?.id) {
                                      setparentshow(-99);
                                      setparentshowa(-99);
                                      setparentshowb(-99);
                                      setparentshowc(-99);
                                    } else {
                                      setparentshow(row?.id);
                                    }

                                    //console.log("click", e);
                                  }}
                                >
                                  <IconAcccourdion />
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </td>

                        {data.table.map((item: any, a: any) => {
                          return (
                            <td
                              className={`${
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } px-2 py-0.5 border-b border-gray-100 text-xs text-gray-700`}
                              key={item.key + "-" + a}
                            >
                              {typeof row[item.key] == "string" ||
                              typeof row[item.key] == "number" ? (
                                item?.is_html ? (
                                  <>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: row[item.key],
                                      }}
                                    />
                                  </>
                                ) : (
                                  <>{row[item.key]}</>
                                )
                              ) : row[item.key]?.value == 1 &&
                                typeof row[item.key] == "object" &&
                                item.key == "status" ? (
                                <img
                                  src="/assets/images/apps/checklist.png"
                                  className="w-[20px]"
                                />
                              ) : row[item.key]?.value == 0 &&
                                typeof row[item.key] == "object" &&
                                item.key == "status" ? (
                                <img
                                  src="/assets/images/apps/cross.png"
                                  className="w-[20px]"
                                />
                              ) : row[item.key]?.value == 1 &&
                                typeof row[item.key] == "object" ? (
                                row[item.key]?.label
                              ) : row[item.key]?.value == 0 &&
                                typeof row[item.key] == "object" ? (
                                row[item.key]?.label
                              ) : typeof row[item.key] == "object" &&
                                row[item.key]?.en ? (
                                row[item.key]?.en
                              ) : (
                                ""
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {row?.relation?.children ? (
                        <>
                          {row?.relation?.children.map(
                            (rows: any, indexs: any) => (
                              <>
                                <tr
                                  className={
                                    parentshow != rows?.parent_id
                                      ? "hidden"
                                      : ""
                                  }
                                  key={indexs}
                                  onDragStart={(e) =>
                                    dragStart(
                                      e,
                                      indexs,
                                      rows?.id,
                                      rows?.visibility,
                                      rows?.parent_id
                                    )
                                  }
                                  onDragEnter={(e) =>
                                    dragEnter(
                                      e,
                                      indexs,
                                      rows?.id,
                                      rows?.visibility,
                                      rows?.parent_id
                                    )
                                  }
                                  onDragEnd={(e) =>
                                    dropChildren(e, index, -1, -1)
                                  }
                                  draggable
                                >
                                  <td
                                    className={`${
                                      index % 2 == 0 ? "" : ""
                                    } pl-[20px] p-2 focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]`}
                                  >
                                    <div className="flex gap-2">
                                      {/* {rows?.parent_id} */}
                                      {isview ? (
                                        <>
                                          {/* <button
                                            className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                            onClick={() => {
                                              router.push(
                                                fullpath + "?data=" + rows?.id
                                              );
                                            }}
                                          >
                                            <i
                                              className="ri-eye-line"
                                              title="View"
                                            ></i>
                                          </button> */}
                                        </>
                                      ) : (
                                        <></>
                                      )}

                                      {rows?.is_edit || isedit ? (
                                        <>
                                          <button
                                            className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                            onClick={() => {
                                              window.location.assign(
                                                fullpath + "?data=" + rows?.id
                                              );
                                            }}
                                          >
                                            <i
                                              className="ri-file-edit-line"
                                              title="Edit"
                                            ></i>
                                          </button>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {rows?.relation?.children ? (
                                        <>
                                          <div
                                            className={`cursor-pointer flex justify-center w-fit ${
                                              parentshowa != rows?.id
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                            onClick={(e) => {
                                              if (parentshowa == rows?.id) {
                                                // setparentshow(-99);
                                                setparentshowa(-99);
                                                setparentshowb(-99);
                                                setparentshowc(-99);
                                              } else {
                                                // setparentshow(rows?.id);
                                                setparentshowa(rows?.id);
                                              }
                                              //console.log("click", e);
                                            }}
                                          >
                                            <IconAcccourdion />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className={`w-[24px] flex justify-center ${
                                              parentshow != row?.id
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                          ></div>
                                        </>
                                      )}

                                      {/* {rows?.is_need_approval ? (
                                        <>
                                          <button
                                            title="Approve"
                                            className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                            onClick={() => {}}
                                          >
                                            <i
                                              className="ri-ball-pen-fill"
                                              title="Approve"
                                            ></i>
                                          </button>
                                        </>
                                      ) : (
                                        <></>
                                      )} */}
                                    </div>
                                  </td>

                                  {data.table.map((item: any, a: any) => {
                                    return (
                                      <td
                                        className={`${
                                          index % 2 == 0 ? "" : ""
                                        } p-2 pl-[15px] `}
                                        key={item.key + "-" + a}
                                      >
                                        {typeof rows[item.key] == "string" ||
                                        typeof rows[item.key] == "number" ? (
                                          item?.is_html ? (
                                            <>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: rows[item.key],
                                                }}
                                              />
                                            </>
                                          ) : (
                                            <>{rows[item.key]}</>
                                          )
                                        ) : rows[item.key]?.value == 1 &&
                                          typeof rows[item.key] == "object" &&
                                          item.key == "status" ? (
                                          <img
                                            src="/assets/images/apps/checklist.png"
                                            className="w-[20px]"
                                          />
                                        ) : rows[item.key]?.value == 0 &&
                                          typeof rows[item.key] == "object" &&
                                          item.key == "status" ? (
                                          <img
                                            src="/assets/images/apps/cross.png"
                                            className="w-[20px]"
                                          />
                                        ) : rows[item.key]?.label &&
                                          typeof rows[item.key] == "object" ? (
                                          rows[item.key]?.label
                                        ) : typeof rows[item.key] == "object" &&
                                          rows[item.key]?.en ? (
                                          rows[item.key]?.en
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                                {rows?.relation?.children ? (
                                  <>
                                    {rows?.relation?.children.map(
                                      (rowss: any, indexss: any) => (
                                        <>
                                          <tr
                                            className={
                                              parentshowa != rowss?.parent_id
                                                ? "hidden"
                                                : ""
                                            }
                                            key={indexs}
                                            onDragStart={(e) =>
                                              dragStart(
                                                e,
                                                indexss,
                                                rowss?.id,
                                                rowss?.visibility,
                                                rowss?.parent_id
                                              )
                                            }
                                            onDragEnter={(e) =>
                                              dragEnter(
                                                e,
                                                indexss,
                                                rowss?.id,
                                                rowss?.visibility,
                                                rowss?.parent_id
                                              )
                                            }
                                            onDragEnd={(e) =>
                                              dropChildren(e, index, indexs, -1)
                                            }
                                            draggable
                                          >
                                            <td
                                              className={`bg-[#f9ffed] ${
                                                index % 2 == 0 ? "" : ""
                                              } pl-[25px]  p-2 `}
                                            >
                                              <div className="flex gap-2">
                                                {isview ? (
                                                  <>
                                                    {/* <button
                                                      className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                                      onClick={() => {
                                                        router.push(
                                                          fullpath +
                                                            "?data=" +
                                                            rowss?.id
                                                        );
                                                      }}
                                                    >
                                                      <i
                                                        className="ri-eye-line"
                                                        title="View"
                                                      ></i>
                                                    </button> */}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}

                                                {rowss?.is_edit || isedit ? (
                                                  <>
                                                    <button
                                                      className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                                      onClick={() => {
                                                        window.location.assign(
                                                          fullpath +
                                                            "?data=" +
                                                            rowss?.id
                                                        );
                                                      }}
                                                    >
                                                      <i
                                                        className="ri-file-edit-line"
                                                        title="Edit"
                                                      ></i>
                                                    </button>
                                                  </>
                                                ) : (
                                                  <></>
                                                )}

                                                {rowss?.is_need_approval ? (
                                                  <>
                                                    <button
                                                      title="Approve"
                                                      className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                                      onClick={() => {}}
                                                    >
                                                      <i
                                                        className="ri-ball-pen-fill"
                                                        title="Approve"
                                                      ></i>
                                                    </button>
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {rowss?.relation?.children ? (
                                                  <>
                                                    <div
                                                      className={`cursor-pointer flex justify-center w-fit ${
                                                        parentshowb != rowss?.id
                                                          ? "rotate-180"
                                                          : ""
                                                      }`}
                                                      onClick={(e) => {
                                                        if (
                                                          parentshowb ==
                                                          rowss?.id
                                                        ) {
                                                          setparentshowb(-99);
                                                          setparentshowc(-99);
                                                        } else {
                                                          setparentshowb(
                                                            rowss?.id
                                                          );
                                                        }
                                                        //console.log("click", e);
                                                      }}
                                                    >
                                                      <IconAcccourdion />
                                                    </div>
                                                  </>
                                                ) : (
                                                  <>
                                                    <div
                                                      className={`w-[24px] flex justify-center ${
                                                        parentshowb != rowss?.id
                                                          ? "rotate-180"
                                                          : ""
                                                      }`}
                                                    ></div>
                                                  </>
                                                )}
                                              </div>
                                            </td>

                                            {data.table.map(
                                              (item: any, a: any) => {
                                                return (
                                                  <td
                                                    className={`bg-[#f9ffed] ${
                                                      index % 2 == 0 ? "" : ""
                                                    } p-2 pl-[30px] `}
                                                    key={item.key + "-" + a}
                                                  >
                                                    {typeof rowss[item.key] ==
                                                      "string" ||
                                                    typeof rowss[item.key] ==
                                                      "number" ? (
                                                      item?.is_html ? (
                                                        <>
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                rowss[item.key],
                                                            }}
                                                          />
                                                        </>
                                                      ) : (
                                                        <>{rowss[item.key]}</>
                                                      )
                                                    ) : rowss[item.key]
                                                        ?.value == 1 &&
                                                      typeof rowss[item.key] ==
                                                        "object" &&
                                                      item.key == "status" ? (
                                                      <img
                                                        src="/assets/images/apps/checklist.png"
                                                        className="w-[20px]"
                                                      />
                                                    ) : rowss[item.key]
                                                        ?.value == 0 &&
                                                      typeof rowss[item.key] ==
                                                        "object" &&
                                                      item.key == "status" ? (
                                                      <img
                                                        src="/assets/images/apps/cross.png"
                                                        className="w-[20px]"
                                                      />
                                                    ) : rowss[item.key]
                                                        ?.label &&
                                                      typeof rowss[item.key] ==
                                                        "object" ? (
                                                      rowss[item.key]?.label
                                                    ) : typeof rowss[
                                                        item.key
                                                      ] == "object" &&
                                                      rowss[item.key]?.en ? (
                                                      rowss[item.key]?.en
                                                    ) : (
                                                      ""
                                                    )}
                                                  </td>
                                                );
                                              }
                                            )}
                                          </tr>
                                          {rowss?.relation?.children ? (
                                            <>
                                              {rowss?.relation?.children.map(
                                                (
                                                  rowsss: any,
                                                  indexsss: any
                                                ) => (
                                                  <>
                                                    <tr
                                                      className={
                                                        parentshowb !=
                                                        rowsss?.parent_id
                                                          ? "hidden"
                                                          : ""
                                                      }
                                                      key={indexs}
                                                      onDragStart={(e) =>
                                                        dragStart(
                                                          e,
                                                          indexsss,
                                                          rowsss?.id,
                                                          rowsss?.visibility,
                                                          rowsss?.parent_id
                                                        )
                                                      }
                                                      onDragEnter={(e) =>
                                                        dragEnter(
                                                          e,
                                                          indexsss,
                                                          rowsss?.id,
                                                          rowsss?.visibility,
                                                          rowsss?.parent_id
                                                        )
                                                      }
                                                      onDragEnd={(e) =>
                                                        dropChildren(
                                                          e,
                                                          index,
                                                          indexs,
                                                          indexss
                                                        )
                                                      }
                                                      draggable
                                                    >
                                                      <td
                                                        className={`bg-[#edf2fa] ${
                                                          index % 2 == 0
                                                            ? ""
                                                            : ""
                                                        } p-2 `}
                                                      >
                                                        <div className="flex gap-2">
                                                          {rowsss?.relation
                                                            ?.children ? (
                                                            <>
                                                              <div
                                                                className={`cursor-pointer flex justify-center w-fit ${
                                                                  parentshow !=
                                                                  rowsss?.id
                                                                    ? "rotate-180"
                                                                    : ""
                                                                }`}
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  if (
                                                                    parentshow ==
                                                                    rowsss?.id
                                                                  ) {
                                                                    setparentshow(
                                                                      -99
                                                                    );
                                                                  } else {
                                                                    setparentshow(
                                                                      rowsss?.id
                                                                    );
                                                                  }
                                                                  //console.log("click", e);
                                                                }}
                                                              >
                                                                <IconAcccourdion />
                                                              </div>
                                                            </>
                                                          ) : (
                                                            <>
                                                              <div
                                                                className={`w-[24px] flex justify-center ${
                                                                  parentshow !=
                                                                  rowsss?.id
                                                                    ? "rotate-180"
                                                                    : ""
                                                                }`}
                                                              ></div>
                                                            </>
                                                          )}

                                                          {isview ? (
                                                            <>
                                                              {/* <button
                                                                className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                                                onClick={() => {
                                                                  router.push(
                                                                    fullpath +
                                                                      "?data=" +
                                                                      rowsss?.id
                                                                  );
                                                                }}
                                                              >
                                                                <i
                                                                  className="ri-eye-line"
                                                                  title="View"
                                                                ></i>
                                                              </button> */}
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}

                                                          {rowsss?.is_edit ||
                                                          isedit ? (
                                                            <>
                                                              <button
                                                                className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                                                onClick={() => {
                                                                  window.location.assign(
                                                                    fullpath +
                                                                      "?data=" +
                                                                      rowsss?.id
                                                                  );
                                                                }}
                                                              >
                                                                <i
                                                                  className="ri-file-edit-line"
                                                                  title="Edit"
                                                                ></i>
                                                              </button>
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}

                                                          {rowsss?.is_need_approval ? (
                                                            <>
                                                              <button
                                                                title="Approve"
                                                                className="p-[3px] border-primary w-fit border text-primary rounded-md"
                                                                onClick={() => {}}
                                                              >
                                                                <i
                                                                  className="ri-ball-pen-fill"
                                                                  title="Approve"
                                                                ></i>
                                                              </button>
                                                            </>
                                                          ) : (
                                                            <></>
                                                          )}
                                                        </div>
                                                      </td>

                                                      {data.table.map(
                                                        (item: any, a: any) => {
                                                          return (
                                                            <td
                                                              className={`bg-[#edf2fa] ${
                                                                index % 2 == 0
                                                                  ? ""
                                                                  : ""
                                                              } p-2 pl-[30px] `}
                                                              key={
                                                                item.key +
                                                                "-" +
                                                                a
                                                              }
                                                            >
                                                              {typeof rowsss[
                                                                item.key
                                                              ] == "string" ||
                                                              typeof rowsss[
                                                                item.key
                                                              ] == "number" ? (
                                                                item?.is_html ? (
                                                                  <>
                                                                    <div
                                                                      dangerouslySetInnerHTML={{
                                                                        __html:
                                                                          rowsss[
                                                                            item
                                                                              .key
                                                                          ],
                                                                      }}
                                                                    />
                                                                  </>
                                                                ) : (
                                                                  <>
                                                                    {
                                                                      rowsss[
                                                                        item.key
                                                                      ]
                                                                    }
                                                                  </>
                                                                )
                                                              ) : rowsss[
                                                                  item.key
                                                                ]?.value == 1 &&
                                                                typeof rowsss[
                                                                  item.key
                                                                ] == "object" &&
                                                                item.key ==
                                                                  "status" ? (
                                                                <img
                                                                  src="/assets/images/apps/checklist.png"
                                                                  className="w-[20px]"
                                                                />
                                                              ) : rowsss[
                                                                  item.key
                                                                ]?.value == 0 &&
                                                                typeof rowsss[
                                                                  item.key
                                                                ] == "object" &&
                                                                item.key ==
                                                                  "status" ? (
                                                                <img
                                                                  src="/assets/images/apps/cross.png"
                                                                  className="w-[20px]"
                                                                />
                                                              ) : rowsss[
                                                                  item.key
                                                                ]?.label &&
                                                                typeof rowsss[
                                                                  item.key
                                                                ] ==
                                                                  "object" ? (
                                                                rowsss[item.key]
                                                                  ?.label
                                                              ) : typeof rowsss[
                                                                  item.key
                                                                ] == "object" &&
                                                                rowsss[item.key]
                                                                  ?.en ? (
                                                                rowsss[item.key]
                                                                  ?.en
                                                              ) : (
                                                                ""
                                                              )}
                                                            </td>
                                                          );
                                                        }
                                                      )}
                                                    </tr>
                                                  </>
                                                )
                                              )}
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      )
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 flex justify-center">Not Data</div>
            </>
          )}
        </>
      ) : (
        <>
          {loading ? (
            <>
              <div className="mt-8 flex justify-center">
                <IconSpiner />
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 flex justify-center">Not Data</div>
            </>
          )}
        </>
      )}
      <PaginationTable
        vnext={data?.pagination?.next}
        vprev={data?.pagination?.prev}
        vnextJump={data?.pagination?.next_jump}
        vprevjump={data?.pagination?.prev_jump}
        prev={prev}
        next={next}
        prevJump={prevJump}
        nextJump={nextJump}
        totalPage={data?.pagination?.end_paging}
        page={data?.pagination?.start_paging}
        totalData={data?.pagination?.total_data}
      />
    </>
  );
};

export default TableView;
