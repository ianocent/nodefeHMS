import React, { useEffect, useState } from "react";
import Seo from "../../components/common/seo";
import { FetchData, GetDecrypt } from "../../components/helper";
import { useSelector } from "react-redux";
import LayoutComponent from "../../components/common/layout/LayoutComponent";
import FormStaahOta from "../../components/pages/staah-ota-mapping/form/form";

const StaahMapping = () => {
  const API_URI = "/cms/staah-ota-mapping";
  const [load, setLoad] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const token = datalocal?.data?.access_token;

  const fetchList = async () => {
    setLoadingList(true);
    try {
      const res = await FetchData(API_URI, "GET", "", false, token, "", "");
      setList(res?.data || []);
    } catch (error) {
      console.log("error fetch list", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const GetSync = async () => {
    try {
      setLoad(true);
      await FetchData(
        "/sync/staah-ota-mapping",
        "GET",
        "",
        false,
        token,
        "",
        "",
      );
      await fetchList();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoad(false);
    }
  };

  const openAdd = async () => {
    try {
      const res = await FetchData(
        `${API_URI}/create`,
        "GET",
        "",
        false,
        token,
        "",
        "",
      );
      setFormData(res);
      setModalOpen(true);
    } catch (error) {
      console.log("error open add", error);
    }
  };

  const openEdit = async (id: number) => {
    try {
      const res = await FetchData(
        `${API_URI}/${id}/update`,
        "GET",
        "",
        false,
        token,
        "",
        "",
      );
      setFormData(res);
      setModalOpen(true);
    } catch (error) {
      console.log("error open edit", error);
    }
  };

  const handleSave = async (encryptedPayload: any) => {
    setSaving(true);
    try {
      const isEdit = !!formData?.data?.id;
      const url = isEdit ? `${API_URI}/${formData.data.id}` : API_URI;
      const method = isEdit ? "PUT" : "POST";

      await FetchData(
        url,
        method,
        encryptedPayload,
        false,
        token,
        "",
        "",
      );

      setModalOpen(false);
      setFormData(null);
      await fetchList();
    } catch (error) {
      console.log("error save", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus mapping ini?")) return;
    try {
      await FetchData(`${API_URI}/${id}`, "DELETE", "", false, token, "", "");
      await fetchList();
    } catch (error) {
      console.log("error delete", error);
    }
  };

  return (
    <LayoutComponent>
      <Seo title={"Management Staah OTA Mapping"} />

      <div className="flex items-end justify-end w-full gap-2">
        {/* <div
          onClick={() => {
            if (!load) GetSync();
          }}
          className="p-2 bg-green text-white rounded-md flex px-4 shadow-lg cursor-pointer"
        >
          {load ? "..." : "Sync"}
        </div> */}
        <div
          onClick={openAdd}
          className="p-2 bg-success text-white rounded-md flex px-4 shadow-lg cursor-pointer"
        >
          + Add
        </div>
      </div>

      <div className="mt-4 min-w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">OTA / Channel</th>
              <th className="p-3 border">Channel ID (STAAH)</th>
              <th className="p-3 border">Company Profile</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loadingList && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loadingList && list.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Belum ada mapping
                </td>
              </tr>
            )}
            {list.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="p-3 border">
                  {item.channel_name || `Channel #${item.channel_id}`}
                </td>
                <td className="p-3 border">{item.channel_id}</td>
                <td className="p-3 border">
                  {item.company_profile?.name || (
                    <span className="text-red-500 italic">
                      - Belum di-mapping -
                    </span>
                  )}
                </td>
                <td className="p-3 border">
                  {item.status == 1 ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="p-3 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item.id)}
                      className="px-3 py-1 bg-primary text-white rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-lg w-full">
            <FormStaahOta
              data={formData}
              saving={saving}
              onSave={handleSave}
              onCancel={() => {
                setModalOpen(false);
                setFormData(null);
              }}
            />
          </div>
        </div>
      )}
    </LayoutComponent>
  );
};

export default StaahMapping;
