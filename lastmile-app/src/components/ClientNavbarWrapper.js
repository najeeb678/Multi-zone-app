"use client";

import React from "react";
import { Navbar } from "app-tship";
import { globalLogout } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function ClientNavbarWrapper() {
  const router = useRouter();
  console.log("path :", router.basePath);
  return (
    <Navbar
      logoText="TShip"
      onLogoClick={() => (window.location.href = "/")}
      menuItems={[
        { label: "🏠 Host App", onClick: () => (window.location.href = "/") },
        { label: "🚚 Last-Mile App", onClick: () => (window.location.href = "/v2") },
        { label: "🚚 Fulfillment App", onClick: () => (window.location.href = "/v3") },
        { label: "🚪 Logout", onClick: globalLogout },
      ]}
    />
  );
}
