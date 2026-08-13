import React, { useEffect, useState } from "react";
import PaperBase from "../../../components/common/paper/PaperBase";
import Seo from "../../../components/common/seo";
import { useRouter } from "next/router";
import {
  FetchData,
  GetDecrypt,
  GetQueryParam,
} from "../../../components/helper";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";
import LayoutComponent from "../../../components/common/layout/LayoutComponent";

const UserView = () => {
  const routers = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataDetail, setDataDetail] = useState<any>(null);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  const toTitleCase = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const GetDetailUser = async (id: any) => {
    try {
      setLoading(true);
      const response = await FetchData(
        `/cms/user/${id}`,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        routers,
        ""
      );
      setDataDetail(response?.data || response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value == null || value === "") return <span className="text-gray-400 capitalize">-</span>;

    if (typeof value === "boolean") {
      return value ? (
        <span className="text-green-600 font-medium capitalize">Active</span>
      ) : (
        <span className="text-red-600 font-medium capitalize">Inactive</span>
      );
    }

    if (typeof value === "string" || typeof value === "number") {
      return <span className="font-medium">{value}</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400 ">Empty</span>;
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm capitalize"
            >
              {item?.label || String(item)}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === "object" && value?.label) {
      return <span className="font-medium capitalize">{value.label}</span>;
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="space-y-3 mt-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-semibold text-gray-600 capitalize">{toTitleCase(k)}:</span>
              <div className="ml-4 mt-1 capitalize">{renderValue(v)}</div>
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  useEffect(() => {
    const idreq = GetQueryParam(2);
    if (idreq) GetDetailUser(idreq);
  }, []);

  return (
    <LayoutComponent>
      <Seo title="View User" />
      <PaperBase>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed pb-4">
            <div className="col-span-12">
              <h2 className="text-lg font-bold">View User</h2>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading</div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Name
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.name)}
                </div>
              </div>

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Username
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.username)}
                </div>
              </div>

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Email
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.email)}
                </div>
              </div>

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Phone
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.phone)}
                </div>
              </div>

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Role
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.roles || dataDetail?.relation?.roles)}
                </div>
              </div>

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Company
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.companies || dataDetail?.relation?.companies)}
                </div>
              </div>

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Property
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.properties || dataDetail?.relation?.properties)}
                </div>
              </div>

              {/* <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Pin End Shift
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  you cant bro :)
                </div>
              </div> */}

              <div className={"col-span-6"}>
                <label className="font-bold capitalize text-[14px] leading-[19px]">
                  Status
                </label>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[46px]">
                  {renderValue(dataDetail?.status)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <ButtonSubmit
            isprimary={false}
            onCreate={() => routers.push("/user")}
            label="Back to List"
          />
        </div>
      </PaperBase>
    </LayoutComponent>
  );
};

export default UserView;