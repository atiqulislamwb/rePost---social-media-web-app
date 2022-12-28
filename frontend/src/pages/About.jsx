import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { SpinnerCircularFixed } from "spinners-react";
import { StateContext } from "./../context/context";

const About = () => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState(
    "Upload Profile Image"
  );
  const { user, BASE_URL } = useContext(StateContext);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: () =>
      fetch(`${BASE_URL}/users/${user?.email}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => res.json()),
  });

  const handleImageChange = (image) => {
    setPreview(window.URL.createObjectURL(image));
    setUploadButtonText(image.name);
  };
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const fullName = e.target.name.value;
    const university = e.target.university.value;
    const address = e.target.address.value;
    const image = e.target.image.files[0];

    if (!fullName) {
      alert("Please enter a name");
      return;
    }

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
        const userInformation = {
          name: fullName,

          imgUrl: data?.data?.display_url,
          university,
          address,
          createdAt: new Date(),
        };

        setLoading(true);
        fetch(`${BASE_URL}/users/${user?.email}`, {
          method: "PUT",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(userInformation),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === true) {
              setLoading(false);
              toast.success("Updated successfully", { autoClose: 1000 });
              refetch();
            } else {
              toast.error("Something went wrong", { autoClose: 1000 });
            }
          });
        setLoading(false);
      });
  };

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

  const about = data?.data;
  return (
    <>
      <div className="text-white w-full p-3 h-[65vh] sm:h-[68vh] flex items-center justify-center bg-[#F3F4F6]">
        <div className="bounce-in-top w-full p-3 sm:w-[550px] h-auto my-3 rounded-md bg-[#231E39] sm:-mt-20">
          <div className="flex items-center justify-end">
            {" "}
            <label
              htmlFor="my-modal-4"
              className="py-1 px-5 cursor-pointer  rounded-md tracking-[3px] font-bold bg-[#2d5de2] hover:bg-[#1D4ED8] text-right mt-4 "
            >
              Edit
            </label>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={about?.imgUrl}
              alt={about?.name}
              className="w-36 h-36 rounded-full object-contain border-2 border-[#1D4ED8]"
            />
            <p className="text-lg text-slate-200 font-bold mt-3">
              {about?.name}
            </p>
            <p className="text-md text-slate-300 font-semibold mb-2">
              {about?.email}
            </p>
            <p className="text-md text-slate-300 font-semibold ">
              University: {about?.university}
            </p>
            <p className="text-md text-slate-300 font-semibold mb-10">
              Address: {about?.address}
            </p>
          </div>
        </div>
      </div>
      <div>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer">
          <label className="modal-box relative" htmlFor="">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleRegisterSubmit}
            >
              <div className="">
                <div className="mb-2 block">
                  <label>Name </label>
                </div>
                <input
                  defaultValue={about?.name}
                  id="name"
                  className="input input-bordered input-warning w-full max-w-xs"
                  type="text"
                  name="name"
                  required={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <label>Email </label>
                </div>
                <input
                  defaultValue={about?.email}
                  className="input input-bordered input-warning w-full max-w-xs"
                  readOnly
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <label>University </label>
                </div>
                <input
                  defaultValue={about?.university}
                  className="input input-bordered input-warning w-full max-w-xs"
                  type="text"
                  name="university"
                  required={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <label>Address </label>
                </div>
                <input
                  defaultValue={about?.address}
                  className="input input-bordered input-warning w-full max-w-xs"
                  type="text"
                  name="address"
                  required={true}
                />
              </div>

              <div className="flex space-x-4 items-center">
                <label
                  htmlFor="image"
                  className="p-3 text-center rounded-md cursor-pointer text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold border hover:text-white "
                >
                  {uploadButtonText}
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                    name="image"
                    id="image"
                    accept="image/*"
                    hidden
                  />
                </label>
                {preview && (
                  <img src={preview} className="w-16 h-16" alt="preview_img" />
                )}
              </div>

              <button
                disabled={loading}
                className="w-[40vw] sm:w-[10vw] rounded-lg text-white font-semibold mt-2  px-16 py-3 bg-[#1D4ED8] hover:bg-[#1640b4] border-[#FF5F3D] "
                type="submit"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin border-dashed  h-5 w-5 mr-3 border-white border-2 rounded-full "
                      viewBox="0 0 24 24"
                    ></svg>
                    <p>Update</p>
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </label>
        </label>
      </div>
    </>
  );
};

export default About;
