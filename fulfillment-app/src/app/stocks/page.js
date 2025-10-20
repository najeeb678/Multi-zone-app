"use client";
import { Button } from "app-tship";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 20px;
`;

export default function StockPage() {
  return (
    <MainContainer>
      <h1>📊 Stock Overview</h1>
      <p>Track inventory levels, product categories, and restock alerts.</p>
      <Button variant="secondary" onClick={() => (window.location.href = "/v3")}>
        Go Back to Fulfillment app
      </Button>
    </MainContainer>
  );
}
