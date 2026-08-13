import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import React from "react";
interface notifProps {
  notif: any;
}
const Notification = (props: notifProps) => {
  return (
    <>
      <div
        onClick={() => {
          window.location.assign("/module/notification");
        }}
        className=" cursor-pointer w-[36px] h-[36px] flex items-center justify-center bg-[#F4F7F9] rounded-full"
      >
        <span className="relative">
          <svg
            className="fill-textmuted dark:fill-textmuted/50 w-7 h-7 text-[2rem]"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
          </svg>
          <span className="badge !rounded-full bg-success text-white absolute -end-2 -top-2">
            {props.notif}
          </span>
        </span>
      </div>
    </>
  );
};

export default Notification;
