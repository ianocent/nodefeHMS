import React, { useEffect } from "react";
import TableView from "./index";
import { FetchData } from "../../helper";

interface DraggableTableViewProps {
    [key: string]: any;
    onPreviewMoveReservation?: (payload: any) => Promise<void>;
    businessDate?: string;
    accessToken?: string;
}

const DraggableTableView = ({
    onPreviewMoveReservation,
    businessDate,
    accessToken,
    router,
    ...tableProps
}: DraggableTableViewProps) => {

    // ─── Tooltip helpers ────────────────────────────────────────────────────────

    const getTooltip = (): HTMLElement => {
        let el = document.getElementById("rsv-tooltip");
        if (!el) {
            el = document.createElement("div");
            el.id = "rsv-tooltip";
            Object.assign(el.style, {
                position:      "fixed",
                zIndex:        "9999",
                background:    "#1e293b",
                color:         "#f1f5f9",
                borderRadius:  "8px",
                padding:       "10px 14px",
                fontSize:      "12px",
                lineHeight:    "1.7",
                pointerEvents: "none",
                boxShadow:     "0 4px 20px rgba(0,0,0,0.35)",
                minWidth:      "200px",
                display:       "none",
                transition:    "opacity 0.15s",
            });
            document.body.appendChild(el);
        }
        return el;
    };

    const showTooltip = (html: string, x: number, y: number) => {
        const tip = getTooltip();
        tip.innerHTML = html;
        tip.style.display = "block";
        const vw = window.innerWidth;
        const tw = tip.offsetWidth || 220;
        const left = x + 16 + tw > vw ? x - tw - 8 : x + 16;
        tip.style.left = `${left}px`;
        tip.style.top  = `${Math.max(4, y - 10)}px`;
    };

    const hideTooltip = () => {
        const tip = document.getElementById("rsv-tooltip");
        if (tip) tip.style.display = "none";
    };

    // ─── Drag ghost label ────────────────────────────────────────────────────────
    // Shows a small pill near the cursor while dragging so user always knows what they're moving

    const getDragGhost = (): HTMLElement => {
        let el = document.getElementById("rsv-drag-ghost");
        if (!el) {
            el = document.createElement("div");
            el.id = "rsv-drag-ghost";
            Object.assign(el.style, {
                position:      "fixed",
                zIndex:        "10000",
                background:    "#3b82f6",
                color:         "#fff",
                borderRadius:  "6px",
                padding:       "4px 10px",
                fontSize:      "11px",
                fontWeight:    "600",
                pointerEvents: "none",
                boxShadow:     "0 2px 10px rgba(0,0,0,0.3)",
                display:       "none",
                whiteSpace:    "nowrap",
                letterSpacing: "0.3px",
            });
            document.body.appendChild(el);
        }
        return el;
    };

    const showDragGhost = (text: string, x: number, y: number) => {
        const ghost = getDragGhost();
        ghost.textContent = text;
        ghost.style.display = "block";
        ghost.style.left = `${x + 14}px`;
        ghost.style.top  = `${y - 28}px`;
    };

    const moveDragGhost = (x: number, y: number) => {
        const ghost = document.getElementById("rsv-drag-ghost");
        if (!ghost || ghost.style.display === "none") return;
        ghost.style.left = `${x + 14}px`;
        ghost.style.top  = `${y - 28}px`;
    };

    const hideDragGhost = () => {
        const ghost = document.getElementById("rsv-drag-ghost");
        if (ghost) ghost.style.display = "none";
    };

    // ─── Utilities ───────────────────────────────────────────────────────────────

    const tooltipCache: Record<string, string> = {};

    const extractFolioId = (text: string): string | null => {
        const cleaned = text.replace(/\s+/g, " ").trim();
        // const match   = cleaned.match(/\b[FG]\d{12}(?:\/\d{3})?\b/i);
        const match = cleaned.match(/\b[FG]\d{8,13}(?:\/\d{3})?\b/i);
        return match ? match[0].toUpperCase() : null;
    };

    const getDateFromColumnIndex = (index: number): string => {
        const dateFrom = new URLSearchParams(window.location.search).get("date_from");
        const baseDate = dateFrom || businessDate || new Date().toISOString().split("T")[0];
        const [year, month, day] = baseDate.split("-").map(Number);
        const offset = index - 4;
        const result = new Date(Date.UTC(year, month - 1, day + offset));
        return result.toISOString().split("T")[0];
    };

    const fmtDate = (d: string) => {
        if (!d) return "-";
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const parts = d.split("-");
        if (parts.length !== 3) return d;
        return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    };

    // ─── Main effect ─────────────────────────────────────────────────────────────

    useEffect(() => {
        const wrapper = document.getElementById("draggable-wrapper");
        if (!wrapper) return;

        // Track which cells already have reservation content so drop targets
        // can visually indicate "occupied" vs "empty" during drag
        const reservationDates = new Set<string>(); // key: "room__date"

        const attachDragDrop = () => {
            const table = wrapper.querySelector("table");
            if (!table) return;

            reservationDates.clear();

            const rows = table.querySelectorAll("tbody tr");

            rows.forEach((row) => {
                const firstCell = row.querySelector("td:first-child");
                const roomId =
                    firstCell?.textContent
                        ?.replace(/\s+/g, " ")
                        ?.trim()
                        ?.match(/[A-Z0-9-]+/)?.[0] || "";

                const cells = row.querySelectorAll("td");

                cells.forEach((cell, index) => {
                    const htmlCell = cell as HTMLElement;
                    const normalizedDate = index >= 4 ? getDateFromColumnIndex(index) : "";

                    if (normalizedDate) {
                        htmlCell.dataset.drop = "true";
                        htmlCell.dataset.room = roomId;
                        htmlCell.dataset.date = normalizedDate;
                    }

                    const text = htmlCell.innerText || htmlCell.textContent || "";
                    const folioId = extractFolioId(text);

                    // Prefix-prefix yang menandakan status bukan pure RESERVATION
                    // → cell ini tetap dianggap "occupied" tapi TIDAK bisa di-drag
                    const NON_DRAGGABLE_PREFIXES = [
                        "CHECK-IN",
                        "CHECK-OUT",
                        // "CHECKED-IN",
                        // "CHECKED-OUT",
                        // "CHECK_IN",
                        // "CHECK_OUT",
                    ];

                    const upperText = text.trim().toUpperCase();
                    const isNonDraggable = NON_DRAGGABLE_PREFIXES.some((p) =>
                        upperText.startsWith(p)
                    );

                    if (folioId) {
                        // Tandai sebagai occupied untuk drop-zone coloring
                        if (normalizedDate) {
                            reservationDates.add(`${roomId}__${normalizedDate}`);
                        }

                        if (isNonDraggable) {
                            // Occupied tapi tidak bisa di-drag (CHECK-IN / CHECK-OUT)
                            htmlCell.dataset.reservation = "true"; // block drop ke sini
                            htmlCell.dataset.folio  = folioId;
                            htmlCell.dataset.room   = roomId;
                            htmlCell.dataset.date   = normalizedDate;
                            htmlCell.style.cursor = "not-allowed";
                            const tooltipEl = htmlCell.querySelector(".tooltiptext") as HTMLElement | null;
                            if (tooltipEl) tooltipEl.style.display = "none";
                            return; // ← skip pasang draggable
                        }

                        // Pure RESERVATION → bisa di-drag
                        htmlCell.dataset.reservation = "true";
                        htmlCell.dataset.folio  = folioId;
                        htmlCell.dataset.room   = roomId;
                        htmlCell.dataset.date   = normalizedDate;
                        htmlCell.dataset.draggable = "true"; // flag tambahan

                        if (!htmlCell.dataset.checkIn)  htmlCell.dataset.checkIn  = "";
                        if (!htmlCell.dataset.checkOut) htmlCell.dataset.checkOut = "";

                        htmlCell.draggable        = true;
                        htmlCell.style.cursor     = "grab";
                        htmlCell.style.userSelect = "none";
                        htmlCell.dataset.clickable = "true";
                    }
                });
            });
        };

        const observer = new MutationObserver(() => { attachDragDrop(); });
        observer.observe(wrapper, { childList: true, subtree: true });
        setTimeout(() => { attachDragDrop(); }, 500);

        // ── Drag start ──────────────────────────────────────────────────────────
        // Store pending fetch promises keyed by folio so handleDrop can await them
        const pendingFetch: Record<string, Promise<void>> = {};

        const handleDragStart = (e: any) => {
            isDragging = true;
            const target = e.target.closest("[data-draggable='true']") as HTMLElement | null;
            if (!target) return;

            const folio    = target.dataset.folio    || "";
            const fromRoom = target.dataset.room     || "";
            const fromDate = target.dataset.date     || "";

            // If checkIn/checkOut still empty (tooltip never opened), fetch now.
            // handleDrop awaits pendingFetch[folio] before computing the new checkout.
            if (folio && accessToken && (!target.dataset.checkIn || !target.dataset.checkOut)) {
                pendingFetch[folio] = FetchData(
                    `/cms/statistic/room-availability/folio/${encodeURIComponent(folio)}`,
                    "GET", "", false, accessToken, router, ""
                ).then((json: any) => {
                    const d = json?.data;
                    if (d) {
                        target.dataset.checkIn  = d.check_in_date  || "";
                        target.dataset.checkOut = d.check_out_date || "";
                    }
                }).catch(() => { /* leave empty; handleDrop will guard */ });
            }

            const payload = {
                folioId:      folio,
                fromRoom,
                fromDate,
                checkInDate:  target.dataset.checkIn  || "",
                checkOutDate: target.dataset.checkOut || "",
                _el: folio, // used by handleDrop to re-read dataset after fetch resolves
            };

            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("application/json", JSON.stringify(payload));
            target.style.opacity = "0.45";

            showDragGhost(`✈ ${folio}  ·  ${fromRoom}`, e.clientX, e.clientY);
        };

        // ── Drag end ────────────────────────────────────────────────────────────

        const handleDragEnd = (e: any) => {
            setTimeout(() => {
                isDragging = false;
            }, 100);
            const target = e.target.closest("[data-reservation='true']");
            if (target) target.style.opacity = "1";
            hideDragGhost();

            // Reset all drop-zone highlights
            wrapper.querySelectorAll<HTMLElement>("[data-drop='true']").forEach((cell) => {
                cell.style.backgroundColor = "";
                cell.style.outline = "";
            });
        };

        const handleClick = (e: any) => {
          if (isDragging) return;

          const target = (e.target as HTMLElement).closest(
            "[data-clickable='true']",
          ) as HTMLElement | null;
          if (!target) return;

          // Cari anchor <a> di dalam cell, klik programatically
          const anchor = target.querySelector("a") as HTMLAnchorElement | null;
          if (anchor) {
            anchor.click();
            return;
          }

          // Fallback: kalau tidak ada anchor, coba ambil dari href di dalam cell
          // atau navigasi manual via folio ID (sesuaikan URL pattern lo)
          const folio = target.dataset.folio;
          if (folio) {
            // Sesuaikan dengan URL pattern folio di project lo
            // Contoh: /cms/reservation/fit/reservation?folio=F100026060004
            // window.location.href = `/cms/reservation/data/?folio=${folio}`;
            window.location.href = `/cms/reservation/fit/reservation?folio=${folio}`;
          }
        };

        // ── Drag over ───────────────────────────────────────────────────────────

        const handleDragOver = (e: any) => {
            const target = e.target.closest("[data-drop='true']") as HTMLElement | null;
            if (!target) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";

            // ✅ FIX #1 bonus: color drop zone red if occupied, blue if empty
            const key = `${target.dataset.room}__${target.dataset.date}`;
            const isOccupied = reservationDates.has(key);

            target.style.backgroundColor = isOccupied ? "#fee2e2" : "#dbeafe";
            target.style.outline = isOccupied ? "2px dashed #ef4444" : "2px dashed #3b82f6";

            moveDragGhost(e.clientX, e.clientY);
        };

        // ── Drag leave ──────────────────────────────────────────────────────────

        const handleDragLeave = (e: any) => {
            const target = e.target.closest("[data-drop='true']") as HTMLElement | null;
            if (!target) return;
            target.style.backgroundColor = "";
            target.style.outline = "";
        };

        // ── Drop ────────────────────────────────────────────────────────────────

        const handleDrop = async (e: any) => {
            const target = e.target.closest("[data-drop='true']") as HTMLElement | null;
            if (!target) return;

            e.preventDefault();
            target.style.backgroundColor = "";
            target.style.outline = "";

            const raw = e.dataTransfer.getData("application/json");
            if (!raw) return;

            const source = JSON.parse(raw);

            // FIX #1 — drop ke cell yang sudah ada reservasi → no-op
            if (target.dataset.reservation === "true") {
                // console.log("DROP TARGET IS RESERVATION CELL – no-op");
                return;
            }

            const folioId    = source.folioId;
            const newRoom    = target.dataset.room;
            const newCheckIn = target.dataset.date;

            const isValidDate = (s: string) =>
                Boolean(s) && s !== "" && !isNaN(new Date(s).getTime());

            if (!folioId || !newRoom || !isValidDate(newCheckIn)) {
                // console.log("INVALID DROP TARGET", { folioId, newRoom, newCheckIn });
                return;
            }

            // Await pending fetch jika dragstart sudah kick off API call
            // (user drag tanpa hover tooltip dulu)
            if (pendingFetch[folioId]) {
                await pendingFetch[folioId];
                delete pendingFetch[folioId];
            }

            // Re-read checkIn/checkOut dari DOM element sumber (mungkin sudah diisi setelah fetch)
            const sourceEl = wrapper.querySelector(
                `[data-reservation='true'][data-folio='${folioId}']`
            ) as HTMLElement | null;

            const resolvedCheckIn  = sourceEl?.dataset.checkIn  || source.checkInDate  || "";
            const resolvedCheckOut = sourceEl?.dataset.checkOut || source.checkOutDate || "";

            // FIX #2 — hitung durasi asli, snap check-out dengan offset yang sama
            let durationDays = 1;
            if (isValidDate(resolvedCheckIn) && isValidDate(resolvedCheckOut)) {
                const diff =
                    new Date(resolvedCheckOut).getTime() - new Date(resolvedCheckIn).getTime();
                if (diff > 0) durationDays = Math.round(diff / (1000 * 60 * 60 * 24));
            }

            const newCheckOut = new Date(
                new Date(newCheckIn).getTime() + durationDays * 24 * 60 * 60 * 1000
            ).toISOString().split("T")[0];

            if (newRoom === source.fromRoom && newCheckIn === source.fromDate) {
                // console.log("SAME CELL – no-op");
                return;
            }

            if (onPreviewMoveReservation) {
                await onPreviewMoveReservation({
                    folioId,
                    fromRoom:     source.fromRoom,
                    toRoom:       newRoom,
                    toDate:       newCheckIn,
                    checkInDate:  newCheckIn,
                    checkOutDate: newCheckOut,
                });
            }
        };

        // ── Mouse-over tooltip ──────────────────────────────────────────────────

        const handleMouseEnter = async (e: any) => {
            const target = (e.target as HTMLElement).closest("[data-reservation='true']") as HTMLElement | null;
            if (!target) return;

            const folio = target.dataset.folio;
            if (!folio) return;

            showTooltip(
                `<div style="opacity:0.6">Loading <strong>${folio}</strong>…</div>`,
                e.clientX, e.clientY
            );

            if (tooltipCache[folio]) {
                showTooltip(tooltipCache[folio], e.clientX, e.clientY);
                return;
            }

            try {
                const token = accessToken;
                if (!token) {
                    console.warn("accessToken is empty, skip fetch tooltip");
                    return;
                }

                const json = await FetchData(
                    `/cms/statistic/room-availability/folio/${encodeURIComponent(folio)}`,
                    "GET",
                    "",
                    false,
                    accessToken,
                    router,
                    ""
                );

                const d = json?.data;
                if (!d) throw new Error("No data");

                target.dataset.checkIn  = d.check_in_date  || "";
                target.dataset.checkOut = d.check_out_date || "";

                const html = `
                    <div style="margin-bottom:6px;font-size:13px;font-weight:700;color:#93c5fd;border-bottom:1px solid #334155;padding-bottom:4px">
                        📋 ${folio}
                    </div>
                    <div style="margin:2px 0">👤 <strong>Guest</strong>: ${d.guest_name        || "-"}</div>
                    <div style="margin:2px 0">👤 <strong>Company</strong>: ${d.company_name        || "-"}</div>
                    <div style="margin:2px 0">🏷️ <strong>Rate</strong>: ${d.rate_name          || "-"}</div>
                    <div style="margin:2px 0">📅 <strong>Check-In</strong>: ${fmtDate(d.check_in_date)}</div>
                    <div style="margin:2px 0">📅 <strong>Check-Out</strong>: ${fmtDate(d.check_out_date)}</div>
                    <div style="margin:2px 0">🛏️ <strong>Room</strong>: ${d.room_name          || "-"}</div>
                    <div style="margin:2px 0">🔖 <strong>Status</strong>: ${d.status            || "-"}</div>
                    <div style="margin:2px 0">📌 <strong>Type</strong>: ${d.type_reservation   || "-"}</div>
                    <div style="margin-top:6px;font-size:10px;opacity:0.5;border-top:1px solid #334155;padding-top:4px">Drag to move reservation</div>
                `;
                tooltipCache[folio] = html;
                showTooltip(html, e.clientX, e.clientY);

            } catch (err) {
                const errHtml = `<div style="color:#fca5a5">Failed to load <strong>${folio}</strong></div>`;
                tooltipCache[folio] = errHtml;
                showTooltip(errHtml, e.clientX, e.clientY);
                console.warn("Tooltip fetch error:", err);
            }
        };

        const handleMouseMove = (e: any) => {
            const tip = document.getElementById("rsv-tooltip");
            if (!tip || tip.style.display === "none") return;
            const vw = window.innerWidth;
            const tw = tip.offsetWidth || 220;
            const left = e.clientX + 16 + tw > vw ? e.clientX - tw - 8 : e.clientX + 16;
            tip.style.left = `${left}px`;
            tip.style.top  = `${Math.max(4, e.clientY - 10)}px`;
        };

        const handleMouseLeave = (e: any) => {
            const target = (e.target as HTMLElement).closest("[data-reservation='true']");
            if (!target) return;
            hideTooltip();
        };

        // ── Register events ─────────────────────────────────────────────────────

        let isDragging = false;
        
        wrapper.addEventListener("dragstart",   handleDragStart);
        wrapper.addEventListener("dragend",     handleDragEnd);
        wrapper.addEventListener("dragover",    handleDragOver);
        wrapper.addEventListener("dragleave",   handleDragLeave);
        wrapper.addEventListener("drop",        handleDrop);
        wrapper.addEventListener("mouseover",   handleMouseEnter);
        wrapper.addEventListener("mousemove",   handleMouseMove);
        wrapper.addEventListener("mouseout",    handleMouseLeave);
        wrapper.addEventListener("click", handleClick);

        return () => {
            observer.disconnect();
            hideTooltip();
            hideDragGhost();
            wrapper.removeEventListener("dragstart",   handleDragStart);
            wrapper.removeEventListener("dragend",     handleDragEnd);
            wrapper.removeEventListener("dragover",    handleDragOver);
            wrapper.removeEventListener("dragleave",   handleDragLeave);
            wrapper.removeEventListener("drop",        handleDrop);
            wrapper.removeEventListener("mouseover",   handleMouseEnter);
            wrapper.removeEventListener("mousemove",   handleMouseMove);
            wrapper.removeEventListener("mouseout",    handleMouseLeave);
            wrapper.removeEventListener("click", handleClick);
        };
    }, [accessToken]);

    return (
        <div id="draggable-wrapper">
            <TableView
                uri=""
                groups=""
                {...tableProps}
            />
        </div>
    );
};

export default DraggableTableView;