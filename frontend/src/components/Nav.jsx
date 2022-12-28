import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiDotsVertical } from "react-icons/hi";
import { StateContext } from "../context/context";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
const Nav = () => {
  const [toggle, setToggle] = useState(false);
  const { user, userFromDb, handleLogout } = useContext(StateContext);
  return (
    <div className="flex items-center h-16 justify-between text-white bg-slate-800 sm:sticky">
      <div>
        {" "}
        <Link to="/">
          <img src={logo} className="w-20 h-16 object-contain p-2 ml-10" />
        </Link>
      </div>
      <div className="sm:hidden block">
        <div className="absolute top-3 right-5">
          {toggle ? (
            <IoMdCloseCircleOutline
              color={"#ffffff"}
              size={32}
              onClick={() => setToggle((prev) => !prev)}
            />
          ) : (
            <HiDotsVertical
              color={"#ffffff"}
              size={32}
              onClick={() => setToggle((prev) => !prev)}
            />
          )}
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="mr-10 flex flex-row gap-6 sm:">
          <Link to="/" className="hover:text-slate-300">
            Home
          </Link>
          <Link to="/media" className="hover:text-slate-300">
            Media
          </Link>
          <Link to="/message" className="hover:text-slate-300">
            Message
          </Link>
          <Link to="/about" className="hover:text-slate-300">
            About
          </Link>
          {userFromDb && (
            <div className="flex items-center justify-center gap-3">
              <div>
                <img
                  src={userFromDb?.imgUrl}
                  alt={userFromDb?.name}
                  title={userFromDb?.name}
                  className="w-8 h-8 object-cover rounded-full "
                />
              </div>
              <div className="dropdown dropdown-end z-[1000]">
                <label
                  tabIndex={0}
                  className="text-white  hover:text-slate-300 text-2xl cursor-pointer"
                >
                  <BiDotsVerticalRounded />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 mt-6 z-40 bg-slate-800  rounded-box w-52"
                >
                  <li
                    className="text-white font-semibold "
                    onClick={handleLogout}
                  >
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {!userFromDb && (
            <Link
              to="/login"
              className="bg-[#335ed6] hover:bg-[#1D4ED8] py-[6px] px-3 rounded-md font-semibold"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      {toggle && (
        <div
          className={`transition slide-right duration-700 transform absolute top-0 h-[65vh] rounded-br-[15px]  w-2/3 opacity-100 bg-[#1E293B] backdrop-blur-lg z-10
            p-6 sm:hidden  ${toggle ? "left-[-100px]" : "-left-full"} `}
        >
          <div className="slide-top">
            <div className="mr-10 flex flex-col ml-[30px] mt-[150px] gap-6 ">
              <Link
                onClick={() => setToggle((prev) => !prev)}
                to="/"
                className="hover:text-slate-300"
              >
                Home
              </Link>
              <Link
                onClick={() => setToggle((prev) => !prev)}
                to="/media"
                className="hover:text-slate-300"
              >
                Media
              </Link>
              <Link
                onClick={() => setToggle((prev) => !prev)}
                to="/message"
                className="hover:text-slate-300"
              >
                Message
              </Link>
              <Link
                onClick={() => setToggle((prev) => !prev)}
                to="/about"
                className="hover:text-slate-300"
              >
                About
              </Link>
              {userFromDb ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <img
                      src={userFromDb?.imgUrl}
                      alt={userFromDb?.name}
                      title={userFromDb?.name}
                      className="w-8 h-8 object-cover rounded-full "
                    />
                  </div>
                  <div className="">
                    <button
                      className="px-2 py-2 bg-[#335ed6] rounded-lg"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  onClick={() => setToggle((prev) => !prev)}
                  to="/login"
                  className="bg-[#335ed6] hover:bg-[#1D4ED8] py-[6px] px-3 rounded-md font-semibold"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
