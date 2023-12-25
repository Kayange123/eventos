import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-center min-h-screen bg-primary-50 bg-dotted-pattern bg-cover bg-fixed bg-center">
      {children}
    </div>
  );
};

export default AuthLayout;
