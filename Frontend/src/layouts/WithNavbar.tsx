import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar"
export default function WithNavbarLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar currentPath={location.pathname} />
      <Outlet />
    </>
  );
}
