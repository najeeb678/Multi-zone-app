"use client";

import React, { useState } from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #0070f3;
  }
`;

const SearchInput = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the parent's onSearch function and pass the searchTerm (lifting state up)
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputContainer>
        <StyledInput type="text" value={searchTerm} onChange={handleChange} placeholder={placeholder} />
        <SearchButton type="submit">🔍</SearchButton>
      </InputContainer>
    </form>
  );
};

export default SearchInput;
