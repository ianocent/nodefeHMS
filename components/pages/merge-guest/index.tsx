import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import InputBase from "../../common/input/InputBase";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import TableView from "../../common/table-edit";
import TableMergeGuest from "../../common/table-merge-guest";
import { FetchData, GetDecrypt, GetEncrypt } from "../../helper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormPermission } from "../../../hooks/useFormPermission";

const MergeGuest = () => {
  const GLOBALURI = "/cms/profile/guest";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataMain, setDataMain] = useState<any>();
  const [dataOther, setDataOther] = useState<any[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [toggleGetTable, setToggleGetTable] = useState<boolean>(false);
  const { canCreate, canUpdate } = useFormPermission(84);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
    // console.log("DATALOG", window.location.pathname.split("/"));
  });

  const mergeData = (main, other) => {
    let mergedData = { ...main }; // Create a copy of the main data

    // Iterate over the keys of the main data
    Object.keys(main).forEach((key) => {
      // If the value in the main data is null or an empty string, use the value from the other data
      if (
        (main[key] === null || main[key] === "") &&
        other[key] !== undefined
      ) {
        mergedData[key] = other[key];
      }
    });

    return mergedData;
  };

  const onDeleted = async (id: any) => {
    try {
      let getuuri = GLOBALURI + "/" + id;

      const datauser: any = await FetchData(
        getuuri,
        "PUT",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const transformData = (data) => {
    const newData = { ...data };

    // Daftar properti yang perlu diubah
    const propertiesToTransform = [
      "card_type",
      "status_profile",
      "gender",
      "nationality_id",
      "city_id",
      "country_id",
      "title",
      "region",
    ];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const handleMergeData = async () => {
    try {
      let mergeDatas = dataMain;
      dataOther.map((item) => {
        mergeDatas = mergeData(mergeDatas, item);
      });
      // const mergeDatas = mergeData(dataMain, dataOther);
      let urisave = GLOBALURI + "/" + dataMain?.id + "/merge";
      let mth = "PUT";
      const transformedData = transformData(mergeDatas);

      console.log(transformedData, "cek transformed data");

      const raw = JSON.stringify(transformedData);

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
        const profilesToUpdate = dataOther.map((item) => ({
          id: item.id,
          // Include any other fields required by your API
        }));

        // Call batch update API
        const batchUpdateUri = GLOBALURI + "/update-batch";
        const batchUpdateData = GetEncrypt(
          JSON.stringify({
            guest_profiles: profilesToUpdate,
            guest_updates: transformedData.id,
          })
        );

        const batchUpdateResult = await FetchData(
          batchUpdateUri,
          "POST",
          batchUpdateData,
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );

        if (batchUpdateResult?.code == "200") {
          setToggleGetTable(!toggleGetTable);
          setloading(false);
          // You might want to add a success message here
        } else {
          setloading(false);
          // Handle error for batch update
        }
      } else {
        setloading(false);
      }
    } catch (error) {
      setloading(false);
    }
  };

  function RouteInit() {
    return (
      <div className="mt-2 min-w-full table-auto ">
        <h3 className="font-semibold mb-2">Merge Guest</h3>
        <fieldset className="w-full border p-4 grid grid-cols-12 gap-2">
          {/* <legend className="ml-2">Filter</legend> */}
          <div className="col-span-5">
            <InputBase
              label="First Name"
              rest={{
                onChange: (e) => setFirstName(e.target.value),
                value: firstName,
              }}
              error={false}
            />
          </div>
          <div className="col-span-5">
            <InputBase
              label="Last Name"
              rest={{
                onChange: (e) => setLastName(e.target.value),
                value: lastName,
              }}
              error={false}
            />
          </div>
          <div className="col-span-2 items-end justify-end mt-[22px]">
            <ButtonSubmit
              label="Search"
              onCreate={() => setToggleGetTable(!toggleGetTable)}
              ClassCustome="w-full max-h-[34px]"
            />
          </div>
        </fieldset>
        <div className="w-full flex justify-end mt-[22px]">
          <div className="justify-end mb-5">
            <ButtonSubmit
              isBtnAdd={canCreate || canUpdate}
              label="Merge"
              onCreate={handleMergeData}
              ClassCustome=" max-h-[34px]  "
              loading={loading}
              disabled={!dataMain && !dataOther}
            />
          </div>
        </div>
        <fieldset className=" border p-2">
          <legend className="ml-2 font-semibold">Main Guest Selection</legend>
          <div className="h-[40px]"></div>
          <TableMergeGuest
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            queryString={
              "&trash=0" +
              "&status=1" +
              `${
                firstName.length > 0 || lastName.length > 0
                  ? "&search_field=" +
                    `${firstName.length > 0 ? "first_name;" : ""}` +
                    `${lastName.length > 0 ? "last_name" : ""}` +
                    "&search_value=" +
                    `${firstName.length > 0 ? `${firstName};` : ""}` +
                    `${lastName.length > 0 ? `${lastName};` : ""}` +
                    "&status=1"
                  : ""
              }`
            }
            checked={true}
            isBtnAdd={false}
            isTitle={false}
            setDataSelected={setDataMain}
            toggleGetTable={toggleGetTable}
            dataSelected={dataMain}
          />
        </fieldset>
        <fieldset className="border p-2 ">
          <legend className="ml-2 font-semibold">Other Guest Selection</legend>
          <div className="h-[40px]"></div>
          <TableMergeGuest
            groups={groups}
            uri={GLOBALURI}
            isEditTable={false}
            checked={true}
            queryString={
              "&trash=0" +
              "&status=1" +
              `${
                firstName.length > 0 || lastName.length > 0
                  ? "&search_field=" +
                    `${firstName.length > 0 ? "first_name;" : ""}` +
                    `${lastName.length > 0 ? "last_name" : ""}` +
                    "&search_value=" +
                    `${firstName.length > 0 ? `${firstName};` : ""}` +
                    `${lastName.length > 0 ? `${lastName};` : ""}` +
                    "&status=1"
                  : ""
              }`
            }
            isBtnAdd={false}
            isTitle={false}
            setDataMultiSelected={setDataOther}
            toggleGetTable={toggleGetTable}
            multi={true}
            dataSelected={dataMain}
          />
        </fieldset>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}
    </>
  );
};

export default MergeGuest;
