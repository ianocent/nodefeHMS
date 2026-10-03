import React from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";

// Fully read-only ledger: the booking engine writes every row when a guest earns or
// redeems points, so the reference controller answers 400 on create/update/delete.
const GuestPointTransaction = () => {
  const GLOBALURI = "/cms/content/guest-point-transaction";
  const groups = "guest-point-transaction";

  return (
    <>
      <Seo
        title={
          "Management " + GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      <div className="mt-2 min-w-full table-auto">
        <TableView groups={groups} uri={GLOBALURI} isEditTable={false} />
      </div>
    </>
  );
};

export default GuestPointTransaction;