import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { StateContext } from "../context/context";
import { BsThreeDots } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { TbListDetails } from "react-icons/tb";
import { MdOutlinePublic } from "react-icons/md";
const PostItem = ({ post }) => {
  const { user, userFromDb } = useContext(StateContext);
  const [text, setText] = useState(post?.post_content?.slice(0, 150));
  const [readMore, setReadMore] = useState(false);

  const handleClick = () => {
    if (!readMore) {
      setReadMore(true);
      setText(post?.post_content);
    } else {
      setReadMore(false);
      setText(post?.post_content.slice(0, 100));
    }
  };

  return (
    <div className="bg-[#ffffff]  p-5 rounded-md shadow-md scale-in-ver-bottom">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img
            src={post?.author_image}
            alt={post?.author_name}
            className="w-10 h-10 object-contain rounded-full "
          />
          <div>
            <p className="font-semibold text-slate-500">{post?.author_name}</p>
            <div className="flex items-center  gap-2">
              <p className="text-sm text-slate-600">
                {post?.createdAt.slice(11, 19)} h
              </p>
              <MdOutlinePublic />
            </div>
          </div>
        </div>
        <div className="flex items-center  text-xl">
          <div className="flex items-center justify-center p-1 w-10 h-10 cursor-pointer hover:bg-slate-100 rounded-full">
            <BsThreeDots />
          </div>
          <div className="flex items-center justify-center p-1 w-10 h-10 cursor-pointer hover:bg-slate-100 rounded-full">
            <RxCross1 />
          </div>
        </div>
      </div>
      <div>
        <span className=" font-normal ">
          {text}
          <span
            onClick={handleClick}
            className="inline cursor-pointer font-bold text-black rounded-md mt-1 p-1   "
          >
            {post?.post_content.length > 150 && (
              <>{readMore ? "...Hide" : "...Read More"}</>
            )}
          </span>
        </span>
      </div>
      <div className="mt-4 bg-slate-300">
        <img src={post?.post_image} className="w-full h-[400px] object-cover" />
      </div>
      <div className="w-full "></div>
      <div className="flex items-center gap-2 justify-end mt-5  ">
        <Link to={`/media/${post?._id}`}>
          <div className="flex items-center justify-center gap-2 py-1 px-4 rounded-md hover:bg-slate-200  ">
            <TbListDetails />
            <p className="text-md text-black font-semibold">More</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
