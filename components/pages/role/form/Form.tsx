// role
import React, { useContext, useEffect, useState, useRef } from "react";
import AddPostViewModel from "./AddPostViewModel";
import PaperBase from "../../../common/paper/PaperBase";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  GetDecrypt,
  GetEncrypt,
  GetQueryParam,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import { hasPermission, getUserRoles, mapPermissions } from "../../../../redux/auth/permissionHelper";
import { checkIsSuperUser } from "../../../../hooks/useFormPermission";

const fitMenus = [62];
const fitActionsList = [{ key: "fit", label: "Create FIT" }];
const gitMenus = [63];
const gitActionsList = [{ key: "git", label: "Create GIT" }];
const vrMenus = [69];
const vrActionsList = [{ key: "vr", label: "Create VR" }];
const dayuseMenus = [1162];
const dayuseActionsList = [{ key: "day-use", label: "Create Day Use" }];
const roomMenus = [1141];
const roomActionsList = [{ key: "blocked_room_access", label: "Access Blocked Room" }];
const userMenus = [1116];
const userActionsList = [{ key: "force_logout_access", label: "Force Logout Access" }];
const companyMenus = [83];
const companyActionsList = [
  { key: "finance_access_edit", label: "Finance Access Edit" },
  { key: "finance_access_view", label: "Finance Access View" },
];
const invoiceMenus = [1039];
const invoiceActionsList = [
  { key: "processed_invoice", label: "Processed Invoice" },
  { key: "cancel_invoice", label: "Cancel Invoice" },
];
const creditMenus = [1040];
const creditActionList = [
  { key: "processed_creditNote", label: "Processed Credit Note" },
  { key: "cancel_creditNote", label: "Cancel Credit Note" },
];
const debitMenus = [1041];
const debitActionsList = [
  { key: "processed_debitNote", label: "Processed Debit Note" },
  { key: "cancel_debitNote", label: "Cancel Debit Note" },
];
const adjustMenus = [1042];
const adjustActionsList = [
  { key: "processed_adjustment", label: "Processed Adjustment" },
  { key: "cancel_adjustment", label: "Cancel Adjustment" },
];
const paymentMenus = [1043];
const paymentActionsList = [
  { key: "processed_payment", label: "Processed Payment" },
  { key: "cancel_payment", label: "Cancel Payment" },
];
const refundMenus = [1044];
const refundActionsList = [
  { key: "processed_refund", label: "Processed Refund" },
  { key: "cancel_refund", label: "Cancel Refund" },
];
const engineMenus = [1137];
const engineActionsList = [
  { key: "start_work_order", label: "Start Work Order" },
  { key: "end_work_order", label: "End Work Order" },
  { key: "assign_engineering", label: "Assign Engineering" },
];
const hkMenus = [172];
const hkActionsList = [
  { key: "perform_cleaning", label: "Perform Cleaning" },
  { key: "perform_inspection", label: "Perform Inspection" },
  { key: "assign_housekeeper", label: "Assign Housekeeper" },
  { key: "clean_all_room", label: "Clean All Rooms" },

];
const transactionMenus = [62, 63, 69, 1162];
const transactionActionsList = [
  { key: "payment",        label: "Payment" },
  { key: "manual_posting", label: "Manual Posting" },
  { key: "refund",         label: "Refund" },
  { key: "paidout",        label: "Paid Out" },
  { key: "split",          label: "Split" },
  { key: "consolidate",    label: "Consolidate" },
  { key: "transfer",       label: "Transfer" },
  { key: "void",           label: "Void" },
];
const reservationMenus = [62, 63, 69, 1162];
const reservationActionsList = [
  { key: "check_in",              label: "Check In" },
  { key: "check_out",             label: "Check Out" },
  { key: "confirm_reservation",   label: "Confirm Reservation" },
  { key: "cancel_reservation",    label: "Cancel Reservation" },
  { key: "assign_room",           label: "Assign Room" },
  { key: "un_assign_room",        label: "Un Assign Room" },
  { key: "confirm_change_room",   label: "Confirm Change Room" },
  { key: "cancel_change_room",    label: "Cancel Change Room" },
  { key: "un_check_in",           label: "Un Check In" },
  { key: "un_check_out",          label: "Re Check In" },
  { key: "copy_reservation",      label: "Copy Reservation" },
  { key: "move_reservation",      label: "Move Reservation" },
  { key: "change_rate",           label: "Change Rate" },
  { key: "change_rate_code",      label: "Change Rate Code" },
  { key: "change_guest",          label: "Change Guest" },
  { key: "change_company",        label: "Change Company" },
  { key: "change_room",           label: "Change Room" },
];

const AddView = () => {
  const { router } = AddPostViewModel();
  const routers = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const isDev = checkIsSuperUser(
      getUserRoles({ datas: datalocal }),
      [datalocal?.name || ""],
      datalocal?.username
  );
  const [dataoption, setdataoption] = useState<any>({});
  const [data, setData] = useState<any>({
    name: "",
    code: "",
    status: [],
    dashboard: [],
    dashboard_ori: [],
    permissions: {},
    roles: []
  });
  const [idusr, setidusr] = useState("0");
  const { code, name, status } = data;
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateScrollTop, setTemplateScrollTop] = useState(0);

  const TemplatePermissionEditor = ({ permissions, templateData, setTemplateData, isDev }: any) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    // isDev(isDev); 
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = templateScrollTop;
      }
    }, [templateScrollTop]);

    const handleCrudChangeTemplate = (groupValue: any, childValue: any, action: string, checked: boolean) => {
      if (scrollRef.current) setTemplateScrollTop(scrollRef.current.scrollTop);

      setTemplateData((prev: any) => {
        const grants = { ...(prev.grants || {}) };
        const menuId = parseInt(childValue);
        if (!grants[menuId]) grants[menuId] = [];

        if (checked) {
          if (!grants[menuId].includes(action)) grants[menuId].push(action);
          if (action !== "view" && !grants[menuId].includes("view")) {
            grants[menuId].push("view");
          }
        } else {
          grants[menuId] = grants[menuId].filter((a: string) => a !== action);
        }

        return { ...prev, grants };
      });
    };

    const handleTransactionActionChangeTemplate = (
      groupValue: any, menuValue: any, actionKey: string, checked: boolean
    ) => {
      if (scrollRef.current) setTemplateScrollTop(scrollRef.current.scrollTop);

      setTemplateData((prev: any) => {
        const menuId = parseInt(menuValue);
        const transactionGrants = { ...(prev.transactionGrants || {}) };
        if (!transactionGrants[menuId]) transactionGrants[menuId] = {};
        transactionGrants[menuId][actionKey] = checked;

        // auto-grant CRUD jika ada action dicentang
        const grants = { ...(prev.grants || {}) };
        if (checked) {
          if (!grants[menuId]) grants[menuId] = [];
          ["view", "add", "edit"].forEach((a) => {
            if (!grants[menuId].includes(a)) grants[menuId].push(a);
          });
        }

        return { ...prev, grants, transactionGrants };
      });
    };

    const handleGroupToggleTemplate = (group: any, checked: boolean) => {
      if (scrollRef.current) setTemplateScrollTop(scrollRef.current.scrollTop);

      setTemplateData((prev: any) => {
        const grants = { ...(prev.grants || {}) };
        group?.access?.forEach((menu: any) => {
          const menuId = parseInt(menu.value);
          // grants[menuId] = checked ? ["view", "add", "edit", "delete"] : [];
          grants[menuId] = checked ? ["view", "add", "edit"] : [];
        });
        return { ...prev, grants };
      });
    };

    const isGroupCheckedTemplate = (group: any) => {
      if (!group?.access?.length) return false;
      return group.access.every((menu: any) => {
        const menuId = parseInt(menu.value);
        return (templateData.grants?.[menuId] || []).includes("view");
      });
    };

    const isGroupIndeterminateTemplate = (group: any) => {
      const children = group.access || [];
      const total = children.length;
      const checked = children.filter((menu: any) => {
        const menuId = parseInt(menu.value);
        return (templateData.grants?.[menuId] || []).includes("view");
      }).length;
      return checked > 0 && checked < total;
    };

    const getGranularSectionsTemplate = (menu: any) => {
      const menuId = parseInt(menu.value);
      const sections: { sectionLabel: string; list: { key: string; label: string }[] }[] = [];
      if (transactionMenus.includes(menuId))      sections.push({ sectionLabel: "Transaction",  list: transactionActionsList });
      if (reservationMenus.includes(menuId))      sections.push({ sectionLabel: "Reservation",  list: reservationActionsList });
      if (fitMenus.includes(menuId))              sections.push({ sectionLabel: "FIT",          list: fitActionsList });
      if (gitMenus.includes(menuId))              sections.push({ sectionLabel: "GIT",          list: gitActionsList });
      if (vrMenus.includes(menuId))               sections.push({ sectionLabel: "VR",           list: vrActionsList });
      if (dayuseMenus.includes(menuId))           sections.push({ sectionLabel: "Day Use",      list: dayuseActionsList });
      if (companyMenus.includes(menuId))          sections.push({ sectionLabel: "Company",      list: companyActionsList });
      if (userMenus.includes(menuId))             sections.push({ sectionLabel: "User",         list: userActionsList });
      if (engineMenus.includes(menuId))           sections.push({ sectionLabel: "Engineering",  list: engineActionsList });
      if (hkMenus.includes(menuId))               sections.push({ sectionLabel: "Housekeeping", list: hkActionsList });
      if (roomMenus.includes(menuId))             sections.push({ sectionLabel: "Room",         list: roomActionsList });
      if (invoiceMenus.includes(menuId))          sections.push({ sectionLabel: "Invoice",      list: invoiceActionsList });
      if (creditMenus.includes(menuId))           sections.push({ sectionLabel: "Credit",       list: creditActionList });
      if (debitMenus.includes(menuId))            sections.push({ sectionLabel: "Debit",        list: debitActionsList });
      if (adjustMenus.includes(menuId))           sections.push({ sectionLabel: "Adjustment",   list: adjustActionsList });
      if (paymentMenus.includes(menuId))          sections.push({ sectionLabel: "Payment",      list: paymentActionsList });
      if (refundMenus.includes(menuId))           sections.push({ sectionLabel: "Refund",       list: refundActionsList });
      return sections;
    };

    const isAllGranularCheckedTemplate = (menuId: number, list: { key: string }[]) =>
      list.every(({ key }) => templateData.transactionGrants?.[menuId]?.[key] === true);

    const handleGranularCheckAllTemplate = (
      groupValue: string, menuValue: string, list: { key: string }[], checked: boolean
    ) => {
      list.forEach(({ key }) =>
        handleTransactionActionChangeTemplate(groupValue, menuValue, key, checked)
      );
    };

    const COL_MENU  = "min-w-[180px] w-[200px]";
    const COL_CHECK = "min-w-[56px] w-[64px] flex-shrink-0 flex justify-center items-start";
    // const CRUD_ACTIONS = ["add", "edit", "view", "delete"] as const;
    const CRUD_ACTIONS = ["add", "edit", "view"] as const;

    const allGroups = permissions?.filter(
      (rw: any) => Array.isArray(rw.access) && rw.access.length > 0
    );

    return (
      <div
        ref={scrollRef}
        className="overflow-auto flex-1 min-h-0"
        style={{ scrollbarWidth: "thin" }}
      >
        <div style={{ minWidth: 900 }}>

          {/* Sticky header */}
          <div
            className="sticky top-0 z-10 bg-gray-50 border-b border-gray-400 flex items-center px-3 py-2"
            style={{ minWidth: 900 }}
          >
            <div className={`${COL_MENU} text-xs font-semibold text-gray-600 border-r border-gray-400 pr-2 flex-shrink-0`}>
              Menu
            </div>
            {/* {["Access", "Add", "Edit", "View", "Delete"].map((h) => ( */}
            {["Access", "Add", "Edit", "View"].map((h) => (
              <div key={h} className={`${COL_CHECK} text-xs font-semibold text-gray-600 border-r border-gray-400`}>
                {h}
              </div>
            ))}
            <div className="flex-1 min-w-[200px] text-xs font-semibold text-gray-600 pl-3">
              Granular Actions
            </div>
          </div>

          {/* Groups */}
          {allGroups?.map((group: any, gi: number) => {
            const deduped: any[] = Array.from(
              new Map(group.access.map((m: any) => [m.label.trim().toLowerCase(), m])).values()
            );
            const groupChecked = isGroupCheckedTemplate(group);
            const groupIndet   = isGroupIndeterminateTemplate(group);

            return (
              <div key={`g-${gi}`} className="border-b border-gray-400 last:border-b-0">

                {/* Group header */}
                <div className="flex items-center px-3 py-2 bg-gray-200 border-b border-gray-400" style={{ minWidth: 900 }}>
                  <div className={`${COL_MENU} border-r border-gray-100 pr-2 flex-shrink-0`}>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        ref={(el) => { if (el) el.indeterminate = groupIndet; }}
                        checked={groupChecked}
                        onChange={(e) => handleGroupToggleTemplate(group, e.target.checked)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="font-bold text-purple-800 text-[11px] uppercase tracking-wide">
                        {group.label}
                      </span>
                    </label>
                  </div>
                  {["a","b","c","d","e"].map((k) => (
                    <div key={k} className={`${COL_CHECK} border-r border-gray-100`} />
                  ))}
                  <div className="flex-1 min-w-[200px]" />
                </div>

                {/* Menu rows */}
                {deduped.map((menu: any, mi: number) => {
                  const menuId   = parseInt(menu.value);
                  const grants   = templateData.grants?.[menuId] || [];
                  const isLast   = mi === deduped.length - 1;
                  const isActive = ["view","add","edit"].every((a) => grants.includes(a));
                  const sections = getGranularSectionsTemplate(menu);

                  return (
                    <div
                      key={`m-${gi}-${mi}`}
                      className={`flex items-start px-3 py-2 transition-colors hover:bg-gray-100
                        ${mi % 2 === 1 ? "bg-gray-50" : "bg-white"}
                        ${!isLast ? "border-b border-dashed border-gray-100" : ""}
                      `}
                      style={{ minWidth: 900 }}
                    >
                      {/* Menu name */}
                      <div className={`${COL_MENU} pt-0.5 border-r border-gray-400 pr-2 flex-shrink-0`}>
                        <span className="text-sm text-gray-700 font-medium leading-snug">{menu.label}</span>
                      </div>

                      {/* Access col */}
                      <div className={`${COL_CHECK} border-r border-gray-100`}>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => {
                            // ["view","add","edit","delete"].forEach((a) =>
                            ["view","add","edit"].forEach((a) =>
                              handleCrudChangeTemplate(group.value, menu.value, a, e.target.checked)
                            );
                          }}
                          className="w-4 h-4 accent-purple-600 mt-0.5"
                          title="Access"
                        />
                      </div>

                      {/* CRUD cols */}
                      {CRUD_ACTIONS.map((act) => (
                        <div key={act} className={`${COL_CHECK} border-r border-gray-100`}>
                          <input
                            type="checkbox"
                            checked={grants.includes(act)}
                            onChange={(e) => handleCrudChangeTemplate(group.value, menu.value, act, e.target.checked)}
                            className="w-4 h-4 accent-purple-600 mt-0.5"
                          />
                        </div>
                      ))}

                      {/* Granular actions */}
                      <div className="flex-1 min-w-[200px] pl-3">
                        {sections.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {sections.map(({ sectionLabel, list }) => {
                              const allChecked  = isAllGranularCheckedTemplate(menuId, list);
                              const someChecked = list.some(({ key }) => templateData.transactionGrants?.[menuId]?.[key]);
                              return (
                                <div
                                  key={sectionLabel}
                                  className="rounded-lg border border-gray-300 bg-gray-50/80 px-2.5 py-1.5 flex-1"
                                  style={{ minWidth: 150, maxWidth: 280 }}
                                >
                                  {/* Section header */}
                                  <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-gray-300">
                                    <input
                                      type="checkbox"
                                      ref={(el) => { if (el) el.indeterminate = !allChecked && someChecked; }}
                                      checked={allChecked}
                                      onChange={(e) => handleGranularCheckAllTemplate(group.value, menu.value, list, e.target.checked)}
                                      className="w-3 h-3 accent-purple-600"
                                      title={`Check all ${sectionLabel}`}
                                    />
                                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                                      {sectionLabel}
                                    </span>
                                  </div>
                                  {/* Actions grid */}
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                                    {list.map(({ key, label: actionLabel }) => (
                                      <label key={key} className="inline-flex items-start gap-1 cursor-pointer select-none group">
                                        <input
                                          type="checkbox"
                                          checked={templateData.transactionGrants?.[menuId]?.[key] || false}
                                          onChange={(e) => handleTransactionActionChangeTemplate(group.value, menu.value, key, e.target.checked)}
                                          className="w-3 h-3 accent-purple-600 flex-shrink-0"
                                        />
                                        <span className="text-[11px] text-gray-600 group-hover:text-gray-900 leading-tight transition-colors">
                                          {actionLabel}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCreateTemplate = async () => {
    const payload = GetEncrypt(JSON.stringify({
        name:              editingTemplate.name,
        // key:               editingTemplate.key,
        label:             editingTemplate.label,
        code:              editingTemplate.code,
        description:       editingTemplate.desc,
        dashboard:         editingTemplate.dashboard,
        grants:            editingTemplate.grants,
      transaction_grants:  editingTemplate.transactionGrants ?? null,
      colors:              editingTemplate.colors,
    }));

    const datares: any = FetchData(
      "/cms/role/template",
      "POST",
      payload,
      false,
      datalocal?.data?.access_token,
      routers,
      ""
    );

    if (datares?.code === 200) {
      setShowTemplateModal(false);
      GetDetailUser(idusr === "0" ? 0 : idusr);
    }
  };

  const handleSaveTemplate = async () => {
    const isEdit = !!editingTemplate?.id;
    const url = isEdit
      ? `/cms/role/templates/${editingTemplate.id}`
      : `/cms/role/templates`;
    const method = isEdit ? "PUT" : "POST";

    const payload = GetEncrypt(JSON.stringify({
        name:              editingTemplate.name,
        // key:               editingTemplate.key,
        label:             editingTemplate.label,
        code:              editingTemplate.code,
        description:       editingTemplate.desc,
        dashboard:         editingTemplate.dashboard,
        grants:            editingTemplate.grants,
      transaction_grants:  editingTemplate.transactionGrants ?? null,
      colors:              editingTemplate.colors,
    }));

    const res = await FetchData(url, method, payload, false,
      datalocal?.data?.access_token, routers, "");

    if (res?.code === 200) {
      setShowTemplateModal(false);
      GetDetailUser(idusr === "0" ? 0 : idusr);
    }
  };

  const handleCrudChange = (groupValue: any, childValue: any, action: string, checked: boolean) => {
    setData((prev: any) => {
      const newPerm = { ...prev.permissions };
      if (!newPerm[groupValue]) newPerm[groupValue] = {};
      if (!newPerm[groupValue][childValue]) newPerm[groupValue][childValue] = {};
      newPerm[groupValue][childValue][action] = checked;
      if (action !== "view" && checked) {
        newPerm[groupValue][childValue]["view"] = true;
      }
      return { ...prev, permissions: newPerm };
    });
  };

  const handleGroupToggle = (groupValue, checked) => {
    setData((prev) => {
      const newPerm = { ...prev.permissions };
      if (!newPerm[groupValue]) newPerm[groupValue] = {};
      const group = dataoption?.data?.permissions?.find(
        (g) => g.value === groupValue
      );
      group?.access?.forEach((acc) => {
        if (!newPerm[groupValue][acc.value]) newPerm[groupValue][acc.value] = {};
        // ["view", "add", "edit", "delete"].forEach((act) => {
        ["view", "add", "edit"].forEach((act) => {
          newPerm[groupValue][acc.value][act] = checked;
        });
      });
      return { ...prev, permissions: newPerm };
    });
  };

  const isGroupChecked = (group) => {
    if (!group?.access?.length) return false;
    return group.access.every(
      (menu) => data.permissions?.[group.value]?.[menu.value]?.view === true
    );
  };

  const changeHandler = (e: any, b?: boolean, name?: string, ischeck?: boolean) => {
    if (!b) {
      if (ischeck) {
        const checked = e.target.checked;
        const inputName = e?.target?.name;
        if (inputName?.startsWith("head_")) {
          const groupKey = inputName.split("_")[1];
          const group = dataoption?.data?.permissions?.find((g: any) => g.value === groupKey);
          setData((prev: any) => {
            let newData = { ...prev };
            newData[`${groupKey}_${groupKey}`] = checked;
            newData[`permissions_ids_${groupKey}`] = checked;
            group?.access?.forEach((acc: any) => {
              newData[`${groupKey}_${acc.value}`] = checked;
              newData[`permissions_ids_${acc.value}`] = checked;
            });
            return newData;
          });
        } else {
          setData((prev: any) => {
            let newData = {
              ...prev,
              [name + "_" + e.target.value]: checked,
              ["permissions_ids_" + e.target.value]: checked,
            };
            const group = dataoption?.data?.permissions?.find((g: any) => g.value === name);
            if (group) {
              const allChildrenOn = group.access.every((acc: any) =>
                acc.value === e.target.value ? checked : prev[`${name}_${acc.value}`]
              );
              newData[`${name}_${name}`] = allChildrenOn;
              newData[`permissions_ids_${name}`] = allChildrenOn;
            }
            return newData;
          });
        }
      } else {
        setData({ ...data, [e.target.name]: e.target.value });
      }
    } else if (name === "dashboard" && b === true) {
      let valarr: any[] = [];
      e.forEach((element: any) => valarr.push(element?.value));
      setData({ ...data, [name + "_ori"]: e, [name]: valarr });
    } else {
      setData({ ...data, [name]: e });
    }
  };

  const GetDetailUser = async (i: any) => {
    try {
      let getuuri = i == 0 ? "/cms/role/create" : `/cms/role/${i}/update`;
      const datauser: any = await FetchData(
        getuuri, "GET", "", false,
        datalocal?.data?.access_token, router, ""
      );

      let dataobj = {
        code: datauser?.data?.code,
        name: datauser?.data?.name,
        status: datauser?.data?.status,
        dashboard: datauser?.data?.list_dashboard,
        dashboard_ori: datauser?.data?.list_dashboard,
        permissions: {},
      };

      setData(dataobj);
      setdataoption(datauser);

      const templates = datauser?.master?.templates ?? [];
      const templatesMap: Record<string, any> = {};
      templates.forEach((tpl: any) => {
        templatesMap[tpl.id] = { ...tpl, transactionGrants: tpl.transactionGrants ?? undefined };
      });
      setRoleTemplates(templatesMap);

      const mappedPerm = mapPermissions(datauser?.data?.permissions || []);
      setData((prev: any) => ({ ...prev, permissions: mappedPerm }));

      datauser?.data?.permissions?.forEach((rw: any) => {
        rw?.access?.forEach((row: any) => {
          const menuId = parseInt(row.value);
          if (row?.crud) {
            handleCrudChange(rw.value, row.value, "view",   row.crud.view   || false);
            handleCrudChange(rw.value, row.value, "add",    row.crud.add    || false);
            handleCrudChange(rw.value, row.value, "edit",   row.crud.edit   || false);
            // handleCrudChange(rw.value, row.value, "delete", row.crud.delete || false);
          }
          const allMenuSets = [
            { menus: hkMenus }, { menus: transactionMenus }, { menus: companyMenus }, { menus: userMenus }, { menus: reservationMenus },
            { menus: fitMenus }, { menus: gitMenus }, { menus: vrMenus }, { menus: dayuseMenus }, { menus: engineMenus },
            { menus: roomMenus }, { menus: invoiceMenus }, { menus: paymentMenus }, { menus: creditMenus }, { menus: debitMenus },
            { menus: adjustMenus }, { menus: refundMenus }
          ];
          if (row.transaction_actions) {
            const shouldApply = allMenuSets.some(({ menus }) => menus.includes(menuId));
            if (shouldApply) {
              Object.keys(row.transaction_actions).forEach((actionKey) => {
                if (row.transaction_actions[actionKey] === true) {
                  handleTransactionActionChange(rw.value, row.value, actionKey, true);
                }
              });
            }
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const OnSave = async () => {
    try {
      let urisave = "/cms/role";
      let mth = "POST";
      if (idusr != "0") {
        urisave = "/cms/role/" + idusr;
        mth = "PUT";
      }
      const raw = JSON.stringify({
        name: data.name,
        code: data.code,
        status: data.status,
        dashboard: data.dashboard,
        permissions: data.permissions,
      });
      const aesraw = GetEncrypt(raw);
      const saveprocess = await FetchData(
        urisave, mth, aesraw, false,
        datalocal?.data?.access_token, routers, "/role"
      );
      if (saveprocess?.code == "200") {
        setloading(false);
        router.replace({ pathname: "/role", query: { parent: 1116 } });
      } else {
        setloading(false);
      }
      setloading(false);
    } catch (error) {
      console.log("erro", error);
      setloading(false);
    }
  };

  useEffect(() => {
    const idreq = GetQueryParam(2);
    if (idreq) {
      setidusr(idreq);
      GetDetailUser(idreq);
    } else {
      setidusr("0");
      GetDetailUser(0);
    }
  }, []);

  useEffect(() => {
    if (idusr !== "0" && data.permissions && Object.keys(data.permissions).length > 0 && selectedTemplate === null) {
      detectActiveTemplate(data.permissions);
    }
  }, [data.permissions]);

  const isGroupIndeterminate = (group) => {
    const children = group.access || [];
    const total = children.length;
    const checked = children.filter(
      (menu) => data.permissions?.[group.value]?.[menu.value]?.view
    ).length;
    return checked > 0 && checked < total;
  };

  const handleTransactionActionChange = (groupValue: any, menuValue: any, actionKey: string, checked: boolean) => {
    setData((prev: any) => {
      const newPerm = { ...prev.permissions };
      if (!newPerm[groupValue]) newPerm[groupValue] = {};
      if (!newPerm[groupValue][menuValue]) newPerm[groupValue][menuValue] = {};
      if (!newPerm[groupValue][menuValue].transaction_actions) {
        newPerm[groupValue][menuValue].transaction_actions = {};
      }
      newPerm[groupValue][menuValue].transaction_actions[actionKey] = checked;
      if (checked) {
        newPerm[groupValue][menuValue].view = true;
        newPerm[groupValue][menuValue].add  = true;
        newPerm[groupValue][menuValue].edit = true;
      }
      return { ...prev, permissions: newPerm };
    });
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [roleTemplates, setRoleTemplates] = useState<Record<string, any>>({});

  const TEMPLATE_COLORS: Record<string, { ringColor: string; bgColor: string; badgeBg: string; badgeText: string }> = {
    fo:    { ringColor: "#3b82f6", bgColor: "#eff6ff", badgeBg: "#dbeafe", badgeText: "#1d4ed8" },
    hk:    { ringColor: "#10b981", bgColor: "#ecfdf5", badgeBg: "#d1fae5", badgeText: "#065f46" },
    hkspv: { ringColor: "#16a34a", bgColor: "#f0fdf4", badgeBg: "#bbf7d0", badgeText: "#15803d" },
    sm:    { ringColor: "#f59e0b", bgColor: "#fffbeb", badgeBg: "#fde68a", badgeText: "#92400e" },
    eng:   { ringColor: "#8b5cf6", bgColor: "#f5f3ff", badgeBg: "#ede9fe", badgeText: "#6d28d9" },
    it:    { ringColor: "#6b7280", bgColor: "#f9fafb", badgeBg: "#e5e7eb", badgeText: "#374151" },
  };

  const applyRoleTemplate = (roleKey: string) => {
    const template = roleTemplates[roleKey];
    console.log("idusr:", idusr);
    console.log("template:", JSON.stringify(template));
    if (!template || !dataoption?.data?.permissions) return;
    setSelectedTemplate(roleKey);
    const masterDashboards = dataoption?.master?.dashboards ?? [];
    const matchedDashboards = masterDashboards.filter((d: any) =>
      template.dashboard.includes(d.value)
    );
    setData((prev: any) => {
      const newPerm: any = {};
      dataoption.data.permissions.forEach((group: any) => {
        group?.access?.forEach((menu: any) => {
          const menuId = parseInt(menu.value);
          const grants = template.grants[menuId] ?? [];
          if (!newPerm[group.value]) newPerm[group.value] = {};
          newPerm[group.value][menu.value] = {
            view:   grants.includes("view"),
            add:    grants.includes("add"),
            edit:   grants.includes("edit"),
            // delete: grants.includes("delete"),
          };
          const transActions = template.transactionGrants?.[menuId];
          if (transActions) {
            newPerm[group.value][menu.value].transaction_actions = { ...transActions };
          } else if (menu.transaction_actions) {
            newPerm[group.value][menu.value].transaction_actions = Object.fromEntries(
              Object.keys(menu.transaction_actions).map(k => [k, false])
            );
          }
        });
      });
      return {
        ...prev,
        // key: template.key,
        name: template.name,
        code: template.code,
        permissions: newPerm,
        dashboard: matchedDashboards.map((d: any) => d.value),
        dashboard_ori: matchedDashboards,
      };
    });
  };

  // const bulkSetPermission = (action: "view" | "add" | "edit" | "delete") => {
  const bulkSetPermission = (action: "view" | "add" | "edit") => {
    if (!dataoption?.data?.permissions) return;
    setData((prev: any) => {
      const newPerm = { ...prev.permissions };
      dataoption.data.permissions.forEach((group: any) => {
        group?.access?.forEach((menu: any) => {
          if (!newPerm[group.value]) newPerm[group.value] = {};
          if (!newPerm[group.value][menu.value]) newPerm[group.value][menu.value] = { view: false, add: false, edit: false, delete: false };
          newPerm[group.value][menu.value][action] = true;
          if (action !== "view") newPerm[group.value][menu.value].view = true;
        });
      });
      return { ...prev, permissions: newPerm };
    });
    setSelectedTemplate(null);
  };

  const bulkClearPermission = () => {
    if (!dataoption?.data?.permissions) return;
    setData((prev: any) => {
      const newPerm = { ...prev.permissions };
      dataoption.data.permissions.forEach((group: any) => {
        group?.access?.forEach((menu: any) => {
          if (!newPerm[group.value]) newPerm[group.value] = {};
          newPerm[group.value][menu.value] = { view: false, add: false, edit: false, delete: false };
        });
      });
      return { ...prev, permissions: newPerm };
    });
    setSelectedTemplate(null);
  };

  const detectActiveTemplate = (permissions: any) => {
    if (!permissions || Object.keys(permissions).length === 0) return;
    let bestMatch = null;
    let bestScore = -1;
    Object.entries(roleTemplates).forEach(([key, tpl]) => {
      let score = 0;
      let total = Object.keys(tpl.grants).length;
      Object.entries(tpl.grants).forEach(([menuIdStr, actions]) => {
        let found: any = null;
        Object.values(permissions).forEach((group: any) => {
          if (group[parseInt(menuIdStr)] || group[menuIdStr]) {
            found = group[parseInt(menuIdStr)] ?? group[menuIdStr];
          }
        });
        if (!found) return;
        const match = (actions as string[]).every((act) => found[act] === true);
        if (match) score++;
      });
      const ratio = score / total;
      if (ratio > bestScore) { bestScore = ratio; bestMatch = key; }
    });
    if (bestScore >= 0.7) setSelectedTemplate(bestMatch);
  };

  const renderRoleTemplateSelector = () => (
    <div className="col-span-12">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-900">
          Role Template
        </label>
        {isDev && (
          <button
            type="button"
            onClick={() => {
              setEditingTemplate({
                id:               null,
                name:             "",
                // key:              "",
                label:            "",
                code:             "",
                desc:             "",
                dashboard:        [],
                grants:           {},
                transactionGrants: null,
                colors:           null,
              });
              setShowTemplateModal(true);
            }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-white bg-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Template
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mb-3">
        {Object.entries(roleTemplates).map(([key, tpl]) => {
          // const c = TEMPLATE_COLORS[key] || { ringColor: "#6b7280", bgColor: "#f9fafb", badgeBg: "#e5e7eb", badgeText: "#374151" };
          const c = (tpl.colors?.ringColor)
          ? {
              ringColor: tpl.colors.ringColor,
              bgColor:   tpl.colors.bgColor,
              badgeBg:   tpl.colors.badgeBg,
              badgeText: tpl.colors.badgeText,
            }
          : TEMPLATE_COLORS[tpl.key] || { 
              ringColor: "#6b7280", 
              bgColor: "#f9fafb", 
              badgeBg: "#e5e7eb", 
              badgeText: "#374151" 
            };
          const isActive = selectedTemplate === key;
          return (
            <div
              key={key}
              className="relative flex flex-col items-start gap-2 p-3 rounded-lg border transition-all cursor-pointer group"
              style={{
                backgroundColor: isActive ? c.bgColor : "white",
                borderColor: isActive ? c.ringColor : "#e5e7eb",
              }}
              onClick={() => applyRoleTemplate(key)}
            >
              <div className="flex items-start justify-between w-full">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: c.badgeBg, color: c.badgeText }}
                >
                  {/* {tpl.label} <span className="opacity-70">({tpl.code})</span> */}
                  {tpl.label}
                </span>
                {isDev && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate({ ...tpl, id: tpl.id || null });
                      setShowTemplateModal(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 transition-all"
                    title="Edit Template"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414V18h1.586a2 2 0 001.414-.586l.414-.414" />
                    </svg>
                  </button>
                )}
              </div>
              <span className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                {tpl.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bulk Access bar — mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-xs text-gray-500 font-medium">Bulk Access:</span>

        {/* 2x2 grid on mobile, inline on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {[
            { label: "View All",   action: "view"   as const, border: "#6ee7b7", color: "#065f46", hover: "#ecfdf5" },
            { label: "Edit All",   action: "edit"   as const, border: "#fcd34d", color: "#92400e", hover: "#fffbeb" },
            { label: "Add All",    action: "add"    as const, border: "#93c5fd", color: "#1e40af", hover: "#eff6ff" },
            // { label: "Delete All", action: "delete" as const, border: "#fca5a5", color: "#991b1b", hover: "#fef2f2" },
          ].map(({ label, action, border, color, hover }) => (
            <button
              key={action}
              type="button"
              onClick={() => bulkSetPermission(action)}
              className="text-xs px-3 py-1.5 rounded-md border bg-white transition-colors text-center"
              style={{ borderColor: border, color }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = hover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block w-px h-4 bg-gray-300" />

        {/* Clear buttons — row on mobile */}
        <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={() => bulkClearPermission()}
            className="flex-1 sm:flex-none text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors text-center"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={() => {
              setData((prev: any) => ({ ...prev, dashboard: [], dashboard_ori: [] }));
              setSelectedTemplate(null);
            }}
            className="flex-1 sm:flex-none text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors text-center"
          >
            Clear Dashboard
          </button>
        </div>

        {selectedTemplate && (
          <p className="text-xs text-gray-500 sm:ml-1">
            Template <span className="font-semibold text-gray-700">{roleTemplates[selectedTemplate].label}</span> active — modify below.
          </p>
        )}
      </div>
    </div>
  );

  // ─── RBAC Table ───────────────────────────────────────────────────────
  const renderPermissions = () => {
    const allGroups = dataoption?.data?.permissions
      ?.filter((rw: any) => Array.isArray(rw.access) && rw.access.length > 0);

    if (!allGroups?.length) return null;

    // const CRUD_ACTIONS = ["add", "edit", "view", "delete"] as const;
    const CRUD_ACTIONS = ["add", "edit", "view"] as const;

    const getMenuType = (menu: any, groupLabel: string): "access" | "view" | "full" => {
      const label = menu.label.trim().toLowerCase();
      const viewOnlyGroups    = ["Statistic", "Reporting", "System Balance", "Security Audit", "Notification"];
      const viewOnlyKeywords  = ["occupancy", "room types", "room type groupings", "system balance", "batch", "account", "before night audit", "after night audit", "front office", "sales marketing"];
      const viewOnlyExact     = ["housekeeping", "transaction", "gl code", "floor plan"];
      const accessOnlyGroups  = ["Night Audit"];
      const accessOnlyKeywords = ["night audit"];
      if (accessOnlyGroups.includes(groupLabel) || accessOnlyKeywords.some(k => label.includes(k))) return "access";
      if (viewOnlyGroups.includes(groupLabel) || viewOnlyKeywords.some(k => label.includes(k)) || viewOnlyExact.some(k => label === k)) return "view";
      return "full";
    };

    const getGranularSections = (menu: any) => {
      const menuId = parseInt(menu.value);
      const sections: { sectionLabel: string; list: { key: string; label: string }[] }[] = [];
      if (transactionMenus.includes(menuId))      sections.push({ sectionLabel: "Transaction",  list: transactionActionsList });
      if (reservationMenus.includes(menuId))      sections.push({ sectionLabel: "Reservation",  list: reservationActionsList });
      if (fitMenus.includes(menuId))              sections.push({ sectionLabel: "FIT",          list: fitActionsList });
      if (gitMenus.includes(menuId))              sections.push({ sectionLabel: "GIT",          list: gitActionsList });
      if (vrMenus.includes(menuId))               sections.push({ sectionLabel: "VR",           list: vrActionsList });
      if (dayuseMenus.includes(menuId))           sections.push({ sectionLabel: "Day Use",      list: dayuseActionsList });
      if (companyMenus.includes(menuId))          sections.push({ sectionLabel: "Company",      list: companyActionsList });
      if (userMenus.includes(menuId))             sections.push({ sectionLabel: "User",         list: userActionsList });
      if (engineMenus.includes(menuId))           sections.push({ sectionLabel: "Engineering",  list: engineActionsList });
      if (hkMenus.includes(menuId))               sections.push({ sectionLabel: "Housekeeping", list: hkActionsList });
      if (roomMenus.includes(menuId))             sections.push({ sectionLabel: "Room",         list: roomActionsList });
      if (invoiceMenus.includes(menuId))          sections.push({ sectionLabel: "Invoice",      list: invoiceActionsList });
      if (creditMenus.includes(menuId))           sections.push({ sectionLabel: "Credit",       list: creditActionList });
      if (debitMenus.includes(menuId))            sections.push({ sectionLabel: "Debit",        list: debitActionsList });
      if (adjustMenus.includes(menuId))           sections.push({ sectionLabel: "Adjustment",   list: adjustActionsList });
      if (paymentMenus.includes(menuId))          sections.push({ sectionLabel: "Payment",      list: paymentActionsList });
      if (refundMenus.includes(menuId))           sections.push({ sectionLabel: "Refund",       list: refundActionsList });
      return sections;
    };

    const isAllGranularChecked = (perm: any, list: { key: string }[]) =>
      list.every(({ key }) => perm?.transaction_actions?.[key] === true);

    const handleGranularCheckAll = (groupValue: string, menuValue: string, list: { key: string }[], checked: boolean) => {
      list.forEach(({ key }) => handleTransactionActionChange(groupValue, menuValue, key, checked));
    };

    // Column widths — designed to work with horizontal scroll on mobile
    const COL_MENU  = "min-w-[180px] w-[200px]";
    const COL_CHECK = "min-w-[56px] w-[64px] flex-shrink-0 flex justify-center items-start";

    return (
      <div className="col-span-12">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">
            Role Based Access Control
          </label>
        </div>

        <div
            className="border border-gray-400 rounded-lg bg-white"
            style={{ maxHeight: 580, overflowY: "auto", overflowX: "auto", WebkitOverflowScrolling: "touch", position: "relative" }}
          >
            <div style={{ minWidth: 780 }}>

              {/* Sticky header */}
              <div
                className="sticky top-0 z-10 bg-gray-50 border-b border-gray-400 flex items-center px-3 py-2 gap-0"
                style={{ minWidth: 780 }}
              >
              <div className={`${COL_MENU} text-xs font-semibold text-gray-600 border-r border-gray-400 pr-2 flex-shrink-0`}>
                Menu
              </div>
              {/* {["Access", "Add", "Edit", "View", "Delete"].map((h) => ( */}
              {["Access", "Add", "Edit", "View"].map((h) => (
                <div key={h} className={`${COL_CHECK} text-xs font-semibold text-gray-600 border-r border-gray-400`}>
                  {h}
                </div>
              ))}
              <div className="flex-1 min-w-[200px] text-xs font-semibold text-gray-600 pl-3">
                Granular Actions
              </div>
            </div>

            {/* Groups */}
            {allGroups.map((group: any, gi: number) => {
              const deduped: any[] = Array.from(
                new Map(group.access.map((m: any) => [m.label.trim().toLowerCase(), m])).values()
              );
              const groupChecked = isGroupChecked(group);
              const groupIndet   = isGroupIndeterminate(group);

              return (
                <div key={`g-${gi}`} className="border-b border-gray-400 last:border-b-0">

                  {/* Group header */}
                  <div className="flex items-center px-3 py-2 bg-gray-200 border-b border-gray-400" style={{ minWidth: 680 }}>
                    <div className={`${COL_MENU} border-r border-gray-100 pr-2 flex-shrink-0`}>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          ref={(el) => { if (el) el.indeterminate = groupIndet; }}
                          checked={groupChecked}
                          onChange={(e) => handleGroupToggle(group.value, e.target.checked)}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <span className="font-bold text-purple-800 text-[11px] uppercase tracking-wide leading-tight">
                          {group.label}
                        </span>
                      </label>
                    </div>
                    {["a", "v", "ad", "e", "d"].map((k) => (
                      <div key={k} className={`${COL_CHECK} border-r border-gray-100`} />
                    ))}
                    <div className="flex-1 min-w-[200px]" />
                  </div>

                  {/* Menu rows */}
                  {deduped.map((menu: any, mi: number) => {
                    const type     = getMenuType(menu, group.label);
                    const perm     = data.permissions?.[group.value]?.[menu.value] ?? {};
                    const sections = getGranularSections(menu);
                    const isActive = ["view", "add", "edit"].every((a) => perm?.[a]);
                    const isLast   = mi === deduped.length - 1;

                    return (
                      <div
                        key={`m-${gi}-${mi}`}
                        className={`flex items-start px-3 py-2 gap-0 transition-colors hover:bg-gray-100
                          ${mi % 2 === 1 ? "bg-gray-50" : "bg-white"}
                          ${!isLast ? "border-b border-dashed border-gray-100" : ""}
                        `}
                        style={{ minWidth: 680 }}
                      >
                        {/* Menu name */}
                        <div className={`${COL_MENU} pt-0.5 border-r border-gray-400 pr-2 flex-shrink-0`}>
                          <span className="text-sm text-gray-700 font-medium leading-snug">{menu.label}</span>
                        </div>

                        {/* Access col */}
                        <div className={`${COL_CHECK} border-r border-gray-100`}>
                          {type === "access" ? (
                            <input type="checkbox" checked={isActive}
                              // onChange={(e) => ["view","add","edit","delete"].forEach((a) =>
                              onChange={(e) => ["view","add","edit"].forEach((a) =>
                                handleCrudChange(group.value, menu.value, a, e.target.checked)
                              )}
                              className="w-4 h-4 accent-purple-600 mt-0.5" title="Active"
                            />
                          ) : type === "view" ? (
                            <input type="checkbox" checked={perm?.view || false}
                              onChange={(e) => handleCrudChange(group.value, menu.value, "view", e.target.checked)}
                              className="w-4 h-4 accent-purple-600 mt-0.5" title="Active"
                            />
                          ) : (
                            <span className="text-gray-300 text-xs mt-0.5">—</span>
                          )}
                        </div>

                        {/* CRUD cols */}
                        {CRUD_ACTIONS.map((act) => (
                          <div key={act} className={`${COL_CHECK} border-r border-gray-100`}>
                            {type === "full" ? (
                              <input type="checkbox" checked={perm?.[act] || false}
                                onChange={(e) => handleCrudChange(group.value, menu.value, act, e.target.checked)}
                                className="w-4 h-4 accent-purple-600 mt-0.5"
                              />
                            ) : (
                              <span className="text-gray-300 text-xs mt-0.5">—</span>
                            )}
                          </div>
                        ))}

                        {/* Granular actions */}
                        <div className="flex-1 min-w-[200px] pl-3">
                          {sections.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {sections.map(({ sectionLabel, list }) => {
                                const allChecked  = isAllGranularChecked(perm, list);
                                const someChecked = list.some(({ key }) => perm?.transaction_actions?.[key]);
                                return (
                                  <div
                                    key={sectionLabel}
                                    className="rounded-lg border border-gray-300 bg-gray-50/80 px-2.5 py-1.5 flex-1"
                                    style={{ minWidth: 150, maxWidth: 280 }}
                                  >
                                    {/* Section header */}
                                    <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-gray-300">
                                      <input
                                        type="checkbox"
                                        ref={(el) => { if (el) el.indeterminate = !allChecked && someChecked; }}
                                        checked={allChecked}
                                        onChange={(e) => handleGranularCheckAll(group.value, menu.value, list, e.target.checked)}
                                        className="w-3 h-3 accent-purple-600"
                                        title={`Check all ${sectionLabel}`}
                                      />
                                      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                                        {sectionLabel}
                                      </span>
                                    </div>
                                    {/* Actions 2-col grid */}
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                                      {list.map(({ key, label: actionLabel }) => (
                                        <label key={key} className="inline-flex items-start gap-1 cursor-pointer select-none group">
                                          <input
                                            type="checkbox"
                                            checked={perm?.transaction_actions?.[key] || false}
                                            onChange={(e) => handleTransactionActionChange(group.value, menu.value, key, e.target.checked)}
                                            className="w-3 h-3 accent-purple-600 flex-shrink-0"
                                          />
                                          <span className="text-[11px] text-gray-600 group-hover:text-gray-900 leading-tight transition-colors">
                                            {actionLabel}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <PaperBase>
        <div className="flex flex-col gap-4">

          {/* Page title */}
          <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed pb-3">
            <div className="col-span-12 sm:col-span-6">
              <h2 className="text-lg font-bold">
                {(idusr == "0" ? "Create" : "Edit") + " " + layout?.title}
              </h2>
            </div>
          </div>

          {/* Form body */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 grid grid-cols-12 gap-3">

              {/* Role Name — full width on mobile, half on sm+ */}
              <div className="col-span-12 sm:col-span-6">
                <InputMain
                  typeInput={"base"}
                  error={false}
                  label={"Role Name"}
                  required={true}
                  rest={{
                    name: "name",
                    placeholder: "Input Role Name",
                    value: name,
                    type: "text",
                    onChange: changeHandler,
                  }}
                />
              </div>

              {/* Status — full width on mobile, half on sm+ */}
              <div className="col-span-12 sm:col-span-6">
                <InputMain
                  typeInput={"select-multi"}
                  error={false}
                  label={"Status"}
                  required={true}
                  options={dataoption?.master?.statuses}
                  onChangeSel={(e) => changeHandler(e, true, "status")}
                  valueSel={status}
                  isMulti={false}
                />
              </div>

              {/* Template Selector */}
              {renderRoleTemplateSelector()}

              {/* RBAC Table */}
              {renderPermissions()}

              {/* Dashboard multiselect */}
              {/* <div className="col-span-12">
                <InputMain
                  typeInput="select-multi"
                  label={"List Dashboard"}
                  error={false}
                  required={false}
                  valueSel={data["dashboard_ori"]}
                  isMulti={true}
                  options={dataoption?.master?.dashboards}
                  onChangeSel={(e) => changeHandler(e, true, "dashboard")}
                />
              </div> */}
              {/* Dashboard — ordered checkbox */}
              <div className="col-span-12">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  List Dashboard <span className="text-xs text-gray-500">Sortir by selected first</span>
                </label>

                {/* Selected order preview */}
                {data.dashboard?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {data.dashboard?.map((val: any, idx: number) => {
                      // normalize — bisa string atau object
                      const strVal = typeof val === "string" ? val : val?.value;
                      const opt = dataoption?.master?.dashboards?.find((d: any) => d.value === strVal);
                      return (
                        <div key={strVal} className="flex items-center gap-1 bg-primary border border-gray-200 text-white text-xs px-2 py-1 rounded-full">
                          {/* <span className="font-bold text-purple-400 text-[10px]">#{idx + 1}</span> */}
                          <span>{opt?.label || strVal}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setData((prev: any) => ({
                                ...prev,
                                dashboard: prev.dashboard.filter((v: any) => 
                                  typeof v === "string" ? v !== strVal : v?.value !== strVal
                                ),
                                dashboard_ori: prev.dashboard_ori.filter((d: any) => d?.value !== strVal),
                              }));
                            }}
                            className="hover:text-red transition-colors rounded-full bg-white text-blackRed w-4"
                          >
                            X
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setData((prev: any) => ({ ...prev, dashboard: [], dashboard_ori: [] }))}
                      className="text-xs text-gray-900 hover:text-red-400 px-2 py-1 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Checkbox grid */}
                <div className="bg-white p-2 border border-gray-200 rounded-lg overflow-hidden">
                  {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x-4 divide-y-4 divide-gray-100"> */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                    {(dataoption?.master?.dashboards || []).map((opt: any) => {
                      const isChecked = data.dashboard?.some((v: any) => 
                        typeof v === "string" ? v === opt.value : v?.value === opt.value
                      );
                      const order = data.dashboard?.findIndex((v: any) => 
                        typeof v === "string" ? v === opt.value : v?.value === opt.value
                      );
                      return (
                        <label
                          key={opt.value}
                          className={`rounded-lg flex items-center gap-2.5 px-2.5 py-2.5 cursor-pointer transition-colors select-none
                            ${isChecked ? "bg-white" : "bg-gray-300 hover:bg-gray-200"}
                          `}
                        >
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setData((prev: any) => ({
                                    ...prev,
                                    dashboard: [...(prev.dashboard || []), opt.value],
                                    dashboard_ori: [...(prev.dashboard_ori || []), opt],
                                  }));
                                } else {
                                  setData((prev: any) => ({
                                    ...prev,
                                    dashboard: (prev.dashboard || []).filter((v: any) => 
                                      typeof v === "string" ? v !== opt.value : v?.value !== opt.value
                                    ),
                                    dashboard_ori: (prev.dashboard_ori || []).filter((d: any) => 
                                      d?.value !== opt.value
                                    ),
                                  }));
                                }
                              }}
                              className="w-4 h-4 accent-purple-600"
                            />
                            {/* {isChecked && (
                              <span className="absolute -top-2 bg-gray-300 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                                {order + 1}
                              </span>
                            )} */}
                          </div>
                          <span className={`text-xs leading-snug ${isChecked ? "text-purple-700 font-medium" : "text-gray-600"}`}>
                            {opt.label}
                          </span>
                          <span className={`bg-gray-300 flex items-center justify-center rounded-full w-4 h-4 text-xs leading-snug ${isChecked ? "text-purple-700 font-medium" : "opacity-0"}`}>
                            {order + 1}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Fixed bottom action bar */}
        <div className="fixed w-full bg-white border-t border-gray-200 py-2 px-4 bottom-0 left-0 z-40">
          <div className="lg:ms-[250px] flex justify-end px-4 gap-3">
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                router.replace({ pathname: "/role", query: { parent: 1116 } });
              }}
              loading={loading}
              label="Cancel"
              isprimary={false}
            />
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          </div>
        </div>

        {/* Template editor modal */}
        {showTemplateModal && editingTemplate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[95vh] sm:h-[92vh] flex flex-col overflow-hidden">

              {/* Modal header */}
              <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between bg-white">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  {editingTemplate.id ? "Edit" : "Create"} Role Template
                </h3>
              </div>

              {/* Modal content — stacks vertically on mobile, side-by-side on desktop */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4 sm:p-6 min-h-0">

                {/* Left: form fields — full width on mobile, fixed 320px on desktop */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-4 overflow-y-auto pb-2">
                  {[
                    { label: "Name",       key: "name",       transform: (v: string) => v.toUpperCase() },
                    { label: "Label",       key: "label",       transform: (v: string) => v },
                    // { label: "Code",        key: "code",        transform: (v: string) => v.toUpperCase() },
                    { label: "Description", key: "desc",        transform: (v: string) => v },
                  ].map(({ label, key, transform }) => (
                    <div key={key}>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">{label}</label>
                      <input
                        type="text"
                        value={editingTemplate[key] || ""}
                        onChange={(e) => setEditingTemplate((p: any) => ({ ...p, [key]: transform(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Badge Color</label>
                    <div className="space-y-3">
                      {[
                        { label: "Ring Color",   key: "ringColor",  preview: "border" },
                        { label: "Background",   key: "bgColor",    preview: "bg" },
                        { label: "Badge BG",     key: "badgeBg",    preview: "bg" },
                        { label: "Badge Text",   key: "badgeText",  preview: "text" },
                      ].map(({ label, key }) => (
                        <div key={key} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-300 flex-shrink-0 cursor-pointer overflow-hidden relative"
                            title={label}
                          >
                            <input
                              type="color"
                              value={editingTemplate.colors?.[key] || "#6b7280"}
                              onChange={(e) =>
                                setEditingTemplate((p: any) => ({
                                  ...p,
                                  colors: { ...(p.colors || {}), [key]: e.target.value },
                                }))
                              }
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div
                              className="w-full h-full rounded-lg"
                              style={{ backgroundColor: editingTemplate.colors?.[key] || "#6b7280" }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{label}</div>
                            <input
                              type="text"
                              value={editingTemplate.colors?.[key] || ""}
                              onChange={(e) =>
                                setEditingTemplate((p: any) => ({
                                  ...p,
                                  colors: { ...(p.colors || {}), [key]: e.target.value },
                                }))
                              }
                              placeholder="#000000"
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live preview badge */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Preview</div>
                      <div
                        className="inline-flex flex-col gap-1.5 p-3 rounded-lg border-2 w-full"
                        style={{
                          backgroundColor: editingTemplate.colors?.bgColor || "#f9fafb",
                          borderColor: editingTemplate.colors?.ringColor || "#6b7280",
                        }}
                      >
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
                          style={{
                            backgroundColor: editingTemplate.colors?.badgeBg || "#e5e7eb",
                            color: editingTemplate.colors?.badgeText || "#374151",
                          }}
                        >
                          {editingTemplate.label || "Label"}
                        </span>
                        <span className="text-[11px] text-gray-600">
                          {editingTemplate.desc || "Description"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: permission editor */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="text-sm font-semibold mb-2 text-gray-900">
                    Role Based Access Control
                  </label>
                  <div className="border border-gray-300 rounded-lg bg-white flex-1 flex flex-col overflow-hidden">
                    <TemplatePermissionEditor
                      permissions={dataoption?.data?.permissions || []}
                      templateData={editingTemplate}
                      setTemplateData={setEditingTemplate}
                      isDev={isDev}
                    />
                  </div>
                  {/* {renderPermissions()} */}
                </div>
              </div>

              {/* Modal footer */}
              <div className="border-t px-4 sm:px-6 py-3 flex justify-end gap-3 bg-white">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate || handleCreateTemplate}
                  // onClick={editingTemplate?.id ? handleSaveTemplate : handleCreateTemplate}
                  className="px-4 sm:px-6 py-2 bg-primary text-white rounded-md hover:bg-purple-700 text-sm font-medium"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scroll-to-top button — mobile only */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-20 right-4 md:hidden z-50 bg-white shadow-lg border border-gray-300
                       hover:bg-gray-50 active:bg-gray-100 w-11 h-11 rounded-full flex items-center justify-center
                       transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </PaperBase>
    </>
  );
};

export default AddView;