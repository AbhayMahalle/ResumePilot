import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
