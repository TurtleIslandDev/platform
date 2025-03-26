import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
// import {} from "../../assets/docs/fw9.pdf"
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
const TestForm1099 = () => {
  const formRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const generatePDF = async () => {
  //   const formElement = formRef.current;
  //   const inputs = formElement.querySelectorAll("input, textarea");

  //   const formRect = formElement.getBoundingClientRect();

  //   inputs.forEach((input) => {
  //     const rect = input.getBoundingClientRect();
  //     const span = document.createElement("span");

  //     span.innerText = input.value;

  //     // Apply styles to match input field
  //     span.style.position = "absolute";
  //     span.style.left = `${rect.left - formRect.left + window.scrollX}px`;
  //     span.style.top = `${rect.top - formRect.top + window.scrollY}px`;
  //     span.style.width = `${rect.width}px`;
  //     span.style.height = `${rect.height}px`;
  //     span.style.lineHeight = window.getComputedStyle(input).lineHeight;
  //     span.style.fontSize = window.getComputedStyle(input).fontSize;
  //     span.style.fontFamily = window.getComputedStyle(input).fontFamily;
  //     span.style.fontWeight = window.getComputedStyle(input).fontWeight;
  //     span.style.color = "#000";
  //     span.style.background = "transparent";
  //     span.style.border = "none";
  //     span.style.padding = window.getComputedStyle(input).padding;
  //     span.style.textAlign = window.getComputedStyle(input).textAlign;
  //     span.style.display = "flex";
  //     span.style.alignItems = "center"; // Ensures vertical centering
  //     span.style.justifyContent = "left";
  //     span.style.overflow = "visible"; // Prevents text cutoff
  //     span.style.whiteSpace = "pre-wrap"; // Ensures multi-line text displays correctly
  //     span.style.zIndex = "10";

  //     formElement.appendChild(span);
  //     input.style.opacity = "0"; // Hide input but keep space
  //   });

  //   // Small delay to ensure correct rendering
  //   await new Promise((resolve) => setTimeout(resolve, 300));

  //   // Capture form as an image
  //   const canvas = await html2canvas(formElement, {
  //     scrollX: -window.scrollX,
  //     scrollY: -window.scrollY,
  //     useCORS: true,
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   // Generate PDF
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //   pdf.save("data.pdf");

  //   // Cleanup: Remove spans & restore inputs
  //   inputs.forEach((input) => {
  //     formElement.removeChild(formElement.lastChild);
  //     input.style.opacity = "1";
  //   });
  // };

  const onSubmit = async (data) => {
    console.log(data);

    try {
      // Load the existing fillable PDF
      const existingPdfBytes = await fetch("/f1099msc.pdf").then((res) =>
        res.arrayBuffer()
      );

      // Load the PDF into pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the form fields
      const form = pdfDoc.getForm();

      // Fill the form fields
      form
        .getTextField(
          "topmostSubform[0].CopyA[0].CopyHeader[0].CalendarYear[0].f1_1[0]"
        )
        .setText(data.name);
      form
        .getCheckBox("topmostSubform[0].Copy2[0].CopyHeader[0].c2_1[0]")
        .check();
      form
        .getTextField("topmostSubform[0].CopyA[0].Box16_ReadOrder[0].f1_22[0]")
        .setText(data.email);

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();

      // Download the filled PDF
      saveAs(
        new Blob([pdfBytes], { type: "application/pdf" }),
        "filled-form.pdf"
      );

      alert("PDF filled and downloaded!");
    } catch (error) {
      console.error("Error filling PDF:", error);
    }
    console.log("pdf downloaded");
  };

  const getFieldNames = async () => {
    // Load the PDF file
    const existingPdfBytes = await fetch("/f1099msc.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the form fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log(fields.length, "length");

    // Extract and log field names
    fields.forEach((field) => {
      console.log("Field Name:", field.getName());
    });
  };
  useEffect(() => {
    getFieldNames();
  }, []);
  return (
    <div className="w-full" ref={formRef}>
      <section className="px-20 mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full">
            <div className="w-[45%]">
              <div className="w-full h-56 border border-black overflow-hidden">
                <div className=" text-xl p-1">
                  PAYER'S name, street address, city or town, state or province,
                  country, ZIP or foreign postal code, and telephone no.
                </div>
                <textarea
                  {...register("payerName", { required: true })}
                  className="w-full overflow-hidden h-full p-2 text-xl border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                  placeholder="Enter details here..."
                ></textarea>
              </div>
            </div>
            <div className="w-[22%]">
              <div>
                <div className="w-full border border-black h-20 flex flex-col justify-between">
                  <label className=" text-xl p-1 ">1 Rents</label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      className="w-full p-3 h-3 text-xl border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-20 flex flex-col justify-between">
                  <label className=" text-xl p-1 ">1 Rents</label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("email", { required: true })}
                      type="text"
                      className="w-full p-3 h-3 text-xl border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-20 flex flex-col justify-between">
                  <label className=" text-xl p-1 ">1 Rents</label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input {...register("phone")} type="checkbox" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#1E40AF] rounded-xl py-2 px-8 text-white font-bold w-max mt-6"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
};

export default TestForm1099;
