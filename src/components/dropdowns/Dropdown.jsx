import React from "react";
import ArrowDownSvg from "../../assets/SVGs/ArrowDownSvg";
import settings from "../../assets/images/settings.png";
const Dropdown = () => {
  return (
    <>
      <div>
        <button
          id="dropdownTopButton"
          data-dropdown-toggle="dropdownTop"
          data-dropdown-placement="top"
          className="w-96 h-[70px] me-3 mb-3 md:mb-0 text-white bg-[#1E40AF]  rounded-lg text-[22px] font-[400] px-5 py-2.5 text-center inline-flex items-center justify-between  "
          type="button"
          onClick={() => console.log("clicked dropdown")}
        >
          Dispositions
          <ArrowDownSvg />
        </button>

        {/* Dropdown menu */}
        <div
          id="dropdownTop"
          className="z-10 hidden bg-white  rounded-lg shadow w-80 border border-[#EBEDEF] px-14 py-11"
        >
          <div>
            <div className="flex items-center gap-2 text-[#1E40AF] font-[400] text-[22px]">
              <img src={settings} alt="settings" /> Category 2
            </div>
            <ul
              className="py-2 pl-16 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownTopButton"
            >
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#1E40AF] font-[400] text-[22px]">
              <img src={settings} alt="settings" /> Category 2
            </div>
            <ul
              className="py-2 pl-16 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownTopButton"
            >
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#1E40AF] font-[400] text-[22px]">
              <img src={settings} alt="settings" /> Category 2
            </div>
            <ul
              className="py-2 pl-16 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownTopButton"
            >
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
              <li className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400]">
                Disposition 4
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dropdown;
