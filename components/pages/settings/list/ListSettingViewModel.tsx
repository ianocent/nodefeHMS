import {
  IconEmail,
  IconMaintenance,
  IconMarketPlace,
  IconMeta,
  IconShield,
  IconSite,
  IconSocialMedia,
} from "../../../../components/common/icon/SettingIcon";
import PaperBase from "../../../../components/common/paper/PaperBase";
import React, { useState } from "react";
import { InputSite } from "../data";
import Site from "./components/Site";
import SocialMedia from "./components/SocialMedia";

const ListSettingViewModel = () => {
  const [tabsSetting, setTabsSetting] = useState([
    {
      id: "site",
      label: "site",
      icon: <IconSite />,
      data: <Site group="site" />,
    },
    {
      id: "meta",
      label: "meta",
      icon: <IconMeta />,
      data: <Site group="seo" />,
    },
    {
      id: "marketplace",
      label: "marketplace",
      icon: <IconMarketPlace />,
      data: <Site group="apps" />,
    },
    {
      id: "social-media",
      label: "social media",
      icon: <IconSocialMedia />,
      data: <SocialMedia />,
    },
    {
      id: "email",
      label: "email",
      icon: <IconEmail />,
      data: <Site group="site" />,
    },
    {
      id: "shield",
      label: "shield",
      icon: <IconShield />,
      data: <Site group="site" />,
    },
    {
      id: "maintenance",
      label: "maintenance",
      icon: <IconMaintenance />,
      data: <Site group="site" />,
    },
  ]);
  const [activeTabSetting, setActiveTabSetting] = useState("site");

  const [input, setInput] = useState({
    site: InputSite,
  });

  return {
    tabsSetting,
    activeTabSetting,
    setActiveTabSetting,
    input,
  };
};

export default ListSettingViewModel;
