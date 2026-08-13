import React, { useEffect, useState } from "react";
import { FetchData, GetDecrypt } from "../../../../helper/index";
import { useSelector } from "react-redux";

const StaahWebhookNotification = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = datalocal?.data?.access_token;
        if (!token) return;

        const res: any = await FetchData(
          "/cms/staah-reservation?search=PENDING",
          "GET",
          "",
          false,
          token,
          null,
          "",
          true
        );

        if (res && res.code == 200) {
          setPendingCount(res.total_data || 0);
        }
      } catch (e) {
        console.log("Error fetching staah notifs", e);
      }
    };

    fetchPending();
    const interval = setInterval(fetchPending, 60000); // every minute
    return () => clearInterval(interval);
  }, [datalocal?.data?.access_token]);

  return (
    <div
      onClick={() => {
        window.location.assign("/module/staah-reservation");
      }}
      className="cursor-pointer w-[36px] h-[36px] flex items-center justify-center bg-[#F4F7F9] rounded-full relative"
      title="Staah Webhook Reservations"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#EA580C"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      {pendingCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
          {pendingCount}
        </div>
      )}
    </div>
  );
};

export default StaahWebhookNotification;
