"use client";

import React from "react";
import { Navbar } from "app-tship";
import { globalLogout } from "@/utils/auth";

export default function ClientNavbarWrapper() {
  return (
    <Navbar
      logoText="TShip"
      onLogoClick={() => (window.location.href = "/")}
      menuItems={[
        { label: "🏠 Host App", onClick: () => (window.location.href = "/") },
        { label: "🚚 Last-Mile App", onClick: () => (window.location.href = "/v2") },
        { label: "📦 Fulfillment", onClick: () => (window.location.href = "/inventory") },
        { label: "🚪 Logout", onClick: globalLogout },
      ]}
    />
  );
}
