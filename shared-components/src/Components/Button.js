"use client";

import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  /* Variant styles */
  background-color: ${(props) =>
    props.variant === "primary"
      ? "#0070f3"
      : props.variant === "secondary"
      ? "#ffffff"
      : props.variant === "danger"
      ? "#ff4d4f"
      : "#0070f3"};

  color: ${(props) => (props.variant === "secondary" ? "#0070f3" : "#ffffff")};

  border: ${(props) => (props.variant === "secondary" ? "1px solid #0070f3" : "none")};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const Button = ({ children, variant = "primary", onClick, ...props }) => {
  return (
    <StyledButton variant={variant} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
