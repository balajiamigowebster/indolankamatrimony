// components/FooterWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./Footer"; // உங்கள் Footer component-ஐ import செய்யவும்

// மறைக்க வேண்டிய ரூட் ப்ரிஃபிக்ஸ்கள்/பாதைகள்
const DASHBOARD_ROUTE_PREFIX = "/dashboard";
const LOGIN_ROUTE = "/login";

const FooterWrapper = () => {
  const pathName = usePathname();

  // 🎯 லாஜிக்: Footer-ஐ மறைக்க வேண்டுமா? (Hide = true)
  const shouldHideFooter =
    pathName.startsWith(DASHBOARD_ROUTE_PREFIX) ||
    pathName.startsWith(LOGIN_ROUTE);

  // மறைக்காமல் இருந்தால் மட்டுமே Footer-ஐ ரெண்டர் செய்யவும்
  if (shouldHideFooter) {
    return null; // Footer-ஐ மறைக்கவும்
  }

  return <Footer />;
};

export default FooterWrapper;
