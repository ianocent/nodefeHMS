import { IconHome } from "../components/common/icon/SidebarIcon";
import * as React from "react";
interface LayoutContextType {
  dataAuth: any;
  setdataAuth: any;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  breadcumbs: {
    label: any;
    href: string;
  }[];
  setBreadcumbs: any;
  activeSideBarMobile: boolean;
  setActiveSideBarMobile: React.Dispatch<React.SetStateAction<boolean>>;
}
export const LayoutContext = React.createContext<LayoutContextType | null>(
  null
);

const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataAuth, setdataAuth] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("Dashboard Default");
  const [activeSideBarMobile, setActiveSideBarMobile] = React.useState(false);
  const [breadcumbs, setBreadcumbs] = React.useState([
    {
      label: <IconHome />,
      href: "",
    },
    {
      label: "Dashboard",
      href: "",
    },
    {
      label: "Default Dashboard",
      href: "",
    },
  ]);
  // const [dataAuth, setdataAuth] = React.useState<any>(false);
  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        breadcumbs,
        setBreadcumbs,
        setActiveSideBarMobile,
        activeSideBarMobile,
        dataAuth,
        setdataAuth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
export default LayoutProvider;
