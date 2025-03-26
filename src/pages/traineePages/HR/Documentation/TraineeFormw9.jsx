import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useSelector } from "react-redux";
const TraineeFormW9 = () => {
  const { token } = useSelector((state) => state.user);
  const formRef = useRef();
  const { register, handleSubmit, watch } = useForm();

  const watchCheck = watch("federalTexClassification");
  const createRefs = (length) =>
    Array(length)
      .fill(0)
      .map(() => useRef());

  const [ssn, setSsn] = useState(Array(9).fill(""));
  const [ein, setEin] = useState(Array(9).fill(""));
  const ssnRefs = createRefs(9);
  const einRefs = createRefs(9);

  const inputStyle = {
    padding: 0,
    width: "30px",
    height: "40px",
    textAlign: "center",
    fontSize: "16px",
    border: "1px solid #000",
    borderRadius: "1px",
    backgroundColor: "#f3f4f6",
  };
  let spanClass = "text-lg font-semibold my-1";
  let lineClass = "text-xl font-semibold my-2";
  let h3Class = "text-2xl font-semibold my-1";
  const containerStyle = {
    display: "flex",
    gap: "0px",
    alignItems: "center",
  };
  const handleChange = (index, value, data, setData, refs, maxIndex) => {
    if (/^\d*$/.test(value)) {
      const newData = [...data];
      newData[index] = value;
      setData(newData);

      if (value && index < maxIndex) {
        refs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, event, data, refs) => {
    if (event.key === "Backspace" && !data[index] && index > 0) {
      refs[index - 1].current.focus();
    }
  };
  const onSubmit = async (data) => {
    let firstSSN = "";
    let secondSSN = "";
    let thirdSSN = "";
    let firstEIN = "";
    let secondEIN = "";
    for (let i = 0; i < ssn?.length; i++) {
      if (i < 3) {
        firstSSN += ssn[i];
      }
      if (i > 2 && i < 5) {
        secondSSN += ssn[i];
      }
      if (i > 4) {
        thirdSSN += ssn[i];
      }
    }
    for (let i = 0; i < ein?.length; i++) {
      if (i < 2) {
        firstEIN += ein[i];
      }
      if (i > 1) {
        secondEIN += ein[i];
      }
    }
    if (
      firstSSN.length === 3 &&
      secondSSN.length === 2 &&
      thirdSSN.length === 4 &&
      firstEIN.length === 2 &&
      secondEIN.length === 7
    ) {
      try {
        // Load the existing fillable PDF
        const existingPdfBytes = await fetch("/fw9.pdf").then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        form
          .getTextField("topmostSubform[0].Page1[0].f1_01[0]")
          .setText(data.name);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_02[0]")
          .setText(data.businessName);
        if (data.federalTexClassification == "Individual") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[0]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[0]"
            )
            .uncheck();
        }
        if (data.federalTexClassification == "C") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[1]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[1]"
            )
            .uncheck();
        }
        if (data.federalTexClassification == "S") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[2]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[2]"
            )
            .uncheck();
        }
        if (data.federalTexClassification == "partnership") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[3]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[3]"
            )
            .uncheck();
        }
        if (data.federalTexClassification == "Trust/estate") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[4]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[4]"
            )
            .uncheck();
        }
        if (data.federalTexClassification == "LLC") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[5]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[5]"
            )
            .uncheck();
        }
        form
          .getTextField(
            "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].f1_03[0]"
          )
          .setText(data.federalTexClassification == "LLC" ? data.llc : "");

        if (data.federalTexClassification == "other") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[6]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_1[6]"
            )
            .uncheck();
        }

        form
          .getTextField(
            "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].f1_04[0]"
          )
          .setText(data.federalTexClassification == "other" ? data.other : "");

        if (data?.threeB == "3bChecked") {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_2[0]"
            )
            .check();
        } else {
          form
            .getCheckBox(
              "topmostSubform[0].Page1[0].Boxes3a-b_ReadOrder[0].c1_2[0]"
            )
            .uncheck();
        }

        form
          .getTextField("topmostSubform[0].Page1[0].f1_05[0]")
          .setText(data.payeeCode);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_06[0]")
          .setText(data.exemption);
        form
          .getTextField(
            "topmostSubform[0].Page1[0].Address_ReadOrder[0].f1_07[0]"
          )
          .setText(data.address);
        form
          .getTextField(
            "topmostSubform[0].Page1[0].Address_ReadOrder[0].f1_08[0]"
          )
          .setText(data.cityOrStateOrZip);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_09[0]")
          .setText(data.requesterName);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_10[0]")
          .setText(data.accountNo);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_11[0]")
          .setText(firstSSN);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_12[0]")
          .setText(secondSSN);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_13[0]")
          .setText(thirdSSN);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_14[0]")
          .setText(firstEIN);
        form
          .getTextField("topmostSubform[0].Page1[0].f1_15[0]")
          .setText(secondEIN);
        // Save the modified PDF
        const pdfBytes = await pdfDoc.save();
        // Download the filled PDF
        // saveAs(
        //   new Blob([pdfBytes], { type: "application/pdf" }),
        //   "filled-form.pdf"
        // );
        saveAs(
          new Blob([pdfBytes], { type: "application/pdf" }),
          "filled-form.pdf"
        );
        let blobPDF = new Blob([pdfBytes], { type: "application/pdf" });

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("file", blobPDF, "w9.pdf");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        fetch(
          "https://endpoint.itsbuzzmarketing.com/user/upload_document",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            result = JSON.parse(result);
            alert(result.message);
            console.log(result);
          })
          .catch((error) => console.error(error));
      } catch (error) {
        console.error("Error filling PDF:", error);
      }
    } else {
      alert("Please fillout EIN and SSN");
      return;
    }
  };

  return (
    <div className="w-full font-sans p-5" ref={formRef}>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <section
          className="px-4 flex justify-between"
          style={{ borderBottom: "2px solid black" }}
        >
          <div className="w-[13%] text-start">
            Form <span className="font-bold text-4xl">W-9</span>
            <br />
            (Rev. March 2024)
            <br />
            Department of the Treasury
            <br />
            Internal Revenue Service
          </div>
          <div
            className="w-[77%]"
            style={{
              borderRight: "2px solid black",
              borderLeft: "2px solid black",
              textAlign: "center",
            }}
          >
            <h1 className="font-semibold text-3xl">
              Request for Taxpayer <br /> Identification Number and
              Certification
            </h1>
            <p className="font-semibold">
              Go to www.irs.gov/FormW9 for instructions and the latest
              information.
            </p>
          </div>
          <div className="w-[10%] font-semibold flex items-center justify-center pl-2">
            Give form to the requester. Do not send to the IRS.
          </div>
        </section>
        <div
          className="toTop w-full"
          style={{ borderBottom: "2px solid black" }}
        >
          <span className="font-bold text-base">Before you begin</span>. For
          guidance related to the purpose of Form W-9, see Purpose of Form,
          below
        </div>
        <section className="px-4">
          <div className="flex m-0 ">
            <div
              className="text-center "
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                whiteSpace: "nowrap",
              }}
            >
              <p className="text-xl font-semibold">Print or type.</p>
              <p>
                See{" "}
                <span className="text-xl font-semibold">
                  Specific Instructions
                </span>{" "}
                on page 3.
              </p>
            </div>
            <div style={{ borderLeft: "2px solid #898989", width: "100%" }}>
              <div
                className="w-full overflow-hidden"
                style={{ borderBottom: "2px solid #898989" }}
              >
                <div className=" text-sm p-1">
                  <span className="font-bold text-base">1</span>. Name of
                  entity/individual. An entry is required. (For a sole
                  proprietor or disregarded entity, enter the owner’s name on
                  line 1, and enter the business/disregarded entity’s name on
                  line 2.)
                </div>
                <input
                  {...register("name")}
                  className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                />
              </div>
              <div
                className="w-full overflow-hidden"
                style={{ borderBottom: "2px solid #898989" }}
              >
                <div className=" text-sm p-1">
                  <span className="font-bold text-base">2</span>. Business
                  name/disregarded entity name, if different from above.
                </div>
                <input
                  {...register("businessName")}
                  className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                />
              </div>
              <div className="flex">
                <div className="w-3/4">
                  <div>
                    <div
                      className="w-full overflow-hidden pr-2 py-3"
                      style={{ borderBottom: "2px solid #898989" }}
                    >
                      <div className=" text-sm p-1 flex">
                        <span className="font-bold text-base">3a</span>.
                        <p>
                          Check the appropriate box for federal tax
                          classification of the entity/individual whose name is
                          entered on line 1. Check only one of the following
                          seven boxes.
                        </p>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="flex items-center gap-5 ml-7">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"Individual"}
                          />
                          <p>Individual/sole proprietor</p>
                        </div>
                        <div className="flex items-center gap-5 ml-7">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"C"}
                          />
                          <p>C corporation</p>
                        </div>
                        <div className="flex items-center gap-5 ml-7">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"S"}
                          />
                          <p>S corporation</p>
                        </div>
                        <div className="flex items-center gap-5 ml-7">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"partnership"}
                          />
                          <p>Partnership </p>
                        </div>
                        <div className="flex items-center gap-5 ml-7">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"Trust/estate"}
                          />
                          <p>Trust/estate </p>
                        </div>

                        <div className="flex items-center gap-5 ml-7">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"LLC"}
                          />
                          {/* watchCheck */}
                          <p>
                            LLC. Enter the tax classification (C = C
                            corporation, S = S corporation, P = Partnership){" "}
                          </p>
                          <input
                            {...register("llc")}
                            disabled={watchCheck !== "LLC"}
                            className="overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                            style={{
                              borderBottom: "2px solid #898989",
                            }}
                          />
                        </div>
                        <p className="ml-7">
                          <span className={spanClass}>Note</span>: Check the
                          “LLC” box above and, in the entry space, enter the
                          appropriate code (C, S, or P) for the tax
                          classification of the LLC, unless it is a disregarded
                          entity. A disregarded entity should instead check the
                          appropriate box for the tax classification of its
                          owner.
                        </p>
                        <div className="flex items-center gap-5 ml-7 w-full">
                          <input
                            {...register("federalTexClassification")}
                            type="radio"
                            value={"other"}
                          />
                          {/* watchCheck */}
                          <p>Other (see instructions)</p>
                          <input
                            {...register("other")}
                            disabled={watchCheck !== "other"}
                            className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                            style={{
                              borderBottom: "2px solid #898989",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="w-full overflow-hidden flex items-end pr-4 py-3"
                    style={{ borderBottom: "2px solid #898989" }}
                  >
                    <div className=" text-sm p-1 ">
                      <span className="font-bold text-base">3b</span>. If on
                      line 3a you checked “Partnership” or “Trust/estate,” or
                      checked “LLC” and entered “P” as its tax classification,
                      and you are providing this form to a partnership, trust,
                      or estate in which you have an ownership interest, check
                      this box if you have any foreign partners, owners, or
                      beneficiaries. See instructions . . . . . . . . .
                      <span>
                        {" "}
                        <input
                          {...register("threeB")}
                          type="checkbox"
                          value={"3bChecked"}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="w-1/4 overflow-hidden"
                  style={{
                    // borderBottom: "2px solid #898989",
                    borderLeft: "2px solid #898989",
                  }}
                >
                  <div className=" p-1">
                    <span className="font-bold text-base">4</span>. City,
                    Exemptions (codes apply only to certain entities, not
                    individuals; see instructions on page 3):
                  </div>
                  <div className="flex text-sm">
                    Exempt payee code (if any)
                    <input
                      {...register("payeeCode")}
                      style={{ borderBottom: "2px solid #898989" }}
                      className=" overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </div>
                  <div className="text-sm mt-2">
                    Exemption from Foreign Account Tax Compliance Act (FATCA)
                    reporting code (if any)
                    <input
                      style={{ borderBottom: "2px solid #898989" }}
                      {...register("exemption")}
                      className="overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </div>
                  <br />
                  <p className="text-center">
                    (Applies to accounts maintained <br /> outside the United
                    States.)
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="w-3/4">
                  {" "}
                  <div
                    className="w-full overflow-hidden"
                    style={{ borderBottom: "2px solid #898989" }}
                  >
                    <div className=" text-sm p-1">
                      <span className="font-bold text-base">5</span>. Address
                      (number, street, and apt. or suite no.). See instructions.
                    </div>
                    <input
                      {...register("address")}
                      className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </div>
                  <div
                    className="w-full overflow-hidden"
                    style={{ borderBottom: "2px solid #898989" }}
                  >
                    <div className=" text-sm p-1">
                      <span className="font-bold text-base">6</span>. City,
                      state, and ZIP code
                    </div>
                    <input
                      {...register("cityOrStateOrZip")}
                      className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                    />
                  </div>
                </div>

                <div
                  className="w-1/4 overflow-hidden"
                  style={{
                    borderBottom: "2px solid #898989",
                    borderTop: "2px solid #898989",
                    borderLeft: "2px solid #898989",
                  }}
                >
                  <div className=" text-sm p-1">
                    <span className="font-bold text-base"></span>Requester’s
                    name and address (optional)
                  </div>
                  <textarea
                    {...register("requesterName")}
                    className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                  />
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <div className=" text-sm p-1">
                  <span className="font-bold text-base">7</span>. List account
                  number(s) here (optional)
                </div>
                <input
                  {...register("accountNo")}
                  className="w-full overflow-hidden h-full p-2 text-sm border-none outline-none resize-none bg-gray-100 focus:bg-white focus:ring-0 focus:border-none"
                />
              </div>
            </div>
          </div>
          {/* Part I Taxpayer Identification Number (TIN) */}
          <div
            style={{
              // borderBottom: "2px solid black",
              borderTop: "2px solid black",
            }}
          >
            <div
              className="flex"
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <h2 className="bg-black text-white px-2 mr-5">Part I</h2>
              <p>Taxpayer Identification Number (TIN)</p>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col justify-around">
                <p>
                  Enter your TIN in the appropriate box. The TIN provided must
                  match the name given on line 1 to avoid backup withholding.
                  For individuals, this is generally your social security number
                  (SSN). However, for a resident alien, sole proprietor, or
                  disregarded entity, see the instructions for Part I, later.
                  For other entities, it is your employer identification number
                  (EIN). If you do not have a number, see How to get a TIN,
                  later.
                </p>
                <p>
                  <span className="font-bold text-base">Note</span>: If the
                  account is in more than one name, see the instructions for
                  line 1. See also What Name and Number To Give the Requester
                  for guidelines on whose number to enter.
                </p>
              </div>
              <div className="min-w-[20%]">
                <div className="w-max">
                  <h3 className=" text-sm font-semibold m-0 border-2 border-black p-1">
                    Social security number
                  </h3>
                  <div style={containerStyle}>
                    {ssn.map((char, index) => (
                      <>
                        {index === 3 || index === 5 ? (
                          <div className="w-5 flex justify-center font-bold">
                            -
                          </div>
                        ) : null}
                        <input
                          key={`ssn-${index}`}
                          type="text"
                          maxLength="1"
                          ref={ssnRefs[index]}
                          value={char}
                          onChange={(e) =>
                            handleChange(
                              index,
                              e.target.value,
                              ssn,
                              setSsn,
                              ssnRefs,
                              8
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(index, e, ssn, ssnRefs)
                          }
                          style={inputStyle}
                        />
                      </>
                    ))}
                  </div>
                </div>
                <p className="text-sm font-semibold">Or</p>
                <div className="w-max">
                  <h3 className="text-sm font-semibold m-0 border-2 border-black p-1">
                    Employer Idenification Number
                  </h3>
                  <div style={containerStyle}>
                    {ein.map((char, index) => (
                      <>
                        {index === 2 ? (
                          <div className="w-5 flex justify-center font-bold">
                            -
                          </div>
                        ) : null}
                        <input
                          key={`ein-${index}`}
                          type="text"
                          maxLength="1"
                          ref={einRefs[index]}
                          value={char}
                          onChange={(e) =>
                            handleChange(
                              index,
                              e.target.value,
                              ein,
                              setEin,
                              einRefs,
                              8
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(index, e, ein, einRefs)
                          }
                          style={inputStyle}
                        />{" "}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          {/* Part II Certification */}
          <div
            style={{
              borderBottom: "2px solid black",
              borderTop: "2px solid black",
            }}
          >
            <div
              className="flex"
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <h2 className="bg-black text-white px-2 mr-5">Part II</h2>
              <p>Certification (TIN)</p>
            </div>
            <div className="">
              <p>Under penalties of perjury, I certify that:</p>
              <ol className="list-decimal ml-6">
                <li>
                  {" "}
                  The number shown on this form is my correct taxpayer
                  identification number (or I am waiting for a number to be
                  issued to me); and
                </li>
                <li>
                  I am not subject to backup withholding because (a) I am exempt
                  from backup withholding, or (b) I have not been notified by
                  the Internal Revenue Service (IRS) that I am subject to backup
                  withholding as a result of a failure to report all interest or
                  dividends, or (c) the IRS has notified me that I am no longer
                  subject to backup withholding; and
                </li>
                <li>
                  I am a U.S. citizen or other U.S. person (defined below); and
                </li>
                <li>
                  {" "}
                  The FATCA code(s) entered on this form (if any) indicating
                  that I am exempt from FATCA reporting is correct.
                </li>
              </ol>
              <p>
                <span className="text-lg font-semibold">
                  Certification instructions
                </span>
                . You must cross out item 2 above if you have been notified by
                the IRS that you are currently subject to backup withholding
                because you have failed to report all interest and dividends on
                your tax return. For real estate transactions, item 2 does not
                apply. For mortgage interest paid, acquisition or abandonment of
                secured property, cancellation of debt, contributions to an
                individual retirement arrangement (IRA), and, generally,
                payments other than interest and dividends, you are not required
                to sign the certification, but you must provide your correct
                TIN. See the instructions for Part II, later
              </p>
            </div>
          </div>

          {/* Sign Here II Certification Signature of U.S. person */}
          <div
            style={{
              borderBottom: "2px solid black",
            }}
          >
            <div
              className="flex"
              style={{
                borderBottom: "2px solid black",
              }}
            >
              <h2 className="text-xl px-2 mr-5 font-bold">
                Sign
                <br />
                Here
              </h2>
              <div className="flex justify-between w-full items-end">
                <p
                  className="pl-2 font-bold w-1/2"
                  style={{ borderLeft: "2px solid black" }}
                >
                  Signature of
                  <br />
                  U.S. person
                </p>
                <p className="pl-2 font-bold w-1/2">Date</p>
              </div>
            </div>
            <div className="flex gap-6 mt-3">
              <div className="w-1/2">
                <h1 className="text-2xl font-semibold">General Instructions</h1>
                <p>
                  Section references are to the Internal Revenue Code unless
                  otherwise noted.
                </p>
                <p>
                  <span className="text-lg font-bold">Future developments</span>
                  . For the latest information about developments related to
                  Form W-9 and its instructions, such as legislation enacted
                  after they were published, go to www.irs.gov/FormW9.
                </p>
                <h3 className="text-2xl font-semibold">What’s New</h3>
                <p>
                  Line 3a has been modified to clarify how a disregarded entity
                  completes this line. An LLC that is a disregarded entity
                  should check the appropriate box for the tax classification of
                  its owner. Otherwise, it should check the “LLC” box and enter
                  its appropriate tax classification.
                </p>
              </div>
              <div className="w-1/2">
                <p>
                  New line 3b has been added to this form. A flow-through entity
                  is required to complete this line to indicate that it has
                  direct or indirect foreign partners, owners, or beneficiaries
                  when it provides the Form W-9 to another flow-through entity
                  in which it has an ownership interest. This change is intended
                  to provide a flow-through entity with information regarding
                  the status of its indirect foreign partners, owners, or
                  beneficiaries, so that it can satisfy any applicable reporting
                  requirements. For example, a partnership that has any indirect
                  foreign partners may be required to complete Schedules K-2 and
                  K-3. See the Partnership Instructions for Schedules K-2 and
                  K-3 (Form 1065).
                </p>
                <h3 className="text-2xl font-semibold">Purpose of Form</h3>
                <p>
                  An individual or entity (Form W-9 requester) who is required
                  to file an information return with the IRS is giving you this
                  form because they
                </p>
              </div>
            </div>
          </div>
          {/* page 2 */}
          <div
            style={{
              borderBottom: "2px solid black",
            }}
            className="flex gap-6 my-4 pb-4"
          >
            <div className="w-1/2">
              <p>
                must obtain your correct taxpayer identification number (TIN),
                which may be your social security number (SSN), individual
                taxpayer identification number (ITIN), adoption taxpayer
                identification number (ATIN), or employer identification number
                (EIN), to report on an information return the amount paid to
                you, or other amount reportable on an information return.
                Examples of information returns include, but are not limited to,
                the following
              </p>
              <ul className="leading-8 list-disc ml-5">
                <li>Form 1099-INT (interest earned or paid)</li>
                <li>
                  {" "}
                  Form 1099-DIV (dividends, including those from stocks or
                  mutual funds).
                </li>
                <li>
                  {" "}
                  Form 1099-MISC (various types of income, prizes, awards, or
                  gross proceeds).
                </li>
                <li> Form 1099-NEC (nonemployee compensation).</li>
                <li>
                  Form 1099-B (stock or mutual fund sales and certain other
                  transactions by brokers).
                </li>
                <li> Form 1099-S (proceeds from real estate transactions).</li>
                <li>
                  Form 1099-K (merchant card and third-party network
                  transactions).
                </li>
                <li>
                  Form 1098 (home mortgage interest), 1098-E (student loan
                  interest), and 1098-T (tuition).
                </li>
                <li>Form 1099-C (canceled debt).</li>
                <li>
                  Form 1099-A (acquisition or abandonment of secured property).
                  Use Form W-9 only if you are a U.S. person (including a
                  resident alien), to provide your correct TIN.{" "}
                </li>
              </ul>
              <p>
                <span className={spanClass}>Caution</span>: If you don’t return
                Form W-9 to the requester with a TIN, you might be subject to
                backup withholding. See What is backup withholding, later.
              </p>
              <div className="ml-5">
                <p>
                  <span className={spanClass}>
                    By signing the filled-out form
                  </span>
                  , you:
                </p>
                <ol className="list-decimal">
                  <li>
                    Certify that the TIN you are giving is correct (or you are
                    waiting for a number to be issued)
                  </li>
                  <li>
                    {" "}
                    Certify that you are not subject to backup withholding; or
                  </li>
                  <li>
                    {" "}
                    Claim exemption from backup withholding if you are a U.S.
                    exempt payee; and
                  </li>
                  <li>
                    Certify to your non-foreign status for purposes of
                    withholding under chapter 3 or 4 of the Code (if
                    applicable); and
                  </li>
                  <li>
                    Certify that FATCA code(s) entered on this form (if any)
                    indicating that you are exempt from the FATCA reporting is
                    correct. See What Is FATCA Reporting, later, for further
                    information
                  </li>
                </ol>
              </div>
              <p>
                <span className={spanClass}>Note</span>: If you are a U.S.
                person and a requester gives you a form other than Form W-9 to
                request your TIN, you must use the requester’s form if it is
                substantially similar to this Form W-9.
              </p>
              <p>
                <span className={spanClass}>Definition of a U.S. person</span>.
                For federal tax purposes, you are considered a U.S. person if
                you are:
              </p>
              <ul className="leading-8 list-disc ml-5">
                <li>
                  An individual who is a U.S. citizen or U.S. resident alien;
                </li>
                <li>
                  A partnership, corporation, company, or association created or
                  organized in the United States or under the laws of the United
                  States;
                </li>
                <li>An estate (other than a foreign estate); or</li>
                <li>
                  A domestic trust (as defined in Regulations section
                  301.7701-7).
                </li>
              </ul>
              <p>
                <span className={spanClass}>
                  Establishing U.S. status for purposes of chapter 3 and chapter
                  4 withholding
                </span>
                . Payments made to foreign persons, including certain
                distributions, allocations of income, or transfers of sales
                proceeds, may be subject to withholding under chapter 3 or
                chapter 4 of the Code (sections 1441–1474). Under those rules,
                if a Form W-9 or other certification of non-foreign status has
                not been received, a withholding agent, transferee, or
                partnership (payor) generally applies presumption rules that may
                require the payor to withhold applicable tax from the recipient,
                owner, transferor, or partner (payee). See Pub. 515, Withholding
                of Tax on Nonresident Aliens and Foreign Entities
              </p>
              <p className="indent-5">
                {" "}
                The following persons must provide Form W-9 to the payor for
                purposes of establishing its non-foreign status.
              </p>
              <ul className="leading-8 list-disc ml-5">
                <li>
                  {" "}
                  In the case of a disregarded entity with a U.S. owner, the
                  U.S. owner of the disregarded entity and not the disregarded
                  entity.
                </li>
                <li>
                  {" "}
                  In the case of a grantor trust with a U.S. grantor or other
                  U.S. owner, generally, the U.S. grantor or other U.S. owner of
                  the grantor trust and not the grantor trust.
                </li>
                <li>
                  In the case of a U.S. trust (other than a grantor trust), the
                  U.S. trust and not the beneficiaries of the trust.
                </li>
              </ul>
              <p>
                See Pub. 515 for more information on providing a Form W-9 or a
                certification of non-foreign status to avoid withholding.
              </p>
            </div>
            <div className="w-1/2">
              <p>
                {" "}
                <span className={spanClass}>Foreign person</span> . If you are a
                foreign person or the U.S. branch of a foreign bank that has
                elected to be treated as a U.S. person (under Regulations
                section 1.1441-1(b)(2)(iv) or other applicable section for
                chapter 3 or 4 purposes), do not use Form W-9. Instead, use the
                appropriate Form W-8 or Form 8233 (see Pub. 515). If you are a
                qualified foreign pension fund under Regulations section
                1.897(l)-1(d), or a partnership that is wholly owned by
                qualified foreign pension funds, that is treated as a
                non-foreign person for purposes of section 1445 withholding, do
                not use Form W-9. Instead, use Form W-8EXP (or other
                certification of non-foreign status).
              </p>
              <p>
                {" "}
                <span className={spanClass}>
                  Nonresident alien who becomes a resident alien
                </span>{" "}
                . Generally, only a nonresident alien individual may use the
                terms of a tax treaty to reduce or eliminate U.S. tax on certain
                types of income. However, most tax treaties contain a provision
                known as a saving clause. Exceptions specified in the saving
                clause may permit an exemption from tax to continue for certain
                types of income even after the payee has otherwise become a U.S.
                resident alien for tax purposes
              </p>
              <p className="indent-4">
                {" "}
                If you are a U.S. resident alien who is relying on an exception
                contained in the saving clause of a tax treaty to claim an
                exemption from U.S. tax on certain types of income, you must
                attach a statement to Form W-9 that specifies the following five
                items
              </p>
              <ol className="list-decimal ml-5">
                <li>
                  The treaty country. Generally, this must be the same treaty
                  under which you claimed exemption from tax as a nonresident
                  alien.
                </li>
                <li>The treaty article addressing the income.</li>
                <li>
                  {" "}
                  The article number (or location) in the tax treaty that
                  contains the saving clause and its exceptions.
                </li>
                <li>
                  The type and amount of income that qualifies for the exemption
                  from tax.
                </li>
                <li>
                  {" "}
                  Sufficient facts to justify the exemption from tax under the
                  terms of the treaty article.
                </li>
              </ol>
              <p className="indent-4">
                {" "}
                <span className={`${spanClass} italic indent-4`}>Example</span>.
                Article 20 of the U.S.-China income tax treaty allows an
                exemption from tax for scholarship income received by a Chinese
                student temporarily present in the United States. Under U.S.
                law, this student will become a resident alien for tax purposes
                if their stay in the United States exceeds 5 calendar years.
                However, paragraph 2 of the first Protocol to the U.S.-China
                treaty (dated April 30, 1984) allows the provisions of Article
                20 to continue to apply even after the Chinese student becomes a
                resident alien of the United States. A Chinese student who
                qualifies for this exception (under paragraph 2 of the first
                Protocol) and is relying on this exception to claim an exemption
                from tax on their scholarship or fellowship income would attach
                to Form W-9 a statement that includes the information described
                above to support that exemption.
              </p>
              <p className="indent-4">
                {" "}
                If you are a nonresident alien or a foreign entity, give the
                requester the appropriate completed Form W-8 or Form 8233.
              </p>
              <h3 className="text-2xl font-semibold">Backup Withholding</h3>
              <p>
                {" "}
                <span className={spanClass}>What is backup withholding</span> ?
                Persons making certain payments to you must under certain
                conditions withhold and pay to the IRS 24% of such payments.
                This is called “backup withholding.” Payments that may be
                subject to backup withholding include, but are not limited to,
                interest, tax-exempt interest, dividends, broker and barter
                exchange transactions, rents, royalties, nonemployee pay,
                payments made in settlement of payment card and third-party
                network transactions, and certain payments from fishing boat
                operators. Real estate transactions are not subject to backup
                withholding.
              </p>
              <p className="indent-5">
                You will not be subject to backup withholding on payments you
                receive if you give the requester your correct TIN, make the
                proper certifications, and report all your taxable interest and
                dividends on your tax return.
              </p>
              <p className={spanClass}>
                Payments you receive will be subject to backup withholding if:
              </p>
              <ol className="ml-5 list-decimal">
                <li>You do not furnish your TIN to the requester;</li>
                <li>
                  You do not certify your TIN when required (see the
                  instructions for Part II for details)
                </li>
                <li>
                  The IRS tells the requester that you furnished an incorrect
                  TIN;
                </li>
                <li>
                  The IRS tells you that you are subject to backup withholding
                  because you did not report all your interest and dividends on
                  your tax return (for reportable interest and dividends only);
                  or
                </li>
                <li>
                  You do not certify to the requester that you are not subject
                  to backup withholding, as described in item 4 under “By
                  signing the filledout form” above (for reportable interest and
                  dividend accounts opened after 1983 only)
                </li>
              </ol>
            </div>
          </div>
        </section>
        {/* page 3 */}
        <section
          style={{
            borderBottom: "2px solid black",
          }}
          className="flex gap-6 my-4 pb-4"
        >
          <div className="w-1/2">
            <p className="indent-5">
              Certain payees and payments are exempt from backup withholding.
              See Exempt payee code, later, and the separate Instructions for
              the Requester of Form W-9 for more information
            </p>
            <p className="indent-5">
              See also Establishing U.S. status for purposes of chapter 3 and
              chapter 4 withholding, earlier.
            </p>
            <h3 className={h3Class}>What Is FATCA Reporting?</h3>
            <p>
              The Foreign Account Tax Compliance Act (FATCA) requires a
              participating foreign financial institution to report all U.S.
              account holders that are specified U.S. persons. Certain payees
              are exempt from FATCA reporting. See Exemption from FATCA
              reporting code, later, and
            </p>
            <h3 className={h3Class}>Updating Your Information</h3>
            <p>
              You must provide updated information to any person to whom you
              claimed to be an exempt payee if you are no longer an exempt payee
              and anticipate receiving reportable payments in the future from
              this person. For example, you may need to provide updated
              information if you are a C corporation that elects to be an S
              corporation, or if you are no longer tax exempt. In addition, you
              must furnish a new Form W-9 if the name or TIN changes for the
              account, for example, if the grantor of a grantor trust dies.
            </p>
            <h3 className={h3Class}>Penalties</h3>
            <p>
              <span className={spanClass}>Failure to furnish TIN.</span>: If you
              fail to furnish your correct TIN to a requester, you are subject
              to a penalty of $50 for each such failure unless your failure is
              due to reasonable cause and not to willful neglect.
            </p>
            <p>
              <span className={spanClass}>
                Civil penalty for false information with respect to withholding
              </span>
              : If you make a false statement with no reasonable basis that
              results in no backup withholding, you are subject to a $500
              penalty.
            </p>
            <p>
              <span className={spanClass}>
                Criminal penalty for falsifying information
              </span>
              . Willfully falsifying certifications or affirmations may subject
              you to criminal penalties including fines and/or imprisonment.
            </p>
            <p>
              <span className={spanClass}>Misuse of TINs</span>. If the
              requester discloses or uses TINs in violation of federal law, the
              requester may be subject to civil and criminal penalties.
            </p>
            <h3 className={h3Class}>Specific Instructions</h3>
            <h4 className={lineClass}>Line 1</h4>
            <p>
              You must enter one of the following on this line;{" "}
              <span className={spanClass}>do not</span> leave this line blank.
              The name should match the name on your tax return.
            </p>
            <p className="indent-5">
              If this Form W-9 is for a joint account (other than an account
              maintained by a foreign financial institution (FFI)), list first,
              and then circle, the name of the person or entity whose number you
              entered in Part I of Form W-9. If you are providing Form W-9 to an
              FFI to document a joint account, each holder of the account that
              is a U.S. person must provide a Form W-9.
            </p>
            <ol className="list-disc ml-5">
              <li>
                {" "}
                <span className={spanClass}>Individual</span>. Generally, enter
                the name shown on your tax return. If you have changed your last
                name without informing the Social Security Administration (SSA)
                of the name change, enter your first name, the last name as
                shown on your social security card, and your new last name.
              </li>
              <li>
                {" "}
                <span className={spanClass}>Note for ITIN applicant</span>:
                Enter your individual name as it was entered on your Form W-7
                application, line 1a. This should also be the same as the name
                you entered on the Form 1040 you filed with your application.
              </li>
              <li>
                {" "}
                <span className={spanClass}>Sole proprietor</span>. Enter your
                individual name as shown on your Form 1040 on line 1. Enter your
                business, trade, or “doing business as” (DBA) name on line 2
              </li>
              <li>
                {" "}
                <span className={spanClass}>
                  Partnership, C corporation, S corporation, or LLC, other than
                  a disregarded entity
                </span>
                : Enter the entity’s name as shown on the entity’s tax return on
                line 1 and any business, trade, or DBA name on line 2
              </li>
              <li>
                {" "}
                <span className={spanClass}>Other entities</span>: . Enter your
                name as shown on required U.S. federal tax documents on line 1.
                This name should match the name shown on the charter or other
                legal document creating the entity. Enter any business, trade,
                or DBA name on line 2
              </li>
              <li>
                {" "}
                <span className={spanClass}> Disregarded entity</span>: . In
                general, a business entity that has a single owner, including an
                LLC, and is not a corporation, is disregarded as an entity
                separate from its owner (a disregarded entity). See Regulations
                section 301.7701-2(c)(2). A disregarded entity should check the
                appropriate box for the tax classification of its owner. Enter
                the owner’s name on line 1. The name of the owner entered on
                line 1 should never be a disregarded entity. The name on line 1
                should be the name shown on the income tax return on which the
                income should be reported. For
              </li>
            </ol>
          </div>
          <div className="w-1/2">
            example, if a foreign LLC that is treated as a disregarded entity
            for U.S. federal tax purposes has a single owner that is a U.S.
            person, the U.S. owner’s name is required to be provided on line 1.
            If the direct owner of the entity is also a disregarded entity,
            enter the first owner that is not disregarded for federal tax
            purposes. Enter the disregarded entity’s name on line 2. If the
            owner of the disregarded entity is a foreign person, the owner must
            complete an appropriate Form W-8 instead of a Form W-9. This is the
            case even if the foreign person has a U.S. TIN.{" "}
            <p className={lineClass}>Line 2</p>
            <p>
              If you have a business name, trade name, DBA name, or disregarded
              entity name, enter it on line 2.
            </p>
            <p className={lineClass}>Line 3a</p>
            <p>
              Check the appropriate box on line 3a for the U.S. federal tax
              classification of the person whose name is entered on line 1.
              Check only one box on line 3a.
            </p>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left">
                    IF the entity/individual on line 1 is a(n) . . .
                  </th>
                  <th className="border border-black p-2 text-left">
                    THEN check the box for . . .
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">• Corporation</td>
                  <td className="border border-black p-2">Corporation.</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    • Individual or <br /> • Sole proprietorship
                  </td>
                  <td className="border border-black p-2">
                    Individual/sole proprietor.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    • LLC classified as a partnership for U.S. federal tax
                    purposes or <br />• LLC that has filed Form 8832 or 2553
                    electing to be taxed as a corporation
                  </td>
                  <td className="border border-black p-2">
                    Limited liability company and enter the appropriate tax
                    classification:
                    <br />
                    P = Partnership, <br />
                    C = C corporation, or <br />S = S corporation.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">• Partnership</td>
                  <td className="border border-black p-2">Partnership.</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">• Trust/estate</td>
                  <td className="border border-black p-2">Trust/estate.</td>
                </tr>
              </tbody>
            </table>
            <p className={lineClass}>Line 3b</p>
            <p>
              Check this box if you are a partnership (including an LLC
              classified as a partnership for U.S. federal tax purposes), trust,
              or estate that has any foreign partners, owners, or beneficiaries,
              and you are providing this form to a partnership, trust, or
              estate, in which you have an ownership interest. You must check
              the box on line 3b if you receive a Form W-8 (or documentary
              evidence) from any partner, owner, or beneficiary establishing
              foreign status or if you receive a Form W-9 from any partner,
              owner, or beneficiary that has checked the box on line 3b
            </p>
            <div className="">
              <p className="">
                <span className={spanClass}>Note:</span> A partnership that
                provides a Form W-9 and checks box 3b may be required to
                complete Schedules K-2 and K-3 (Form 1065). For more
                information, see the Partnership Instructions for Schedules K-2
                and K-3 (Form 1065).
              </p>
              <p className=" mt-2">
                If you are required to complete line 3b but fail to do so, you
                may not receive the information necessary to file a correct
                information return with the IRS or furnish a correct payee
                statement to your partners or beneficiaries. See, for example,
                sections 6698, 6722, and 6724 for penalties that may apply.
              </p>
              <h2 className={lineClass}>Line 4 Exemptions</h2>
              <p className=" mt-2">
                If you are exempt from backup withholding and/or FATCA
                reporting, enter the appropriate space on line 4 any code(s)
                that may apply to you.
              </p>
              <h3 className="font-bold text-base mt-4">Exempt payee code.</h3>
              <ul className="list-disc pl-6  mt-2">
                <li>
                  Generally, individuals (including sole proprietors) are not
                  exempt from backup withholding.
                </li>
                <li>
                  Except as provided below, corporations are exempt from backup
                  withholding for certain payments, including interest and
                  dividends.
                </li>
                <li>
                  Corporations are not exempt from backup withholding for
                  payments made in settlement of payment card or third-party
                  network transactions.
                </li>
                <li>
                  Corporations are not exempt from backup withholding with
                  respect to attorneys’ fees or gross proceeds paid to
                  attorneys, and corporations that provide medical or health
                  care services are not exempt with respect to payments
                  reportable on Form 1099-MISC.
                </li>
              </ul>
              <p className=" mt-2">
                The following codes identify payees that are exempt from backup
                withholding. Enter the appropriate code in the space on line 4.
              </p>
              <p className=" mt-2">
                1— An organization exempt from tax under section 501(a), any
                IRA, or a custodial account under section 403(b)(7) if the
                account satisfies the requirements of section 401(f)(2).
              </p>
            </div>
          </div>
        </section>
        {/* page 4 */}
        <section
          style={{
            borderBottom: "2px solid black",
          }}
          className="flex gap-6 my-4 pb-4"
        >
          <div className="w-1/2">
            <p className=" mt-2">
              2—The United States or any of its agencies or instrumentalities.
            </p>
            <p className=" mt-2">
              3—A state, the District of Columbia, a U.S. commonwealth or
              territory, or any of their political subdivisions or
              instrumentalities.
            </p>
            <p className=" mt-2">
              4—A foreign government or any of its political subdivisions,
              agencies, or instrumentalities.
            </p>
            <p className=" mt-2">5—A corporation.</p>
            <p className=" mt-2">
              6—A dealer in securities or commodities required to register in
              the United States, the District of Columbia, or a U.S.
              commonwealth or territory.
            </p>
            <p className=" mt-2">
              7—A futures commission merchant registered with the Commodity
              Futures Trading Commission.
            </p>
            <p className=" mt-2">8—A real estate investment trust</p>
            <p className=" mt-2">
              9—An entity registered at all times during the tax year under the
              Investment Company Act of 1940.
            </p>
            <p className=" mt-2">
              10—A common trust fund operated by a bank under section 584(a).
            </p>
            <p className=" mt-2">
              11—A financial institution as defined under section 581.
            </p>
            <p className=" mt-2">
              12—A middleman known in the investment community as a nominee or
              custodian.
            </p>
            <p className=" mt-2">
              13—A trust exempt from tax under section 664 or described in
              section 4947.
            </p>
            <p className=" mt-2 indent-5">
              The following chart shows types of payments that may be exempt
              from backup withholding. The chart applies to the exempt payees
              listed above, 1 through 13.
            </p>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="">
                  <th className="border border-black p-2 text-left">
                    IF the payment is for . . .
                  </th>
                  <th className="border border-black p-2 text-left">
                    THEN the payment is exempt for . . .
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">
                    • Interest and dividend payments
                  </td>
                  <td className="border border-black p-2">
                    All exempt payees except for 7.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    • Broker transactions
                  </td>
                  <td className="border border-black p-2">
                    Exempt payees 1 through 4 and 6 through 11 and all C
                    corporations. <br />S corporations must not enter an exempt
                    payee code because they are exempt only for sales of
                    noncovered securities acquired prior to 2012.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    • Barter exchange transactions and patronage dividends
                  </td>
                  <td className="border border-black p-2">
                    Exempt payees 1 through 4.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    • Payments over $600 required to be reported and direct
                    sales over $5,000¹
                  </td>
                  <td className="border border-black p-2">
                    Generally, exempt payees 1 through 5².
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    • Payments made in settlement of payment card or third-party
                    network transactions
                  </td>
                  <td className="border border-black p-2">
                    Exempt payees 1 through 4.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <sup>1</sup> See Form 1099-MISC, Miscellaneous Information, and
              its instructions.
            </p>
            <p className="mt-2">
              <sup>2</sup> However, the following payments made to a corporation
              and reportable on Form 1099-MISC are not exempt from backup
              withholding: medical and health care payments, attorneys’ fees,
              gross proceeds paid to an attorney reportable under section
              6045(f), and payments for services paid by a federal executive
              agency.
            </p>
            <p>
              <span className={spanClass}>
                Exemption from FATCA reporting code
              </span>
              . The following codes identify payees that are exempt from
              reporting under FATCA. These codes apply to persons submitting
              this form for accounts maintained outside of the United States by
              certain foreign financial institutions. Therefore, if you are only
              submitting this form for an account you hold in the United States,
              you may leave this field blank. Consult with the person requesting
              this form if you are uncertain if the financial institution is
              subject to these requirements. A requester may indicate that a
              code is not required by providing you with a Form W-9 with “Not
              Applicable” (or any similar indication) entered on the line for a
              FATCA exemption code
            </p>
            <p className=" mt-2">
              A—An organization exempt from tax under section 501(a) or any
              individual retirement plan as defined in section 7701(a)(37).
            </p>
            <p className=" mt-2">
              B—The United States or any of its agencies or instrumentalities.
            </p>
            <p className=" mt-2">
              C—A state, the District of Columbia, a U.S. commonwealth or
              territory, or any of their political subdivisions or
              instrumentalities
            </p>
            <p className=" mt-2">
              D—A corporation the stock of which is regularly traded on one or
              more established securities markets, as described in Regulations
              section 1.1472-1(c)(1)(i).
            </p>
            <p className=" mt-2">
              E—A corporation that is a member of the same expanded affiliated
              group as a corporation described in Regulations section
              1.1472-1(c)(1)(i).
            </p>
          </div>
          <div className="w-1/2">
            <p className=" mt-2">
              F—A dealer in securities, commodities, or derivative financial
              instruments (including notional principal contracts, futures,
              forwards, and options) that is registered as such under the laws
              of the United States or any state.
            </p>
            <p className=" mt-2">G—A real estate investment trust</p>
            <p className=" mt-2">
              H—A regulated investment company as defined in section 851 or an
              entity registered at all times during the tax year under the
              Investment Company Act of 1940.
            </p>
            <p className=" mt-2">
              I—A common trust fund as defined in section 584(a).
            </p>
            <p className=" mt-2">J—A bank as defined in section 581.</p>
            <p className=" mt-2">K—A broker</p>
            <p className=" mt-2">
              L—A trust exempt from tax under section 664 or described in
              section 4947(a)(1).
            </p>
            <p className=" mt-2">
              M—A tax-exempt trust under a section 403(b) plan or section 457(g)
              plan.
            </p>
            <p>
              <span className={spanClass}>Note</span>: You may wish to consult
              with the financial institution requesting this form to determine
              whether the FATCA code and/or exempt payee code should be
              completed.
            </p>
            <p className={lineClass}> Line 5</p>
            <p>
              Enter your address (number, street, and apartment or suite
              number). This is where the requester of this Form W-9 will mail
              your information returns. If this address differs from the one the
              requester already has on file, enter “NEW” at the top. If a new
              address is provided, there is still a chance the old address will
              be used until the payor changes your address in their records.
            </p>
            ? Enter your address (number, street, and apartment or suite
            number). This is where the requester of this Form W-9 will mail your
            information returns. If this address differs from the one the
            requester already has on file, enter “NEW” at the top. If a new
            address is provided, there is still a chance the old address will be
            used until the payor changes your address in their records.
            <p className={lineClass}> Line 6</p>
            <p>Enter your city, state, and ZIP code.</p>
            <h3 className={h3Class}>
              Part I. Taxpayer Identification Number (TIN)
            </h3>
            <p>
              <span className={spanClass}>
                Enter your TIN in the appropriate box
              </span>
              . If you are a resident alien and you do not have, and are not
              eligible to get, an SSN, your TIN is your IRS ITIN. Enter it in
              the entry space for the Social security number. If you do not have
              an ITIN, see How to get a TIN below.
            </p>
            <p className="indent-5">
              If you are a sole proprietor and you have an EIN, you may enter
              either your SSN or EIN
            </p>
            <p className="indent-5">
              If you are a single-member LLC that is disregarded as an entity
              separate from its owner, enter the owner’s SSN (or EIN, if the
              owner has one). If the LLC is classified as a corporation or
              partnership, enter the entity’s EIN.
            </p>
            <p>
              <span className={spanClass}>Note</span>: See What Name and Number
              To Give the Requester, later, for further clarification of name
              and TIN combinations.
            </p>
            <p>
              <span className={spanClass}>How to get a TIN</span>. If you do not
              have a TIN, apply for one immediately. To apply for an SSN, get
              Form SS-5, Application for a Social Security Card, from your local
              SSA office or get this form online at www.SSA.gov. You may also
              get this form by calling 800-772-1213. Use Form W-7, Application
              for IRS Individual Taxpayer Identification Number, to apply for an
              ITIN, or Form SS-4, Application for Employer Identification
              Number, to apply for an EIN. You can apply for an EIN online by
              accessing the IRS website at www.irs.gov/EIN. Go to
              www.irs.gov/Forms to view, download, or print Form W-7 and/or Form
              SS-4. Or, you can go to www.irs.gov/OrderForms to place an order
              and have Form W-7 and/or Form SS-4 mailed to you within 15
              business days.
            </p>
            <p className="indent-5">
              If you are asked to complete Form W-9 but do not have a TIN, apply
              for a TIN and enter “Applied For” in the space for the TIN, sign
              and date the form, and give it to the requester. For interest and
              dividend payments, and certain payments made with respect to
              readily tradable instruments, you will generally have 60 days to
              get a TIN and give it to the requester before you are subject to
              backup withholding on payments. The 60-day rule does not apply to
              other types of payments. You will be subject to backup withholding
              on all such payments until you provide your TIN to the requester.
            </p>
            <p>
              <span className={spanClass}>Note</span>: Entering “Applied For”
              means that you have already applied for a TIN or that you intend
              to apply for one soon. See also Establishing U.S. status for
              purposes of chapter 3 and chapter 4 withholding, earlier, for when
              you may instead be subject to withholding under chapter 3 or 4 of
              the Code.
            </p>
            <p>
              <span className={spanClass}>Caution</span>: A disregarded U.S.
              entity that has a foreign owner must use the appropriate Form W-8.
            </p>
          </div>
        </section>
        {/* page 5 */}
        <section
          style={{
            borderBottom: "2px solid black",
          }}
          className="flex gap-6 my-4 pb-4"
        >
          <div className="w-1/2">
            <h3 className={h3Class}>Part II. Certification</h3>
            <div className=" bg-white text-black">
              <p className="">
                To establish to the withholding agent that you are a U.S.
                person, or resident alien, sign Form W-9. You may be requested
                to sign by the withholding agent even if item 1, 4, or 5 below
                indicates otherwise.
              </p>

              <p className=" mt-2">
                For a joint account, only the person whose TIN is shown in Part
                I should sign (when required). In the case of a disregarded
                entity, the beneficial owner on line 1 must sign. Exempt payees,
                see <span className="italic">Exempt payee code</span>, earlier.
              </p>

              <h2 className="font-bold text-lg mt-4">
                Signature requirements.
              </h2>
              <p className="">
                Complete the certification as indicated in items 1 through 5
                below.
              </p>

              <ol className="list-decimal pl-6  mt-2">
                <li>
                  <span className="font-bold">
                    Interest, dividend, and barter exchange accounts opened
                    before 1984 and broker accounts considered active during
                    1983.
                  </span>{" "}
                  You must give your correct TIN, but you do not have to sign
                  the certification.
                </li>
                <li className="mt-2">
                  <span className="font-bold">
                    Interest, dividend, broker, and barter exchange accounts
                    opened after 1983 and broker accounts considered inactive
                    during 1983.
                  </span>{" "}
                  You must sign the certification or backup withholding will
                  apply. If you are subject to backup withholding and you are
                  merely providing your correct TIN to the requester, you must
                  cross out item 2 in the certification before signing the form.
                </li>
                <li className="mt-2">
                  <span className="font-bold">Real estate transactions.</span>{" "}
                  You must sign the certification. You may not cross out item 2
                  of the certification.
                </li>
                <li className="mt-2">
                  <span className="font-bold">Other payments.</span> You must
                  give your correct TIN, but you do not have to sign the
                  certification unless you have been notified that you have
                  previously given an incorrect TIN. “Other payments” include
                  payments made in the course of the requester’s trade or
                  business for rents, royalties, goods (other than bills for
                  merchandise), medical and health care services (including
                  payments to corporations), payments to a nonemployee for
                  services, payments made in settlement of payment card and
                  third-party network transactions, payments to certain fishing
                  boat crew members and fishermen, and gross proceeds paid to
                  attorneys (including payments to corporations).
                </li>
                <li className="mt-2">
                  <span className="font-bold">
                    Mortgage interest paid by you, acquisition or abandonment of
                    secured property, cancellation of debt, qualified tuition
                    program payments (under section 529), ABLE accounts (under
                    section 529A), IRA, Coverdell ESA, Archer MSA or HSA
                    contributions or distributions, and pension distributions.
                  </span>{" "}
                  You must give your correct TIN, but you do not have to sign
                  the certification.
                </li>
              </ol>
            </div>
            <h3 className={h3Class}>
              What Name and Number To Give the Requester
            </h3>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left">
                    For this type of account:
                  </th>
                  <th className="border border-black p-2 text-left">
                    Give name and SSN of:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">1. Individual</td>
                  <td className="border border-black p-2">The individual</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    2. Two or more individuals (joint account) other than an
                    account maintained by an FFI
                  </td>
                  <td className="border border-black p-2">
                    The actual owner of the account; if combined funds, the
                    first individual on the account<sup>1</sup>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    3. Two or more U.S. persons (joint account maintained by an
                    FFI)
                  </td>
                  <td className="border border-black p-2">
                    Each holder of the account
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    4. Custodial account of a minor (Uniform Gift to Minors Act)
                  </td>
                  <td className="border border-black p-2">
                    The minor<sup>2</sup>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    5. a. The usual revocable savings trust (grantor is also
                    trustee)
                  </td>
                  <td className="border border-black p-2">
                    The grantor-trustee<sup>1</sup>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    5. b. So-called trust account that is not a legal or valid
                    trust under state law
                  </td>
                  <td className="border border-black p-2">
                    The actual owner<sup>1</sup>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    6. Sole proprietorship or disregarded entity owned by an
                    individual
                  </td>
                  <td className="border border-black p-2">
                    The owner<sup>3</sup>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    7. Grantor trust filing under Optional Filing Method 1 (see
                    Regulations section 1.671-4(b)(2)(i)(A))<sup>*</sup>
                  </td>
                  <td className="border border-black p-2">
                    The grantor<sup>*</sup>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-1/2">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left w-1/2">
                    For this type of account:
                  </th>
                  <th className="border border-black p-2 text-left">
                    Give name and EIN of:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">
                    8. Disregarded entity not owned by an individual
                  </td>
                  <td className="border border-black p-2">The owner</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    9. A valid trust, estate, or pension trust
                  </td>
                  <td className="border border-black p-2">
                    Legal entity<sup>4</sup>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    10. Corporation or LLC electing corporate status on Form
                    8832 or Form 2553
                  </td>
                  <td className="border border-black p-2">The corporation</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    11. Association, club, religious, charitable, educational,
                    or other tax-exempt organization
                  </td>
                  <td className="border border-black p-2">The organization</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    12. Partnership or multi-member LLC
                  </td>
                  <td className="border border-black p-2">The partnership</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    13. A broker or registered nominee
                  </td>
                  <td className="border border-black p-2">
                    The broker or nominee
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    14. Account with the Department of Agriculture in the name
                    of a public entity (such as a state or local government,
                    school district, or prison) that receives agricultural
                    program payments
                  </td>
                  <td className="border border-black p-2">The public entity</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">
                    15. Grantor trust filing Form 1041 or under the Optional
                    Filing Method 2, requiring Form 1099 (see Regulations
                    section 1.671-4(b)(2)(i)(B))<sup>**</sup>
                  </td>
                  <td className="border border-black p-2">The trust</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <p>
                <sup>1</sup> List first and circle the name of the person whose
                number you furnish. If only one person on a joint account has an
                SSN, that person’s number must be furnished.
              </p>
              <p>
                <sup>2</sup> Circle the minor’s name and furnish the minor’s
                SSN.
              </p>
              <p>
                <sup>3</sup> You must show your individual name on line 1, and
                enter your business or DBA name, if any, on line 2. You may use
                either your SSN or EIN (if you have one), but the IRS encourages
                you to use your SSN.
              </p>
              <p>
                <sup>4</sup> List first and circle the name of the trust,
                estate, or pension trust. (Do not furnish the TIN of the
                personal representative or trustee unless the legal entity
                itself is not designated in the account title.)
              </p>
              <p>
                <strong>Note:</strong> The grantor must also provide a Form W-9
                to the trustee of the trust.
              </p>
              <p>
                <strong>**</strong> For more information on optional filing
                methods for grantor trusts, see the Instructions for Form 1041.
              </p>
              <p>
                <strong>Note:</strong> If more than one name is listed, the IRS
                will consider the name of the first listed person.
              </p>
            </div>
            <h3 className={h3Class}>
              Secure Your Tax Records From Identity Theft
            </h3>
            <p>
              Identity theft occurs when someone uses your personal information,
              such as your name, SSN, or other identifying information, without
              your permission to commit fraud or other crimes. An identity thief
              may use your SSN to get a job or may file a tax return using your
              SSN to receive a refund.
            </p>
            <ol className="list-disc">
              <li>To reduce your risk:</li>
              <li> Protect your SSN,</li>
              <li>Ensure your employer is protecting your SSN, and</li>
              <li> Be careful when choosing a tax return preparer</li>
            </ol>
            <p className="indent-5">
              If your tax records are affected by identity theft and you receive
              a notice from the IRS, respond right away to the name and phone
              number printed on the IRS notice or letter.
            </p>
            <p className="indent-5">
              If your tax records are not currently affected by identity theft
              but you think you are at risk due to a lost or stolen purse or
              wallet, questionable credit card activity, or a questionable
              credit report, contact the IRS Identity Theft Hotline at
              800-908-4490 or submit Form 14039.
            </p>
            <p className="indent-5">
              For more information, see Pub. 5027, Identity Theft Information
              for Taxpayers.
            </p>
          </div>
        </section>
        {/* page 6 */}
        <section
          style={{
            borderBottom: "2px solid black",
          }}
          className="flex gap-6 my-4 pb-4"
        >
          <div className="w-1/2">
            <p>
              Victims of identity theft who are experiencing economic harm or a
              systemic problem, or are seeking help in resolving tax problems
              that have not been resolved through normal channels, may be
              eligible for Taxpayer Advocate Service (TAS) assistance. You can
              reach TAS by calling the TAS toll-free case intake line at{" "}
              <strong>877-777-4778</strong> or TTY/TDD{" "}
              <strong>800-829-4059</strong>.
            </p>

            <h2 className="mt-4 font-bold text-lg">
              Protect yourself from suspicious emails or phishing schemes.
            </h2>
            <p>
              Phishing is the creation and use of email and websites designed to
              mimic legitimate business emails and websites. The most common act
              is sending an email to a user falsely claiming to be an
              established legitimate enterprise in an attempt to scam the user
              into surrendering private information that will be used for
              identity theft.
            </p>

            <p className="indent-5">
              The IRS does not initiate contacts with taxpayers via emails.
              Also, the IRS does not request personal detailed information
              through email or ask taxpayers for the PIN numbers, passwords, or
              similar secret access information for their credit card, bank, or
              other financial accounts.
            </p>

            <p className="indent-5">
              If you receive an unsolicited email claiming to be from the IRS,
              forward this message to <strong>phishing@irs.gov</strong>. You may
              also report misuse of the IRS name, logo, or other IRS property to
              the Treasury Inspector General for Tax Administration (TIGTA) at{" "}
              <strong>800-366-4484</strong>. You can forward suspicious emails
              to the Federal Trade Commission at <strong>spam@uce.gov</strong>{" "}
              or report them at{" "}
              <a href="https://www.ftc.gov/complaint">www.ftc.gov/complaint</a>.
              You can contact the FTC at{" "}
              <a href="https://www.ftc.gov/idtheft">www.ftc.gov/idtheft</a> or{" "}
              <strong>877-IDTHEFT (877-438-4338)</strong>.
            </p>

            <p>
              If you have been the victim of identity theft, see{" "}
              <a href="https://www.IdentityTheft.gov">www.IdentityTheft.gov</a>{" "}
              and Pub. 5027.
            </p>

            <p className="indent-5">
              Go to{" "}
              <a href="https://www.irs.gov/IdentityTheft">
                www.irs.gov/IdentityTheft
              </a>{" "}
              to learn more about identity theft and how to reduce your risk.
            </p>
          </div>
          <div className="w-1/2">
            <h3 className={h3Class}>Privacy Act Notice</h3>
            <p>
              Section 6109 of the Internal Revenue Code requires you to provide
              your correct TIN to persons (including federal agencies) who are
              required to file information returns with the IRS to report
              interest, dividends, or certain other income paid to you; mortgage
              interest you paid; the acquisition or abandonment of secured
              property; the cancellation of debt; or contributions you made to
              an IRA, Archer MSA, or HSA. The person collecting this form uses
              the information on the form to file information returns with the
              IRS, reporting the above information. Routine uses of this
              information include giving it to the Department of Justice for
              civil and criminal litigation and to cities, states, the District
              of Columbia, and U.S. commonwealths and territories for use in
              administering their laws. The information may also be disclosed to
              other countries under a treaty, to federal and state agencies to
              enforce civil and criminal laws, or to federal law enforcement and
              intelligence agencies to combat terrorism. You must provide your
              TIN whether or not you are required to file a tax return. Under
              section 3406, payors must generally withhold a percentage of
              taxable interest, dividends, and certain other payments to a payee
              who does not give a TIN to the payor. Certain penalties may also
              apply for providing false or fraudulent information.
            </p>
          </div>
        </section>
        <button
          type="submit"
          className="bg-[#1E40AF] rounded-xl py-2 px-8 text-white font-bold text-base w-max mt-6"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default TraineeFormW9;
