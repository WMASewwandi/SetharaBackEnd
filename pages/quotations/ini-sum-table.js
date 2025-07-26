import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BASE_URL from "Base/api";

export default function InitialSummaryTable() {
  const [items, setItems] = useState([]);
  const [patternItem, setPatternItem] = useState({});
  const QuotationDetails = JSON.parse(localStorage.getItem("QuotationDetails"));

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Inquiry/GetAllInquirySummeryTableItems?InquiryID=${QuotationDetails.inquiryID}&OptionId=${QuotationDetails.optionId}&WindowType=${QuotationDetails.windowType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Size List");
      }

      const data = await response.json();
      setItems(data.result);
    } catch (error) {
      console.error("Error fetching Size List:", error);
    }
  };

  const fetchPattern = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Inquiry/GetAllInquirySummeryLinesPattern?InquiryID=${QuotationDetails.inquiryID}&OptionId=${QuotationDetails.optionId}&WindowType=${QuotationDetails.windowType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Size List");
      }
      const data = await response.json();
      setPatternItem(data.result[0]);
    } catch (error) {
      console.error("Error fetching Size List:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchPattern();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table" className="dark-table">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell align="right">Unit Cost</TableCell>
              <TableCell sx={{ background: "#a0b8f6", width: '200px', color: "#fff" }}>
                Approved Unit Cost
              </TableCell>
              {/* <TableCell align="right">Total Cost</TableCell>
              <TableCell
                sx={{ background: "#a0b8f6", color: "#fff" }}
              >
                Approved Total Cost
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.itemName}
                </TableCell>
                <TableCell>
                  {item.quantity === null ? 0 : item.quantity}
                </TableCell>
                <TableCell align="right">
                  {item.unitCost === null ? 0 : item.unitCost}
                </TableCell>
                <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                  {item.approvedUnitCost === null ? 0 : item.approvedUnitCost}
                </TableCell>
                {/* <TableCell align="right">
                  {item.totalCost === null ? 0 : item.totalCost}
                </TableCell>
                <TableCell
                  sx={{ background: "#a0b8f6", color: "#fff" }}
                >
                  {item.approvedTotalCost === null ? 0 : item.approvedTotalCost}
                </TableCell> */}
              </TableRow>
            ))}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {patternItem.itemName}
              </TableCell>
              <TableCell>
                {patternItem.quantity === null ? 0 : patternItem.quantity}
              </TableCell>
              <TableCell align="right">
                {patternItem.unitCost === null ? 0 : patternItem.unitCost}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {patternItem.approvedUnitCost === null
                  ? 0
                  : patternItem.approvedUnitCost}
              </TableCell>
              {/* <TableCell align="right">
                {patternItem.totalCost === null ? 0 : patternItem.totalCost}
              </TableCell>
              <TableCell
                sx={{ background: "#a0b8f6", color: "#fff" }}
              >
                {patternItem.approvedTotalCost === null
                  ? 0
                  : patternItem.approvedTotalCost}
              </TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer sx={{ mt: 2, mb: 3 }}>
        <Table size="small" aria-label="simple table" className="dark-table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Description</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                Initial
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6",width: '200px', color: "#fff" }}>
                Approved
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Total Cost</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                {QuotationDetails.totalCost}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {QuotationDetails.apprvedTotalCost}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>No of Units</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                {QuotationDetails.totalUnits}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {QuotationDetails.apprvedTotalUnits}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Profit</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                {QuotationDetails.unitProfit}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {QuotationDetails.apprvedUnitProfit}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Profit Percentage</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                {QuotationDetails.profitPercentage}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {QuotationDetails.apprvedProfitPercentage}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Total Profit</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                {QuotationDetails.totalProfit}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {QuotationDetails.apprvedTotalProfit}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Revenue</TableCell>
              <TableCell align="right" sx={{ color: "#90a4ae" }}>
                {QuotationDetails.revanue}
              </TableCell>
              <TableCell sx={{ background: "#a0b8f6", color: "#fff" }}>
                {QuotationDetails.apprvedRevanue}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
