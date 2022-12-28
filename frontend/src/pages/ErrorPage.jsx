import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col text-2xl font-bold mt-10 text-red-500 items-center justify-center">
      <p>404!</p>
      <p>Oops! Something went wrong.</p>
      <p>
        {" "}
        <div className="spinner flex justify-center items-center">
          <div className="w-6 h-6 rounded-full bg-blue-500 border-t-2 border-red-600 animate-spin" />
        </div>
      </p>
    </div>
  );
};

export default ErrorPage;
