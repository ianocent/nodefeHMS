import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LayoutContext } from "../../../../context/LayoutContext";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import TableView from "../../../common/table-edit";
import {
    FetchData,
    GetDecrypt,
    GetEncrypt
} from "../../../helper";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const router = useRouter();
  // This one form is shared by all three phone-book-group tabs
  // (/concierge/phone-book-group, /group-2, /group-3). It used to hardcode
  // "/cms/profile/guest" - copy-pasted from the Guest form - so creating or editing a
  // Phone Group POSTed to the Guest endpoint and never produced a phone book group.
  // Derive the group from the current route instead.
  const path = router.asPath.split("?")[0];
  const groupNo = path.includes("group-2") ? 2 : path.includes("group-3") ? 3 : 1;
  const GLOBALURI = `/cms/concierge/phone-book-group-${groupNo}`;
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const [dataform, setdataform] = useState<any>([
    {
      name: "Phone Book Group",
      data: [
        {
          label: "Active",
          name: "status",
          type: "checkbox",
          cols: "col-span-12",
        },
        {
          label: "Name",
          name: "name",
          type: "text",
          cols: "col-span-12",
        },
        {
          label: "Parent Group",
          name: "parent_id",
          type: "select",
          cols: "col-span-12",
          options: [],
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  // const changeHandler = (
  //   e: any,
  //   b?: any,
  //   name?: string,
  //   ismulti?: boolean,
  //   options?: any
  // ) => {
  //   console.log("masuk gak");
  //   if (b == "text" || b == false || b == "number" || b == "textarea") {
  //     setData({ ...dataval, [e.target.name]: e.target.value });
  //   } else if (b == "select-multi" || ismulti) {
  //     let valarr = [];
  //     if (ismulti && e.target) {
  //       e.target.selectedOptions.forEach((element: any) => {
  //         valarr.push(element.value);
  //       });
  //     } else {
  //       valarr = e.map((option: any) => option.value);
  //     }
  //     setData({
  //       ...dataval,
  //       [name + "_ori"]: e,
  //       [name]: ismulti ? valarr : e.value,
  //     });
  //   } else if (b == "checkbox") {
  //     if (ismulti) {
  //       if (e.target.checked) {
  //         setData({ ...dataval, [e.target.value]: e.target.checked });
  //       }
  //       let valarr = [];
  //       options?.forEach((row: any) => {
  //         if (dataval[row.value]) {
  //           valarr.push(row.value);
  //         }
  //       });
  //       setData({ ...dataval, [name]: valarr });
  //     } else if (b == "select") {
  //       console.log("masuk gak");
  //       setData({ ...dataval, [name]: e });
  //     } else if (b == "select-multi" || ismulti) {
  //       let valarr = [];
  //       if (ismulti && e.target) {
  //         e.target.selectedOptions.forEach((element: any) => {
  //           valarr.push(element.value);
  //         });
  //       } else {
  //         valarr = e.map((option: any) => option.value);
  //       }
  //       setData({
  //         ...dataval,
  //         [name + "_ori"]: e,
  //         [name]: ismulti ? valarr : e.value,
  //       });
  //     } else {
  //       setData({ ...dataval, [name]: e.target.checked });
  //     }
  //   }
  //   // setError("");
  // };

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "select") {
      setData({ ...dataval, [name]: e.target.value });
    } else if (type === "checkbox") {
      setData({ ...dataval, [name]: e.target.checked });
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };
  const GetDetailUser = async (i: any) => {
    setuiddata(i);
    try {
      let getuuri = GLOBALURI + "/" + i + "/update";
      if (i == 0) {
        getuuri = GLOBALURI + "/create";
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

      setDataEd(datauser?.data);

      // Parent Group only applies to level 2 and 3 (the backend validates it as
      // required there), and its options come from the level above. A group
      // saved without `group` set is invisible in every tab, so the form and
      // the list have to agree on which level this page is.
      const parentOptions = (datauser?.master?.parent_groups ?? []).map(
        (row: any) => ({ value: row.id, label: row.name })
      );
      const dataInput = [...dataform];
      dataInput[0].data = dataInput[0].data
        .filter((row: any) => groupNo > 1 || row.name !== "parent_id")
        .map((row: any) =>
          row.name === "parent_id" ? { ...row, options: parentOptions } : row
        );
      if (groupNo === 1) {
        delete dataval.parent_id;
      }
      setdataform(dataInput);

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const OnSave = async () => {
    // console.log("widylog", dataval);
    try {
      let urisave = GLOBALURI;
      let mth = "POST";

      const raw = JSON.stringify(dataval);

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
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

  const [parent, setparent] = useState("0");
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

  console.log(dataval, "data val");

  return (
    <>
      <Seo title={"Management " + layout?.title} />

      <div className="flex flex-col gap-4">
        {isview ? (
          <div className="absolute h-full w-full bg-[rgba(0,0,0,0)] z-20"></div>
        ) : (
          <></>
        )}

        {/* <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold capitalize">
              {(idusr == "0" ? "Create" : isview ? "View" : "Edit") +
                " " +
                GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")}
            </h2>
          </div>
          <div className="col-span-8 h-fit"></div>
        </div> */}

        <div className="grid grid-cols-12 h-fit gap-4 ">
            <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
              <div className="col-span-12 ">
              <fieldset className="border">
                <legend className="ml-2">Main</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataform[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select_multiple") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div className={row?.cols}>
                        <InputMain
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
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
