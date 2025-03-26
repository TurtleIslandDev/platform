// Material Tailwind
// Dashboard
// Analytics
// Sales
// Profile
// Tables
import React from "react";
import {
  Drawer,
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import PositiveSVG from "../../assets/SVGs/globalSvgs/PositiveSVG";

const SupportPage = () => {
  const [open, setOpen] = React.useState(true);
  const [modelOpen, setModelOpen] = React.useState(false);

  const handleOpen = () => setModelOpen(!modelOpen);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  return (
    <div className="h-screen bg-white text-white">
      {/* Sidebar */}
      <div className="flex items-center p-4 gap-3">
        <IconButton variant="text" color="blue-gray" onClick={openDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 48 48"
            fill="none"
          >
            <g clipPath="url(#clip0_1729_16058)">
              <path
                d="M31.7438 39.81H31.7175L6.46878 39.4087C6.10203 39.4019 5.75256 39.2516 5.4953 38.9901C5.23803 38.7287 5.09345 38.3768 5.09253 38.01V19.3537C5.09352 18.9834 5.24133 18.6286 5.50354 18.3671C5.76575 18.1056 6.12096 17.9587 6.49128 17.9587H13.9913C14.2837 17.9591 14.5708 18.0366 14.8236 18.1834C15.0765 18.3302 15.2861 18.5412 15.4313 18.795L17.3963 22.2675H31.7513C32.1186 22.2675 32.471 22.4132 32.7311 22.6726C32.9912 22.9319 33.1378 23.2839 33.1388 23.6512V38.415C33.1388 38.785 32.9918 39.1398 32.7302 39.4014C32.4686 39.663 32.1138 39.81 31.7438 39.81ZM6.49128 18.9975C6.39182 18.9975 6.29644 19.037 6.22611 19.1073C6.15579 19.1777 6.11628 19.273 6.11628 19.3725V38.0287C6.11611 38.1244 6.15251 38.2165 6.21804 38.2863C6.28357 38.356 6.37327 38.398 6.46878 38.4037L31.7213 38.805C31.816 38.8047 31.9071 38.7685 31.9763 38.7037C32.0111 38.6711 32.0387 38.6315 32.0574 38.5876C32.0761 38.5438 32.0855 38.4965 32.085 38.4487V23.6512C32.084 23.5594 32.0469 23.4717 31.9816 23.4071C31.9163 23.3425 31.8281 23.3062 31.7363 23.3062H17.1038C17.0122 23.3066 16.9222 23.2824 16.843 23.2363C16.7639 23.1901 16.6986 23.1236 16.6538 23.0437L14.5388 19.2937C14.485 19.199 14.407 19.1203 14.3127 19.0656C14.2185 19.0109 14.1115 18.9822 14.0025 18.9825L6.49128 18.9975Z"
                fill="#333"
              />
              <path
                d="M37.6462 34.5C37.5096 34.501 37.3781 34.448 37.2805 34.3524C37.1828 34.2569 37.1269 34.1266 37.125 33.99V19.395C37.125 19.2508 37.0677 19.1125 36.9657 19.0105C36.8637 18.9086 36.7254 18.8513 36.5812 18.8513H21.8437C21.7466 18.8529 21.6511 18.827 21.5681 18.7766C21.4852 18.7261 21.4182 18.6532 21.375 18.5663L19.3687 14.5388C19.3259 14.4528 19.2602 14.3804 19.1788 14.3294C19.0974 14.2785 19.0035 14.251 18.9075 14.25H11.6737C11.5371 14.251 11.4065 14.306 11.3102 14.4029C11.214 14.4999 11.16 14.6309 11.16 14.7675V16.4625C11.1489 16.5926 11.0894 16.7139 10.9932 16.8022C10.897 16.8906 10.7712 16.9396 10.6406 16.9396C10.51 16.9396 10.3842 16.8906 10.288 16.8022C10.1918 16.7139 10.1323 16.5926 10.1212 16.4625V14.7713C10.1212 14.3595 10.2848 13.9646 10.5759 13.6735C10.8671 13.3823 11.262 13.2188 11.6737 13.2188H18.9075C19.1965 13.2175 19.4801 13.2972 19.726 13.449C19.9719 13.6008 20.1703 13.8186 20.2987 14.0775L22.1737 17.8275H36.585C37.0044 17.8285 37.4063 17.9956 37.7029 18.2921C37.9994 18.5887 38.1665 18.9906 38.1675 19.41V33.99C38.1645 34.1263 38.1083 34.256 38.0109 34.3513C37.9134 34.4467 37.7825 34.5 37.6462 34.5Z"
                fill="#333"
              />
              <path
                d="M42.375 29.625C42.2377 29.625 42.1061 29.5705 42.009 29.4734C41.912 29.3764 41.8575 29.2447 41.8575 29.1075V14.25C41.8575 14.0252 41.7682 13.8096 41.6092 13.6507C41.4503 13.4918 41.2347 13.4025 41.01 13.4025H28.125C27.6955 13.4027 27.2727 13.2958 26.8949 13.0915C26.5171 12.8872 26.1962 12.592 25.9612 12.2325L24.24 9.60747C24.1666 9.4929 24.0657 9.39854 23.9465 9.33303C23.8273 9.26752 23.6935 9.23295 23.5575 9.23247H16.875C16.6585 9.23346 16.4511 9.31991 16.298 9.473C16.1449 9.6261 16.0585 9.83346 16.0575 10.05V11.5837C16.0636 11.6556 16.0547 11.728 16.0314 11.7963C16.0081 11.8646 15.9708 11.9274 15.922 11.9805C15.8732 12.0337 15.8138 12.0761 15.7477 12.1051C15.6817 12.1342 15.6103 12.1491 15.5381 12.1491C15.4659 12.1491 15.3945 12.1342 15.3285 12.1051C15.2624 12.0761 15.203 12.0337 15.1542 11.9805C15.1054 11.9274 15.0681 11.8646 15.0448 11.7963C15.0215 11.728 15.0126 11.6556 15.0187 11.5837V10.0462C15.0237 9.5522 15.2234 9.08009 15.5745 8.7325C15.9256 8.38492 16.3997 8.18995 16.8937 8.18997H23.565C23.8741 8.18812 24.1788 8.26367 24.4513 8.40973C24.7238 8.5558 24.9554 8.76773 25.125 9.02622L26.8462 11.6512C26.9828 11.8683 27.1711 12.0481 27.3943 12.1744C27.6175 12.3007 27.8686 12.3696 28.125 12.375H41.0137C41.511 12.375 41.9879 12.5725 42.3395 12.9241C42.6912 13.2758 42.8887 13.7527 42.8887 14.25V29.1075C42.8887 29.2441 42.8347 29.3751 42.7385 29.4721C42.6422 29.569 42.5116 29.624 42.375 29.625Z"
                fill="#333"
              />
            </g>
          </svg>
        </IconButton>
        <IconButton variant="text" color="blue-gray">
          <div className="transform scale-50">
            <PositiveSVG color={"grey"} />
          </div>
        </IconButton>
      </div>

      <Drawer
        open={open}
        // onClose={closeDrawer}
        className="bg-[#333]"
        overlay={false}
      >
        <div className="mb-2 flex items-center justify-between p-4">
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
                fill="black"
              />
            </svg>
          </IconButton>
          <div className="flex items-center">
            <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 50 50"
                fill="grey"
              >
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
              </svg>
            </IconButton>
            <IconButton variant="text" color="blue-gray">
              <div className="transform scale-50">
                <PositiveSVG color={"grey"} />
              </div>
            </IconButton>
          </div>
        </div>
        <aside className="w-64 p-4 flex flex-col">
          <h2 className="text-lg font-semibold">Support</h2>
          <ul className="mt-4 space-y-2">
            <li className="text-gray-400 hover:text-white cursor-pointer">
              Image Generator
            </li>
            <li className="text-gray-400 hover:text-white cursor-pointer">
              Explore GPTs
            </li>
          </ul>
          <h3 className="mt-6 text-sm text-gray-500">Today</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-gray-400 hover:text-white cursor-pointer">
              Support Homepage Tailwind
            </li>
          </ul>
          <h3 className="mt-6 text-sm text-gray-500">Yesterday</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-gray-400 hover:text-white cursor-pointer">
              Object Key Grouping
            </li>
          </ul>
          <h3 className="mt-6 text-sm text-gray-500">Previous 7 Days</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-gray-400 hover:text-white cursor-pointer">
              API CRUD
            </li>
            <li className="text-gray-400 hover:text-white cursor-pointer">
              Network Error
            </li>
          </ul>
        </aside>
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold text-gray-600">
          What can I help with?
        </h1>
        <div className="mt-6 w-full max-w-2xl">
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 ">
              <input
                type="text"
                className="grow h-16 border text-[#333] border-[#cccccc] rounded pl-5 focus:outline-none"
                placeholder="Message Support"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex space-x-4"></div>
      </main>

      <>
        <Dialog
          open={modelOpen}
          handler={handleOpen}
          overlay={false}
          className="backdrop-blur-none p-5"
        >
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 ">
              <input
                type="text"
                className="grow h-16 outline-none border-none rounded pl-5 focus:outline-none"
                placeholder="Search Chat"
              />
            </label>
          </div>
          <hr className="my-3" />
          <div className=" flex items-center rounded hover:bg-blue-gray-50 cursor-pointer">
            <div className="transform scale-50 ">
              <PositiveSVG color={"#333"} />
            </div>
            <span className="text-[#333]">New Chat</span>
          </div>
          <ul className="mt-4 space-y-2">
            <li className="text-[#333] px-4 py-3 rounded hover:bg-blue-gray-50 cursor-pointer">
              Image Generator
            </li>
            <li className="text-[#333] px-4 py-3 rounded hover:bg-blue-gray-50 cursor-pointer">
              Explore GPTs
            </li>
          </ul>
          <h3 className="mt-6 text-sm text-gray-500">Today</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-[#333] px-4 py-3 rounded hover:bg-blue-gray-50 cursor-pointer">
              Support Homepage Tailwind
            </li>
          </ul>
          <h3 className="mt-6 text-sm text-gray-500">Yesterday</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-[#333] px-4 py-3 rounded hover:bg-blue-gray-50 cursor-pointer">
              Object Key Grouping
            </li>
          </ul>
          <h3 className="mt-6 text-sm text-gray-500">Previous 7 Days</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-[#333] px-4 py-3 rounded hover:bg-blue-gray-50 cursor-pointer">
              API CRUD
            </li>
            <li className="text-[#333] px-4 py-3 rounded hover:bg-blue-gray-50 cursor-pointer">
              Network Error
            </li>
          </ul>
        </Dialog>
      </>
    </div>
  );
};

export default SupportPage;
