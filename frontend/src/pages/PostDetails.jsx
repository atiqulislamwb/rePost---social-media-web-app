import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SpinnerCircularFixed } from "spinners-react";
import { Link } from "react-router-dom";

import { BsThreeDots } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { TbListDetails } from "react-icons/tb";
import { MdOutlinePublic } from "react-icons/md";
import { StateContext } from "./../context/context";
import { BiComment, BiDislike, BiLike } from "react-icons/bi";
import { toast } from "react-toastify";

const PostDetails = () => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, BASE_URL, userFromDb } = useContext(StateContext);
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts", id],
    queryFn: () =>
      fetch(`${BASE_URL}/posts/${id}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => res.json()),
  });

  const post = data?.data;

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(post?.like_count);
  const {
    data: commentData,
    isLoading: commentLoading,
    isError: commentError,
    refetch: commentRefetch,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      fetch(`${BASE_URL}/comments`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => res.json()),
  });

  const handleComment = () => {
    const information = {
      name: userFromDb?.name,
      email: userFromDb?.email,
      photo: userFromDb?.imgUrl,
      post_id: id,
      comment,
      createdAt: new Date(),
    };

    setLoading(true);
    fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(information),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true) {
          setLoading(false);
          toast.success(`${data.message}`, { autoClose: 1000 });
          setComment("");
          commentRefetch();
        } else {
          toast.error(`${data.message}`, { autoClose: 1000 });
        }
      });

    setLoading(false);
  };

  const inputRef = useRef(null);

  const handleOnFocus = () => {
    // Focus the input field
    inputRef.current.focus();
  };

  const handleClick = () => {
    if (!liked) {
      // Decrement the count if the button is currently liked
      setCount(post?.like_count + 1);
    } else {
      // Increment the count if the button is currently not liked
      setCount(post?.like_count - 1);
    }

    const inform = {
      id,
      likeCount: count,
    };

    fetch(`${BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(inform),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === true) {
          console.log("success");
          refetch();
        } else {
          console.log("unsuccess");
        }
      })
      .catch((err) => console.log(err));
  };

  if (isLoading || commentLoading)
    return (
      <div className="flex items-center justify-center">
        <SpinnerCircularFixed
          size={50}
          thickness={100}
          speed={130}
          color="#1D4ED8"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </div>
    );
  if (isError) return <div>Error...</div>;

  const filteredComments = commentData?.data?.filter(
    (item) => item?.post_id == post._id
  );

  if (commentLoading)
    return (
      <div className="flex items-center justify-center">
        <SpinnerCircularFixed
          size={50}
          thickness={100}
          speed={130}
          color="#1D4ED8"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </div>
    );
  if (commentError) return <div>Error...</div>;

  return (
    <div className="w-full sm:w-9/12 mx-auto mt-5 p-2">
      <div className="bg-[#ffffff] w-full p-5 rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-10 h-10 object-contain rounded-full "
            />
            <div>
              <p className="font-semibold text-slate-500">
                {user?.displayName}
              </p>
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
          <p>{post?.post_content}</p>
        </div>
        <div className="mt-4 bg-slate-300 w-full h-[800px]">
          <img
            src={post?.post_image}
            className="w-full h-full  object-contain"
          />
        </div>

        <div className="mt-4 ">
          <div className="flex items-center gap-2 justify-center  my-[3px] ">
            <div className="flex cursor-pointer p-1 items-center justify-center gap-3 w-full text-sm font-semibold ">
              {post?.like_count} {post?.like_count > 1 ? "Likes" : "Like"}
            </div>
            <div className=" flex cursor-pointer p-1 items-center justify-center gap-3 w-full text-sm font-semibold">
              {filteredComments?.length}{" "}
              {filteredComments?.length > 1 ? "Comments" : "comment"}
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-300 "></div>
        <div className="flex items-center gap-2 justify-center  my-[3px] ">
          <div className="w-1/2">
            <button
              onClick={handleClick}
              className="flex cursor-pointer p-1 items-center justify-center gap-3 w-full sm:text-md font-semibold hover:bg-slate-100"
            >
              {liked ? (
                <>
                  <BiDislike />
                  Unlike
                </>
              ) : (
                <>
                  <BiLike />
                  Like
                </>
              )}
            </button>
          </div>

          <div className="w-1/2">
            <button
              onClick={handleOnFocus}
              className=" flex cursor-pointer p-1 items-center justify-center gap-3 w-full sm:text-md font-semibold hover:bg-slate-100"
            >
              <BiComment />
              Comment
            </button>
          </div>
        </div>
        <div className="w-full h-[1px] bg-slate-300 "></div>
        <div>{loading && <div>loading..........</div>}</div>
        <div className="">
          <div className="flex items-center r gap-1 mt-2">
            <img
              src={userFromDb?.imgUrl}
              alt={userFromDb?.name}
              className="w-10 h-10 object-contain rounded-full "
            />
            <div className="w-[90%]">
              <input
                ref={inputRef}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Write a comment..."
                className="bg-slate-200 overflow-y-scroll p-2 w-full rounded-full  border-hidden "
              />
            </div>
            <div>
              <button
                disabled={loading || !comment}
                onClick={handleComment}
                className="w-full p-[9px] cursor-pointer hover:bg-slate-300 transition duration-300 font-semibold text-sm bg-slate-200 rounded-full text"
              >
                {loading ? (
                  <div className="flex">
                    <p>
                      {" "}
                      <svg
                        className="animate-spin border-dashed  h-6 w-6 mr-3 border-blue-500 border-2 rounded-full "
                        viewBox="0 0 24 24"
                      ></svg>
                    </p>
                    <p>Comment</p>
                  </div>
                ) : (
                  "Comment"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-6 mt-4">
          {filteredComments?.map((comment) => (
            <div key={comment._id} className="flex">
              <img
                src={comment?.photo}
                alt={comment?.name}
                className="w-10 h-10 object-contain rounded-full "
              />

              <div className="p-1">
                <div className="bg-slate-200 p-2 rounded-lg">
                  <p className="text-[14px] font-bold">{comment?.name}</p>
                  <p className="text-[16px] ">{comment?.comment}</p>
                </div>
                <div className="flex text-[12px] gap-2 ml-2 font-semibold text-black">
                  <p>Like</p>
                  <p>Reply</p>
                  <p>{comment?.createdAt.slice(12, 19)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
