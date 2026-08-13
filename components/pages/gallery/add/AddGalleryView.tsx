import InputBase from "../../../../components/common/input/InputBase";
import PaperBase from "../../../../components/common/paper/PaperBase";
import React from "react";
import AddGalleryViewModel from "./AddGalleryViewModel";
import TextareaBase from "../../../../components/common/input/TextareaBase";
import CardInputGallery from "../../../../components/common/card/CardInputGallery";
import InputMain from "../../../../components/common/input/InputMain";

const AddGalleryView = () => {
  const {
    input,
    setUploadMedia,
    uploadMedia,
    onChangeRadio,
    onChangeLink,
    onChangeName,
    addLink,
    addName,
    addSection,
    setInput,
    onChangeFiles,
  } = AddGalleryViewModel();
  return (
    <PaperBase>
      <div className="grid grid-cols-12 w-full gap-4">
        {input.map((row, index) => (
          <div key={"input" + index} className={`${row.style}`}>
            <InputMain
              typeInput={row.typeInput}
              restArea={{}}
              error={row.error}
              label={row.label}
              rest={{
                placeholder: row.placeholder,
                value: row.value,
                type: row.type,
                onChange: (e) => {
                  let dataInput = [...input];
                  input[index].value = e.target.value;
                  setInput(dataInput);
                },
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-between items-center mt-4">
        <h3 className="font-bold text-[16px] leading-[22px]">Upload Media</h3>
        <button
          onClick={() => {
            addSection();
          }}
          className="bg-[#766FB6] w-fit  text-white px-4 py-2 rounded-md "
        >
          + Add New
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {uploadMedia.map((row, index) => (
          <CardInputGallery
            onChangeFiles={(e) => {
              onChangeFiles(e, index);
            }}
            key={"card-input-gallery"}
            answerRadio={row.answerRadio}
            onChangeRadio={(e) => {
              onChangeRadio(e, index);
            }}
            onChangeLink={(e, indexLink) => {
              onChangeLink(e, index, indexLink);
            }}
            onChangeName={(e, indexLink) => {
              onChangeName(e, index, indexLink);
            }}
            inputLink={row.link}
            inputName={row.name}
            addLink={() => {
              addLink(index);
            }}
            addName={() => {
              addName(index);
            }}
            id={"" + index}
          />
        ))}
      </div>
    </PaperBase>
  );
};

export default AddGalleryView;
