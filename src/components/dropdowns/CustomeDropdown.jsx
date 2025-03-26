import React, { useState, useRef, useEffect } from "react";
import settings from "../../assets/images/settings.png";
import ArrowDownSvg from "../../assets/SVGs/ArrowDownSvg";
import styled from "styled-components";

const DropdownMenu = styled.div`
  position: absolute;
  left: -16px;
  background-color: white;
  border-radius: 8px;
  padding: 44px 60px;
  z-index: 1000;
  border: 2px solid #ebedef;
  height: 560px;
  top: -576px; /* Add an extra 16px gap */
  overflow-y: auto;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const CustomDropdown = ({ setSelectedDisposition, dispositionData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setHeight(rect.height); // Calculate the dropdown height after rendering
    }
  }, [isOpen]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside both the button and the dropdown, close it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (e) => {
    setIsOpen(false); // Close dropdown
    setSelectedDisposition(e.target.textContent);
  };

  return (
    <DropdownContainer>
      <button
        ref={buttonRef}
        className="w-80 h-[55px] me-3 mb-3 md:mb-0 text-white bg-[#1E40AF]  rounded-lg text-[22px] font-[400] px-5 py-2.5 text-center inline-flex items-center justify-between"
        type="button"
        onClick={(event) => {
          event.stopPropagation(); // Prevent event propagation to handleClickOutside
          setIsOpen((prev) => !prev); // Toggle dropdown state
        }}
      >
        Dispositions
        <ArrowDownSvg />
      </button>
      {isOpen && (
        <DropdownMenu ref={dropdownRef} height={height}>
          {dispositionData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 text-[#1E40AF] font-[400] text-[22px] cursor-default">
                <img src={settings} alt="settings" /> {item.category}
              </div>
              <ul
                className="py-2 pl-16 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownTopButton"
              >
                {item.disposttions.map((disposition, index) => (
                  <li
                    key={index}
                    onClick={(e) => handleItemClick(e)}
                    className="block px-3.5 py-2 hover:bg-gray-100 text-xl w-max font-[400] cursor-pointer "
                  >
                    {disposition}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default CustomDropdown;
