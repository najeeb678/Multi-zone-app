"use client";

import React, { useState } from "react";
import { Button, SearchInput, DataTable } from "app-tship";
import styled from "styled-components";
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 20px;
`;
const InventoryPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Example columns for inventory table
  const columns = [
    { key: "id", title: "ID", sortable: true },
    { key: "name", title: "Product Name", sortable: true },
    { key: "category", title: "Category" },
    { key: "quantity", title: "Quantity", sortable: true },
    { key: "price", title: "Price", sortable: true },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <Button variant="secondary" onClick={() => handleViewDetails(row.id)}>
          View Details
        </Button>
      ),
    },
  ];

  // Example data
  const inventoryData = [
    { id: 1, name: "Product A", category: "Electronics", quantity: 50, price: 99.99 },
    { id: 2, name: "Product B", category: "Furniture", quantity: 20, price: 149.99 },
    { id: 3, name: "Product C", category: "Clothing", quantity: 100, price: 29.99 },
    // More items...
  ];

  // Search handler - demonstrates state lifting from SearchInput
  const handleSearch = (searchTerm) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filteredData = inventoryData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredData);
      setIsLoading(false);
    }, 500);
  };

  // Row click handler
  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

  // Sort handler
  const handleSort = (key, direction) => {
    console.log(`Sorting by ${key} in ${direction} order`);
    // Implement sorting logic here
  };

  // View details handler
  const handleViewDetails = (id) => {
    console.log(`View details for product ID: ${id}`);
    // Navigate to details page or open modal
  };

  return (
    <MainContainer>
      <h1>Inventory Management</h1>
      <p>Track inventory levels, product categories, and restock alerts.</p>
      <Button variant="secondary" onClick={() => (window.location.href = "/v3")}>
        Go Back to Fulfillment app
      </Button>
    </MainContainer>
    //   <div className="container">
    //     <h1>Inventory Management</h1>

    //     <div className="search-section">
    //       <SearchInput onSearch={handleSearch} placeholder="Search products by name or category..." />
    //     </div>

    //     <div className="actions-section" style={{ margin: "20px 0" }}>
    //       <Button variant="primary">Add New Product</Button>
    //     </div>

    //  {isLoading ? (
    //       <p>Loading...</p>
    //     ) : (
    //       <DataTable
    //         columns={columns}
    //         data={searchResults.length > 0 ? searchResults : inventoryData}
    //         pageSize={5}
    //         sortable={true}
    //         onSort={handleSort}
    //         onRowClick={handleRowClick}
    //       />
    //     )}
    //   </div>
  );
};

export default InventoryPage;
