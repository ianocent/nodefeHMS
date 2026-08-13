import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import LayoutComponent from "../../../common/layout/LayoutComponent";
interface AddviewProps {
  isview?: boolean;
  groups?: string;
}
const AddView = (props: AddviewProps) => {
  const Lastpath = window.location.pathname.split("/").pop();
  const { isview = false, groups } = props;
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [group, setgroup] = useState("");
  const [data, setData] = useState<any>({
    name: "",
    room_type_grouping: [],

    status: [],
    country: [],
    expired: "",
    description: "",
    pic: "",
    ip: "",
  });

  const [idusr, setidusr] = useState("0");

  const {
    room_type_grouping,
    name,
    status,
    country,
    expired,
    description,
    pic,
    ip,
  } = data;
  const changeHandler = (e: any, b?: boolean, name?: string) => {
    if (!b) {
      setData({ ...data, [e.target.name]: e.target.value });
    } else {
      setData({ ...data, [name]: e });
    }
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const group = urlParams.get("group");
      let getuuri = "/cms/setup/" + i + "?group=" + group + "";
      if (i == 0) {
        getuuri = "/cms/setup/create";
      }
      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      let dataobj = {
        name: datauser?.data?.name,
        status: datauser?.data?.status,
        rate: datauser?.data?.rate,
        room_type_grouping: datauser?.data?.room_type_grouping,
        description: datauser?.data?.description,
        pic: datauser?.data?.pic_name,
        ip: datauser?.data?.ip,
      };
      setData(dataobj);
      setdataoption(datauser);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const group = urlParams.get("group");
      let urisave = "/cms/setup?group=" + group;
      let mth = "POST";

      const raw = JSON.stringify({
        name: name,
        room_type_grouping: room_type_grouping?.value,
        status: status?.value,
        country_id: country?.value,

        description: description,
      });

      if (idusr != "0") {
        urisave = "/cms/setup/" + idusr + "?group=" + group;
        mth = "PUT";
      }
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave,
        mth,
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        "/setup?group=" + group
      );
      if (saveprocess?.code == "200") {
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };
  const [parent, setparent] = useState("0");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    setparent(idparent);
    const group = urlParams.get("group");
    setgroup(group);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  return (
    <>
      <Seo title={"Management " + Lastpath.replaceAll("_", "")} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") + " Room"}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-8 grid grid-cols-12 h-fit  gap-2">
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Name "}
                required={true}
                rest={{
                  name: "name",
                  placeholder: "Input Name",
                  value: name,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Description"}
                required={true}
                rest={{
                  name: "description",
                  placeholder: "Input Description",
                  value: description,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>

            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Status"}
                required={true}
                rest={{
                  name: "description",
                  placeholder: "Input Description",
                  value: status ? "Active" : "Inactive",
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              router.replace({
                pathname: window.location.pathname,
                query: {
                  parent: parent,
                  module: new URLSearchParams(window.location.search).get(
                    "module"
                  ),
                },
              });
            }}
            loading={loading}
            label="Cancel"
            isprimary={false}
          />
          {isview ? (
            <></>
          ) : (
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AddView;
