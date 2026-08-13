import ButtonAddList from "../../../common/button/ButtonAddList";
import PaperBase from "../../../common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-drag";
import { useRouter } from "next/router";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../helper";
import { useDispatch, useSelector } from "react-redux";
import { LayoutContext } from "../../../../context/LayoutContext";
import InputMain from "../../../common/input/InputMain";

const ListView = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const layout = useContext(LayoutContext);

  const [datatable, setdatatable] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [isloading, setIsloading] = useState<boolean>(false);

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
        "/cms/menu?page=" +
          pages +
          "&limit=100&name=" +
          search +
          "&trash=" +
          status,
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

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        {datatable?.permission?.add == 1 ? (
          <>
            <ButtonAddList
              label="+ Add"
              title={"List " + layout?.title}
              onAdd={() => {
                router.push("/navigation-menu/form");
              }}
            />
          </>
        ) : (
          <></>
        )}
        <div className="w-full flex justify-end">
          <div className="flex w-1/3 gap-2 mt-4 mb-2 ">
            <div className="w-[150px]">
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
                restSelect={{}}
                valueSel={statuses}
                isMulti={false}
                placeholder={"Status"}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="search"
                className="form-control form-control-lg  !rounded-md"
                id="search"
                onChange={changeHandler}
                onKeyUp={(e: any) => {
                  changeHandler(e);
                  if (e.target?.value.length > 3) {
                    GetDataTable();
                  }
                }}
                value={search}
              />
              <button
                onClick={() => {
                  GetDataTable();
                }}
                aria-label="button"
                className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                type="button"
                id="button-addon2"
              >
                <i className="ri-search-eye-line"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2 w-full table-auto">
          {!isloading ? (
            <TableView
              prev={prev}
              next={next}
              prevJump={prevJump}
              nextJump={nextJump}
              data={datatable}
              loading={isloading}
              uri={"/cms/menu"}
            />
          ) : (
            <></>
          )}
        </div>
      </PaperBase>
    </>
  );
};

export default ListView;
