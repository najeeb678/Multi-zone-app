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
export default function OrdersPage() {
  return (
    <MainContainer>
      <h1>📦 Active Orders</h1>
      <p>All active and pending orders for last-mile delivery.</p>
      <Button variant="secondary" onClick={() => (window.location.href = "/v2")}>
        Go Back to Lastmile app
      </Button>
    </MainContainer>
  );
}
