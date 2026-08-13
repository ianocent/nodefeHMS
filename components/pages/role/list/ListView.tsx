import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import ListPostViewModel from "./ListPostViewModel";
import SelectBase from "../../../common/input/SelectBase";
import Seo from "../../../common/seo";
import TableView from "../../../common/table";
import Tabs from "../../../common/tab";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt } from "../../../helper";
import { useDispatch, useSelector } from "react-redux";
import { LayoutContext } from "../../../../context/LayoutContext";
import InputMain from "../../../common/input/InputMain";

const ListView = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const layout = useContext(LayoutContext);

  const { filter, table, goToAddView } = ListPostViewModel();
  const [datatable, setdatatable] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [isloading, setIsloading] = useState<boolean>(false);

  const [path, setpath] = useState("");
  const [parentid, setparentid] = useState("0");
  const [ischildren, setischildren] = useState("1");
  const [dataval, setData] = useState<any>({
    search: "",
    statuses: [],
  });
  const { search, statuses } = dataval;
  const changeHandler = (e: any, b?: boolean, name?: string) => {
    if (!b) {
      setData({ ...dataval, [e.target.name]: e.target.value });
    } else {
      setData({ ...dataval, [name]: e });
    }
    // setError("");
  };
  const GetDataTable = async (i?: any, page?: number) => {
    try {
      setIsloading(true);
      let status = 0;
      if (i == 1) {
        status = 1;
      } else if (i == 2) {
        status = -1;
      }
      let pages = 1;
      if (page) {
        pages = page;
      }

      const datajson = await FetchData(
        "/cms/role?page=" + pages + "&name=" + search + "&trash=" + status,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setdatatable(datajson);
      if (datajson?.code == "200") {
        setIsloading(false);
      } else {
        setIsloading(false);
      }
      return;
    } catch (error) {
      setIsloading(false);
      // console.log("err", error);
      return;
    }
  };
  const prev = () => {
    // alert(1);
    if (datatable?.pagging?.prev) {
      GetDataTable(statuses?.value, datatable?.pagging?.prev);
    }
  };
  const next = () => {
    if (datatable?.pagging?.next) {
      GetDataTable(statuses?.value, datatable?.pagging?.next);
    }
  };
  const prevJump = () => {
    if (datatable?.pagging?.prev_jump) {
      GetDataTable(statuses?.value, datatable?.pagging?.prev_jump);
    }
  };
  const nextJump = () => {
    if (datatable?.pagging?.next_jump) {
      GetDataTable(statuses?.value, datatable?.pagging?.next_jump);
    }
  };
  useEffect(() => {
    GetDataTable();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const guestId = urlParams.get("data");
    if (guestId) {
      setischildren(guestId);
    }
    setparentid(parent);
    setpath(window.location.pathname.split("/")[2]);
  });

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        <Tabs active={path} idparent={parentid} ischildren={ischildren} />
        {datatable?.permission?.add == 1 ? (
          <>
            <ButtonAddList
              label="+ Add"
              title={"List " + layout?.title}
              onAdd={() => {
                router.push("/role/form");
              }}
            />
          </>
        ) : (
          <></>
        )}
        <div className="flex flex-col lg:flex-row gap-3 mt-4 mb-4 items-end">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
            <div className="w-full sm:w-[160px]">
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={""}
                required={true}
                options={[
                  { label: "Active", value: "1" },
                  { label: "In Active", value: "2" },
                ]}
                onChangeSel={(e: any) => {
                  changeHandler(e, true, "statuses");
                  GetDataTable(e.value);
                }}
                valueSel={statuses}
                isMulti={false}
                placeholder={"Status"}
              />
            </div>

            <div className="flex-1">
              <div className="input-group">
                <input
                  type="text"
                  name="search"
                  className="form-control form-control-lg !rounded-md"
                  placeholder="Search role name or code..."
                  onChange={changeHandler}
                  onKeyUp={(e: any) => {
                    changeHandler(e);
                    if (e.target?.value.length > 2) {
                      GetDataTable();
                    }
                  }}
                  value={search}
                />
                <button
                  onClick={() => GetDataTable()}
                  aria-label="button"
                  className="ti-btn ti-btn-light !rounded-s-none"
                  type="button"
                >
                  <i className="ri-search-eye-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 w-full table-auto">
          <TableView
            prev={prev}
            next={next}
            prevJump={prevJump}
            nextJump={nextJump}
            data={datatable}
            loading={isloading}
            uri={"/cms/role"}
          />
        </div>
      </PaperBase>
    </>
  );
};

export default ListView;
