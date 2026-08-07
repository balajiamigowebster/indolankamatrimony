"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";

const NavbarProvider = ({ children }) => {
  const pathName = usePathname();
  const DASHBOARD_ROUTE_PREFIX = "/dashboard";
  const LOGIN_ROUTE = "/login";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldHideNavbar =
    pathName.startsWith(DASHBOARD_ROUTE_PREFIX) ||
    pathName.startsWith(LOGIN_ROUTE);

  if (
    pathName.startsWith(DASHBOARD_ROUTE_PREFIX) ||
    pathName.startsWith(LOGIN_ROUTE)
  ) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default NavbarProvider;
