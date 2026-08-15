import React, { useContext, useEffect, useState, useRef } from "react";
import InputMain from "../../common/input/InputMain";
import Svg1 from "./svg-1";
import Svg2 from "./svg-2";
import Svg3 from "./svg-3";
import Svg4 from "./svg-4";
import Svg5 from "./svg-5";
interface PropMap {
  data: any;
  building: any;
  floorval: any;
  buildingval: any;
}
const IndexSVG = (props: PropMap) => {
  const { data, building, floorval, buildingval } = props;
  const [flooropt, setflooropt] = useState<any>([]);
  // const [floorval, setfloorval] = useState<any>({});
  // const [buildingval, setbuildingval] = useState<any>({});
  const [dataval, setdataval] = useState<any>({});

  const [frist, setfirst] = useState<any>(true);
  useEffect(() => {
    var obj = {};
    for (let index = 1; index < 13; index++) {
      const textclass = document.getElementsByClassName("label-text");
      while (textclass.length > 0) {
        textclass[0].parentNode.removeChild(textclass[0]);
      }
      const element = document.getElementById("Room-" + index);
      if (element) {
        element.style.fill = "#BDBDBD";
      }
    }
    data?.map((rw) => {
      if (buildingval?.label && floorval?.label) {
        if (
          rw?.floor?.label == floorval?.label &&
          buildingval?.label == rw?.building?.label
        ) {
          obj[(rw?.map_id ?? "").replaceAll("-", "_") + "_data"] = rw;
          // console.log("wes", rw?.name);
          // let label1 = document.querySelector("#" + rw?.map_id);
          if (!rw?.map_id) return;

          let safeId = CSS.escape(rw.map_id);
          let label1 = document.querySelector(`#${safeId}`);

          if (!label1) return;

          const textclass = document.getElementsByClassName(rw?.name);
          while (textclass.length > 0) {
            textclass[0].parentNode.removeChild(textclass[0]);
          }

          const element = document.getElementById(rw?.map_id);
          if (element) {
            element.style.fill = rw?.folio?.folio_number
              ? rw?.folio?.folio_status_color_code
              : rw?.room_status_color?.colorCode;
            element.style.cursor = "pointer";
            element.onclick = function (e: any) {
              // console.log("wewon", e?.target?.id);
              if (e?.target?.id) {
                if (rw?.folio?.url) {
                  // console.log("wew", rw?.folio?.url);
                  window.location.assign(rw?.folio?.url);
                }
              }
            };
            // console.log(rw?.maid_status)
            addLabelText(
              label1,
              rw?.room_type_id.label,
              rw?.name,
              rw?.folio?.url,
              rw?.folio?.folio_number
                ? rw?.folio?.folio_number + " - " + rw?.folio?.folio_status
                : "",
              rw?.maid_status.label,
              rw?.maid_status.color
            );
          }
        }
      } else {
        if (
          rw?.floor?.label == building[0]?.floors[0]?.label &&
          building[0]?.label == rw?.building?.label
        ) {
          obj[(rw?.map_id ?? "").replaceAll("-", "_") + "_data"] = rw;
          //   console.log("wes", rw);
          let label1 = document.querySelector("#" + rw?.map_id);
          const element = document.getElementById(rw?.map_id);
          if (element) {
            element.style.fill = rw?.folio?.folio_number
              ? rw?.folio?.folio_status_color_code
              : rw?.room_status_color?.colorCode;
            element.style.cursor = "pointer";
            addLabelText(
              label1,
              rw?.maid_status.label,
              rw?.name,
              rw?.folio?.url,
              rw?.folio?.folio_number
                ? rw?.folio?.folio_number + " - " + rw?.folio?.folio_status
                : "",
              rw?.maid_status.label,
              rw?.maid_status.color
            );
          }
        }
      }
    });
    // console.log("floor", building[0]?.floors[0]?.label);
    // console.log("bd", building[0]?.label);
    setdataval(obj);
    // setfirst(false);
  }, [floorval]);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!svgWrapperRef.current) return;
    const svgEl = svgWrapperRef.current.querySelector("svg");
    if (!svgEl) return;

    if (!svgEl.getAttribute("viewBox")) {
      const w = svgEl.getAttribute("width")  || "1200";
      const h = svgEl.getAttribute("height") || "800";
      svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
    }

    svgEl.removeAttribute("width");
    svgEl.removeAttribute("height");
    svgEl.style.display = "block";
    svgEl.style.height  = "auto";

    if (window.innerWidth < 768) {
      svgEl.style.width = "100%";
    } else {
      svgEl.style.width = "50%";
    }
  }, [floorval?.code_image]);
  function addLabelText(
    bgPath,
    labelText,
    labelTextB,
    uri,
    labelTextC,
    labelTextD,
    labelTextE
  ) {
    let bbox = bgPath?.getBBox();
    if (bbox) {
      let x = bbox.x + bbox.width / 2;
      let y = bbox.y + 50;

      // Create a <text> element
      let textElem = document.createElementNS(bgPath.namespaceURI, "text");
      textElem.setAttribute("x", x);
      textElem.setAttribute("y", y);
      // Centre text horizontally at x,y
      textElem.setAttribute("text-anchor", "middle");
      // Give it a class that will determine the text size, colour, etc
      textElem.classList.add("label-text");
      // textElem.classList.add(labelText);
      textElem.classList.add("cursor-pointer");
      // Set the text
      textElem.textContent = labelText;
      textElem.onclick = function (e: any) {
        // console.log("wewon", e?.target?.id);

        if (uri) {
          // console.log("wew", rw?.folio?.url);
          window.location.assign(uri);
        }
      };
      // Add this text element directly after the label background path
      bgPath.after(textElem);

      let textElemB = document.createElementNS(bgPath.namespaceURI, "text");
      textElemB.setAttribute("x", x);
      textElemB.setAttribute("y", y + 32);
      // Centre text horizontally at x,y
      textElemB.setAttribute("text-anchor", "middle");
      // Give it a class that will determine the text size, colour, etc
      textElemB.classList.add("label-text");
      // textElemB.classList.add(labelText);
      textElemB.classList.add("cursor-pointer");
      // Set the text
      textElemB.textContent = labelTextB;
      textElemB.onclick = function (e: any) {
        // console.log("wewon", e?.target?.id);

        if (uri) {
          // console.log("wew", rw?.folio?.url);
          window.location.assign(uri);
        }
      };
      bgPath.after(textElemB);

      let textElemC = document.createElementNS(bgPath.namespaceURI, "text");
      textElemC.setAttribute("x", x);
      textElemC.setAttribute("y", y + 32 + 42);
      // Centre text horizontally at x,y
      textElemC.setAttribute("text-anchor", "middle");
      // Give it a class that will determine the text size, colour, etc
      textElemC.classList.add("label-text");
      // textElemB.classList.add(labelText);
      textElemC.classList.add("cursor-pointer");
      // Set the text
      textElemC.textContent = labelTextC.toString().split("-")[1] ?? "";
      textElemC.onclick = function (e: any) {
        // console.log("wewon", e?.target?.id);

        if (uri) {
          // console.log("wew", rw?.folio?.url);
          window.location.assign(uri);
        }
      };
      // Add this text element directly after the label background path
      bgPath.after(textElemC);

      let textElemCa = document.createElementNS(bgPath.namespaceURI, "text");
      textElemCa.setAttribute("x", x);
      textElemCa.setAttribute("y", y + 32 + 42 + 32);
      // Centre text horizontally at x,y
      textElemCa.setAttribute("text-anchor", "middle");
      // Give it a class that will determine the text size, colour, etc
      textElemCa.classList.add("label-text");
      // textElemB.classList.add(labelText);
      textElemCa.classList.add("cursor-pointer");
      // Set the text
      textElemCa.textContent = labelTextC.toString().split("-")[0] ?? "";
      textElemCa.onclick = function (e: any) {
        // console.log("wewon", e?.target?.id);

        if (uri) {
          // console.log("wew", rw?.folio?.url);
          window.location.assign(uri);
        }
      };
      // Add this text element directly after the label background path
      bgPath.after(textElemCa);

      var enterD = labelTextC == "" ? 32 + 32 : 32 + 42 + 32 + 32;
      let textElemD = document.createElementNS(bgPath.namespaceURI, "text");
      textElemD.setAttribute("x", x);
      textElemD.setAttribute("y", y + enterD);
      // Centre text horizontally at x,y
      textElemD.setAttribute("text-anchor", "middle");
      // Give it a class that will determine the text size, colour, etc
      textElemD.classList.add("label-text");
      if (labelTextE != "bg-cyan") {
        var filcolor = "!fill-" + labelTextE.toString().split("-")[1];
        textElemD.classList.add(filcolor);
      } else {
        textElemD.classList.add("!fill-white");
      }
      textElemD.classList.add("font-bold");

      // textElemB.classList.add(labelText);
      textElemD.classList.add("cursor-pointer");
      // Set the text
      textElemD.textContent = labelTextD ?? "";
      // textElemD.textContent = labelTextD.toString().split("-")[1] ?? "";

      textElemD.onclick = function (e: any) {
        // console.log("wewon", e?.target?.id);
        if (uri) {
          // console.log("wew", rw?.folio?.url);
          window.location.assign(uri);
        }
      };
      // Add this text element directly after the label background path
      bgPath.after(textElemD);
    }
  }

  return (
    <>
      <div
        ref={svgWrapperRef}
        className="w-full md:w-auto overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
        dangerouslySetInnerHTML={{ __html: floorval?.code_image }}
      />
    </>
  );
};
export default IndexSVG;
