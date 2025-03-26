import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import InformationSvg from "../../assets/SVGs/interactionGuides/InformationSvg";
import QuestionSvg from "./../../assets/SVGs/interactionGuides/QuestionSvg";

const DropdownMenu = styled.div`
  position: absolute;
  left: -110px;
  background-color: white;
  border-radius: 8px;
  z-index: 1000;
  border: 2px solid #ebedef;
  height: 284px;
  top: -300px;
  overflow-y: auto;
  width: 220px;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const AnswerBox = styled.div`
  position: absolute;
  top: -300px;
  right: 145px; /* Position it next to the dropdown */
  background-color: #ffffff;
  border: 2px solid #ebedef;
  border-radius: 8px;
  padding: 16px;
  z-index: 1000;
  width: 200px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.5px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #6f6f6f;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 12px;
  color: #228512;
  font-weight: 700;
  &:hover {
    background-color: #f7f7f7;
  }
`;

const ArrowIcon = styled.svg`
  width: 12px;
  height: 6px;
  transform: ${({ isOpen }) => (isOpen ? "rotate(90deg)" : "rotate(0)")};
  transition: transform 0.2s;
`;

const QuestionsDropdown = ({ questionsData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const answerBoxRef = useRef(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected index for arrow rotation

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside the dropdown and button, but not in the answer box
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !(answerBoxRef.current && answerBoxRef.current.contains(event.target))
      ) {
        setIsOpen(false); // Close the dropdown
        setSelectedAnswer(null);
        setSelectedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (index, answer) => {
    if (selectedIndex === index) {
      // Close answer box if the same item is clicked again
      setSelectedAnswer(null);
      setSelectedIndex(null);
    } else {
      // Open answer box for the clicked item
      setSelectedAnswer(answer);
      setSelectedIndex(index);
    }
  };

  return (
    <DropdownContainer>
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        <QuestionSvg />
      </button>
      {isOpen && (
        <>
          <DropdownMenu ref={dropdownRef}>
            <ul>
              {questionsData?.map((item, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleItemClick(index, item)}
                >
                  <span>{item.question}</span>
                  <ArrowIcon
                    isOpen={selectedIndex === index} // Rotate if selected
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 6"
                  >
                    <path d="M6 6L12 0L0 0L6 6Z" fill="#D2D2D2" />
                  </ArrowIcon>
                </ListItem>
              ))}
            </ul>
          </DropdownMenu>
          {selectedAnswer && (
            <AnswerBox ref={answerBoxRef}>
              <div className="h-[1.5px] w-full bg-[#228512] mb-3"></div>
              <p>{selectedAnswer.answer}</p>
            </AnswerBox>
          )}
        </>
      )}
    </DropdownContainer>
  );
};

export default QuestionsDropdown;
