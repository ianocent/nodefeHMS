import React, { useContext, useEffect, useState } from "react";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  GetCapitalFirst,
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
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;

  const router = useRouter();

  const [loading, setloading] = useState(false);
  const path = router.pathname;
  const layout = { title: GetCapitalFirst(path.replace("/", "")) };

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    room_type: [],
    status: [],
    linen_days: "",
    max_pax: "",
    description: "",
    phone_ext: "",
    total_bed: "",
    room_id: "",
    with_tv: [],
    with_shower: [],
    sort: "",
    tower: "",
    floor: "",
    room_configuration: "",
    cleaning_time: "",
  });

  const [idusr, setidusr] = useState("0");
  const [parent, setparent] = useState("0");

  const {
    room_type,
    name,
    status,
    linen_days,
    max_pax,
    description,
    phone_ext,
    total_bed,
    room_id,
    with_tv,
    with_shower,
    sort,
    tower,
    floor,
    room_configuration,
    cleaning_time,
  } = data;
  const changeHandler = (
    e: any,
    b?: boolean,
    name?: string,
    ischeckbox?: boolean
  ) => {
    if (!b) {
      // console.log("yuks", e);
      setData({ ...data, [e.target.name]: e.target.value });
    } else {
      if (ischeckbox) {
        setData({ ...data, [name]: e.target.checked });
      } else {
        setData({ ...data, [name]: e });
      }
    }
    // setError("");
  };
  const GetDetailUser = async (i: any) => {
    try {
      let getuuri = "/cms/room/" + i + "/update";
      if (i == 0) {
        getuuri = "/cms/room/create";
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
      let arrconfigroom = [];
      datauser?.data?.relation?.configuration.forEach((element: any) => {
        arrconfigroom.push({ value: element?.id, label: element?.name });
      });
      let dataobj = {
        name: datauser?.data?.name,
        cleaning_time: datauser?.data?.cleaning_time,
        status: datauser?.data?.status,
        linen_days: datauser?.data?.linen_days,
        room_type: [
          {
            value: datauser?.data?.relation?.type?.id,
            label: datauser?.data?.relation?.type?.name,
          },
        ],
        description: datauser?.data?.description,
        max_pax: datauser?.data?.max_pax,
        phone_ext: datauser?.data?.phone_ext,
        total_bed: datauser?.data?.total_bed,
        room_id: [
          {
            value: datauser?.data?.relation?.room?.id,
            label: datauser?.data?.relation?.room?.name,
          },
        ],
        with_tv: [
          {
            value: datauser?.data?.with_tv,
            label: datauser?.data?.with_tv == 1 ? "Yes" : "No",
          },
        ],
        with_shower: [
          {
            value: datauser?.data?.with_shower,
            label: datauser?.data?.with_shower == 1 ? "Yes" : "No",
          },
        ],
        sort: datauser?.data?.sort,
        tower: datauser?.data?.tower,
        floor: datauser?.data?.floor,
        room_configuration: arrconfigroom,
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
      let urisave = "/cms/room";
      let mth = "POST";
      let roomconfigarr = [];
      room_configuration.forEach((element: any) => {
        roomconfigarr.push(element?.value);
      });
      const raw = JSON.stringify({
        name: name,
        room_type_id: room_type?.value,
        status: status?.value,
        linen_days: linen_days,
        with_tv: with_tv?.value,
        with_shower: with_shower?.value,
        max_pax: max_pax,
        phone_ext: phone_ext,
        total_bed: total_bed,
        room_id: room_id?.value,
        description: description,
        sort: sort,
        tower: tower,
        floor: floor,
        room_configuration_ids: roomconfigarr,
        cleaning_time: cleaning_time,
      });

      if (idusr != "0") {
        urisave = "/cms/room/" + idusr;
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
        window.location.href
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    setparent(idparent);
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
      <Seo title={"Management Room"} />

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
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Unit "}
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
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Cleaning Time "}
                required={true}
                rest={{
                  name: "cleaning_time",
                  placeholder: "Cleaning Time",
                  value: cleaning_time,
                  type: "time",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Room type"}
                required={true}
                options={dataoption?.master?.room_types}
                onChangeSel={(e) => {
                  changeHandler(e, true, "room_type");
                }}
                restSelect={{}}
                valueSel={room_type}
                isMulti={false}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Linen Days"}
                required={true}
                rest={{
                  name: "linen_days",
                  placeholder: "Linen Days",
                  value: linen_days,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Max Pax"}
                required={true}
                rest={{
                  name: "max_pax",
                  placeholder: "Max Pax",
                  value: max_pax,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Phone Ext"}
                required={true}
                rest={{
                  name: "phone_ext",
                  placeholder: "Phone Ext",
                  value: phone_ext,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Bed"}
                required={true}
                rest={{
                  name: "total_bed",
                  placeholder: "Bed",
                  value: total_bed,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>

            <div className={"col-span-6"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Interconnecting Room"}
                required={true}
                options={dataoption?.master?.rooms}
                onChangeSel={(e) => {
                  changeHandler(e, true, "room_id");
                }}
                restSelect={{}}
                valueSel={room_id}
                isMulti={false}
              />
            </div>
            <div className={"col-span-6 grid grid-cols-12 gap-2"}>
              <div className="col-span-6">
                <InputMain
                  typeInput={"select-multi"}
                  error={false}
                  label={"TV"}
                  required={true}
                  options={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },
                  ]}
                  onChangeSel={(e) => {
                    changeHandler(e, true, "with_tv");
                  }}
                  restSelect={{}}
                  valueSel={with_tv}
                  isMulti={false}
                />
              </div>
              <div className="col-span-6">
                <InputMain
                  typeInput={"select-multi"}
                  error={false}
                  label={"Shower"}
                  required={true}
                  options={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },
                  ]}
                  onChangeSel={(e) => {
                    changeHandler(e, true, "with_shower");
                  }}
                  restSelect={{}}
                  valueSel={with_shower}
                  isMulti={false}
                />
              </div>
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Sort Order"}
                required={true}
                rest={{
                  name: "sort",
                  placeholder: "Sort Order",
                  value: sort,
                  type: "number",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6 grid grid-cols-12 gap-2"}>
              <div className={"col-span-6"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"floor"}
                  required={true}
                  rest={{
                    name: "floor",
                    placeholder: "floor",
                    value: floor,
                    type: "number",
                    onChange: (e) => {
                      changeHandler(e);
                    },
                  }}
                />
              </div>
              <div className={"col-span-6"}>
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Tower"}
                  required={true}
                  rest={{
                    name: "tower",
                    placeholder: "Tower",
                    value: tower,
                    type: "number",
                    onChange: (e) => {
                      changeHandler(e);
                    },
                  }}
                />
              </div>
            </div>

            <div className={"col-span-6"}>
              <InputMain
                typeInput={"textarea"}
                error={false}
                label={"Description "}
                required={true}
                restArea={{
                  name: "description",
                  placeholder: "Input Description",
                  value: description,
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"checkbox"}
                error={false}
                label={"Status"}
                required={true}
                options={dataoption?.master?.statuses}
                onChangeSel={(e) => {
                  changeHandler(e, true, "status", true);
                }}
                restSelect={{}}
                valueSel={status}
                isMulti={false}
              />
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-12 h-fit  gap-2">
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Room Configuration"}
                required={true}
                options={dataoption?.master?.room_configurations}
                onChangeSel={(e) => {
                  changeHandler(e, true, "room_configuration");
                }}
                restSelect={{}}
                valueSel={room_configuration}
                isMulti={true}
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
                query: { parent: parent },
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
