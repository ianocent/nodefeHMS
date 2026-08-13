import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import InputMain from "../../../../components/common/input/InputMain";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import Seo from "../../../../components/common/seo";
import { LayoutContext } from "../../../../context/LayoutContext";
import {
    FetchData,
    GetDecrypt,
    GetEncrypt,
} from "../../../../components/helper";

interface RoomTypeRow {
    room_type_id: string;
    room_type_id_ori?: { value: string; label: string } | null;
    qty: number;
    is_required: boolean;
}

interface RoomRow {
    room_id: string;
    room_id_ori?: { value: string; label: string } | null;
    qty: number;
    is_required: boolean;
}

interface SelectOption {
    value: string;
    label: string;
}

const AddView = () => {
    const GLOBALURI = "/cms/housekeeping-setup";
    const router = useRouter();
    const layout = useContext(LayoutContext);
    const pathname = usePathname();

    const { isLogin } = useSelector((state: any) => state?.auth);
    const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;

    const [loading, setLoading] = useState(false);
    const [idusr, setidusr] = useState("0");
    const [parent, setParent] = useState("0");

    const [dataval, setData] = useState<any>({
        status: true,
        is_required: true,
        mandatory_inspection: false,
        used_by: "both",
        sort: 0,
    });

    const [roomTypeOptions, setRoomTypeOptions] = useState<SelectOption[]>([]);
    const [roomOptions, setRoomOptions] = useState<SelectOption[]>([]);

    const [roomTypesDetail, setRoomTypesDetail] = useState<RoomTypeRow[]>([]);
    const [roomsDetail, setRoomsDetail] = useState<RoomRow[]>([]);

    const GetDetailUser = async (id: any) => {
        try {
            const uri = id == 0 ? `${GLOBALURI}/create` : `${GLOBALURI}/${id}/update`;
            const res: any = await FetchData(
                uri,
                "GET",
                "",
                false,
                datalocal?.data?.access_token,
                router,
                "",
            );

            setRoomTypeOptions(
                (res?.master?.room_types ?? []).map((o: any) => ({
                    value: String(o.value),
                    label: o.label,
                })),
            );
            setRoomOptions(
                (res?.master?.rooms ?? []).map((o: any) => ({
                    value: String(o.value),
                    label: o.label,
                })),
            );

            if (id != 0 && res?.data) {
                setData(res.data);
                setRoomTypesDetail(
                    (res.data.room_types_detail ?? []).map((r: any) => ({
                        ...r,
                        room_type_id: String(r.room_type_id),
                        room_type_id_ori: r.room_type_id_ori
                            ? {
                                  value: String(r.room_type_id_ori.value),
                                  label: r.room_type_id_ori.label,
                              }
                            : null,
                    })),
                );
                setRoomsDetail(
                    (res.data.rooms_detail ?? []).map((r: any) => ({
                        ...r,
                        room_id: String(r.room_id),
                        room_id_ori: r.room_id_ori
                            ? {
                                  value: String(r.room_id_ori.value),
                                  label: r.room_id_ori.label,
                              }
                            : null,
                    })),
                );
            }
        } catch (err) {
            console.error("GetDetailUser error:", err);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const idreq = params.get("data");
        const idparent = params.get("parent");
        setParent(idparent ?? "0");

        if (idreq) {
            GetDetailUser(idreq);
            setidusr(idreq);
        } else {
            GetDetailUser(0);
            setidusr("0");
        }
    }, []);

    const changeHandler = (e: any, type?: string, name?: string) => {
        if (type === "select-multi" || type === "select") {
            setData((prev: any) => ({
                ...prev,
                [name + "_ori"]: e,
                [name!]: e?.value ?? e,
            }));
        } else if (type === "checkbox" || type === "switch") {
            setData((prev: any) => ({
                ...prev,
                [name ?? e.target.name]: type === "switch" ? e : e.target.checked,
            }));
        } else {
            setData((prev: any) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const addRoomTypeRow = () => {
        setRoomTypesDetail((prev) => [
            ...prev,
            {
                room_type_id: "",
                room_type_id_ori: null,
                qty: 1,
                is_required: true,
            } as RoomTypeRow,
        ]);
    };

    const removeRoomTypeRow = (idx: number) => {
        setRoomTypesDetail((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateRoomTypeRow = (idx: number, field: string, value: any) => {
        setRoomTypesDetail((prev) =>
            prev.map((row, i) => {
                if (i !== idx) return row;
                if (field === "room_type_id_ori") {
                    return {
                        ...row,
                        room_type_id: value?.value ?? "",
                        room_type_id_ori: value,
                    };
                }
                return { ...row, [field]: value };
            }),
        );
    };

    const addRoomRow = () => {
        setRoomsDetail((prev) => [
            ...prev,
            { room_id: "", room_id_ori: null, qty: 1, is_required: true } as RoomRow,
        ]);
    };

    const removeRoomRow = (idx: number) => {
        setRoomsDetail((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateRoomRow = (idx: number, field: string, value: any) => {
        setRoomsDetail((prev) =>
            prev.map((row, i) => {
                if (i !== idx) return row;
                if (field === "room_id_ori") {
                    return { ...row, room_id: value?.value ?? "", room_id_ori: value };
                }
                return { ...row, [field]: value };
            }),
        );
    };

    const OnSave = async () => {
        setLoading(true);
        try {
            const payload = {
                ...dataval,
                used_by: dataval?.used_by_ori?.value ?? dataval?.used_by,
                category: dataval?.category_ori?.value ?? dataval?.category,
                status: dataval?.status_ori?.value ?? dataval?.status,
                room_types_detail: roomTypesDetail.map((r) => ({
                    room_type_id: String(r.room_type_id),
                    qty: Number(r.qty) || 1,
                    is_required: r.is_required,
                })),
                rooms_detail: roomsDetail.map((r) => ({
                    room_id: String(r.room_id),
                    qty: Number(r.qty) || 1,
                    is_required: r.is_required,
                })),
            };

            const raw = JSON.stringify(payload);
            const aesraw = GetEncrypt(raw);
            const uri = idusr !== "0" ? `${GLOBALURI}/${idusr}` : GLOBALURI;
            const method = idusr !== "0" ? "PUT" : "POST";

            const res: any = await FetchData(
                uri,
                method,
                aesraw,
                false,
                datalocal?.data?.access_token,
                router,
                "",
            );

            if (String(res?.code) === "200") {
                router.replace({
                    pathname: window.location.pathname,
                    query: { parent },
                });
            } else {
                alert(res?.message || "Gagal menyimpan data");
            }
        } catch (err) {
            console.error("OnSave error:", err);
            alert("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const usedByOptions: SelectOption[] = [
        { value: "hk", label: "Housekeeper" },
        { value: "hkspv", label: "Supervisor" },
        { value: "both", label: "Both" },
    ];
    const categoryOptions: SelectOption[] = [
        { value: "Bedroom Area",             label: "Bedroom Area" },
        { value: "Bathroom Area",            label: "Bathroom Area" },
        { value: "Balcony Area",             label: "Balcony Area" },
        { value: "Pantry Area",              label: "Pantry Area" },
        { value: "Living Room Area (Suite)", label: "Living Room Area" },
        { value: "Corridor/Entrance Area",   label: "Corridor/Entrance Area" },
    ];

    return (
        <>
            <Seo title={"Management " + layout?.title} />
            <div className="flex flex-col gap-4 mb-24"> {/* Tambahan mb-24 agar table gak ketutupan footer sticky */}
                <div className="grid grid-cols-1 lg:grid-cols-12 h-fit gap-4">
                    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 h-fit gap-4">
                        <div className="col-span-12">
                            <fieldset className="border">
                                <legend className="ml-2 font-semibold text-base">Setup Info</legend>
                                <div className="grid grid-cols-1 lg:grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                                    <div className="col-span-12 lg:col-span-2">
                                        <InputMain
                                            typeInput="base"
                                            label="Sort No"
                                            disabled={false}
                                            required={false}
                                            error={false}
                                            rest={{
                                                name: "sort",
                                                type: "number",
                                                value: dataval?.sort ?? "",
                                                onChange: (e: any) => changeHandler(e, "number"),
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-12 lg:col-span-4">
                                        <InputMain
                                            typeInput="base"
                                            label="Code"
                                            disabled={false}
                                            required={true}
                                            error={false}
                                            rest={{
                                                name: "code",
                                                type: "text",
                                                value: dataval?.code ?? "",
                                                onChange: (e: any) => changeHandler(e, "text"),
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-12 lg:col-span-6">
                                        <InputMain
                                            typeInput="base"
                                            label="Item Name"
                                            disabled={false}
                                            required={true}
                                            error={false}
                                            rest={{
                                                name: "item_name",
                                                type: "text",
                                                value: dataval?.item_name ?? "",
                                                onChange: (e: any) => changeHandler(e, "text"),
                                            }}
                                        />
                                    </div>

                                    {/* <div className="col-span-12 lg:col-span-6">
                                        <InputMain
                                            typeInput="base"
                                            label="Category"
                                            disabled={false}
                                            required={false}
                                            error={false}
                                            rest={{
                                                name: "category",
                                                type: "text",
                                                value: dataval?.category ?? "",
                                                onChange: (e: any) => changeHandler(e, "text"),
                                            }}
                                        />
                                    </div> */}
                                    <div className="col-span-12 lg:col-span-6">
                                        <InputMain
                                            typeInput="select-multi"
                                            label="Category"
                                            disabled={false}
                                            required={false}
                                            error={false}
                                            options={categoryOptions}
                                            valueSel={
                                                dataval?.category_ori ??
                                                categoryOptions.find((o) => o.value === dataval?.category) ??
                                                null
                                            }
                                            onChangeSel={(e: any) => changeHandler(e, "select", "category")}
                                            rest={{ name: "category" }}
                                            isMulti={false}
                                        />
                                    </div>

                                    <div className="col-span-12 lg:col-span-6">
                                        <InputMain
                                            typeInput="select-multi"
                                            label="Used By"
                                            disabled={false}
                                            required={false}
                                            error={false}
                                            options={usedByOptions}
                                            valueSel={
                                                dataval?.used_by_ori ??
                                                usedByOptions.find(
                                                    (o) => o.value === (dataval?.used_by ?? "both")
                                                )
                                            }
                                            onChangeSel={(e: any) => changeHandler(e, "select", "used_by")}
                                            rest={{ name: "used_by" }}
                                            isMulti={false}
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <InputMain
                                            typeInput="textarea"
                                            label="Description"
                                            disabled={false}
                                            required={false}
                                            error={false}
                                            restArea={{
                                                name: "description",
                                                value: dataval?.description ?? "",
                                                onChange: (e: any) => changeHandler(e, "textarea"),
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-12 flex flex-wrap gap-8 mt-2 pt-4 border-t">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!dataval?.is_required}
                                                onChange={(e) => changeHandler(e, "checkbox", "is_required")}
                                            />
                                            <span>Required</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!dataval?.mandatory_inspection}
                                                onChange={(e) =>
                                                    changeHandler(e, "checkbox", "mandatory_inspection")
                                                }
                                            />
                                            <span>Mandatory Inspection</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!dataval?.status}
                                                onChange={(e) => changeHandler(e, "checkbox", "status")}
                                            />
                                            <span>Active</span>
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="col-span-12">
                            <fieldset className="border min-w-full">
                                <legend className="ml-2 font-semibold">Room Types</legend>
                                {/* DIGANTI: overflow-x-auto menjadi overflow-visible */}
                                <div className="m-2 overflow-visible">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 text-left">
                                                <th className="p-2 w-1/2">Room Type</th>
                                                <th className="p-2 w-24">Qty</th>
                                                <th className="p-2 w-24 text-center">Required</th>
                                                <th className="p-2 w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roomTypesDetail.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-3 text-center text-gray-400">
                                                        No room types added yet
                                                    </td>
                                                </tr>
                                            )}
                                            {roomTypesDetail.map((row, idx) => (
                                                <tr key={idx} className="border-b last:border-0">
                                                    <td className="p-2">
                                                        <InputMain
                                                            typeInput="select-multi"
                                                            label=""
                                                            disabled={false}
                                                            required={true}
                                                            error={false}
                                                            options={roomTypeOptions}
                                                            valueSel={row.room_type_id_ori}
                                                            onChangeSel={(e: any) =>
                                                                updateRoomTypeRow(idx, "room_type_id_ori", e)
                                                            }
                                                            rest={{ name: `rt_type_${idx}` }}
                                                            isMulti={false}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={row.qty}
                                                            onChange={(e) =>
                                                                updateRoomTypeRow(idx, "qty", e.target.value)
                                                            }
                                                            className="border rounded px-2 py-1 w-full text-sm"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!row.is_required}
                                                            onChange={(e) =>
                                                                updateRoomTypeRow(idx, "is_required", e.target.checked)
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRoomTypeRow(idx)}
                                                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                                                            title="Remove"
                                                        >
                                                            ×
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                        type="button"
                                        onClick={addRoomTypeRow}
                                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <span className="text-lg font-bold leading-none">+</span> Add Room Type
                                    </button>
                                </div>
                            </fieldset>
                        </div>

                        <div className="col-span-12">
                            <fieldset className="border min-w-full">
                                <legend className="ml-2 font-semibold">Specific Rooms</legend>
                                {/* DIGANTI: overflow-x-auto menjadi overflow-visible */}
                                <div className="m-2 overflow-visible">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 text-left">
                                                <th className="p-2 w-1/2">Room Type</th>
                                                <th className="p-2 w-24">Qty</th>
                                                <th className="p-2 w-24 text-center">Required</th>
                                                <th className="p-2 w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roomsDetail.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-3 text-center text-gray-400">
                                                        No specific rooms added yet
                                                    </td>
                                                </tr>
                                            )}
                                            {roomsDetail.map((row, idx) => (
                                                <tr key={idx} className="border-b last:border-0">
                                                    <td className="p-2">
                                                        <InputMain
                                                            typeInput="select-multi"
                                                            label=""
                                                            disabled={false}
                                                            required={true}
                                                            error={false}
                                                            options={roomOptions}
                                                            valueSel={row.room_id_ori}
                                                            onChangeSel={(e: any) => updateRoomRow(idx, "room_id_ori", e)}
                                                            rest={{ name: `room_${idx}` }}
                                                            isMulti={false}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={row.qty}
                                                            onChange={(e) => updateRoomRow(idx, "qty", e.target.value)}
                                                            className="border rounded px-2 py-1 w-full text-sm"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!row.is_required}
                                                            onChange={(e) =>
                                                                updateRoomRow(idx, "is_required", e.target.checked)
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRoomRow(idx)}
                                                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                                                            title="Remove"
                                                        >
                                                            ×
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                        type="button"
                                        onClick={addRoomRow}
                                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <span className="text-lg font-bold leading-none">+</span> Add Specific Room
                                    </button>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30 rounded-lg shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
                <div className="lg:ms-[250px] flex justify-end px-4 gap-4">
                    <ButtonSubmit
                        onCreate={() =>
                            router.replace({
                                pathname: window.location.pathname,
                                query: { parent: parent },
                            })
                        }
                        loading={loading}
                        label="Cancel"
                        isprimary={false}
                    />
                    <ButtonSubmit
                        onCreate={OnSave}
                        loading={loading}
                        label="Save"
                        isprimary={true}
                    />
                </div>
            </div>
        </>
    );
};

export default AddView;