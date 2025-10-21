"use client";

import React from "react";
import styled from "styled-components";

// Styled components
const NavbarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 2rem;
  background-color: #260944;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  /* Optional blur effect when scrolling */
  backdrop-filter: blur(6px);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const Menu = styled.div`
  display: flex;
  column-gap: 1.5rem;
`;

const MenuItem = styled.div`
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
  padding: 0.5rem 0;
  border-bottom: ${(props) => (props.$isActive ? "2px solid #ba9775" : "none")};
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};

  &:hover {
    color: #ba9775;
  }
`;

const Navbar = ({ logoText = "TShip", menuItems = [], onLogoClick, activeItem }) => {

  return (
    <NavbarContainer>
      <Logo onClick={onLogoClick}>{logoText}</Logo>
      <Menu>
        {menuItems
          .filter((item) => item.onClick) // hides items without click handler
          .map((item, idx) => (
            <MenuItem key={idx} onClick={item.onClick} $isActive={item.label === activeItem}>
              {item.label}
            </MenuItem>
          ))}
      </Menu>
    </NavbarContainer>
  );
};

export default Navbar;
