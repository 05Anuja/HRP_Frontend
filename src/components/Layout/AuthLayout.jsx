import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b0d12]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
