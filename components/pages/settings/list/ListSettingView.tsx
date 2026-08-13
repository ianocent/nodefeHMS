import PaperBase from "../../../../components/common/paper/PaperBase";
import React from "react";
import ListSettingViewModel from "./ListSettingViewModel";
import Site from "./components/Site";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";

const ListSettingView = () => {
  const { tabsSetting, activeTabSetting, setActiveTabSetting, input } =
    ListSettingViewModel();
  return (
    <PaperBase>
      <div className="grid grid-cols-12">
        <div className="col-span-4 ">
          <h3 className="title-h3"> Settings</h3>
          <div className="flex flex-col gap-2 mt-4">
            {tabsSetting.map((tabs) => (
              <div
                onClick={() => setActiveTabSetting(tabs.id)}
                className={`flex gap-2 items-center cursor-pointer ${
                  activeTabSetting == tabs.id ? "" : "opacity-40"
                }`}
              >
                <div>{tabs.icon}</div>
                <div className="font-bold capitalize">{tabs.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-8">
          {tabsSetting.map(
            (tabData) => tabData.id == activeTabSetting && tabData.data
          )}
        </div>
      </div>
    </PaperBase>
  );
};

export default ListSettingView;
