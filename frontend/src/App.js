import { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SpinnerCircularFixed } from "spinners-react";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home";
import Media from "./pages/Media";
import Message from "./pages/Message";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import Foot from "./components/Foot";
import About from "./pages/About.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import { StateContext } from "./context/context.js";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(StateContext);

  const location = useLocation();
  const auth = user?.uid;
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
  return auth ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <div className="bg-[#F3F4F6] w-full sm:w-full md:w-9/12 mx-auto overflow-hidden ">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/media" element={<Media />} />
        <Route
          path="/media/:id"
          element={
            <PrivateRoute>
              <PostDetails />
            </PrivateRoute>
          }
        />
        <Route path="/message" element={<Message />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Foot />
    </div>
  );
}

export default App;
