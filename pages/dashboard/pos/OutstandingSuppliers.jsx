import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatCurrency } from "@/components/utils/formatHelper";

const OutstandingSuppliers = ({ outstandingSuppliers = [] }) => {
  // Dummy data
  const dummyData = [
    { supplierName: "Global Suppliers Inc", totalOutstanding: 250000, task: "1" },
    { supplierName: "TechParts Distributors", totalOutstanding: 189500, task: "2" },
    { supplierName: "EcoMaterials Ltd", totalOutstanding: 167800, task: "3" },
    { supplierName: "Industrial Hardware Co", totalOutstanding: 356700, task: "4" },
    { supplierName: "NextGen Components", totalOutstanding: 243200, task: "5" },
    { supplierName: "Oceanic Imports Ltd", totalOutstanding: 498400, task: "6" },
    { supplierName: "Precision Engineering", totalOutstanding: 378300, task: "7" },
    { supplierName: "Advanced Tech Solutions", totalOutstanding: 512600, task: "8" }
  ];

  // Use dummy data if no real data is provided
  const dataToUse = outstandingSuppliers.length > 0 ? outstandingSuppliers : dummyData;

  // Add safety check for empty or undefined array
  if (!dataToUse || dataToUse.length === 0) {
    return (
      <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 20px 15px", mb: "15px" }}>
        <Box sx={{ paddingBottom: "10px" }}>
          <Typography as="h3" sx={{ fontSize: 18, fontWeight: 500 }}>
            Suppliers Outstanding
          </Typography>
        </Box>
        <Typography sx={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No outstanding suppliers data available
        </Typography>
      </Card>
    );
  }

  const totalOutstandingSum = dataToUse.reduce(
    (sum, row) => sum + Number(row.totalOutstanding || 0),
    0
  );

  return (
    <Card sx={{ boxShadow: "none", borderRadius: "10px", p: "25px 20px 15px", mb: "15px" }}>
      <Box sx={{ paddingBottom: "10px" }}>
        <Typography as="h3" sx={{ fontSize: 18, fontWeight: 500 }}>
          Suppliers Outstanding
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          maxHeight: "50vh",
          overflowY: "auto",
          height: 'auto'
        }}
      >
        <Table
          sx={{ minWidth: 500 }}
          aria-label="custom pagination table"
          className="dark-table"
        >
          <TableHead sx={{ background: "#F7FAFF" }}>
            <TableRow>
              <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px" }}>
                Supplier Name
              </TableCell>
              <TableCell sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px", padding: "15px 10px" }}>
                Total Outstanding Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dataToUse.map((row, index) => (
              <TableRow key={row.task || index}>
                <TableCell sx={{ fontWeight: "500", fontSize: "13px", borderBottom: "1px solid #F7FAFF", color: "#260944", padding: "9px 10px" }}>
                  {row.supplierName || 'N/A'}
                </TableCell>
                <TableCell sx={{ fontWeight: 500, borderBottom: "1px solid #F7FAFF", fontSize: "12px", padding: "9px 10px" }}>
                  Rs. {formatCurrency(row.totalOutstanding || 0)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, padding: "10px" }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 600, padding: "10px" }}>
                Rs. {formatCurrency(totalOutstandingSum)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default OutstandingSuppliers;