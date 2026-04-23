import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;