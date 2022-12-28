import React, { useContext, useState } from "react";
import { StateContext } from "../context/context";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { BiMessageSquareAdd } from "react-icons/bi";
import { IoMdPhotos } from "react-icons/io";
const AddPost = () => {
  const { user, userFromDb, BASE_URL } = useContext(StateContext);

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Add Photos");
  const handleImageChange = (image) => {
    setPreview(window.URL.createObjectURL(image));
    setUploadButtonText(image.name);
  };
  const navigate = useNavigate();

  const handlePost = (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    const image = e.target.image.files[0];

    let formData = new FormData();
    formData.append("image", image);
    setLoading(true);
    fetch(
      "https://api.imgbb.com/1/upload?key=ab37beca6699392a8865e14aac1bbe8d",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const post = {
          author_name: userFromDb?.name,
          author_email: userFromDb?.email,
          author_image: userFromDb?.imgUrl,
          post_image: data?.data?.display_url,
          post_content: content,
          createdAt: new Date(),
        };
        setLoading(true);
        fetch(`${BASE_URL}/posts`, {
          method: "POST",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(post),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.status === true) {
              setLoading(false);
              toast.success(`${data?.message}`, { autoClose: 1000 });
              navigate("/media");
            } else {
              toast.error(`Something went wrong`, { autoClose: 1000 });
            }
          });
      });
    setLoading(false);
    e.target.reset();
  };

  return (
    <div className="w-full p-5 overflow-hidden">
      <div className="sm:w-[700px] mx-auto">
        {userFromDb && (
          <div className="flex my-3">
            <div className="flex items-center gap-1">
              <img
                src={userFromDb?.imgUrl}
                alt={userFromDb?.name}
                className="w-12 h-12 object-contain rounded-full "
              />
              <p className="font-semibold text-slate-500">{userFromDb?.name}</p>
            </div>
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handlePost}>
          <div className="">
            <textarea
              id="name"
              rows="7"
              cols="40"
              className="w-full p-2 sm:placeholder:text-xl overflow-y-auto"
              type="text"
              name="content"
              placeholder="What's on your mind?"
              required={true}
            />
          </div>

          <div className="flex items-center justify-start gap-2 -mt-2">
            <div className="flex flex-col items-center">
              <label
                htmlFor="image"
                className="px-4 py-2 flex cursor-pointer items-center gap-2 justify-center  rounded-lg hover:bg-slate-300 bg-slate-200 font-semibold text-black p-3  "
              >
                <IoMdPhotos />
                {uploadButtonText.slice(0, 15)}
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  name="image"
                  id="image"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>

            <div className="flex items-center justify-start ">
              {user && (
                <button
                  disabled={loading}
                  className="px-4 py-2  rounded-lg hover:bg-blue-700 bg-blue-600 font-semibold text-white p-3 "
                  type="submit"
                >
                  {loading ? (
                    <div className="flex flex-row">
                      <svg
                        className="animate-spin border-dashed h-6 w-6 mr-3 border-red-500 border-2 rounded-full "
                        viewBox="0 0 24 24"
                      ></svg>
                      <p className="flex gap-2 items-center">
                        <BiMessageSquareAdd /> Add Post
                      </p>
                    </div>
                  ) : (
                    <p className="flex gap-2 items-center">
                      <BiMessageSquareAdd /> Add Post
                    </p>
                  )}
                </button>
              )}
            </div>
          </div>
          <div>
            {preview && (
              <img src={preview} className="w-16 h-16" alt="preview_img" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
