import React from "react";
import PaperBase from "../paper/PaperBase";
interface FormBaseProps {
  language: {
    value: string;
    label: string;
  }[];
  stepper:{
    icon: React.JSX.Element;
    title: string;
    subTitle: string;
}[]
input:any

}
const FormBase = () => {
  return (
    <PaperBase>
      <div></div>
    </PaperBase>
  );
};

export default FormBase;
