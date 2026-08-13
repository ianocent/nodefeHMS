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
import { useFormPermission } from "../../../../hooks/useFormPermission";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;

  const router = useRouter();

  const [loading, setloading] = useState(false);
  const path = router.pathname;
  const layout = { title: GetCapitalFirst(path.replace("/", "")) };
  const { canCreate, canUpdate } = useFormPermission(1150);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    room_type: {},
    status: true,
    linen_days: "0",
    max_pax: "",
    address_code: "",
    description: "",
    phone_ext: "",
    total_bed: "",
    room_id: "",
    with_tv: {},
    with_shower: {},
    sort: "",
    building: {},
    floor: {},
    room_configuration: [],
    cleaning_time: "",
    map_id: "",
  });

  const [idusr, setidusr] = useState("0");
  const [parent, setparent] = useState("0");

  const {
    room_type,
    name,
    status,
    linen_days,
    max_pax,
    address_code,
    description,
    phone_ext,
    total_bed,
    room_id,
    with_tv,
    with_shower,
    sort,
    building,
    floor,
    room_configuration,
    cleaning_time,
    map_id,
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
      if (i != 0) {
        datauser?.data?.room_configuration.forEach((element: any) => {
          arrconfigroom.push({ value: element?.value, label: element?.label });
        });
        let dataobj = {
          name: datauser?.data?.name,
          map_id: datauser?.data?.map_id,
          cleaning_time: datauser?.data?.cleaning_time,
          status: datauser?.data?.status,
          linen_days: datauser?.data?.linen_days,
          room_type: {
            value: datauser?.data?.room_type_id?.value,
            label: datauser?.data?.room_type_id?.label,
          },

          description: datauser?.data?.description,
          max_pax: datauser?.data?.max_pax,
          address_code: datauser?.data?.address_code,
          phone_ext: datauser?.data?.phone_ext,
          total_bed: datauser?.data?.total_bed,
          room_id: {
            value: datauser?.data?.room_id?.value,
            label: datauser?.data?.room_id?.label,
          },

          with_tv: {
            value: datauser?.data?.with_tv,
            label: datauser?.data?.with_tv == 1 ? "Yes" : "No",
          },

          with_shower: {
            value: datauser?.data?.with_shower,
            label: datauser?.data?.with_shower == 1 ? "Yes" : "No",
          },

          sort: datauser?.data?.sort,
          building: {
            value: datauser?.data?.building?.value,
            label: datauser?.data?.building?.label,
          },

          floor: {
            value: datauser?.data?.floor?.value,
            label: datauser?.data?.floor?.label,
          },

          room_configuration: arrconfigroom,
        };
        setData(dataobj);
      }

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
      if (room_configuration.length > 0) {
        room_configuration.forEach((element: any) => {
          roomconfigarr.push(element?.value);
        });
      }

      const raw = JSON.stringify({
        name: name,
        room_type_id: room_type?.value,
        status: status,
        linen_days: linen_days,
        with_tv: with_tv?.value,
        with_shower: with_shower?.value,
        max_pax: max_pax,
        address_code: address_code,
        phone_ext: phone_ext,
        total_bed: total_bed,
        room_id: room_id?.value,
        description: description,
        sort: sort,
        building: building?.value,
        floor: floor?.value,
        room_configuration_ids: roomconfigarr,
        cleaning_time: cleaning_time,
        map_id: map_id,
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
        ""
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        router.replace({
          pathname: window.location.pathname,
          query: { parent: parent },
        });
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
  useEffect(() => {
    console.log("wdy", data);
  }, [data]);
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
          <div className="col-span-6 grid grid-cols-12 h-fit  gap-2">
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
                required={false}
                rest={{
                  name: "linen_days",
                  placeholder: "Linen Days",
                  value: linen_days ?? "0",
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
                required={false}
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
                required={false}
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
                required={false}
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
                  typeInput={"select-multi"}
                  error={false}
                  label={"floor"}
                  required={true}
                  options={dataoption?.master?.floors}
                  onChangeSel={(e) => {
                    changeHandler(e, true, "floor");
                  }}
                  restSelect={{}}
                  valueSel={floor}
                  isMulti={false}
                />
              </div>
              <div className={"col-span-6"}>
                <InputMain
                  typeInput={"select-multi"}
                  error={false}
                  label={"building"}
                  required={true}
                  options={dataoption?.master?.buildings}
                  onChangeSel={(e) => {
                    changeHandler(e, true, "building");
                  }}
                  restSelect={{}}
                  valueSel={building}
                  isMulti={false}
                />
              </div>
            </div>

            <div className={"col-span-6"}>
              <InputMain
                typeInput={"textarea"}
                error={false}
                label={"Description "}
                required={false}
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
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Map Id "}
                required={true}
                rest={{
                  name: "map_id",
                  placeholder: "Input MapId",
                  value: map_id,
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
                label={"Address Code"}
                required={true}
                rest={{
                  name: "address_code",
                  placeholder: "Address Code",
                  value: address_code,
                  type: "text",
                  onChange: (e) => {
                    changeHandler(e);
                  },
                }}
              />
            </div>
          </div>
          <div className="col-span-6 grid grid-cols-12 h-fit  gap-2">
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Room Configuration"}
                required={false}
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
              isBtnAdd={canCreate || canUpdate}
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
