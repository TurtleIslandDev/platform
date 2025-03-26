import React, { useState, useCallback } from "react";
import Button from "../../components/Buttons/Button";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import TiSolutionsLogoSvg from "../../assets/SVGs/logos/TiSolutionsLogoSvg";
import ItsBuzzMarketingLogo from "../../assets/SVGs/logos/ItsBuzzMarketingLogo";
import { BuzzwordIdModel } from "../../components/modals/BuzzwordIdModel";

const BuzzWord = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [readOnly, setReadOnly] = useState(false);
  const { token } = useSelector((state) => state.user);
  const URL = "https://endpoint.itsbuzzmarketing.com";
  // const URL = "http://localhost:3173";
  const [open, setOpen] = useState(false);
  const [buzzRes, setBuzzRes] = useState(null);
  const gridItems = Array.from({ length: 25 }, (_, index) => {
    const names = [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
      "ninth",
      "tenth",
      "eleventh",
      "twelfth",
      "thirteenth",
      "fourteenth",
      "fifteenth",
      "sixteenth",
      "seventeenth",
      "eighteenth",
      "nineteenth",
      "twentieth",
      "twenty-first",
      "twenty-second",
      "twenty-third",
      "twenty-fourth",
      "twenty-fifth",
    ];
    return { id: index + 1, name: names[index] };
  });
  const onSubmit = async (data) => {
    const response = await fetch(`${URL}/buzzword/create_new_buzzword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const resJson = await response.json();
    console.log(resJson[0]?.data);
    //this to be saved in talent database
    if (resJson[0]?.status === "success") {
      setOpen(true);
      setBuzzRes(resJson[0]?.data);
    }
    //   {
    //     "buzzword_id": "67e35376ec813e0336409f4b",
    //     "created_at": "Wed, 26 Mar 2025 01:08:06 GMT",
    //     "created_by": "admin@gmail.com",
    //     "status": "active"
    // }
  };

  // Memoized functions to prevent unnecessary re-renders
  const handleEdit = useCallback(() => setReadOnly(false), []);
  const handleStartGame = useCallback(() => console.log("Game started"), []);

  return (
    <div className="flex justify-center items-center flex-col h-screen bg-gray-100 gap-7">
      {open && (
        <BuzzwordIdModel
          open={open}
          setOpen={setOpen}
          buzzword_id={buzzRes?.buzzword_id}
        />
      )}
      <ItsBuzzMarketingLogo size={"small"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 grid-rows-5 border-collapse">
          {gridItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-center h-24 w-40 m-0 `}
            >
              <textarea
                {...register(`${item.name}`, { required: true })}
                placeholder={item.name}
                rows="2"
                readOnly={readOnly}
                className="m-0 resize-none outline outline-1 border-none text-center text-sm font-semibold bg-transparent w-full h-full p-1  focus:bg-gray-300"
              />
            </div>
          ))}
        </div>

        <div className="flex w-full justify-between p-0 mt-14">
          <Button
            bgColor="#000000"
            className="w-[28%] h-10 rounded-md justify-center"
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            bgColor="#000000"
            className="w-[28%] h-10 rounded-md justify-center"
            type="submit"
          >
            Share
          </Button>
          <Button
            bgColor="#000000"
            className="w-[28%] h-10 rounded-md justify-center"
            onClick={handleStartGame}
          >
            Start game
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuzzWord;
