import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import b from "@assets/images/irs.jpg";
import { useForm } from "react-hook-form";
const Form1099 = () => {
  const formRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const generatePDF = async () => {
    const formElement = formRef.current;
    const inputs = formElement.querySelectorAll("input, textarea, button");
    const originalValues = [];
  
    // Replace inputs with span elements
    inputs.forEach((input) => {
      const span = document.createElement("span");
      span.innerText =
        input.type === "checkbox" ? (input.checked ? "✅" : "⬜") : input.value;
  
      // Apply exact styles to match the original input
      span.style.position = "absolute";
      span.style.left = `${input.offsetLeft - 0}px`;
      span.style.top = `${input.offsetTop - 3}px`;
      span.style.width = `${input.offsetWidth}px`;
      span.style.height = `${input.offsetHeight}px`;
      span.style.fontSize = window.getComputedStyle(input).fontSize;
      span.style.fontFamily = window.getComputedStyle(input).fontFamily;
      span.style.fontWeight = 600;
      span.style.color = "#ff0000";
      span.style.background = "transparent";
      span.style.border = "none";
      span.style.padding = window.getComputedStyle(input).padding;
      span.style.textAlign = window.getComputedStyle(input).textAlign;
      span.style.display = "flex";
      span.style.alignItems = "center";
      span.style.justifyContent = "left";
      span.style.lineHeight = window.getComputedStyle(input).lineHeight;
      span.style.whiteSpace = "nowrap";
      span.style.zIndex = "99999";
  
      // Store original input reference for later restoration
      originalValues.push({ input, span });
  
      formElement.appendChild(span);
      input.style.opacity = "0"; // Hide original input but keep space
    });
  
    // Capture form as an image
    const canvas = await html2canvas(formElement, {
      scale: 2, // Higher resolution for better quality
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
    });
  
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
  
    // Define page size
    const imgWidth = 190; // Max image width for A4 page
    const pageHeight = 297; // A4 page height
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
  
    let yPosition = 0;
  
    // Add multiple pages if content is longer than one page
    while (yPosition < imgHeight) {
      pdf.addImage(imgData, "PNG", 10, -yPosition + 10, imgWidth, imgHeight);
      yPosition += pageHeight; // Move to the next section
      if (yPosition < imgHeight) pdf.addPage();
    }
    pdf.save("form1099.pdf");
    // Restore original form inputs
    originalValues.forEach(({ input, span }) => {
      formElement.removeChild(span);
      input.style.opacity = "1";
    });
  };
  
  // const generatePDF = async () => {
  //   const formElement = formRef.current;
  //   const inputs = formElement.querySelectorAll("input, textarea");

  //   // Ensure inputs display their values as static text before capturing
  //   inputs.forEach((input) => {
  //     const span = document.createElement("span");
  //     // const rect = input.getBoundingClientRect(); // Get accurate position
  //     span.innerText =
  //       input.type === "checkbox" ? (input.checked ? "✅" : "⬜") : input.value;

  //     // Apply exact styles to match original input
  //     span.style.position = "absolute";
  //     span.style.left = `${input.offsetLeft - 0}px`;
  //     span.style.top = `${input.offsetTop - 3}px`;
  //     span.style.width = `${input.offsetWidth}px`;
  //     span.style.height = `${input.offsetHeight}px`;
  //     span.style.fontSize = window.getComputedStyle(input).fontSize;
  //     span.style.fontFamily = window.getComputedStyle(input).fontFamily;
  //     span.style.fontWeight = 600;
  //     span.style.color = "#ff0000";
  //     span.style.background = "transparent";
  //     span.style.border = "none";
  //     span.style.padding = window.getComputedStyle(input).padding;
  //     span.style.textAlign = window.getComputedStyle(input).textAlign;
  //     span.style.display = "flex";
  //     span.style.alignItems = "center";
  //     span.style.justifyContent = "left";
  //     span.style.lineHeight = window.getComputedStyle(input).lineHeight;
  //     span.style.whiteSpace = "nowrap";
  //     // span.style.overflow = "hidden";
  //     span.style.zIndex = "99999";

  //     formElement.appendChild(span);
  //     input.style.opacity = "0"; // Hide original input but keep space
  //   });

  //   // Capture the form as an image
  //   const canvas = await html2canvas(formElement, {
  //     scrollX: 0,
  //     scrollY: 0,
  //     useCORS: true,
  //   });
  //   const imgData = canvas.toDataURL("image/png");

  //   // Generate PDF
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //   pdf.save("FormData.pdf"); // Download the PDF

  //   // Clean up: Remove the generated span elements & restore inputs
  //   inputs.forEach((input) => {
  //     formElement.removeChild(formElement.lastChild);
  //     input.style.opacity = "1";
  //   });
  // };
  const onSubmit = async (data) => {
    console.log(data);

    await generatePDF();
    console.log("pdf downloaded");
  };

  return (
    <div className="w-full" ref={formRef}>
      <img src={b} className="w-full" />
      <h1 className="text-center text-3xl font-semibold text-[#ff0000] my-10">
        Attention:
      </h1>
      <section className="pl-20 pr-20">
        <div>
          <p className="font-normal text-base text-black">
            Copy A of this form is provided for informational purposes only.
            Copy A appears in red, similar to the official IRS form. The
            official printed version of Copy A of this IRS form is scannable,
            but the online version of it, printed from this website, is not. Do
            not print and file copy A downloaded from this website; a penalty
            may be imposed for filing with the IRS information return forms that
            can’t be scanned. See part O in the current General Instructions for
            Certain Information Returns, available at{" "}
            <span
              onClick={() => {
                window.location.href = "https://www.irs.gov/form1099";
              }}
              className="text-blue-600 underline cursor-pointer"
            >
              IRS.gov/Form1099
            </span>
            , for more information about penalties.
          </p>{" "}
          <br />
          <p className="font-normal text-base text-black">
            Please note that Copy B and other copies of this form, which appear
            in black, may be downloaded and printed and used to satisfy the
            requirement to provide the information to the recipient.
          </p>
          <br />
          <p className="font-normal text-base text-black">
            If you have 10 or more information returns to file, you may be
            required to file e-file. Go to{" "}
            <span
              onClick={() => {
                window.location.href =
                  "https://www.irs.gov/filing/e-file-information-returns";
              }}
              className="text-blue-600 underline cursor-pointer"
            >
              IRS.gov/InfoReturn
            </span>{" "}
            for e-file options.
          </p>
          <br />
          <p className="font-normal text-base text-black">
            If you have fewer than 10 information returns to file, we strongly
            encourage you to e-file. If you want to file them on paper, you can
            place an order for the official IRS information returns, which
            include a scannable Copy A for filing with the IRS and all other
            applicable copies of the form, at{" "}
            <span
              onClick={() => {
                window.location.href =
                  "https://www.irs.gov/businesses/online-ordering-for-information-returns-and-employer-returns";
              }}
              className="text-blue-600 underline cursor-pointer"
            >
              IRS.gov/EmployerForms
            </span>{" "}
            . We’ll mail you the forms you request and their instructions, as
            well as any publications you may order.
          </p>
          <br />
          See Publications{" "}
          <span
            onClick={() => {
              window.location.href =
                "https://www.irs.gov/forms-pubs/about-publication-1141";
            }}
            className="text-blue-600 underline cursor-pointer"
          >
            1141
          </span>
          ,{" "}
          <span
            onClick={() => {
              window.location.href =
                "https://www.irs.gov/forms-pubs/about-publication-1167";
            }}
            className="text-blue-600 underline cursor-pointer"
          >
            1167
          </span>
          , and{" "}
          <span
            onClick={() => {
              window.location.href =
                "https://www.irs.gov/forms-pubs/about-publication-1179";
            }}
            className="text-blue-600 underline cursor-pointer"
          >
            1179
          </span>{" "}
          , for more information about printing these forms.
        </div>
      </section>
      <section className="px-20 mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* first form */}
          <div>
            <div className="flex w-full">
              <div className="w-[40%]">
                <div className="w-full h-[184px] border border-black overflow-hidden">
                  <div className=" text-xs p-1">
                    PAYER'S name, street address, city or town, state or
                    province, country, ZIP or foreign postal code, and telephone
                    no.
                  </div>
                  <textarea
                    {...register("payerName")}
                    className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    placeholder="Enter details here..."
                  ></textarea>
                </div>
                <div className="flex">
                  <div className="w-1/2 border border-black h-24 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">PAYER’S TIN</label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("payersTin")}
                        type="text"
                        className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-1/2 border border-black h-24 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">RECIPIENT’S TIN</label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("recipientsTin")}
                        type="text"
                        className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-x-black border-b-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">RECIPIENT’S name</label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("recipientsName")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-x-black border-y-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    Street address (including apt. no.)
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("streetAddress")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-x-black border-b-black border-t-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    City or town, state or province, country, and ZIP or foreign
                    postal code
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("cityOrTown")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="border border-black flex">
                  <div className="w-full max-w-3/4 bg-gray-400"></div>

                  <div className="w-1/4 border border-x-black border-b-black border-t-0 h-24 flex flex-col items-center">
                    <label className=" text-sm p-1 ">
                      13 FATCA filing requirement
                    </label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("FATCA")}
                        type="checkbox"
                        value="true"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-x-black border-b-black border-t-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    Account number (see instructions)
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("accountNumber")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
              </div>
              <div className="w-[25%]">
                <div>
                  <div className="w-full border border-black h-16 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">1 Rents</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("rents")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-full border border-black h-16 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">2 Royalties</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("royalties")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-full border border-black h-14 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">3 Other income</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("otherIncome")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    5 Fishing boat proceeds
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("fishingBoatProceeds")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                {/* //this to be changed to a checkbox field */}
                <div className="w-full border border-black h-24 flex flex-col">
                  <label className=" text-xs p-1 ">
                    7 Payer made direct sales totaling $5,000 or more of
                    consumer products to recipient for resale
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input {...register("payerDirectSales")} type="checkbox" />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    9 Crop insurance proceeds
                  </label>
                  <span className="ml-1 flex gap-2 font-semibold">
                    $
                    <input
                      {...register("cropInsurance")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    11 Fish purchased for resale
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("fishPurchased")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    14 Excess golden parachute payments
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("excessGolden")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col gap-1">
                  <label className=" text-xs p-1 ">16 State tax withheld</label>
                  <span className="ml-1 flex gap-2 border-dashed border-black">
                    $
                    <input
                      {...register("stateIncome1")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                  <div className="border-dashed border-b-2 border-black" />
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("stateIncome2")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
              </div>
              <div className="w-[35%]">
                <div className="flex">
                  <div className="min-w-56">
                    <div className="p-1 w-full border border-black h-[78px] flex flex-col justify-between text-sm">
                      <p>OMB No. 1545-0115</p>
                      <p>
                        Form{" "}
                        <span className="text-xl font-medium">1099-MISC</span>
                      </p>
                      <p>(Rev. January 2024)</p>
                    </div>
                    <div className="w-full border border-black h-[50px] flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        For calendar year{" "}
                      </label>
                      <span className="ml-1 flex gap-2">
                        <input
                          {...register("calenderYear")}
                          type="text"
                          className="w-[80%] mb-1 p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-32 border-b border-b-black flex items-center justify-end text-end font-semibold text-2xl">
                    Miscellaneous
                    <br />
                    Information
                  </div>
                </div>
                <div className="flex">
                  <div className="w-2/3">
                    <div className="w-full border border-black h-14 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        4 Federal income tax withheld
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("federalIncomeTextWithheld")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        6 Medical and health care payments
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("medicalAndHealthCarePayments")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        8 Substitute payments in lieu of dividends or interest
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("substitutePayments")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        10 Gross proceeds paid to an attorney
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("grossProceedsPaid")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        12 Section 409A deferrals
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("section409ADeferrals")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        15 Nonqualified deferred compensation
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("nonQualifiedDeferred")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col gap-1">
                      <label className=" text-xs p-1 ">
                        17 State/Payer’s state no.
                      </label>
                      <span className="ml-1 flex gap-2 border-dashed border-black">
                        $
                        <input
                          {...register("state1")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                      <div className="border-dashed border-b-2 border-black" />
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("state2")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="w-1/3">
                    <div className="flex h-[536px] justify-end text-end font-semibold text-xl">
                      Copy 1
                      <br />
                      For State Tax
                      <br />
                      Department
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col gap-1">
                      <label className=" text-xs p-1 ">18 State income</label>
                      <span className="ml-1 flex gap-2 border-dashed border-black">
                        $
                        <input
                          {...register("stateIncome1")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                      <div className="border-dashed border-b-2 border-black" />
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("stateText2")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4 mb-10">
              <p>
                Form <span className="font-semibold text-xl">1099-MISC</span>{" "}
                (Rev. 1-2024)
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  window.location.href =
                    "https://www.irs.gov/forms-pubs/about-form-1099-misc";
                }}
              >
                www.irs.gov/Form1099MISC
              </p>
              <p>Department of the Treasury - Internal Revenue Service</p>
            </div>
          </div>
          {/* second form */}
          <div>
            <div className="flex w-full">
              <div className="w-[40%]">
                <div className="w-full h-[184px] border border-black overflow-hidden">
                  <div className=" text-xs p-1">
                    PAYER'S name, street address, city or town, state or
                    province, country, ZIP or foreign postal code, and telephone
                    no.
                  </div>
                  <textarea
                    {...register("payerName")}
                    className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    placeholder="Enter details here..."
                  ></textarea>
                </div>
                <div className="flex">
                  <div className="w-1/2 border border-black h-24 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">PAYER’S TIN</label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("payersTin")}
                        type="text"
                        className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-1/2 border border-black h-24 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">RECIPIENT’S TIN</label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("recipientsTin")}
                        type="text"
                        className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-x-black border-b-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">RECIPIENT’S name</label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("recipientsName")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-x-black border-y-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    Street address (including apt. no.)
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("streetAddress")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-x-black border-b-black border-t-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    City or town, state or province, country, and ZIP or foreign
                    postal code
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("cityOrTown")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="border border-black flex">
                  <div className="w-full max-w-3/4 bg-gray-400"></div>

                  <div className="w-1/4 border border-x-black border-b-black border-t-0 h-24 flex flex-col items-center">
                    <label className=" text-sm p-1 ">
                      13 FATCA filing requirement
                    </label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("FATCA")}
                        type="checkbox"
                        value="true"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-x-black border-b-black border-t-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    Account number (see instructions)
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("accountNumber")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
              </div>
              <div className="w-[25%]">
                <div>
                  <div className="w-full border border-black h-16 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">1 Rents</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("rents")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-full border border-black h-16 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">2 Royalties</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("royalties")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-full border border-black h-14 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">3 Other income</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("otherIncome")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    5 Fishing boat proceeds
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("fishingBoatProceeds")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                {/* //this to be changed to a checkbox field */}
                <div className="w-full border border-black h-24 flex flex-col">
                  <label className=" text-xs p-1 ">
                    7 Payer made direct sales totaling $5,000 or more of
                    consumer products to recipient for resale
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input {...register("payerDirectSales")} type="checkbox" />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    9 Crop insurance proceeds
                  </label>
                  <span className="ml-1 flex gap-2 font-semibold">
                    $
                    <input
                      {...register("cropInsurance")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    11 Fish purchased for resale
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("fishPurchased")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    14 Excess golden parachute payments
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("excessGolden")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col gap-1">
                  <label className=" text-xs p-1 ">16 State tax withheld</label>
                  <span className="ml-1 flex gap-2 border-dashed border-black">
                    $
                    <input
                      {...register("stateIncome1")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                  <div className="border-dashed border-b-2 border-black" />
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("stateIncome2")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
              </div>
              <div className="w-[35%]">
                <div className="flex">
                  <div className="min-w-56">
                    <div className="p-1 w-full border border-black h-[78px] flex flex-col justify-between text-sm">
                      <p>OMB No. 1545-0115</p>
                      <p>
                        Form{" "}
                        <span className="text-xl font-medium">1099-MISC</span>
                      </p>
                      <p>(Rev. January 2024)</p>
                    </div>
                    <div className="w-full border border-black h-[50px] flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        For calendar year{" "}
                      </label>
                      <span className="ml-1 flex gap-2">
                        <input
                          {...register("calenderYear")}
                          type="text"
                          className="w-[80%] mb-1 p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-32 border-b border-b-black flex items-center justify-end text-end font-semibold text-2xl">
                    Miscellaneous
                    <br />
                    Information
                  </div>
                </div>
                <div className="flex">
                  <div className="w-2/3">
                    <div className="w-full border border-black h-14 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        4 Federal income tax withheld
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("federalIncomeTextWithheld")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        6 Medical and health care payments
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("medicalAndHealthCarePayments")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        8 Substitute payments in lieu of dividends or interest
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("substitutePayments")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        10 Gross proceeds paid to an attorney
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("grossProceedsPaid")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        12 Section 409A deferrals
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("section409ADeferrals")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        15 Nonqualified deferred compensation
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("nonQualifiedDeferred")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col gap-1">
                      <label className=" text-xs p-1 ">
                        17 State/Payer’s state no.
                      </label>
                      <span className="ml-1 flex gap-2 border-dashed border-black">
                        $
                        <input
                          {...register("state1")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                      <div className="border-dashed border-b-2 border-black" />
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("state2")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="w-1/3">
                    <div className="flex h-[536px] flex-col justify-between text-end ">
                      <div className="font-semibold text-xl">
                        Copy B
                        <br />
                        For Recipient
                        <br />
                        Department
                      </div>
                      <p>
                        This is important tax information and is being furnished
                        to the IRS. If you are required to file a return, a
                        negligence penalty or other sanction may be imposed on
                        you if this income is taxable and the IRS determines
                        that it has not been reported.
                      </p>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col gap-1">
                      <label className=" text-xs p-1 ">18 State income</label>
                      <span className="ml-1 flex gap-2 border-dashed border-black">
                        $
                        <input
                          {...register("stateIncome1")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                      <div className="border-dashed border-b-2 border-black" />
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("stateText2")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4 mb-10">
              <p>
                Form <span className="font-semibold text-xl">1099-MISC</span>{" "}
                (Rev. 1-2024)
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  window.location.href =
                    "https://www.irs.gov/forms-pubs/about-form-1099-misc";
                }}
              >
                www.irs.gov/Form1099MISC
              </p>
              <p>Department of the Treasury - Internal Revenue Service</p>
            </div>
          </div>
          {/* instructions for reccipients */}
          <div className="mt-40 mb-10">
            <h1 className="text-2xl font-semibold">
              Instructions for Recipient
            </h1>
            <div className="flex gap-9">
              <div className="w-1/2">
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">
                      Recipient’s taxpayer identification number (TIN)
                    </span>
                    . For your protection, this form may show only the last four
                    digits of your social security number (SSN), individual
                    taxpayer identification number (ITIN), adoption taxpayer
                    identification number (ATIN), or employer identification
                    number (EIN). However, the payer has reported your complete
                    TIN to the IRS
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">
                      Account number
                    </span>
                    . May show an account or other unique number the payer
                    assigned to distinguish your account.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">
                      Amounts shown may be subject to self-employment (SE) tax.
                    </span>
                    . Individuals should see the Instructions for Schedule SE
                    (Form 1040). Corporations, fiduciaries, or partnerships must
                    report the amounts on the appropriate line of their tax
                    returns.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">
                      Form 1099-MISC incorrect?
                    </span>
                    If this form is incorrect or has been issued in error,
                    contact the payer. If you cannot get this form corrected,
                    attach an explanation to your tax return and report your
                    information correctly.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 1</span>.
                    Report rents from real estate on Schedule E (Form 1040).
                    However, report rents on Schedule C (Form 1040) if you
                    provided significant services to the tenant, sold real
                    estate as a business, or rented personal property as a
                    business. See Pub. 527
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 2</span>.
                    Report royalties from oil, gas, or mineral properties;
                    copyrights; and patents on Schedule E (Form 1040). However,
                    report payments for a working interest as explained in the
                    Schedule E (Form 1040) instructions. For royalties on
                    timber, coal, and iron ore, see Pub. 544.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 3</span>.
                    Generally, report this amount on the “Other income” line of
                    Schedule 1 (Form 1040) and identify the payment. The amount
                    shown may be payments received as the beneficiary of a
                    deceased employee, prizes, awards, taxable damages, Indian
                    gaming profits, or other taxable income. See Pub. 525. If it
                    is trade or business income, report this amount on Schedule
                    C or F (Form 1040).
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 4</span>.
                    Shows backup withholding or withholding on Indian gaming
                    profits. Generally, a payer must backup withhold if you did
                    not furnish your TIN. See Form W-9 and Pub. 505 for more
                    information. Report this amount on your income tax return as
                    tax withheld.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 5</span>.
                    Shows the amount paid to you as a fishing boat crew member
                    by the operator, who considers you to be self-employed.
                    Self-employed individuals must report this amount on
                    Schedule C (Form 1040). See Pub. 334.
                  </p>
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 6</span>.
                     For individuals, report on Schedule C (Form 1040).

                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 7</span>.
                    If checked, consumer products totaling $5,000 or more were sold to you
for resale, on a buy-sell, a deposit-commission, or other basis. Generally, report
any income from your sale of these products on Schedule C (Form 1040).
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 8</span>.
                    Shows substitute payments in lieu of dividends or tax-exempt interest
received by your broker on your behalf as a result of a loan of your securities.
Report on the “Other income” line of Schedule 1 (Form 1040).
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 9</span>.
                    Report this amount on Schedule F (Form 1040).
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 10</span>.
                    Shows gross proceeds paid to an attorney in connection with legal
services. Report only the taxable part as income on your return.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 11</span>.
                    Shows the amount of cash you received for the sale of fish if you are in
the trade or business of catching fish.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 12</span>.
                    May show current year deferrals as a nonemployee under a
nonqualified deferred compensation (NQDC) plan that is subject to the
requirements of section 409A plus any earnings on current and prior year
deferrals
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 13</span>.
                    If the FATCA filing requirement box is checked, the payer is reporting
on this Form 1099 to satisfy its account reporting requirement under chapter 4
of the Internal Revenue Code. You may also have a filing requirement. See the
Instructions for Form 8938.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 14</span>.
                    Shows your total compensation of excess golden parachute payments
subject to a 20% excise tax. See your tax return instructions for where to report
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 15</span>.
                    Shows income as a nonemployee under an NQDC plan that does not
meet the requirements of section 409A. Any amount included in box 12 that is
currently taxable is also included in this box. Report this amount as income on
your tax return. This income is also subject to a substantial additional tax to be
reported on Form 1040, 1040-SR, or 1040-NR. See the instructions for your tax
return.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Box 16-18</span>.
                    Show state or local income tax withheld from the payments.
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Future developments</span>.
                    For the latest information about developments related to
Form 1099-MISC and its instructions, such as legislation enacted after they
were published, go to www.irs.gov/Form1099MISC
                  </p>
                </div>
                <div>
                  <p className="text-black">
                    <span className="font-semibold leading-3">Free File Program</span>.
                    Go to www.irs.gov/FreeFile to see if you qualify for no-cost
                    online federal tax preparation, e-filing, and direct deposit or payment options.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* third form */}
          <div>
            <div className="flex w-full">
              <div className="w-[40%]">
                <div className="w-full h-[184px] border border-black overflow-hidden">
                  <div className=" text-xs p-1">
                    PAYER'S name, street address, city or town, state or
                    province, country, ZIP or foreign postal code, and telephone
                    no.
                  </div>
                  <textarea
                    {...register("payerName")}
                    className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    placeholder="Enter details here..."
                  ></textarea>
                </div>
                <div className="flex">
                  <div className="w-1/2 border border-black h-24 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">PAYER’S TIN</label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("payersTin")}
                        type="text"
                        className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-1/2 border border-black h-24 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">RECIPIENT’S TIN</label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("recipientsTin")}
                        type="text"
                        className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-x-black border-b-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">RECIPIENT’S name</label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("recipientsName")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-x-black border-y-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    Street address (including apt. no.)
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("streetAddress")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-x-black border-b-black border-t-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    City or town, state or province, country, and ZIP or foreign
                    postal code
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("cityOrTown")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="border border-black flex">
                  <div className="w-full max-w-3/4 bg-gray-400"></div>

                  <div className="w-1/4 border border-x-black border-b-black border-t-0 h-24 flex flex-col items-center">
                    <label className=" text-sm p-1 ">
                      13 FATCA filing requirement
                    </label>
                    <span className="ml-1 flex gap-2">
                      <input
                        {...register("FATCA")}
                        type="checkbox"
                        value="true"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-x-black border-b-black border-t-0 h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    Account number (see instructions)
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input
                      {...register("accountNumber")}
                      type="text"
                      className="w-full p-3 h-16 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
              </div>
              <div className="w-[25%]">
                <div>
                  <div className="w-full border border-black h-16 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">1 Rents</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("rents")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-full border border-black h-16 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">2 Royalties</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("royalties")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                  <div className="w-full border border-black h-14 flex flex-col justify-between">
                    <label className=" text-xs p-1 ">3 Other income</label>
                    <span className="ml-1 flex gap-2">
                      $
                      <input
                        {...register("otherIncome")}
                        type="text"
                        className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                      />
                    </span>
                  </div>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    5 Fishing boat proceeds
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("fishingBoatProceeds")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                {/* //this to be changed to a checkbox field */}
                <div className="w-full border border-black h-24 flex flex-col">
                  <label className=" text-xs p-1 ">
                    7 Payer made direct sales totaling $5,000 or more of
                    consumer products to recipient for resale
                  </label>
                  <span className="ml-1 flex gap-2">
                    <input {...register("payerDirectSales")} type="checkbox" />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    9 Crop insurance proceeds
                  </label>
                  <span className="ml-1 flex gap-2 font-semibold">
                    $
                    <input
                      {...register("cropInsurance")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    11 Fish purchased for resale
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("fishPurchased")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col justify-between">
                  <label className=" text-xs p-1 ">
                    14 Excess golden parachute payments
                  </label>
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("excessGolden")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
                <div className="w-full border border-black h-24 flex flex-col gap-1">
                  <label className=" text-xs p-1 ">16 State tax withheld</label>
                  <span className="ml-1 flex gap-2 border-dashed border-black">
                    $
                    <input
                      {...register("stateIncome1")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                  <div className="border-dashed border-b-2 border-black" />
                  <span className="ml-1 flex gap-2">
                    $
                    <input
                      {...register("stateIncome2")}
                      type="text"
                      className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </span>
                </div>
              </div>
              <div className="w-[35%]">
                <div className="flex">
                  <div className="min-w-56">
                    <div className="p-1 w-full border border-black h-[78px] flex flex-col justify-between text-sm">
                      <p>OMB No. 1545-0115</p>
                      <p>
                        Form{" "}
                        <span className="text-xl font-medium">1099-MISC</span>
                      </p>
                      <p>(Rev. January 2024)</p>
                    </div>
                    <div className="w-full border border-black h-[50px] flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        For calendar year{" "}
                      </label>
                      <span className="ml-1 flex gap-2">
                        <input
                          {...register("calenderYear")}
                          type="text"
                          className="w-[80%] mb-1 p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-32 border-b border-b-black flex items-center justify-end text-end font-semibold text-2xl">
                    Miscellaneous
                    <br />
                    Information
                  </div>
                </div>
                <div className="flex">
                  <div className="w-2/3">
                    <div className="w-full border border-black h-14 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        4 Federal income tax withheld
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("federalIncomeTextWithheld")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        6 Medical and health care payments
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("medicalAndHealthCarePayments")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        8 Substitute payments in lieu of dividends or interest
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("substitutePayments")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        10 Gross proceeds paid to an attorney
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("grossProceedsPaid")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        12 Section 409A deferrals
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("section409ADeferrals")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col justify-between">
                      <label className=" text-xs p-1 ">
                        15 Nonqualified deferred compensation
                      </label>
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("nonQualifiedDeferred")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col gap-1">
                      <label className=" text-xs p-1 ">
                        17 State/Payer’s state no.
                      </label>
                      <span className="ml-1 flex gap-2 border-dashed border-black">
                        $
                        <input
                          {...register("state1")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                      <div className="border-dashed border-b-2 border-black" />
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("state2")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="w-1/3">
                    <div className="flex h-[536px] flex-col justify-between text-end ">
                      <div className="font-semibold text-xl">
                        Copy 2
                        <br />
                        To be filed with recipient’s state income tax return,
                        when required.
                      </div>
                      <p></p>
                    </div>
                    <div className="w-full border border-black h-24 flex flex-col gap-1">
                      <label className=" text-xs p-1 ">18 State income</label>
                      <span className="ml-1 flex gap-2 border-dashed border-black">
                        $
                        <input
                          {...register("stateIncome1")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                      <div className="border-dashed border-b-2 border-black" />
                      <span className="ml-1 flex gap-2">
                        $
                        <input
                          {...register("stateText2")}
                          type="text"
                          className="w-full p-3 h-3 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4 mb-10">
              <p>
                Form <span className="font-semibold text-xl">1099-MISC</span>{" "}
                (Rev. 1-2024)
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  window.location.href =
                    "https://www.irs.gov/forms-pubs/about-form-1099-misc";
                }}
              >
                www.irs.gov/Form1099MISC
              </p>
              <p>Department of the Treasury - Internal Revenue Service</p>
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#1E40AF] rounded-xl py-2 px-8 text-white font-bold text-base w-max mt-6"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
};

export default Form1099;
