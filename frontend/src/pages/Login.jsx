import React, { useContext, useState } from "react";

import { BsGoogle } from "react-icons/bs";
import { app } from "../firebase/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StateContext } from "../context/context.js";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const auth = getAuth(app);

const Login = () => {
  const { setUser } = useContext(StateContext);

  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  let location = useLocation();

  let from = location?.state?.from?.pathname || "/";

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        setUser(user);

        toast.success("login successfully", { autoClose: 1000 });
        navigate(from, { replace: true });
        e.target.reset();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((solve) => {
        console.log(solve);
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoading(true);
        const user = result.user;
        setUser(user);
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login Page- login to access all services</title>
      </Helmet>
      <div className="w-9/12 mx-auto mt-10 mb-20 sm:w-[50vh] ">
        <form
          className="flex flex-col gap-4 mt-10"
          onSubmit={handleLoginSubmit}
        >
          <div>
            <div className="mb-2 block">
              <label htmlFor="email">Email</label>
            </div>
            <input
              id="email"
              className="input w-full max-w-xs border-[#1D4ED8]"
              type="email"
              name="email"
              required={true}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <label htmlFor="">Password</label>
            </div>
            <input
              className="input w-full max-w-xs border-[#1D4ED8]"
              type="password"
              name="password"
              required={true}
            />
          </div>
          <div className="flex flex-col items-start">
            <button
              className=" w-[40vw] sm:w-[10vw] rounded-md text-white font-semibold mt-3 px-16 py-3 bg-[#1D4ED8] hover:bg-[#113ebd]  border-[#1D4ED8] "
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex">
                  <p>
                    {" "}
                    <svg
                      className="animate-spin border-dashed  h-5 w-5 mr-3 border-white border-2 rounded-full "
                      viewBox="0 0 24 24"
                    ></svg>
                  </p>
                  <p>Login</p>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-[50vw] sm:w-[12vw]  mt-5 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-[#1D4ED8]/90 focus:ring-4 focus:outline-none  font-medium rounded-lg text-md px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
        >
          <p>
            <BsGoogle className="mx-4" />
          </p>
          <p> Google Log in</p>
        </button>
        <div className="mt-5 text-[15px] text-red-500 font-semibold">
          Don't have you account?
          <Link
            to="/register"
            className=" ml-2 rounded-md py-2 px-5 font-semibold text-[#fff] bg-[#2554d6] hover:bg-[#1a48c7]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
