import React from "react";
import Seo from "../../common/seo";
import TableView from "../../common/table-edit";

// Read + status-only module: rows are created by the guest portal on the booking
// engine, so there is no create form (the reference controller answers 400 on
// store/destroy). `isEditTable` gives the inline status dropdown.
const RewardRedemption = () => {
  const GLOBALURI = "/cms/content/reward-redemption";
  const groups = "reward-redemption";

  return (
    <>
      <Seo
        title={
          "Management " + GLOBALURI.replaceAll("/cms/", " ").replaceAll("-", " ")
        }
      />

      <div className="mt-2 min-w-full table-auto">
        <TableView groups={groups} uri={GLOBALURI} isEditTable={true} />
      </div>
    </>
  );
};

export default RewardRedemption;