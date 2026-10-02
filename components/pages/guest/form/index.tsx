import { useContext } from "react";
import { LayoutContext } from "../../../../context/LayoutContext";
import TableView from "../../../common/table-edit";
import GuestWizard from "./guest-wizard";

interface AddviewProps {
  isview?: boolean;
  isPopup?: boolean;
  ActionSv?: (id, fn, ln, ti, pn, em, gs, all) => void;
  OnCancelSv?: () => void;
  nameinit?: string;
}

/**
 * Guest form entry point.
 *
 * The wizard itself lives in ./guest-wizard — quick single-step when rendered
 * inside a popup (reservation / front desk), full five steps on the profile
 * page. This file only keeps the profile sub-tables (notes, loyalty, family,
 * preference), which only exist in edit mode.
 */
const AddView = (props: AddviewProps) => {
  const { isview = false, isPopup = false, ActionSv, OnCancelSv, nameinit } = props;
  const layout = useContext(LayoutContext);
  const guestId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("data")
      : null;

  return (
    <>
      <GuestWizard
        isview={isview}
        isPopup={isPopup}
        ActionSv={ActionSv}
        OnCancelSv={OnCancelSv}
        nameinit={nameinit}
      />

      {!isPopup && guestId !== null && (
        <div className="w-full max-w-6xl mx-auto px-2 pb-24">
          {/* Two side-by-side rows instead of one long stack: the four
              sub-tables are short lists and were wasting a full screen each. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <fieldset className="border min-w-full table-auto">
              <legend className="ml-2">Request Notes</legend>
              <div className="m-2">
                <TableView
                  uri="/cms/profile/guest-notes"
                  queryString={"&guest_id=" + guestId}
                  groups=""
                  isEditTable={true}
                  isTitle={false}
                  isDeleted={true}
                  isBtnView={false}
                />
              </div>
            </fieldset>

            <fieldset className="border min-w-full table-auto">
              <legend className="ml-2">Loyalty Card</legend>
              <div className="m-2">
                <TableView
                  uri="/cms/profile/guest-loyalty-card"
                  queryString={"&guest_id=" + guestId}
                  groups=""
                  isEditTable={true}
                  isTitle={false}
                  isDeleted={true}
                  isBtnView={false}
                />
              </div>
            </fieldset>

            <fieldset className="border min-w-full table-auto">
              <legend className="ml-2">Family Member</legend>
              <div className="m-2">
                <TableView
                  uri="/cms/profile/guest-family-member"
                  queryString={"&guest_id=" + guestId}
                  groups=""
                  isEditTable={true}
                  isTitle={false}
                  isDeleted={true}
                  isBtnView={false}
                />
              </div>
            </fieldset>

            <fieldset className="border min-w-full table-auto">
              <legend className="ml-2">Preference</legend>
              <div className="m-2">
                <TableView
                  uri="/cms/profile/guest-preference"
                  queryString={"&guest_id=" + guestId}
                  groups=""
                  isEditTable={true}
                  isTitle={false}
                  isDeleted={true}
                  isBtnView={false}
                />
              </div>
            </fieldset>
          </div>

          <div className="mt-2 text-xs text-gray-500">Managing {layout?.title} profile.</div>
        </div>
      )}
    </>
  );
};

export default AddView;