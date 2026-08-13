import React, { useState } from "react";
import {
  IconAdminstrator,
  IconBanner,
  IconContact,
  IconDashboard,
  IconGallery,
  IconNavigation,
  IconPages,
  IconPermission,
  IconPost,
  IconRole,
  IconSetting,
  IconUser,
  IconVacancy,
} from "../icon/SidebarIcon";

const LayoutComponentModel = () => {
  const [sidebar, setSidebar] = useState([
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <IconDashboard />,
      children: [],
    },
    {
      label: "Navigation Menu",
      link: "/navigation-menu",
      icon: <IconNavigation />,
      children: [],
    },
    {
      label: "Pages",
      link: "/pages",
      icon: <IconPages />,
      children: [],
    },
    {
      label: "post",
      link: "/post",
      icon: <IconPost />,
      children: [],
    },
    {
      label: "vacancy",
      link: "/vacancy",
      icon: <IconVacancy />,
      children: [],
    },
    {
      label: "gallery",
      link: "/gallery",
      icon: <IconGallery />,
      children: [],
    },
    {
      label: "banner",
      link: "/banner",
      icon: <IconBanner />,
      children: [],
    },
    {
      label: "contact",
      link: "/contact",
      icon: <IconContact />,
      children: [],
    },
    {
      label: "administrator",
      link: "/administrator",
      icon: <IconAdminstrator />,
      children: [
        {
          label: "User",
          link: "/administrator/user",
          icon: <IconUser />,
        },
        {
          label: "Role",
          link: "/administrator/Role",
          icon: <IconRole />,
        },
        {
          label: "Permission",
          link: "/administrator/permission",
          icon: <IconPermission />,
        },
      ],
    },
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <IconDashboard />,
      children: [],
    },
    {
      label: "settings",
      link: "/settings",
      icon: <IconSetting />,
      children: [],
    },
    {
      label: "Sign Out",
      link: "/sign-out",
      icon: <IconDashboard />,
      children: [],
    },
  ]);
  return {
    sidebar,
  };
};

export default LayoutComponentModel;
