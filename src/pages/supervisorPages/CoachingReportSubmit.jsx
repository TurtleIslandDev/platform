import React, { useState, useEffect } from "react";
import PhoneSVG from "../../assets/SVGs/PhoneSVG";
import ImprovePerformanceSvg from "../../assets/SVGs/ImprovePerformanceSvg";
import PlusIconSvg from "../../assets/SVGs/PlusIconSvg";
import NotesSvg from "../../assets/SVGs/NotesSvg";
import DateInput from "../../components/inputs/DateInput";
import { useForm } from "react-hook-form";

const CoachingReportAccept = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [dates, setDates] = useState([]);
  const [previousWeekMonday, setPreviousWeekMonday] = useState(null);
  const handleDateChange = (index, newDate) => {
    const updatedDates = [...dates];
    updatedDates[index] = newDate;
    setDates(updatedDates);
  };
  function getPreviousWeekMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Calculate the offset for Monday of the previous week
    const daysSinceLastMonday = (dayOfWeek + 6) % 7; // Days since the last Monday
    const daysToSubtract = daysSinceLastMonday + 7; // Go back to Monday of the previous week

    // Subtract the calculated days
    let previousMonday = new Date(today);
    previousMonday.setDate(today.getDate() - daysToSubtract);
    previousMonday = previousMonday.toDateString();
    setPreviousWeekMonday(previousMonday);
  }
  let data = [1, 2, 3];
  let callTypeDropdown = [
    { name: "callType", label: "Call Type" },
    { name: "outbound", label: "Outbound" },
    { name: "inbound", label: "Inbound" },
    { name: "intake", label: "Intake" },
    { name: "return", label: "Return" },
    { name: "retention", label: "Retention" },
    { name: "service", label: "Customer Service" },
    { name: "clientManagement", label: "Client Management" },
    { name: "sale", label: "Sale" },
    { name: "saleClose", label: "Sale Close" },
  ];

  let productKnowledge = [
    {
      id: 0,
      name: "HighlightedRelevantFeatures",
      text: "Highlighted Relevant Features",
    },
    {
      id: 2,
      name: "FullyExplainedBenefitsTargetedToClientsNeed",
      text: "Fully explained benefits targeted to clients need",
    },
    {
      id: 3,
      name: "ProvidedCorrectResponses",
      text: "Provided correct responses",
    },
    {
      id: 4,
      name: "CorrectlyIdentifiedQuestions",
      text: "Correctly identified questions",
    },
  ];
  let brandAdherence = [
    {
      id: 0,
      name: "KnowledgeableAboutProductSpecifics",
      text: "Knowledgeable about Product specifics",
    },
    {
      id: 2,
      name: "ProvidedCorrectContactInformation",
      text: "Provided correct contact information",
    },
    {
      id: 3,
      name: "QuotedAccuratePrice",
      text: "Quoted accurate price",
    },
    {
      id: 4,
      name: "CorrectSalesInteractionProcessFollowed",
      text: "Correct sales interaction process followed",
    },
  ];
  let listningSkills = [
    {
      id: 0,
      name: "attention",
      text: "Attention",
    },
    {
      id: 2,
      name: "tone",
      text: "Tone",
    },
    {
      id: 3,
      name: "pitch",
      text: "Pitch",
    },
    {
      id: 4,
      name: "speed",
      text: "Speed",
    },
    {
      id: 5,
      name: "transitioning",
      text: "Transitioning",
    },
  ];
  let programRequirements = [
    {
      id: 1,
      name: "ProvidedCorrectResponses",
      text: "Provided correct responses",
    },
    {
      id: 2,
      name: "CorrectlyIdentifiesQuestions",
      text: "Correctly identifies questions",
    },
    {
      id: 3,
      name: "ProvidesRelevantInformation",
      text: "Provides relevant information",
    },
  ];
  const onSubmit = async (payload) => {
    try {
      let data = {
        ...payload,
        dates,
      };
      const result = [];
      const newDates = data.dates; // Extract dates array

      // Determine how many sets of grouped objects exist
      const numGroups = Object.keys(data)
        .filter((key) => key.match(/_\d+$/))
        .map((key) => key.split("_").pop())
        .reduce((acc, val) => (acc.includes(val) ? acc : [...acc, val]), []);

      numGroups.forEach((num) => {
        let obj = {};
        for (let key in data) {
          if (key.endsWith(`_${num}`)) {
            obj[key.replace(/_\d+$/, "")] = data[key]; // Remove the suffix (_0, _1, _2) from keys
          }
        }
        obj.date = newDates[num] || null; // Assign corresponding date
        result.push(obj);
      });
      data.callsReviewed = result;

      // Remove the original split-up keys
      Object.keys(data).forEach((key) => {
        if (key.match(/_\d+$/) || key === "dates") {
          delete data[key];
        }
      });
      console.log(data);
    } catch (error) {
      // add error handling here
      console.log(error);
    }
  };
  useEffect(() => {
    getPreviousWeekMonday();
  }, []);
  return (
    <div className="bg-[#F6F7F9]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-[#1E40AF] flex items-center justify-center pb-[70px] pt-16">
          <div className="w-full max-w-layout flex items-center justify-center flex-col gap-3">
            <h1 className="text-whitePara font-medium text-[32px]">
              Calls Reviewed
            </h1>
            <div className="overflow-x-auto  w-full">
              <table className="table  w-full">
                <tbody className="w-full">
                  {/* row 1 */}
                  {data.map((item, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className={`w-full py-5 ${
                            index === data.length - 1
                              ? ""
                              : "border-b-2 border-[#1414C9]"
                          }`}
                        >
                          <td>
                            <div className="flex items-center  gap-3 ">
                              <div className="bg-[#1414C9] p-3 rounded-full">
                                <PhoneSVG />
                              </div>

                              <select
                                {...register(`${"callType_" + index}`, {
                                  required: true,
                                })}
                                className="select select-lg w-[80%] focus:outline-none bg-transparent text-white "
                              >
                                {callTypeDropdown?.map((option, index) => {
                                  return (
                                    <>
                                      <option
                                        key={index}
                                        className="text-black"
                                      >
                                        {option.label}
                                      </option>
                                    </>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <input
                              {...register(`${"firstName_" + index}`, {
                                required: true,
                              })}
                              type="text"
                              placeholder="First Name"
                              className="placeholder:text-white text-white input input-bordered  w-full active:border-none focus:border-none border border-[#6b7280]  bg-transparent rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              {...register(`${"lastName_" + index}`, {
                                required: true,
                              })}
                              type="text"
                              placeholder="Last Name"
                              className="placeholder:text-white text-white input input-bordered  w-full active:border-none focus:border-none border border-[#6b7280]  bg-transparent rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              {...register(`${"outcome_" + index}`, {
                                required: true,
                              })}
                              type="text"
                              placeholder="Outcome"
                              className="placeholder:text-white text-white input input-bordered  w-full active:border-none focus:border-none border border-[#6b7280]  bg-transparent rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              {...register(`${"disposition_" + index}`, {
                                required: true,
                              })}
                              placeholder="Disposition"
                              className="placeholder:text-white text-white input input-bordered  w-full active:border-none focus:border-none border border-[#6b7280]  bg-transparent rounded-md"
                            />
                          </td>
                          <td>
                            <DateInput
                              startDate={dates[index] || new Date()} // Fallback to today's date
                              setStartDate={(newDate) =>
                                handleDateChange(index, newDate)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              {...register(`${"link_" + index}`, {
                                required: true,
                              })}
                              placeholder="Insert the link here"
                              className="placeholder:text-white text-white input input-bordered  w-full active:border-none focus:border-none border border-[#6b7280]  bg-transparent rounded-md"
                            />
                            {/* <button className="bg-[#1414C9] p-3 rounded-full w-11 h-11 flex items-center justify-center">
                            <PlayButtonSvg />
                          </button> */}
                          </td>
                        </tr>
                        {/* <div className="w-full py-4 bg"> </div> */}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center pt-40 pb-60 flex-col gap-24">
          <div className="w-full max-w-layout  flex items-center justify-center flex-col gap-24 ">
            {/* Product Knowledge */}
            <div>
              <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
                Product Knowledge
              </h2>
              <div className="w-full max-w-layout flex">
                {productKnowledge.map((item) => {
                  return (
                    <div
                      className="w-1/4 border-r-2 border-[#E3E3E3] "
                      key={item.id}
                    >
                      <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                        {item.text}
                      </p>
                      <select
                        {...register(`${item.name}`, { required: true })}
                        className="select outline-none border-none select-lg w-full focus:outline-none bg-transparent h-16"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => {
                          return (
                            <option selected key={option}>
                              {option}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>{" "}
            </div>
            {/* Brand Adherence */}
            <div>
              <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
                Brand Adherence
              </h2>
              <div className="w-full max-w-layout flex">
                {brandAdherence.map((item) => {
                  return (
                    <div
                      className="w-1/4 border-r-2 border-[#E3E3E3] "
                      key={item.id}
                    >
                      <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                        {item.text}
                      </p>
                      <select
                        {...register(`${item.name}`, { required: true })}
                        className="select outline-none border-none select-lg w-full focus:outline-none bg-transparent h-16"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => {
                          return (
                            <option selected key={option}>
                              {option}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>{" "}
            </div>
            {/* Listening Skills */}
            <div className="w-full">
              <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
                Listening Skills
              </h2>
              <div className="flex w-full">
                <div className="w-full max-w-layout flex">
                  {listningSkills.map((item) => {
                    return (
                      <div
                        className="w-1/5 border-r-2 border-[#E3E3E3] "
                        key={item.id}
                      >
                        <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                          {item.text}
                        </p>
                        <select
                          {...register(`${item.name}`, { required: true })}
                          className="select outline-none border-none select-lg w-full focus:outline-none bg-transparent h-16"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => {
                            return (
                              <option selected key={option}>
                                {option}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>{" "}
            </div>
            {/* Program Requirements */}
            <div className="w-full">
              <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
                Program Requirements
              </h2>
              <div className="flex w-full">
                <div className="w-full max-w-layout flex">
                  {programRequirements.map((item) => {
                    return (
                      <div
                        className="w-1/3 border-r-2 border-[#E3E3E3] "
                        key={item.id}
                      >
                        <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                          {item.text}
                        </p>
                        <select
                          {...register(`${item.name}`, { required: true })}
                          className="select outline-none border-none select-lg w-full focus:outline-none bg-transparent h-16"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => {
                            return (
                              <option selected key={option}>
                                {option}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>{" "}
            </div>
            {/* Performance  Results Week of
             */}
            <div className="w-full">
              <div className="flex w-full items-center justify-between">
                <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
                  Performance  Results Week of
                </h2>
                <p className="text-2xl font-medium text-[#3D4A57]">
                  {previousWeekMonday}
                </p>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="table table-zebra w-full">
                  <tbody>
                    {/* row 1 */}
                    <tr className="bg-white">
                      <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                        Active Time
                      </th>
                      <td className="w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("activeTime", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                      <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7">
                        Conversion
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("conversion", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                        Inactive Time
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("inactiveTime", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                      <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7">
                        Sales per hour
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("salesPerHour", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                    </tr>
                    {/* row 3 */}
                    <tr className="bg-white">
                      <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                        Contacts
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("contacts", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                      <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7">
                        Earning per hour
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("earningPerHour", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                    </tr>
                    {/* row 4 */}
                    <tr>
                      <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                        Conversion
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("conversion", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                      <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7"></th>
                      <td className="py-6 w-1/4 text-darkPara text-xl border-r-2 px-7"></td>
                    </tr>
                    {/* row 5 */}
                    <tr className="bg-white">
                      <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                        Sales
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("sales", { required: true })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                      <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7">
                        Total weekly earnings
                      </th>
                      <td className=" w-1/4 text-darkPara text-xl border-r-2">
                        <input
                          {...register("totalWeeklyEarning", {
                            required: true,
                          })}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered  w-full active:border-none focus:border-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF] flex items-center justify-center pb-[70px] pt-16 w-full">
            <div className="w-full max-w-layout flex justify-center flex-col gap-10">
              <div className="flex gap-6 items-center">
                <div className="flex gap-10 items-center w-72">
                  <PlusIconSvg />
                  <p className="text-2xl w-52">Positive</p>
                </div>
                <input
                  {...register("positive", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-[650px] h-28 px-6 focus:outline-none border-2 border-[#E3E3E3] rounded-2xl"
                />
              </div>
              <div className="flex gap-6 items-center ">
                <div className="flex gap-4 items-center w-72">
                  <ImprovePerformanceSvg />
                  <p className="text-2xl w-52">Performance Goal Improvement</p>
                </div>
                <input
                  {...register("performanceGoalImprovement", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-[650px] h-28 px-6 focus:outline-none border-2 border-[#E3E3E3] rounded-2xl"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center pb-[70px]  w-full">
            <div className="w-full max-w-layout flex justify-center flex-col gap-10">
              <div className="flex gap-6 items-center">
                <div className="flex gap-10 items-center w-72">
                  <NotesSvg />
                  <p className="text-2xl w-52">Notes</p>
                </div>
                <input
                  {...register("notes", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-[650px] h-28 px-6 focus:outline-none border-2 border-[#E3E3E3] rounded-2xl"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 items-center ">
                  <div className="flex items-center w-72">
                    <p className="text-2xl">Supervisor Signature</p>
                  </div>
                  <input
                    {...register("supervisorSignature", {
                      required: true,
                    })}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-[400px] h-20 px-6 focus:outline-none border-2 border-[#E3E3E3]  bg-white"
                  />
                </div>
                <label className="input input-bordered flex items-center gap-2 relative">
                  {/* <div className="absolute left-2 top-3">
                  <DateIconSvg color={"#767676"} />
                </div> */}
                  <input
                    {...register("signedDate", {
                      required: true,
                    })}
                    type="date"
                    className="grow focus:outline-none w-[360px] h-16 border-2 border-[#E3E3E3] bg-white px-4 placeholder:text-[#6F6F6F]"
                  />
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#1E40AF] rounded-[60px] py-4 px-10 text-white font-bold text-xl max-w-48"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoachingReportAccept;
