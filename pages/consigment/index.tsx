import React from "react";
import Seo from "../../components/common/seo";
import PaperBase from "../../components/common/paper/PaperBase";

/**
 * Placeholder for the "Consignment" menu (menus.id 1131).
 *
 * The menu row exists and points at /consigment, but there is no consignment
 * module anywhere: not in the Laravel reference, not in the Node backend, not in
 * this frontend, and not in the database. Until that module is built there is
 * nothing to list, so this page states that plainly instead of letting the route
 * fall through to Next's 404 -- a blank error page reads as a broken app rather
 * than an unbuilt feature.
 *
 * Replace this file with the real list view once the backend endpoint exists;
 * nothing else references it.
 */
const Consignment = () => {
  return (
    <>
      <Seo title="Consignment" />

      <PaperBase>
        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🚧</span>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-2">Consignment</h2>

          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            This module is still under construction. The menu is already available
            in the sidebar, but there is no consignment data to display yet.
          </p>

          <p className="text-xs text-gray-400 mt-4">
            It will be enabled here once the setup is finished.
          </p>
        </div>
      </PaperBase>
    </>
  );
};

export default Consignment;