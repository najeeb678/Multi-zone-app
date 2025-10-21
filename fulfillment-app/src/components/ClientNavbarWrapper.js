"use client";

import React from "react";
import { Navbar } from "app-tship";
import { globalLogout } from "@/utils/auth";


export default function ClientNavbarWrapper() {


  return (
    <Navbar
      logoText="TShip"
      onLogoClick={() => (window.location.href = "/")}
       activeItem="🚚 Fulfillment App"
      menuItems={[
        { label: "🏠 Host App", onClick: () => (window.location.href = "/") },
        { label: "🚚 Last-Mile App", onClick: () => (window.location.href = "/v2") },
        { label: "🚚 Fulfillment App", onClick: () => (window.location.href = "/v3") },
        { label: "🚪 Logout", onClick: globalLogout },
      ]}
    />
  );
}
