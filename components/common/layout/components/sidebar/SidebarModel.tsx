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
  IconReport,
  IconRole,
  IconSetting,
  IconSignOut,
  IconUser,
  IconVacancy,
} from "../../../icon/SidebarIcon";

const SidebarModel = () => {
  const [sidebar, setSidebar] = useState([
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <IconDashboard />,
      active: false,
      children: [],
    },
    {
      label: "Navigation Menu",
      link: "/navigation-menu",
      icon: <IconNavigation />,
      active: false,
      children: [],
    },
    {
      label: "Pages",
      link: "/pages",
      icon: <IconPages />,
      active: false,
      children: [],
    },
    {
      label: "post",
      link: "/post",
      icon: <IconPost />,
      active: false,
      children: [],
    },
    {
      label: "vacancy",
      link: "/vacancy",
      icon: <IconVacancy />,
      active: false,
      children: [],
    },
    {
      label: "gallery",
      link: "/gallery",
      icon: <IconGallery />,
      active: false,
      children: [],
    },
    {
      label: "banner",
      link: "/banner",
      icon: <IconBanner />,
      active: false,
      children: [],
    },
    {
      label: "contact",
      link: "/contact",
      icon: <IconContact />,
      active: false,
      children: [],
    },
    {
      label: "administrator",
      link: "/administrator",
      icon: <IconAdminstrator />,
      active: false,
      children: [
        {
          label: "User",
          link: "/user",
          icon: <IconUser />,
        },
        {
          label: "Role",
          link: "/Role",
          icon: <IconRole />,
        },
        {
          label: "Permission",
          link: "/permission",
          icon: <IconPermission />,
        },
      ],
    },

    {
      label: "settings",
      link: "/settings",
      icon: <IconSetting />,
      active: false,
      children: [],
    },
    {
      label: "Report",
      link: "/reports",
      icon: <IconReport />,
      active: false,
      children: [],
    },
  ]);
  return {
    sidebar,
    setSidebar,
  };
};

export default SidebarModel;
