"use client";

import React, { useState } from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
  cursor: ${(props) => (props.sortable ? "pointer" : "default")};

  &:hover {
    background-color: ${(props) => (props.sortable ? "#eaeaea" : "inherit")};
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
`;

const PaginationButton = styled.button`
  background: ${(props) => (props.disabled ? "#f5f5f5" : "#fff")};
  border: 1px solid #ddd;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${(props) => (props.disabled ? "#f5f5f5" : "#f1f1f1")};
  }
`;

const PageInfo = styled.span`
  margin: 0 10px;
`;

const DataTable = ({
  columns,
  data,
  pageSize = 10,
  onRowClick = null,
  sortable = false,
  onSort = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Calculate pagination
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (key) => {
    if (!sortable || !onSort) return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  // Navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <TableContainer>
        <StyledTable>
          <TableHeader>
            <tr>
              {columns.map((column) => (
                <TableHeaderCell
                  key={column.key}
                  sortable={sortable && column.sortable}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.title}
                  {sortable && column.sortable && sortConfig.key === column.key && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </TableHeaderCell>
              ))}
            </tr>
          </TableHeader>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.key}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination>
          <PaginationButton onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </PaginationButton>

          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>

          <PaginationButton onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </PaginationButton>
        </Pagination>
      )}
    </>
  );
};

export default DataTable;
