import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";

import { SpinnerCircularFixed } from "spinners-react";
import PostItem from "../components/PostItem";
import { StateContext } from "../context/context";

const Media = () => {
  const { BASE_URL } = useContext(StateContext);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts"],
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
    <div className="flex flex-col w-full sm:w-8/12 mx-auto gap-6 p-4">
      {posts?.map((item) => (
        <PostItem key={item?._id} post={item} />
      ))}
    </div>
  );
};

export default Media;
