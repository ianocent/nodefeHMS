import { useState } from "react";
import InputMain from "../../../common/input/InputMain";
import { GetEncrypt } from "../../../helper";

const FormStaahOta = ({ data, onSave, onCancel, saving }: any) => {
  const isEdit = !!data?.data?.id;

  const [channelId, setChannelId] = useState(
    data?.data?.channel_id || data?.form?.channel_id?.value || "",
  );
  const [channelName, setChannelName] = useState(
    data?.data?.channel_name || data?.form?.channel_name?.value || "",
  );
  const [companyProfileId, setCompanyProfileId] = useState(
    data?.data?.company_profile_id ||
      data?.form?.company_profile_id?.value ||
      "",
  );

  const initialStatus =
    data?.data?.status !== undefined
      ? !!data?.data?.status
      : data?.form?.status?.value !== undefined
      ? !!data?.form?.status?.value
      : true;

  const [status, setStatus] = useState<boolean>(initialStatus);

  const handleSave = () => {
    const payload = {
      channel_id: channelId,
      channel_name: channelName,
      company_profile_id: companyProfileId,
      status: status ? 1 : 0,
    };

    const raw = JSON.stringify(payload);
    const encryptedPayload = GetEncrypt(raw); // ← Pakai GetEncrypt seperti contoh kamu

    onSave?.(encryptedPayload); // Kirim string encrypted, bukan object
  };

  const companyOptions = data?.form?.company_profile_id?.options || [];
  const channelOptions = data?.form?.channel_id?.options || [];

  const handleChannelChange = (e: any) => {
    const selectedCode = e.target.value;
    setChannelId(selectedCode);

    const matched = channelOptions.find((o: any) => String(o.value) === String(selectedCode));
    if (matched) {
      const cleanName = matched.label.replace(/\s*\(code:.*\)$/, "");
      setChannelName(cleanName);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md w-full">
      <h2 className="text-lg font-bold mb-4">
        {isEdit ? "Edit Mapping OTA" : "Add Mapping OTA"}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <InputMain
          typeInput="select"
          label="Channel (dari STAAH)"
          error={false}
          options={channelOptions}
          valueSel={channelId}
          onChangeSel={handleChannelChange}
          disabled={isEdit}
        />
        <InputMain
          typeInput="base"
          label="Nama OTA (contoh: Expedia, Agoda, Booking.com)"
          error={false}
          rest={{
            name: "channel_name",
            value: channelName,
            onChange: (e: any) => setChannelName(e.target.value),
          }}
        />
        <InputMain
          typeInput="select"
          label="Company Profile"
          error={false}
          options={companyOptions}
          valueSel={companyProfileId}
          onChangeSel={(e: any) => setCompanyProfileId(e.target.value)}
        />
        <InputMain
          typeInput="checkbox"
          label="Status"
          error={false}
          valuename="status"
          valueSel={status}
          onChangeSel={(e: any) => setStatus(e.target.checked)}
        />
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default FormStaahOta;
