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
  const [title, setTitle] = React.useState<string>("Dashboard");
  const [activeSideBarMobile, setActiveSideBarMobile] = React.useState(false);
  // Starts empty on purpose. The previous default was
  // [<IconHome/>, "Dashboard", "Default Dashboard"], and the header only ever
  // appended to it -- so any route reached before the header's effect ran (or
  // while it was skipped) rendered those three stale crumbs, which is what made
  // the header look stuck on "Reservation > Reservation > Choose property".
  const [breadcumbs, setBreadcumbs] = React.useState<{ label: any; href: string }[]>([]);
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
