import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
