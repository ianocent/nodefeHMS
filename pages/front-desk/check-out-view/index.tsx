import LayoutComponent from "../../../components/common/layout/LayoutComponent";
import React, { useEffect, useState } from "react";
import PaperBase from "../../../components/common/paper/PaperBase";
import { useRouter } from "next/router";
import {
  FetchData,
  GetDecrypt,
  GetQueryStr,
  GFormatDate,
} from "../../../components/helper";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../components/common/button/ButtonSubmit";

const CheckOutViewPage = () => {
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [folio, setFolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const folioId = GetQueryStr("data");

  const fetchFolio = async () => {
    if (!folioId || folioId === "0") return;
    setLoading(true);
    try {
      const res = await FetchData(
        "/cms/front-desk/" + folioId,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (res?.code === "200") {
        setFolio(res?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datalocal?.data?.access_token) {
      fetchFolio();
    }
  }, [folioId, datalocal]);

  const handleCheckOut = async () => {
    if (!folio) return;
    setProcessing(true);
    try {
      const raw = JSON.stringify({
        status_reservation: "check_out",
        reason: "Check Out via front desk",
      });
      const res = await FetchData(
        "/cms/reservation/update-status/" + folio.id,
        "POST",
        raw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (res?.code === "200") {
        router.back();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <LayoutComponent>
        <PaperBase>
          <div className="p-4 text-center">Loading...</div>
        </PaperBase>
      </LayoutComponent>
    );
  }

  if (!folio) {
    return (
      <LayoutComponent>
        <PaperBase>
          <div className="p-4 text-center text-gray-500">No folio selected</div>
        </PaperBase>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <PaperBase>
        <div className="p-4">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold">Check Out View</h1>
            <span className="text-sm text-gray-500">
              Folio: {folio?.folio_number}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Guest Name</label>
              <p className="font-semibold">{folio?.guest_name || "-"}</p>
            </div>
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Room</label>
              <p className="font-semibold">{folio?.room || "-"}</p>
            </div>
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Room Type</label>
              <p className="font-semibold">{folio?.room_type || "-"}</p>
            </div>
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Check In</label>
              <p className="font-semibold">
                {folio?.check_in_date ? GFormatDate(folio.check_in_date) : "-"}
              </p>
            </div>
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Check Out</label>
              <p className="font-semibold">
                {folio?.check_out_date
                  ? GFormatDate(folio.check_out_date)
                  : "-"}
              </p>
            </div>
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Company</label>
              <p className="font-semibold">{folio?.company || "-"}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 mb-6">
            <h2 className="font-bold mb-2">Bill Summary</h2>
            <div className="flex justify-between items-center">
              <span>Total Balance</span>
              <span
                className={
                  "text-xl font-bold " +
                  (parseFloat(folio?.balance?.replace(/[^0-9.-]/g, "") || "0") > 0
                    ? "text-red-600"
                    : "text-green-600")
                }
              >
                {folio?.balance || "0"}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <ButtonSubmit
              label="Back"
              isprimary={false}
              onCreate={() => router.back()}
            />
            <ButtonSubmit
              label={processing ? "Processing..." : "Confirm Check Out"}
              onCreate={handleCheckOut}
            />
          </div>
        </div>
      </PaperBase>
    </LayoutComponent>
  );
};

export default CheckOutViewPage;
