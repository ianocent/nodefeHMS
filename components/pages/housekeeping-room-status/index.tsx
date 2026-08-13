// housekeeping_roomstatuslist.tsx
import ButtonAddList from "../../common/button/ButtonAddList";
import PaperBase from "../../common/paper/PaperBase";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";
import InputMain from "../../common/input/InputMain";
import {
  FetchData,
  GetCurrentDate,
  GetDecrypt,
  GetEncrypt,
} from "../../helper";
import { useRouter } from "next/router";
import AddPage from "./form";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { dataForm } from "../administrator/permission/data";
import { toast } from "react-toastify";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { useTransactionPermission } from "../../../hooks/useFormPermission";

const HouseKeepingRoomStatus = () => {
  const GLOBALURI = "/cms/housekeeping/room-status";
  const groups = "";
  const [parentid, setparentid] = useState("0");
  const [add, setadd] = useState("0");
  const [view, setview] = useState("0");
  const [dateSearch, setDateSearch] = useState<any>(GetCurrentDate());
  const [queryStr, setqueryStr] = useState("");
  const router = useRouter();
  const [dataval, setData] = useState<any>({});
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [loading, setloading] = useState(false);
  const canCleanAllRooms = useTransactionPermission("clean_all_room");
  const canAssignHousekeeper = useTransactionPermission("assign_housekeeper");
  
  const getUserRoles = () => {
    const roles = [...(datalocal?.data?.role || [])];
    return roles.map((r: any) => 
      String(r?.name || r?.NAME || r?.pivot?.name || r || '')
        .toLowerCase()
        .trim()
    );
  };
  const [datavala, setDataa] = useState<any>({date: GetCurrentDate()});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [housekeeperData, setHousekeeperData] = useState<any>();
  const [currentHousekeepers, setCurrentHousekeepers] = useState<any[]>([]);
  const [selectedHousekeeper, setSelectedHousekeeper] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const dataMulRef = useRef<any>(null);
  const [refreshHandler, setRefreshHandler] = useState<number>(0);
  const [dataform, setdataform] = useState([
    {
      name: "main",
      data: [
        {
          label: "Date",
          name: "date",
          type: "date",
          cols: "col-span-3",
          options: [{}],
          ismulti: false,
        },
        {
          label: "Clean Status",
          name: "maid_status",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Status",
          name: "room_status",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Floor",
          name: "floor",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Tower",
          name: "building",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: true,
        },
        {
          label: "Room Type",
          name: "room_type",
          type: "select-multi",
          cols: "col-span-3",
          options: [{}],
          ismulti: true,
        },
      ],
    },
  ]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parent = urlParams.get("parent");
    const add = urlParams.get("add");
    const view = urlParams.get("view");
    setparentid(parent);
    setadd(add);
    setview(view);
  });

  useEffect(() => {
    getMaster();
  }, []);

  const getHousekeeperData = async () => {
    try {
      let getuuri = `/cms/housekeeping/room-status/current-housekeepers?date=${dataval?.date ?? "0"}`;

      const response: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (response?.code === 200) {
        setHousekeeperData(response.data || []);
      } else {
        setHousekeeperData([]);
      }
    } catch (error) {
      console.log("Error fetching current housekeepers:", error);
      setHousekeeperData([]);
    }
  };

  useEffect(() => {
    if (isOpen && dataval.date) {
      getHousekeeperData();
    }
  }, [isOpen, dataval.date]);

  const getMaster = async () => {
    try {
      let getuuri = GLOBALURI + "/master";
      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      let dataInput = [...dataform];
      dataInput[0].data[1].options = datauser?.master?.maidStatuses;
      dataInput[0].data[2].options = datauser?.master?.roomStatuses;
      dataInput[0].data[3].options = datauser?.master?.floor;
      dataInput[0].data[4].options = datauser?.master?.builder;
      dataInput[0].data[5].options = datauser?.master?.roomTypes;

      setData({ ...dataval, date: datauser?.master?.business_date });

      setdataform([...dataInput]);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const changeHandler = (
    e: any,
    b?: any,
    name?: string,
    ismulti?: boolean,
    options?: any
  ) => {
    setqueryStr("");
    let qStr = "";
    if (
      b == "text" ||
      b == false ||
      b == "number" ||
      b == "textarea" ||
      b == "date"
    ) {
      setData({ ...dataval, [e.target.name]: e.target.value });
      qStr = "&" + e.target.name + "=" + e?.target?.value;
    } else if (b == "select-multi" || b == true) {
      let valarr = [];
      if (ismulti) {
        e?.forEach((element: any) => {
          valarr.push(element?.value);
        });
      }
      setData({
        ...dataval,
        [name + "_ori"]: e,
        [name]: ismulti ? valarr : e?.value,
      });
      // qStr = qStr + "&" + name + "=" + e?.value;
      qStr = qStr + "&" + name + "=" + valarr.join(",");
    } else if (b == "checkbox") {
      if (ismulti) {
        if (e.target.checked == true) {
          setData({ ...dataval, [e.target.value]: e.target.checked });
          qStr = "&" + e.target.value + "=" + e.target.checked;
        }
        let valarr = [];
        options?.map((row) => {
          if (dataval[row?.value]) {
            valarr.push(row?.value);
          }
        });
        setData({ ...dataval, [name]: valarr });
      } else {
        setData({ ...dataval, [name]: e.target.checked });
        qStr = "&" + name + "=" + e.target.checked;
      }
    }

    var objVal = Object.keys(dataval);
    objVal?.map((val) => {
      if (dataval[val]) {
        if (val != name && val != e?.target?.name && val != e?.target?.value) {
          console.log("bs", val + "-" + name);
          qStr = "&" + val + "=" + dataval[val] + qStr;
        }
      }
    });
    setqueryStr(qStr);
    // setIsload(true);
    const raw = JSON.stringify(dataval);
    const aesraw = GetEncrypt(raw);
    router.replace({
      pathname: window.location.pathname,
      query: {
        parent: parentid,
        req: 1,
        body: aesraw,
      },
    });
  };

  useEffect(() => {
    if (dataMulRef.current !== null) {
      setSelectedRoom(dataMulRef.current);
    }
  }, [dataMulRef.current]);

  const uriClean = async () => {
      try {
        let getuuri = "/middleware/room/clean-from-dirty?client_uid=" + datalocal?.NameProperty;
        const getClean = await FetchData(
          getuuri,
          "GET",
          "",
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );
        if (getClean?.code == "200") {
          setloading(false);
          router.replace({ pathname: "/house-keeping/room-status", query: { parent: 172 } });
        } else {
          setloading(false);
        }
        setloading(false);
      } catch (error) {
        console.log("erro", error);
        setloading(false);
      }
    };

  function filterCom(dataMul?: any) {
    dataMulRef.current = dataMul;
    setSelectedRoom(dataMul);
    return (
      <>
        <fieldset className="mb-2">
          <legend>Filter</legend>
          <div className="sm:grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mr-2">
            <div className="col-span-12">
              <div className="sm:grid grid-cols-12 h-fit gap-4  mb-4 mt-4 mr-2">
                {dataform[0].data?.map((row: any) => (
                  <div
                    className={
                      row?.cols +
                      (row?.type == "checkbox" && row?.name != "fields"
                        ? " border  border-dashed !border-blue rounded-md p-2 "
                        : "")
                    }
                  >
                    <InputMain
                      typeInput={
                        row?.type == "text" ||
                        row?.type == "number" ||
                        row?.type == "date"
                          ? "base"
                          : row?.type
                      }
                      error={false}
                      required={true}
                      label={row?.label}
                      rest={{
                        name: row?.name,
                        placeholder: row?.label,
                        value: dataval[row?.name] ?? dataval[row?.name],
                        type: row?.type,
                        onChange: (e) => {
                          changeHandler(e, row?.type, row?.name);
                        },
                        min: row?.mindate,
                      }}
                      restArea={{
                        placeholder: row?.label,
                        name: row?.name,
                        value: dataval[row?.name] ?? dataval[row?.name],
                        onChange: (e) => {
                          changeHandler(e, row?.type, row?.name);
                        },
                      }}
                      onChangeSel={(e) => {
                        changeHandler(
                          e,
                          row?.type,
                          row?.name,
                          row?.ismulti,
                          row?.options
                        );
                      }}
                      valueSel={
                        dataval[row?.name + "_ori"] ?? dataval[row?.name]
                      }
                      options={row?.options}
                      isMulti={row?.ismulti}
                      valuename={"b" + row?.name}
                      colspan={row?.isOneColumn ? "col-span-12" : "0"}
                      isAll={row?.isAll}
                      valMulti={dataval}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </fieldset>
        {canAssignHousekeeper && (
          <div className="-mb-4 mt-4">
            <ButtonAddList 
              label="Assign Housekeeper" 
              title="" 
              onAdd={onOpen} 
            />
          </div>
        )}
      </>
    );
  }

  function RouteInit() {
    if (view == "1") {
      return <AddPage isview={true} />;
    } else {
      return (
        <div className="mt-2 min-w-full table-auto">
          {canCleanAllRooms && (
            <div className="mb-5">
              <ButtonSubmit
                onCreate={() => {
                  uriClean();
                }}
                label="Clean All Rooms"
                isprimary={true}
              />
          </div>
          )}
          <TableView
            groups={groups}
            uri={GLOBALURI}
            isEditTable={true}
            isBtnEdit={false}
            isBtnDelete={false}
            queryString={`&date=${dataval.date}${
              dataval.maid_status && dataval.maid_status.length
                ? "&maid_status=" + dataval.maid_status.join(",")
                : ""
            }${
              dataval.room_status && dataval.room_status.length
                ? "&room_status=" + dataval.room_status.join(",")
                : ""
            }${
              dataval.floor && dataval.floor.length
                ? "&floor=" + dataval.floor.join(",")
                : ""
            }${
              dataval.building && dataval.building.length
                ? "&building=" + dataval.building.join(",")
                : ""
            }${
              dataval.room_type && dataval.room_type.length
                ? "&room_type=" + dataval.room_type.join(",")
                : ""
            }`}
            isBtnAdd={false}
            // isAdvance={true}
            filterProps={filterCom}
            checked={true}
            btnSave={false}
            key={refreshHandler}
          />
        </div>
      );
    }
  }

  const handleCheckboxChange = (item: any) => {
    setSelectedHousekeeper((prev) =>
      prev.some((hk) => hk.value === item.value)
        ? prev.filter((hk) => hk.value !== item.value)
        : [...prev, item]
    );
  };

  const handleSaveSelection = async () => {
    if (setSelectedHousekeeper.length === 0) {
      toast.error("Please select at least one report.");
      return;
    }

    const data = {
      housekeeper: selectedHousekeeper,
      selectedRoomId: selectedRoom,
      date: dataval.date,
    };

    const raw = JSON.stringify(data);
    const aesraw = GetEncrypt(raw);

    try {
      const result = await FetchData(
        "/cms/housekeeping/room-status/batch",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (result) {
        onClose();
        setSelectedHousekeeper([]);
        setSelectedRoom({});
        setRefreshHandler(refreshHandler + 1);
        // Optionally, you can refresh the main table data here
      }
    } catch (error) {
      console.error("Error saving batch report:", error);
    }
  };

  return (
    <>
      <Seo
        title={
          "Management " +
          GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />
      {dataval?.date && <> {RouteInit()}</>}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          body: "py-6 px-8 gap-4 justify-center",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#ffffff]  text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent className="rounded-lg">
          <ModalHeader className="flex flex-col gap-1">
            Assign Housekeeper
          </ModalHeader>
          <ModalBody>
            <table className="table-auto min-w-full">
              <thead>
                <tr>
                  <th className="bg-[#323A50] text-white p-2 font-bold text-center">
                    Housekeeper
                  </th>
                  <th className="bg-[#323A50] text-white p-2 font-bold text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {housekeeperData?.map((hk, index) => (
                  <tr
                    key={index}
                    className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]"
                  >
                    <td className="p-2 text-center font-medium">{hk?.label}</td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedHousekeeper.some(
                          (item) => item?.value === hk?.value
                        )}
                        onChange={() => handleCheckboxChange(hk)}
                        className="form-checkbox h-5 w-5 text-[#323a50]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose} className="rounded-lg bg-blue-gray-100">
              Close
            </Button>
            <Button color="primary" onPress={handleSaveSelection} className="text-white rounded-lg">
              Assign
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HouseKeepingRoomStatus;
