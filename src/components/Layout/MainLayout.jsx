import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-silgate-background select-none">
      <Sidebar />


      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-silgate-background px-6 py-6 fade-in-slide">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
