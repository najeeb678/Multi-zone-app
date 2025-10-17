"use client";

import React from "react";
import styled from "styled-components";

// Simple Navbar Container
const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 2rem;
  background-color: #260944; // example color
  color: white;
`;

// Logo
const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

// Menu items
const Menu = styled.div`
  display: flex;
  column-gap: 1.5rem;
`;

const MenuItem = styled.div`
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #ba9775;
  }
`;

const Navbar = ({ menuItems = ["Home", "Profile", "Settings", "Logout"], logoText = "TShip" }) => {
  return (
    <NavbarContainer>
      <Logo>{logoText}</Logo>
      <Menu>
        {menuItems.map((item) => (
          <MenuItem key={item}>{item}</MenuItem>
        ))}
      </Menu>
    </NavbarContainer>
  );
};

export default Navbar;
