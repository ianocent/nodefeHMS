import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import InputMain from "../../../../components/common/input/InputMain";
import Seo from "../../../../components/common/seo";
import { FetchData, GetDecrypt, GetEncrypt } from "../../../../components/helper";
import { LayoutContext } from "../../../../context/LayoutContext";

interface AddviewProps {
  isview?: boolean;
}

const GLOBALURI = "/cms/content/loyalty-reward";

const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    property_id: "",
    name: "",
    description: "",
    points_cost: 0,
    image: "",
    stock: "",
    sort: 0,
    status: 1,
  });
  const [idusr, setidusr] = useState("0");

  const { property_id, name, description, points_cost, image, stock, sort, status } = data;

  const changeHandler = (e: any, b?: boolean, name?: string) => {
    if (!b) {
      setData({ ...data, [e.target.name]: e.target.value });
    } else {
      setData({ ...data, [name]: e });
    }
  };

  const GetDetailUser = async (i: any) => {
    try {
      let getuuri = GLOBALURI + "/" + i;
      if (i == 0) getuuri = GLOBALURI + "/create";
      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setData({
        property_id: datauser?.data?.property_id ?? "",
        name: datauser?.data?.name ?? "",
        description: datauser?.data?.description ?? "",
        points_cost: datauser?.data?.points_cost ?? 0,
        image: datauser?.data?.image ?? "",
        stock: datauser?.data?.stock ?? "",
        sort: datauser?.data?.sort ?? 0,
        status: datauser?.data?.status ?? 1,
      });
      setdataoption(datauser);
    } catch (error) {
      console.log(error);
    }
  };

  const OnSave = async () => {
    try {
      let urisave = GLOBALURI;
      let mth = "POST";

      const raw = JSON.stringify({
        property_id: property_id?.value ?? property_id,
        name: name,
        description: description,
        points_cost: points_cost,
        image: image,
        stock: stock === "" ? null : stock,
        sort: sort,
        status: status?.value ?? status,
      });

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr;
        mth = "PUT";
      }
      const saveprocess = await FetchData(
        urisave,
        mth,
        GetEncrypt(raw),
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      setloading(false);
      if (saveprocess?.code == 200 || saveprocess?.code == "200") {
        router.replace({
          pathname: window.location.pathname,
          query: { parent: "1091" },
        });
      }
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };

  const [parent, setparent] = useState("1091");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    if (idparent) setparent(idparent);
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
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") + " Reward"}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4">
          <div className="col-span-8 grid grid-cols-12 h-fit gap-2">
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Property"}
                required={false}
                options={dataoption?.master?.properties}
                onChangeSel={(e) => changeHandler(e, true, "property_id")}
                restSelect={{}}
                valueSel={property_id}
                isMulti={false}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Reward Name"}
                required={true}
                rest={{
                  name: "name",
                  placeholder: "Input Reward Name",
                  value: name,
                  type: "text",
                  onChange: (e) => changeHandler(e),
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Description"}
                required={false}
                rest={{
                  name: "description",
                  placeholder: "Input Description",
                  value: description,
                  type: "textarea",
                  onChange: (e) => changeHandler(e),
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Points Cost"}
                required={true}
                rest={{
                  name: "points_cost",
                  placeholder: "0",
                  value: points_cost,
                  type: "number",
                  onChange: (e) => changeHandler(e),
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Stock"}
                required={false}
                rest={{
                  name: "stock",
                  placeholder: "Input Stock",
                  value: stock,
                  type: "number",
                  onChange: (e) => changeHandler(e),
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Image"}
                required={false}
                rest={{
                  name: "image",
                  placeholder: "Input Image Path",
                  value: image,
                  type: "text",
                  onChange: (e) => changeHandler(e),
                }}
              />
            </div>
            <div className={"col-span-6"}>
              <InputMain
                typeInput={"base"}
                error={false}
                label={"Sort"}
                required={false}
                rest={{
                  name: "sort",
                  placeholder: "0",
                  value: sort,
                  type: "number",
                  onChange: (e) => changeHandler(e),
                }}
              />
            </div>
            <div className={"col-span-12"}>
              <InputMain
                typeInput={"select-multi"}
                error={false}
                label={"Status"}
                required={true}
                options={dataoption?.master?.statuses}
                onChangeSel={(e) => changeHandler(e, true, "status")}
                restSelect={{}}
                valueSel={status}
                isMulti={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
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