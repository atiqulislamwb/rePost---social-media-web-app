import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { app } from "../firebase/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { SpinnerCircularFixed } from "spinners-react";

export const StateContext = createContext();
const auth = getAuth(app);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [userFromDb, setUserFromDb] = useState({});
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  console.log(BASE_URL);
  const handleLogout = () => {
    signOut(auth)
      .then((abc) => {
        console.log(abc);
        setUser({});
        toast.success("Sign Out successfully", { autoClose: 1000 });
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch(`${BASE_URL}/users/${user?.email}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUserFromDb(data?.data));
  }, [user?.email]);

  useEffect(() => {
    const unSubscribed = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      setLoading(false);
    });
    return () => {
      unSubscribed();
      setLoading(false);
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <SpinnerCircularFixed
          size={78}
          thickness={100}
          speed={130}
          color="rgba(172, 57, 57, 1)"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </div>
    );
  console.log(userFromDb);

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        handleLogout,
        loading,
        setLoading,
        userFromDb,
        BASE_URL,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
