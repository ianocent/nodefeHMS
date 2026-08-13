import React from "react";
interface StepperProps {
  data: {
    icon: any;
    title: string;
    subTitle: string;
  }[];
  activeStep: number;
}
const Stepper = (props: StepperProps) => {
  const { data, activeStep } = props;
  return (
    <div className="flex flex-col relative pb-4">
      {data.map((row, index) => (
        <div key={row.title}>
          <div className="flex gap-4 ">
            <div
              className={`w-[32px] h-[32px] min-w-[32px] flex justify-center items-center rounded-full  border-2 outline-dotted outline-2  ${
                activeStep == index ? "bg-primary fill-white stroke-white text-white outline-primary " : "outline-gray-500 stroke-[#828282]"
              }`}
            >
              {row.icon}
            </div>
            <div  className="absolute left-12">
              <h4 className={`text-lg font-bold ${activeStep == index ? "text-primary" : ""}`}>{row.title}</h4>
              <p className="text-gray- line-clamp-1">{row.subTitle}</p>
            </div>
          </div>
          {index < data.length - 1 && (
            <div className="h-[50px] w-[1px] my-2 border left-[14px] border-gray-600 border-dashed relative"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
