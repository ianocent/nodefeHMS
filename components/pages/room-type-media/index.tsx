import React from "react";
import Seo from "../../common/seo";
import AddPage from "./form";

/**
 * Room Type > Image (menu 1099) and Room Type > Facility (menu 1195) are the same
 * screen with a different kind, because both write room-TYPE scoped rows the booking
 * engine reads: photos via RoomType::getRoomTypeImageAttribute, amenities via
 * RoomType::getFacilitiesAttribute. Two near-identical 450-line forms would drift
 * apart on the first fix.
 *
 * `kind` comes from the route (pages/master-setup/index.tsx maps the menu visibility
 * key), not from a query parameter, so the plain URL in `menus.url` renders the right
 * screen. The room type being edited arrives as `?data=<room_type_id>`, the convention
 * every Room Type sub-tab already uses.
 */
const RoomTypeMedia = ({ kind }: { kind: "image" | "facility" }) => {
  return (
    <>
      <Seo
        title={`Management Room Type ${kind === "image" ? "Image" : "Facility"}`}
      />
      <AddPage kind={kind} />
    </>
  );
};

export default RoomTypeMedia;
