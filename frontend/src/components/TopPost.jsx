import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { SpinnerCircularFixed } from "spinners-react";
import { StateContext } from "../context/context";
import PostItem from "./PostItem";
const TopPost = () => {
  const { BASE_URL } = useContext(StateContext);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["all-products"],
    queryFn: () =>
      fetch(`${BASE_URL}/posts`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => res.json()),
  });
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <SpinnerCircularFixed
          size={78}
          thickness={100}
          speed={130}
          color="#1D4ED8"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </div>
    );
  if (isError) return <div>Error...</div>;
  const posts = data?.data;
  console.log(posts);
  return (
    <div className="flex flex-col w-full sm:w-8/12 mx-auto gap-6 p-1 sm:p-4">
      {posts
        ?.slice(0, 3)
        .sort((a, b) => b.like_count - a.like_count)
        .map((item) => (
          <PostItem key={item?._id} post={item} />
        ))}
    </div>
  );
};

export default TopPost;
