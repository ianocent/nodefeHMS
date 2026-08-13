import React, { useEffect, useState } from "react";
import { env } from "../../../next.config";
import { FetchData, formatDate, GetDecrypt, GetEncrypt } from "../../helper";
import { useSelector } from "react-redux";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import InputBase from "../input/InputBase";
import ButtonAddList from "../button/ButtonAddList";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import MultiSelectBAse from "../input/MultiSelectBase";
import InputMain from "../input/InputMain";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

interface reportDataType {
  batch_name: string;
  url: string;
  batch_list?: string;
}

interface TableReportProps {
  reportData: any;
  isBatch?: boolean;
  dataZip?: reportDataType[];
}

const TableReport: React.FC<TableReportProps> = ({
  isBatch,
  dataZip,
  reportData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [date, setDate] = useState<any>([]);
  const [kurs, setKurs] = useState<any>([]);
  const [managementFee, setManagementFee] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>([]);
  const [percentage, setPercentage] = useState<any>(50);
  const [endDate, setEndDate] = useState<any>([]);
  const [staff, setStaff] = useState<any>([]);
  const [staffOptions, setStaffOptions] = useState<any>([]);
  const [batchName, setBatchName] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReports, setSelectedReports] = useState<reportDataType[]>([]);
  const router = useRouter();
  const [data, setData] = useState<reportDataType[]>(reportData);
  const [selectAll, setSelectAll] = useState(false);
  const [today, settoday] = useState<any>(new Date());

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const result = await FetchData(
        `/cms/report/batch`,
        "GET",
        null,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (result && result.data) {
        setData(result.data);
        // setData((prevState) => ({ ...prevState, total: result.pagging.total }));
      }
    } catch (error) {
      console.error("Error fetching batch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBusinessDate = async () => {
    try {
      let urisave = "/cms/night-audit/audit";
      let mth = "GET";

      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        let formatdate: any = new Date(saveprocess?.data?.date);
        settoday(formatdate);
        var obj = {
          name: "",
          value: formatdate.toISOString().split("T")[0],
        };
        var updatedArray = [];
        updatedArray.push(obj);
        setDate(updatedArray);
        setStartDate(updatedArray);
        setEndDate(updatedArray);
      } else {
        return new Date();
      }
    } catch (error) {
      return new Date();
    }
  };

  const staffData = async () => {
    setIsLoading(true);
    try {
      const result = await FetchData(
        `/cms/staff`,
        "GET",
        null,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      setStaffOptions(result?.data);
    } catch (error) {
      console.error("Error fetching batch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    staffData();
    if (isBatch) {
      fetchReportData();
    }
  }, []);

  useEffect(() => {
    getBusinessDate();
  }, []);

  const handleDownload = async (item: reportDataType, index) => {
    setIsLoading(true);
    try {
      const dateVal = Array.isArray(date)
        ? date.find((dat) => dat?.name === item?.batch_name + "" + index)
            ?.value === undefined && date.find((dat) => dat?.name === "")
          ? date.find((dat) => dat?.name === "")?.value
          : date.find((dat) => dat?.name === item?.batch_name + "" + index)
              ?.value ?? undefined
        : undefined;
      const kursVal = Array.isArray(kurs)
        ? kurs.find((dat) => dat?.name === item?.batch_name + "" + index)
            ?.value ?? 0
        : 0;
      const startDateVal = Array.isArray(startDate)
        ? startDate.find((dat) => dat?.name === item?.batch_name + "" + index)
            ?.value === undefined && startDate.find((dat) => dat?.name === "")
          ? date.find((dat) => dat?.name === "")?.value
          : startDate.find((dat) => dat?.name === item?.batch_name + "" + index)
              ?.value ?? undefined
        : undefined;
      const endDateVal = Array.isArray(endDate)
        ? endDate.find((dat) => dat?.name === item?.batch_name + "" + index)
            ?.value === undefined && endDate.find((dat) => dat?.name === "")
          ? date.find((dat) => dat?.name === "")?.value
          : endDate.find((dat) => dat?.name === item?.batch_name + "" + index)
              ?.value ?? undefined
        : undefined;
      const staffVal = Array.isArray(staff)
        ? staff.find((dat) => dat?.name === item?.batch_name + "" + index)
            ?.value
        : undefined;
      // console.log("weww", staffVal);
      let response;
      let isBlob = true;
      while (isBlob) {
        response = await fetch(
          `${env.uriApi}${item.url}?date=${formatDate(
            dateVal
          )}&typeOps=view&start_date=${formatDate(
            startDateVal
          )}&kurs=${kursVal}&end_date=${formatDate(endDateVal)}${
            staffVal?.value ? `&staff_id=${staffVal?.value}` : ""
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${datalocal?.data?.access_token}`,
            },
          }
        );
        setPercentage(50);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const contentType = response.headers.get("Content-Type");
        // Correct MIME type detection
        const isFile =
        contentType &&
          (contentType.includes("application/pdf") ||
            contentType.includes("image/") ||
            contentType.includes("application/octet-stream"));
        if (isFile) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setPercentage(100);
          isBlob = false;
          const blob = await response.blob();
          const fileName = item.batch_name + ".pdf";

          if (Capacitor.isNativePlatform()) {
            // Mobile: pakai Capacitor Filesystem + Share
            await saveFileOnMobile(blob, fileName);
          } else {
            // Web: pakai cara lama
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 3000);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setPercentage(50);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async (item, index) => {
    setIsLoading(true);
    try {
      const getValue = (arr, key) =>
        Array.isArray(arr)
          ? arr.find((dat) => dat?.name === key)?.value ??
            arr.find((dat) => dat?.name === "")?.value
          : undefined;

      const dateVal = getValue(date, item?.batch_name + index);
      const kursVal = getValue(kurs, item?.batch_name + index) ?? 0;
      const startDateVal = getValue(startDate, item?.batch_name + index);
      const endDateVal = getValue(endDate, item?.batch_name + index);
      const staffVal = getValue(staff, item?.batch_name + index);
      let response;
      let counter = 0; // Initialize counter
      let isBlob = true;

      while (isBlob) {
        response = await fetch(
          `${env.uriApi}${item.url}?date=${formatDate(
            dateVal
          )}&typeOps=view&start_date=${formatDate(
            startDateVal
          )}&kurs=${kursVal}&end_date=${formatDate(endDateVal)}${
            staffVal?.value ? `&staff_id=${staffVal?.value}` : ""
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${datalocal?.data?.access_token}`,
            },
          }
        );
        setPercentage(50);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const contentType = response.headers.get("Content-Type");
        // Correct MIME type detection
        const isFile =
          contentType &&
          (contentType.includes("application/pdf") ||
            contentType.includes("image/") ||
            contentType.includes("application/octet-stream"));

        if (isFile) {
          if (counter > 0) {
            const blob = await response.blob();
            const fileName = item.batch_name + ".pdf";

            if (Capacitor.isNativePlatform()) {
              await saveFileOnMobile(blob, fileName);
            } else {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                window.URL.revokeObjectURL(url);
              }, 3000);
            }
            isBlob = false;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setPercentage(100);
            isBlob = false;
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            console.log("Opening PDF URL:", url);

            // Ensure `window.open()` is executed **inside** the loop before moving on
            setTimeout(() => {
              const newTab = window.open(url, "_blank");
              if (!newTab) {
                alert("Popup blocked! Please allow pop-ups for this site.");
              }
            }, 500);
            // Revoke URL after some delay
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 3000);
          }
        }
        counter++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setPercentage(50);
      }
    } catch (error) {
      console.error("Print failed:", error);
      toast.error("Failed to print the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDownload = async (batch_list, index) => {
    setIsLoading(true);
    const zipData = JSON.parse(batch_list.batch_list);
    const zip = new JSZip();
    const failedDownloads: string[] = [];

    try {
      for (const item of zipData || []) {
        try {
          const response = await fetch(env.uriApi + item.url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${datalocal?.data?.access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch ${item.batch_name}`);
          }

          const blob = await response.blob();
          zip.file(`${item.batch_name}.pdf`, blob);
        } catch (error) {
          console.error(`Failed to download ${item.batch_name}:`, error);
          failedDownloads.push(item.batch_name);
        }
      }

      if (failedDownloads.length > 0) {
        console.warn("Some downloads failed:", failedDownloads);
      }

      const content = await zip.generateAsync({ type: "blob" });
      // saveAs(content, "batch_reports.zip");
      if (Capacitor.isNativePlatform()) {
        await saveFileOnMobile(content, "batch_reports.zip");
      } else {
        saveAs(content, "batch_reports.zip");
      }
    } catch (error) {
      console.error("Batch download failed:", error);
      alert("Failed to create zip file. Please try again.");
    } finally {
      setIsLoading(false);
      if (failedDownloads.length > 0) {
        alert(
          `The following reports failed to download: ${failedDownloads.join(
            ", "
          )}`
        );
      }
    }
  };

  const handleBatchPrint = async (batch_list, index) => {
    setIsLoading(true);
    const zipData = JSON.parse(batch_list.batch_list);
    const failedFetches: string[] = [];

    try {
      const pdfBlobs = await Promise.all(
        zipData.map(async (item) => {
          try {
            const url =
              env.uriApi +
              item.url +
              `?typeOps=view` +
              `&date=${formatDate(date)}` +
              `&start_date=${formatDate(startDate)}` +
              `&end_date=${formatDate(endDate)}` +
              `${staff?.value ? `&staff_id=${staff.value}` : ""}`;

            const response = await fetch(url, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${datalocal?.data?.access_token}`,
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch ${item.batch_name}`);
            }

            return { name: item.batch_name, blob: await response.blob() };
          } catch (error) {
            console.error(`Failed to fetch ${item.batch_name}:`, error);
            failedFetches.push(item.batch_name);
            return null;
          }
        })
      );

      const successfulPdfs = pdfBlobs.filter((pdf) => pdf !== null);

      if (successfulPdfs.length > 0) {
        const html = `
          <html>
            <head>
              <title>Batch Print</title>
            </head>
            <body>
              ${successfulPdfs
                .map(
                  (pdf) => `
                <h2>${pdf.name}</h2>
                <iframe src="${URL.createObjectURL(
                  pdf.blob
                )}" width="100%" height="80%"></iframe>
              `
                )
                .join("")}
            </body>
          </html>
        `;

        // Open the HTML in a new tab
        const newWindow = window.open();
        newWindow.document.write(html);
        newWindow.document.close();
      } else {
        throw new Error("No PDFs were successfully fetched");
      }
    } catch (error) {
      console.error("Batch print failed:", error);
      alert("Failed to set up batch printing. Please try again.");
    } finally {
      setIsLoading(false);
      if (failedFetches.length > 0) {
        alert(
          `The following reports failed to fetch: ${failedFetches.join(", ")}`
        );
      }
    }
  };

  const handleCheckboxChange = (item: reportDataType) => {
    setSelectedReports((prev) =>
      prev.some((report) => report.batch_name === item.batch_name)
        ? prev.filter((report) => report.batch_name !== item.batch_name)
        : [...prev, item]
    );
  };

  const handleSaveSelection = async () => {
    if (selectedReports.length === 0) {
      toast.error("Please select at least one report.");
      return;
    }

    if (!batchName) {
      toast.error("Please enter a batch name.");
      return;
    }

    const data = {
      batch_list: JSON.stringify(
        selectedReports.map((report) => ({
          batch_name: report.batch_name,
          url: report.url,
        }))
      ),
      batch_name: batchName,
    };

    const raw = JSON.stringify(data);
    const aesraw = GetEncrypt(raw);

    try {
      const result = await FetchData(
        "/cms/report/batch",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      if (result) {
        fetchReportData();
        onClose();
        setBatchName("");
        setSelectedReports([]);
      }
    } catch (error) {
      console.error("Error saving batch report:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedReports(dataZip);
    } else {
      setSelectedReports([]);
    }
  };

  useEffect(() => {
    setSelectAll(selectedReports?.length === dataZip?.length);
  }, [selectedReports, dataZip]);

  const LoaderPopup = ({ isOpen }) => {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-center mb-4">Loading...</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div
              className={`!bg-[#323A50] h-1.5 rounded-full !dark:bg-blue-500 w-[${percentage}%] animate-pulse`}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const saveFileOnMobile = async (blob: Blob, fileName: string) => {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // ambil bagian base64 aja, buang prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache, // simpan ke cache dulu sebelum di-share
    });

    await Share.share({
      title: fileName,
      url: savedFile.uri,
      dialogTitle: "Save or Share Report",
    });
  };

  const renderFilterInputs = (item: any, index: number) => {
    if (!Array.isArray(item?.filter) || item?.filter.length <= 0) return null;
    return JSON.parse(JSON.stringify(item.filter)).map((rw, i) => (
      <div key={i} className="flex flex-wrap gap-2">
        {rw?.label == "date" && (
          <InputBase
            label="Report Date"
            rest={{
              type: "date",
              value: Array.isArray(date) ? date.find((dat: any) => dat?.name === item?.batch_name + "" + index)?.value ?? formatDate(today) : today,
              onChange: (e) => {
                const key = item?.batch_name + "" + index;
                const obj = { name: key, value: e.target.value };
                const updatedArray = Array.isArray(date) ? date.filter((d) => d.name !== key) : [];
                updatedArray.push(obj);
                setDate(updatedArray);
              },
            }}
            required={false} error={false} clasCus="w-full"
          />
        )}
        {rw?.label == "kurs" && (
          <InputBase
            label="Kurs"
            rest={{
              type: "number",
              value: Array.isArray(kurs) ? kurs.find((dat) => dat?.name === item?.batch_name + "" + index)?.value ?? "" : "",
              onChange: (e) => {
                const key = item?.batch_name + "" + index;
                const obj = { name: key, value: e.target.value };
                const updatedArray = Array.isArray(kurs) ? kurs.filter((d) => d.name !== key) : [];
                updatedArray.push(obj);
                setKurs(updatedArray);
              },
            }}
            required={false} error={false} clasCus="w-full"
          />
        )}
        {rw?.label == "Management-fee" && (
          <InputBase
            label="management-fee"
            rest={{
              type: "number",
              value: Array.isArray(managementFee) ? managementFee.find((dat) => dat?.name === item?.batch_name + "" + index)?.value ?? "" : "",
              onChange: (e) => {
                const key = item?.batch_name + "" + index;
                const obj = { name: key, value: e.target.value };
                const updatedArray = Array.isArray(managementFee) ? managementFee.filter((d) => d.name !== key) : [];
                updatedArray.push(obj);
                setManagementFee(updatedArray);
              },
            }}
            required={false} error={false} clasCus="w-full"
          />
        )}
        {rw?.label == "range-date" && (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <InputBase
              label="From"
              rest={{
                type: "date",
                value: Array.isArray(startDate) ? startDate.find((dat) => dat?.name === item?.batch_name + "" + index)?.value ?? formatDate(today) : today,
                onChange: (e) => {
                  const key = item?.batch_name + "" + index;
                  const obj = { name: key, value: e.target.value };
                  const updatedArray = Array.isArray(startDate) ? startDate.filter((d) => d.name !== key) : [];
                  updatedArray.push(obj);
                  setStartDate(updatedArray);
                },
              }}
              required={false} error={false} clasCus="w-full"
            />
            <InputBase
              label="To"
              rest={{
                type: "date",
                value: Array.isArray(endDate) ? endDate.find((dat) => dat?.name === item?.batch_name + "" + index)?.value ?? formatDate(today) : today,
                onChange: (e) => {
                  const key = item?.batch_name + "" + index;
                  const obj = { name: key, value: e.target.value };
                  const updatedArray = Array.isArray(endDate) ? endDate.filter((d) => d.name !== key) : [];
                  updatedArray.push(obj);
                  setEndDate(updatedArray);
                },
              }}
              required={false} error={false} clasCus="w-full"
            />
          </div>
        )}
        {rw?.label == "user" && (
          <MultiSelectBAse
            disabled={false} error={false} label="Staff" required={false} options={staffOptions}
            onChange={(e) => {
              const key = item?.batch_name + "" + index;
              const obj = { name: key, value: e };
              const updatedArray = Array.isArray(staff) ? staff.filter((d) => d.name !== key) : [];
              updatedArray.push(obj);
              setStaff(updatedArray);
            }}
            value={Array.isArray(staff) ? staff.find((dat) => dat?.name === item?.batch_name + "" + index)?.value : undefined}
            ismulti={false} placeholder="Staff"
          />
        )}
      </div>
    ));
  };

  return (
    <div className="w-full">
      <LoaderPopup isOpen={isLoading} />

      {(data.length > 0 || reportData.length > 0) && (
        <>
          <div className="w-full items-end p-2 flex justify-between">
            {isBatch && <ButtonAddList label="+ Add batch" title="" onAdd={onOpen} />}
          </div>

          {/* ── DESKTOP: tabel biasa (hidden di mobile) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table-auto min-w-full rounded-lg">
              <thead>
                <tr>
                  <th className="bg-[#323A50] text-white p-2 font-bold text-center rounded-tl-lg">Search</th>
                  <th className="bg-[#323A50] text-white p-2 font-bold text-center">Report Name</th>
                  <th className="bg-[#323A50] text-white p-2 font-bold text-center rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {(data.length > 0 ? data : reportData).map((item: any, index: number) => (
                  <tr key={index} className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]">
                    <td className="p-2 text-center">
                      <div className="flex gap-2">{renderFilterInputs(item, index)}</div>
                    </td>
                    <td className="p-2 text-center">{item.batch_name}</td>
                    <td className="p-2 text-center">
                      <button
                        className="px-4 py-2 bg-[#323a50] text-white text-sm font-medium rounded-md hover:bg-[#4a5672] focus:outline-none focus:ring-2 focus:ring-[#323a50] focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 mr-2"
                        onClick={() => isBatch ? handleBatchDownload(item, index) : handleDownload(item, index)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Downloading..." : "Download"}
                      </button>
                      {!isBatch && (
                        <button
                          className="px-4 py-2 bg-[#4a5672] text-white text-sm font-medium rounded-md hover:bg-[#323a50] focus:outline-none focus:ring-2 focus:ring-[#4a5672] focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50"
                          onClick={() => isBatch ? handleBatchPrint(item, index) : handlePrint(item, index)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Printing..." : "Print"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE: card stacked layout (hidden di desktop) ── */}
          <div className="block md:hidden space-y-3 px-2">
            {(data.length > 0 ? data : reportData).map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Report Name header */}
                <div className="bg-[#323A50] px-4 py-2">
                  <p className="text-white font-semibold text-sm uppercase tracking-wide">
                    {item.batch_name}
                  </p>
                </div>

                {/* Filter inputs */}
                {Array.isArray(item?.filter) && item?.filter.length > 0 && (
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Search</p>
                    <div className="space-y-2">
                      {renderFilterInputs(item, index)}
                    </div>
                  </div>
                )}

                <div className="px-4 py-3 bg-gray-50 flex gap-2 justify-end border-t border-gray-100">
                  <button
                    className="flex-1 px-4 py-2 bg-[#323a50] text-white text-sm font-medium rounded-lg hover:bg-[#4a5672] focus:outline-none transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    onClick={() => isBatch ? handleBatchDownload(item, index) : handleDownload(item, index)}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    {isLoading ? "Downloading..." : "Download"}
                  </button>

                  {!isBatch && (
                    <button
                      className="flex-1 px-4 py-2 bg-[#4a5672] text-white text-sm font-medium rounded-lg hover:bg-[#323a50] focus:outline-none transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                      onClick={() => isBatch ? handleBatchPrint(item, index) : handlePrint(item, index)}
                      disabled={isLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9"/>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                        <rect x="6" y="14" width="12" height="8"/>
                      </svg>
                      {isLoading ? "Printing..." : "Print"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isBatch && (
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              classNames={{
                body: "py-6 px-8 gap-4 justify-center",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                base: "border-[#292f46] bg-[#ffffff] text-[#a8b0d3] max-h-[70vh] overflow-y-auto",
                header: "border-b-[1px] border-[#292f46]",
                footer: "border-t-[1px] border-[#292f46]",
                closeButton: "hover:bg-white/5 active:bg-white/10",
              }}
            >
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Add Batch</ModalHeader>
                <ModalBody>
                  <InputBase
                    label="Batch Name"
                    rest={{ type: "text", value: batchName, onChange: (e) => setBatchName(e.target.value) }}
                    required={true} error={false} clasCus="w-full"
                  />
                  <table className="table-auto min-w-full">
                    <thead>
                      <tr>
                        <th className="bg-[#323A50] text-white p-2 font-bold text-center">Report Name</th>
                        <th className="bg-[#323A50] text-white p-2 font-bold text-center">
                          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="form-checkbox h-5 w-5 text-[#323a50]" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataZip.map((item, index) => (
                        <tr key={index} className="focus:!bg-[#d4e4fc] hover:!bg-[#d4e4fc]">
                          <td className="p-2 text-center">{item.batch_name}</td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedReports.some((report) => report.batch_name === item.batch_name)}
                              onChange={() => handleCheckboxChange(item)}
                              className="form-checkbox h-5 w-5 text-[#323a50]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                  <Button color="primary" onPress={handleSaveSelection}>Add</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default TableReport;
