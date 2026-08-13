import ButtonAddList from "../../components/common/button/ButtonAddList";
import PaperBase from "../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../components/common/seo";
import TableView from "../../components/common/table";
import { useRouter } from "next/router";
import {
  FetchData,
  GetCapitalFirst,
  GetDecrypt,
} from "../../components/helper";
import { useDispatch, useSelector } from "react-redux";
import { LayoutContext } from "../../context/LayoutContext";
import InputMain from "../../components/common/input/InputMain";
import LayoutComponent from "../../components/common/layout/LayoutComponent";

const ListView = () => {
  const router = useRouter();
  const path = router.pathname;
  const dispatch = useDispatch();
  const layout = { title: GetCapitalFirst(path.replace("/", "")) };

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
        "/cms/company?page=" + pages + "&name=" + search + "&trash=" + status,
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
    <LayoutComponent>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        {datatable?.permission?.add == 1 ? (
          <>
            <ButtonAddList
              label="+ Add"
              title={"List Client"}
              onAdd={() => {
                router.push("/client/form");
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
          <TableView
            prev={prev}
            next={next}
            prevJump={prevJump}
            nextJump={nextJump}
            data={datatable}
            loading={isloading}
            uri={"/cms/client"}
          />
        </div>
      </PaperBase>
    </LayoutComponent>
  );
};

export default ListView;
