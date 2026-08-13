import React, { useContext, useEffect, useState } from "react";
import InputMain from "../../../common/input/InputMain";
import Seo from "../../../common/seo";
import {
  FetchData,
  FetchDataDocument,
  GetDecrypt,
  GetEncrypt,
} from "../../../helper";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonSubmit from "../../../common/button/ButtonSubmit";
import { LayoutContext } from "../../../../context/LayoutContext";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
interface AddviewProps {
  isview?: boolean;
}
const AddView = (props: AddviewProps) => {
  const { isview = false } = props;
  const GLOBALURI = "/cms/room-type-images";
  const router = useRouter();
  const layout = useContext(LayoutContext);
  const [loading, setloading] = useState(false);

  const { isLogin } = useSelector((state: any) => state?.auth);
  const datalocal: any = isLogin ? JSON.parse(GetDecrypt(isLogin)) : null;
  const [dataval, setData] = useState<any>({});
  const [datavaled, setDataEd] = useState<any>({});
  const pathname = usePathname();

  const [dataImage, setDataImage] = useState([
    {
      name: "Image Item",
      data: [
        {
          label: "Photo 1",
          name: "photo_1",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 2",
          name: "photo_2",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 3",
          name: "photo_3",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 4",
          name: "photo_4",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 5",
          name: "photo_5",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 6",
          name: "photo_6",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 7",
          name: "photo_7",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 8",
          name: "photo_8",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 9",
          name: "photo_9",
          type: "image",
          cols: "col-span-6",
        },
        {
          label: "Photo 10",
          name: "photo_10",
          type: "image",
          cols: "col-span-6",
        },
      ],
    },
  ]);
  const [uiddata, setuiddata] = useState("");

  const [idusr, setidusr] = useState("0");

  const uploadImage = async (file: File, fieldName: string) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("room_type_id", idusr);
      if (dataval[fieldName] || datavaled[fieldName]) {
        console.log("masuk gak");
        formData.append(
          "old_image",
          dataval[fieldName] ? dataval[fieldName] : datavaled[fieldName]
        );
      }

      const response = await FetchDataDocument(
        GLOBALURI,
        "POST",
        formData,
        true,
        datalocal?.data?.access_token,
        router,
        ""
      );

      toast.success("Room type image updated successfully.", {
        autoClose: 3000,
        type: "success",
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      const urlParams = new URLSearchParams(window.location.search);
      const idreq = urlParams.get("data");
      GetDetailUser(idreq);
    } catch (error) {
      console.error("Error uploading/updating image:", error);
      toast.error("An error occurred while uploading/updating the image");
    }
  };

  const changeHandlerSrc = (e: any, type?: string, name?: string) => {
    if (type === "image") {
      const file = e;
      if (file) {
        // Validasi tipe file
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
          toast.error(
            "Please upload a valid image file (JPEG, PNG, JPG, or GIF)"
          );
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          toast.error("Image size should not exceed 2MB");
          return;
        }
        uploadImage(file, name);
      }
    } else {
      setData({ ...dataval, [e.target.name]: e.target.value });
    }
  };

  const GetDetailUser = async (i: any) => {
    setuiddata(i);
    try {
      let getuuri = GLOBALURI + "/" + i + "/update";
      if (i == 0) {
        getuuri = GLOBALURI + "/create";
      }
      const datauser: any = await FetchData(
        getuuri,
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      const imageData = {};
      datauser.data.forEach((image, index) => {
        if (index < 10) {
          // Hanya mengambil 10 gambar pertama
          const photoKey = `photo_${index + 1}`;
          imageData[photoKey] = `${image.image_path}`;
        }
      });

      setDataEd({
        ...imageData,
      });

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const transformData = (data) => {
    const newData = { ...data };

    // Daftar properti yang perlu diubah
    const propertiesToTransform = [];

    propertiesToTransform.forEach((property) => {
      if (newData[property] && newData[property].value !== undefined) {
        newData[property] = newData[property].value;
      }
    });

    return newData;
  };

  const OnSave = async () => {
    try {
      let urisave = GLOBALURI;
      let mth = "POST";
      const transformedData = transformData(dataval);

      const formData = new FormData();
      for (const key in dataval) {
        if (key === "image" && dataval[key] instanceof File) {
          formData.append("image", dataval[key]);
        } else {
          formData.append(key, transformedData[key]);
        }
      }

      if (idusr != "0") {
        urisave = GLOBALURI + "/" + idusr + "";
      }
      const saveprocess = await FetchDataDocument(
        urisave,
        mth,
        formData,
        true,
        datalocal?.data?.access_token,
        router,
        ""
      );

      toast(mth === "POST" ? "Success save" : "Success edit", {
        autoClose: 3000,
        type: "success",
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      router.replace({
        pathname: "/master-setup/room-type/",
        query: { parent: parent },
      });
    } catch (error) {
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  const [parent, setparent] = useState("0");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idreq = urlParams.get("data");
    const idparent = urlParams.get("parent");
    setparent(idparent);
    if (idreq) {
      GetDetailUser(idreq);
      setidusr(idreq);
    } else {
      GetDetailUser(0);
      setidusr("0");
    }
  }, []);

  const handleDelete = async (fieldName: string) => {
    try {
      const imageRoute = dataval[fieldName] || datavaled[fieldName];
      if (!imageRoute) {
        toast.error("No image to delete");
        return;
      }

      const raw = JSON.stringify({ image_route: imageRoute });

      const aesraw = GetEncrypt(raw);

      const response = await FetchData(
        `${GLOBALURI}/delete`,
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );

      setData((prevData) => {
        const newData = { ...prevData };
        delete newData[fieldName];
        return newData;
      });
      setDataEd((prevData) => {
        const newData = { ...prevData };
        delete newData[fieldName];
        return newData;
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("An error occurred while deleting the image");
    }
  };

  return (
    <>
      <Seo title={"Management " + layout?.title} />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-12 grid grid-cols-12 h-fit  gap-2">
            <div className="col-span-12 ">
              <fieldset className="border">
                <legend className="ml-2">Image</legend>
                <div className="grid grid-cols-12 h-fit gap-4 ml-2 mb-4 mt-4 mr-2">
                  {dataImage[0].data?.map((row: any) => {
                    var types: string;
                    var typesmain: string;

                    if (row?.type == "select-multi") {
                      types = "select-multi";
                      typesmain = "select-multi";
                    } else if (row?.type == "select") {
                      types = "select";
                      typesmain = "select";
                    } else if (row?.type == "checkbox") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else if (row?.type == "image") {
                      types = row?.type;
                      typesmain = row?.type;
                    } else {
                      types = row?.type;
                      typesmain = "base";
                    }
                    return (
                      <div className={`${row?.cols} relative`}>
                        <InputMain
                          valuename={row?.name}
                          typeInput={typesmain}
                          error={false}
                          label={row?.label}
                          required={false}
                          options={row?.options}
                          rest={{
                            name: row?.name,
                            placeholder: row?.label,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            type: types,
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          restArea={{
                            placeholder: row?.label,
                            name: row?.name,
                            value: dataval[row?.name] ?? datavaled[row?.name],
                            onChange: (e) => {
                              changeHandlerSrc(e, row?.type, row?.name);
                            },
                          }}
                          onChangeFiles={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          onChangeSel={(e: any) => {
                            changeHandlerSrc(e, row?.type, row?.name);
                            //GetDataTable(e.value);
                          }}
                          valueSel={dataval[row?.name] ?? datavaled[row?.name]}
                          isMulti={false}
                          placeholder={row?.label}
                          useFileObject={true}
                        />
                        {(dataval[row?.name] || datavaled[row?.name]) && (
                          <button
                            onClick={() => handleDelete(row?.name)}
                            className="ml-2 focus:outline-none absolute top-2 right-2"
                          >
                            <img
                              src="/assets/images/apps/delete.png"
                              className="w-[21px]"
                              alt="Delete"
                            />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-full bg-white py-2 px-4 bottom-0 left-0 z-30">
        <div className="lg:ms-[250px] flex justify-end px-4 gap-4 ">
          <ButtonSubmit
            onCreate={() => {
              setloading(true);
              router.replace({
                pathname: "/master-setup/room-type/",
                query: { parent: parent },
              });
            }}
            loading={loading}
            label="Back"
            isprimary={false}
          />
          {isview ? (
            <></>
          ) : (
            <ButtonSubmit
              onCreate={() => {
                setloading(true);
                OnSave();
              }}
              loading={loading}
              label="Save Change"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AddView;
