import React from "react";
import logo from "../assets/logo.png";
const Foot = () => {
  return (
    <div className="flex flex-col items-center justify-center p-5 mt-[100px]">
      <img src={logo} alt="logo" className="w-16 h-16 object-contain " />
      <p className="text-sm font-bold m-1">
        © 2022 Repost. All rights reserved.
      </p>
    </div>
  );
};

export default Foot;
