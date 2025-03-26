import React from 'react'
import PlayButtonSvg from "../../assets/SVGs/PlayButtonSvg";
import NotesSvg from "../../assets/SVGs/NotesSvg";
import DateIconSvg from "../../assets/SVGs/DateIconSvg";
import PhoneSVG from '../../assets/SVGs/PhoneSVG';
import { Tooltip } from '@material-tailwind/react';
const DummyCoachingReportAccept = () => {
    let data = [1, 2, 3];
  return (
    <div className="bg-[#F6F7F9]">
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
                        className={`w-full py-5  ${
                          index === data.length - 1
                            ? ""
                            : "border-b-2 border-[#1414C9]"
                        }`}
                      >
                        <td>
                          <div className="flex items-center  gap-3">
                            <div className="bg-[#1414C9] p-3 rounded-full">
                              <PhoneSVG />
                            </div>
                            <p className="text-whitePara text-xl">Call Type</p>
                          </div>
                        </td>
                        <td>
                          <p className="text-whitePara text-xl">First Name</p>
                        </td>
                        <td>
                          <p className="text-whitePara text-xl">Last Name</p>
                        </td>
                        <td>
                          {" "}
                          <p className="text-whitePara text-xl mt-4 mb-5">
                            Disposition
                          </p>
                        </td>
                        <td>
                          {" "}
                          <p className="text-whitePara text-xl">Outcome</p>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <DateIconSvg />
                            </div>
                            <p className="text-whitePara text-xl">09/25/24</p>
                          </div>
                        </td>
                        <th>
                          <button className="bg-[#1414C9] p-3 rounded-full w-11 h-11 flex items-center justify-center">
                            <PlayButtonSvg />
                          </button>
                        </th>
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
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Highlighted Relevant Features
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  05
                </p>
              </div>
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Fully explained benefits targeted to clients need
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  07
                </p>
              </div>
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Provided correct responses
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  10
                </p>
              </div>
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Correctly identified questions
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  09
                </p>
              </div>
            </div>{" "}
          </div>
          {/* Brand Adherence */}
          <div>
            <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
              Brand Adherence
            </h2>
            <div className="w-full max-w-layout flex">
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Knowledgeable about Product specifics
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  05
                </p>
              </div>
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Provided correct contact information
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  08
                </p>
              </div>
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Quoted accurate price
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  07
                </p>
              </div>
              <div className="w-1/4 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Correct sales interaction process followed
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  02
                </p>
              </div>
            </div>{" "}
          </div>
          {/* Listening Skills */}
          <div className="w-full">
            <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
              Listening Skills
            </h2>
            <div className="flex w-full">
              <div className="w-1/5 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Attention
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  06
                </p>
              </div>
              <div className="w-1/5 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Tone
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  04
                </p>
              </div>
              <div className="w-1/5 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Pitch
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  02
                </p>
              </div>
              <div className="w-1/5 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Speed
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  01
                </p>
              </div>
              <div className="w-1/5 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Transitioning
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  00
                </p>
              </div>
            </div>{" "}
          </div>
          {/* Program Requirements */}
          <div className="w-full">
            <h2 className="bg-[#3B82F6] w-max text-white text-[26px] px-7 py-4 mb-5">
              Program Requirements
            </h2>
            <div className="flex w-full">
              <div className="w-1/3 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Provided correct responses 
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  07
                </p>
              </div>
              <div className="w-1/3 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Correctly identifies questions
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  05
                </p>
              </div>
              <div className="w-1/3 border-r-2 border-[#E3E3E3] ">
                <p className="h-[120px] bg-white py-3 px-5 text-xl text-darkPara">
                  Provides relevant information
                </p>
                <p className="text-[1E1E1E] font-medium text-2xl pl-5 pt-3">
                  03
                </p>
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
              <p className="text-2xl font-medium text-[#3D4A57]">09/27/24</p>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="table table-zebra w-full">
                <tbody>
                  {/* row 1 */}
                  <tr className="bg-white">
                    <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                      Active Time
                    </th>
                    <td className="w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Active]
                    </td>
                    <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7 text-start">
                      Conversion
                    </th>
                    <td className="py-6 w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Conversion]
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                      Inactive Time
                    </th>
                    <td className="w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Active]
                    </td>
                    <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7 text-start">
                      Sales per hour
                    </th>
                    <td className="py-6 w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Sales per hour]
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr className="bg-white">
                    <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                      Contacts
                    </th>
                    <td className="w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Active]
                    </td>
                    <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7 text-start">
                      Earning per hour
                    </th>
                    <td className="py-6 w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Earning per hour]
                    </td>
                  </tr>
                  {/* row 4 */}
                  <tr>
                    <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7 ">
                      Conversion
                    </th>
                    <td className="w-1/4 text-darkPara text-xl border-r-2 px-7">
                      [User_Active]
                    </td>
                    <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7 text-start"></th>
                    <td className="py-6 w-1/4 text-darkPara text-xl border-r-2 px-7"></td>
                  </tr>
                  {/* row 5 */}
                  <tr className="bg-white">
                    <th className="w-1/4 text-start text-darkPara text-xl font-semibold border-r-2 px-7">
                      Sales
                    </th>
                    <td className="w-1/4 text-darkPara text-xl border-r-2 px-7"></td>
                    <th className="w-1/4 text-darkPara text-xl font-semibold border-r-2 px-7 text-start">
                      Total weekly earnings
                    </th>
                    <td className="py-6 w-1/4 text-darkPara text-xl border-r-2 px-7"></td>
                  </tr>
                </tbody>
              </table>
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
                          <Tooltip content="Kindly provide feedback or add a note" placement="top">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-[650px] h-28 px-6 focus:outline-none border-2 border-[#E3E3E3] rounded-2xl"
                              />
                              </Tooltip>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-6 items-center ">
                <div className="flex items-center w-72">
                  <p className="text-2xl">Agent Signature</p>
                              </div>
                              <Tooltip content="Kindly sign it with your name." placement="top">
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-[400px] h-20 px-6 focus:outline-none border-2 border-[#E3E3E3]  bg-white rounded-md"
                                  />
                                  </Tooltip>
              </div>
              <label className="input input-bordered flex items-center gap-2 relative">
                {/* <div className="absolute left-2 top-3">
                  <DateIconSvg color={"#767676"} />
                </div> */}
                <input
                  type="date"
                  className="rounded-md grow focus:outline-none w-[360px] h-16 border-2 border-[#E3E3E3] bg-white px-4 placeholder:text-[#6F6F6F]"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
  
    </div>
  )
}

export default DummyCoachingReportAccept