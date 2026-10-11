const fs = require('fs');
const file = 'components/pages/reservation-fit/transaction/index.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace submitApproval
const submitTarget = `  const submitApproval = () => {
    const id = approverId.trim();
    const pin = approverPin.trim();
    if (!id || !pin) {
      setApprovalError("Supervisor ID and PIN are both required.");
      return;
    }
    setApproval({ approved_by: id, approval_pin: pin });
    const action = approvalAction;
    setApprovalAction(null);
    if (action === "void") {
      showPopup("void", "Void");
    } else if (action === "refund") {
      showPopup("refund", "Refund");
    }
  };`;

const submitReplacement = `  const submitApproval = () => {
    const pin = approverPin.trim();
    if (!pin) {
      setApprovalError("PIN is required.");
      return;
    }
    setApproval({ approved_by: "self", approval_pin: pin });
    const action = approvalAction;
    setApprovalAction(null);
    if (action === "void") {
      showPopup("void", "Void");
    } else if (action === "refund") {
      showPopup("refund", "Refund");
    }
  };`;

code = code.replace(submitTarget.replace(/\n/g, '\r\n'), submitReplacement.replace(/\n/g, '\r\n'));
code = code.replace(submitTarget.replace(/\n/g, '\n'), submitReplacement.replace(/\n/g, '\n'));

// Replace JSX
const jsxTarget = `            <div className="flex flex-col gap-3">
              <label className="text-xs text-gray-500">
                Supervisor ID
                <input
                  autoFocus
                  type="text"
                  value={approverId}
                  onChange={(e) => setApproverId(e.target.value)}
                  placeholder="Supervisor user id"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-gray-500">
                Supervisor PIN
                <input
                  type="password"
                  value={approverPin}
                  onChange={(e) => setApproverPin(e.target.value)}
                  placeholder="Approval PIN"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </label>`;

const jsxReplacement = `            <div className="flex flex-col gap-3">
              <label className="text-xs text-gray-500">
                Endshift PIN
                <input
                  autoFocus
                  type="password"
                  value={approverPin}
                  onChange={(e) => setApproverPin(e.target.value)}
                  placeholder="Approval PIN"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  autoComplete="new-password"
                />
              </label>`;

code = code.replace(jsxTarget.replace(/\n/g, '\r\n'), jsxReplacement.replace(/\n/g, '\r\n'));
code = code.replace(jsxTarget.replace(/\n/g, '\n'), jsxReplacement.replace(/\n/g, '\n'));

fs.writeFileSync(file, code);
console.log("Done");
