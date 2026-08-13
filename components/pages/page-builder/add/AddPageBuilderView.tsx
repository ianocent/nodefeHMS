import React from "react";
import AddPageBuilderViewModel from "./AddPageBuilderViewModel";
import ButtonAddInput from "../../../../components/common/button/ButtonAddInput";
import PaperBase from "../../../../components/common/paper/PaperBase";
import Stepper from "../../../../components/common/stepper/Stepper";
import InputMain from "../../../../components/common/input/InputMain";
import InputBase from "../../../../components/common/input/InputBase";
import dynamic from "next/dynamic";
import SelectBase from "../../../../components/common/input/SelectBase";
import ButtonDeletePageBuilder from "../../../../components/common/button/ButtonDeletePageBuilder";
const RichEditorBase = dynamic(
  () => import("../../../common/input/RichEditorBase"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

const AddPageBuilderView = () => {
  const {
    activeLanguage,
    activeStep,
    input,
    language,
    nextStep,
    previousStep,
    setActiveLanguage,
    stepper,
    onChangeBasicInput,
    addSectionRicchEditor,
    addSection,
    onDeleteSection,
  } = AddPageBuilderViewModel();

  return (
    <PaperBase>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-4 h-fit border-b border-dashed">
          <div className="col-span-4">
            <h2 className="text-lg font-bold">Post Form</h2>
          </div>
          <div className="col-span-8 h-fit flex gap-4 justify-between items-center">
            <div className="flex gap-2">
              {language.map((row) => (
                <div
                  key={row.label + row.value}
                  onClick={() => {
                    setActiveLanguage(row.value);
                  }}
                  className={`${
                    activeLanguage == row.value
                      ? "text-primary border-b border-primary"
                      : ""
                  } cursor-pointer`}
                >
                  {row.label}
                </div>
              ))}
            </div>
            {activeStep == 0 && (
              <button
                className="bg-primary px-4 py-2 w-fit text-white rounded-md"
                onClick={() => {
                  addSection();
                }}
              >
                + Add Section
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 h-fit gap-4 ">
          <div className="col-span-4">
            <Stepper data={stepper} activeStep={activeStep} />
          </div>
          <div className="col-span-8 flex flex-col gap-8  h-fit  ">
            {input.map(
              (row, index) =>
                row.stepper == activeStep &&
                row.children.map(
                  (col, indexCol) =>
                    col.language == activeLanguage &&
                    col.section.map((section, indexSection) => (
                      <div
                        key={"section-input" + indexSection}
                        className={`flex flex-col gap-2`}
                      >
                        {section.input.map((inputValue, indexInput) => (
                          <div
                            key={"input" + indexInput}
                            className={`${inputValue.style}`}
                          >
                            <InputMain
                              typeInput={inputValue.typeInput}
                              restArea={{
                                placeholder: inputValue.placeholder,
                                value: inputValue.value,
                                style: { height: "100px" },
                                onChange: (e) => {
                                  onChangeBasicInput({
                                    e: e.target.value,
                                    index: index,
                                    indexCol: indexCol,
                                    indexSection: indexSection,
                                    indexInput: indexInput,
                                  });
                                },
                              }}
                              restSelect={{
                                value: inputValue.value,

                                onChange: (e) => {
                                  onChangeBasicInput({
                                    e: e.target.value,
                                    index: index,
                                    indexCol: indexCol,
                                    indexSection: indexSection,
                                    indexInput: indexInput,
                                  });
                                },
                              }}
                              error={inputValue.error}
                              label={inputValue.label}
                              options={inputValue.options}
                              required={inputValue.required}
                              onChangeFiles={(e) => {
                                onChangeBasicInput({
                                  e: e,
                                  index: index,
                                  indexCol: indexCol,
                                  indexSection: indexSection,
                                  indexInput: indexInput,
                                });
                              }}
                              rest={{
                                placeholder: inputValue.placeholder,
                                value: inputValue.value,
                                type: inputValue.type,
                                onChange: (e) => {
                                  onChangeBasicInput({
                                    e: e.target.value,
                                    index: index,
                                    indexCol: indexCol,
                                    indexSection: indexSection,
                                    indexInput: indexInput,
                                  });
                                },
                              }}
                              onChangeRichEditor={(e) => {
                                onChangeBasicInput({
                                  e: e,
                                  index: index,
                                  indexCol: indexCol,
                                  indexSection: indexSection,
                                  indexInput: indexInput,
                                });
                              }}
                              valueRichEditor={inputValue.value}
                            />
                            {inputValue.label == "Name" && (
                              <div className="mt-2">
                                <ButtonDeletePageBuilder
                                  label={"Section " + (indexSection + 1)}
                                  onDelete={() => {
                                    onDeleteSection({
                                      e: "",
                                      index: index,
                                      indexCol: indexCol,
                                      indexSection: indexSection,
                                      indexInput: indexInput,
                                    });
                                  }}
                                />
                              </div>
                            )}

                            {inputValue.label == "Type" ? (
                              inputValue.value == "rich-editor" ? (
                                <div className="mt-4">
                                  <button
                                    className="bg-primary px-4 py-2 w-fit text-white rounded-md"
                                    onClick={() => {
                                      addSectionRicchEditor({
                                        e: "",
                                        index: index,
                                        indexCol: indexCol,
                                        indexSection: indexSection,
                                        indexInput: indexInput,
                                      });
                                    }}
                                  >
                                    + Column
                                  </button>
                                  {inputValue.sectionRichEditor?.map(
                                    (richEditor, indexRichEditor) => (
                                      <div
                                        className="flex flex-col gap-2 mt-4"
                                        key={"richeditor-" + indexRichEditor}
                                      >
                                        <RichEditorBase
                                          label=""
                                          onChange={() => {}}
                                          required={false}
                                          value={""}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                inputValue.value == "custom" && (
                                  <div className="grid grid-cols-2 gap-2 mt-4">
                                    <SelectBase
                                      error={inputValue.error}
                                      label="Category"
                                      options={inputValue.options}
                                    />
                                    <SelectBase
                                      error={inputValue.error}
                                      label="Template"
                                      options={inputValue.options}
                                    />
                                  </div>
                                )
                              )
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))
                )
            )}
          </div>
        </div>
      </div>

      <ButtonAddInput
        activeStep={activeStep}
        next={nextStep}
        previous={previousStep}
        stepper={stepper.length - 1}
      />
    </PaperBase>
  );
};

export default AddPageBuilderView;
