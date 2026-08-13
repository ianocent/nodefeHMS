// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";

// interface ImageInputProps {
//   onChange: (file: File) => void;
//   error?: boolean;
//   required?: boolean;
//   urlImg?: string;
// }

// const ImageInput = ({ onChange, error, required, urlImg }: ImageInputProps) => {
//   const [preview, setPreview] = useState<string | null>(null);

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreview(reader.result as string); // Set preview state
//           onChange(file);
//         };
//         reader.readAsDataURL(file);
//       }
//     },
//     [onChange]
//   );

//   const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
//     onDrop,
//     accept: {
//       "image/*": [".jpg", ".jpeg", ".png", ".gif"],
//     },
//   });

//   const file: any = acceptedFiles[0];

//   return (
//     <div className="w-full py-1">
//       <div
//         {...getRootProps({
//           className: `flex flex-col items-center justify-center border-dashed border rounded-md ${
//             error ? "border-red" : "border-[#949eb7]"
//           }`,
//         })}
//       >
//         <input {...getInputProps()} required={required} />
//         {urlImg ? (
//           <div className="flex flex-col items-center">
//             <img
//               src={urlImg}
//               alt="Preview"
//               className="w-24 h-24 object-cover"
//             />
//             {preview && (
//               <ul className="list-disc list-inside">
//                 <li key={file?.path}>
//                   {file?.path} - {file?.size} bytes
//                 </li>
//               </ul>
//             )}
//           </div>
//         ) : (
//           <div className="w-full border-dashed border py-1 px-2 flex gap-2 items-center">
//             Choose Image
//             <img width={24} height={24} alt="" src={"/assets/imgUpload.png"} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageInput;

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getEnv } from "../../helper";

interface ImageInputProps {
  onChange: (file: File | string) => void;
  error?: boolean;
  required?: boolean;
  urlImg?: any;
  useFileObject?: boolean;
  label?: string;
}

const ImageInput = ({
  onChange,
  error,
  required,
  urlImg,
  useFileObject = false,
  label,
}: ImageInputProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (preview) {
      setImageSrc(preview);
    } else if (urlImg instanceof File) {
      const objectUrl = URL.createObjectURL(urlImg);
      setImageSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof urlImg === "string") {
      setImageSrc(
        urlImg.length > 100
          ? urlImg
          : `${getEnv("domainapi")}/storage/${urlImg}`
      );
    }
  }, [urlImg, preview]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (useFileObject) {
          onChange(file);
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            onChange(result);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onChange, useFileObject]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
  });

  const file: any = acceptedFiles[0];

  return (
    <div className="w-full py-1">
      <label className="font-bold">
        {label} {required ? <span className="text-red">*</span> : null}
      </label>
      <div
        {...getRootProps({
          className: `flex flex-col items-center justify-center border-dashed border rounded-md ${
            error ? "border-red" : "border-[#949eb7]"
          }`,
        })}
      >
        <input {...getInputProps()} required={required} />
        {preview || urlImg ? (
          <div className="flex flex-col items-center">
            <img
              src={imageSrc}
              alt="Preview"
              className="w-24 h-24 object-cover"
            />
            {file && (
              <ul className="list-disc list-inside">
                <li key={file.path}>
                  {file.path} - {file.size} bytes
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="w-full border-dashed border py-1 px-2 flex gap-2 items-center">
            Choose Image
            <img width={24} height={24} alt="" src={"/assets/imgUpload.png"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
