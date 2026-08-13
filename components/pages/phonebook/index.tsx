import ButtonAddList from "../../../components/common/button/ButtonAddList";
import PaperBase from "../../../components/common/paper/PaperBase";
import React, { useContext, useEffect, useState } from "react";
import Seo from "../../../components/common/seo";
import TableView from "../../../components/common/table-edit";
import { useSelector } from "react-redux";
import { FetchData, GetDecrypt } from "../../helper";
import { useRouter } from "next/router";
import TreeItem from "../../common/tree-item";

const PhoneBook = () => {
  const [GLOBALURI, SETGLOBALURI] = useState<string>(
    "/cms/concierge/phone-book"
  );
  const groups = "";
  const { isLogin } = useSelector((state: any) => state?.auth);
  const router = useRouter();
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [treeMenu, setTreeMenu] = useState<any[]>([]);
  const [groupActive, setGroupActive] = useState<number>(null);

  const GetMenus = async () => {
    const datamenu: any = await FetchData(
      "/cms/concierge/phone-book/tree",
      "GET",
      "",
      false,
      datalocal?.data?.access_token,
      router,
      ""
    );
    if (datamenu?.code == "200") {
      setTreeMenu(datamenu?.data);
    }
  };

  useEffect(() => {
    GetMenus();
  }, []);

  function RouteInit() {
    return (
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3 border border-[#323a50] p-3 rounded-md">
          {treeMenu?.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              setGroupActive={setGroupActive}
              groupActive={groupActive}
            />
          ))}
        </div>

        <div className="col-span-9 min-w-full table-auto">
          <TableView
            key={groupActive}
            groups={groups}
            uri={GLOBALURI}
            isEditTable={true}
            isBtnAdd={true}
            isDeleted={true}
            queryString={`&phone_book_group_id=` + groupActive}
          />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      {RouteInit()}
    </div>
  );
};

export default PhoneBook;
