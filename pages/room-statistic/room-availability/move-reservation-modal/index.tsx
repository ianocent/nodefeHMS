import React from "react";
import ButtonSubmit from "../../../../components/common/button/ButtonSubmit";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetDecrypt } from "../../../../components/helper";

const MoveReservationModal = ({
    data,
    onClose,
    onConfirm,
    onRevalidate,
}: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [checkIn,   setCheckIn]   = useState(data.new_check_in);
    const [checkOut,  setCheckOut]  = useState(data.new_check_out);
    const [revalidating, setRevalidating] = useState(false);

    // Sync when a new drag preview arrives (different folio)
    useEffect(() => {
        setCheckIn(data.new_check_in);
        setCheckOut(data.new_check_out);
        setIsEditing(false);
    }, [data.folio_number]);

    const invalidDate = new Date(checkIn) >= new Date(checkOut);

    const nightCount = (() => {
        const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
        const n    = Math.round(diff / (1000 * 60 * 60 * 24));
        return n > 0 ? n : 0;
    })();

    const revalidate = async () => {
        if (!onRevalidate) return;
        setRevalidating(true);
        try {
            await onRevalidate({
                folioId:     data.folio_number,
                fromRoom:    data.from_room,
                toRoom:      data.to_room,
                toDate:      checkIn,
                checkInDate: checkIn,
                checkOutDate: checkOut,
            });
        } finally {
            setRevalidating(false);
        }
    };

    // Debounce revalidation when user edits dates
    useEffect(() => {
        if (!isEditing) return;
        const timeout = setTimeout(() => { revalidate(); }, 800);
        return () => clearTimeout(timeout);
    }, [checkIn, checkOut]);

    if (!data) return null;

    // Detect if dates changed from original (snap happened)
    const dateChanged =
        checkIn  !== data.old_check_in ||
        checkOut !== data.old_check_out;

    return (
        <div className="overlay">
            <div className="bg-white rounded-xl p-5 w-full max-w-2xl mx-auto mt-10 shadow-xl">

                {/* Header */}
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    ✈ Move Reservation
                    {revalidating && (
                        <span className="text-xs font-normal text-blue-500 animate-pulse">
                            Checking availability…
                        </span>
                    )}
                </h2>

                {/* Guest summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="font-semibold text-gray-500 text-xs uppercase">Guest</div>
                        <div className="font-medium">{data.guest_name}</div>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-500 text-xs uppercase">Folio</div>
                        <div className="font-medium">{data.folio_number}</div>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-500 text-xs uppercase">Type</div>
                        <div>{data.type_reservation}</div>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-500 text-xs uppercase">Stay</div>
                        {/* ✅ Show live night count based on current check-in/out */}
                        <div>{nightCount} Night{nightCount !== 1 ? "s" : ""}</div>
                    </div>
                </div>

                {/* Before / After */}
                <div className="mt-5 grid grid-cols-2 gap-4">

                    {/* Before */}
                    <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="font-bold mb-2 text-gray-600">Before</div>
                        <div className="text-sm">Room: <strong>{data.from_room}</strong></div>
                        <div className="text-sm">Check In: {data.old_check_in}</div>
                        <div className="text-sm">Check Out: {data.old_check_out}</div>
                    </div>

                    {/* After */}
                    <div className={`border rounded-lg p-3 ${dateChanged ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}>
                        <div className="font-bold mb-2 flex items-center justify-between">
                            <span className={dateChanged ? "text-blue-700" : ""}>
                                After
                                {dateChanged && (
                                    <span className="ml-2 text-xs font-normal text-blue-500">
                                        (Date Adjustable)
                                    </span>
                                )}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                title={isEditing ? "Done editing" : "Edit dates"}
                                className="hover:text-blue-500 transition-colors"
                            >
                                {isEditing ? (
                                    <span className="text-xs text-white font-normal bg-primary p-2 rounded-md">Done</span>
                                ) : (
                                    <img src="/assets/images/apps/edit.png" className="w-[18px]" />
                                )}
                            </button>
                        </div>

                        <div className="text-sm">Room: <strong>{data.to_room}</strong></div>

                        {!isEditing ? (
                            <>
                                <div className="text-sm">Check In: <strong>{checkIn}</strong></div>
                                <div className="text-sm">Check Out: <strong>{checkOut}</strong></div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 mt-2">
                                <div>
                                    <label className="text-xs text-gray-500">Check In</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="border rounded px-2 py-1 w-full text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Check Out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        min={checkIn}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="border rounded px-2 py-1 w-full text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Invalid date error */}
                {invalidDate && (
                    <div className="mt-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                        ⚠ Check-out must be after check-in
                    </div>
                )}

                {/* Parent GIT info */}
                {data.parent && (
                    <div className="mt-4 border rounded p-3 bg-gray-50">
                        <div className="font-bold mb-1 text-sm">Parent GIT</div>
                        <div className="text-sm">Parent Folio: {data.parent.parent_folio}</div>
                        <div className="text-sm">
                            Parent Stay: {data.parent.parent_check_in} – {data.parent.parent_check_out}
                        </div>
                    </div>
                )}

                {/* Warnings */}
                {data.warnings?.length > 0 && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
                        <div className="font-bold text-red-600 mb-2 text-sm">⚠ Warning</div>
                        {data.warnings.map((w: string, i: number) => (
                            <div key={i} className="text-red-600 text-sm">• {w}</div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-6">
                    <ButtonSubmit
                        label="Cancel"
                        isprimary={false}
                        onCreate={onClose}
                    />
                    <ButtonSubmit
                        label={revalidating ? "Checking…" : "Save Changes"}
                        onCreate={onConfirm}
                        disabled={invalidDate || !data.can_move || revalidating}
                    />
                </div>
            </div>
        </div>
    );
};

export default MoveReservationModal;