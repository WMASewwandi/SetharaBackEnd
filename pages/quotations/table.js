import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BASE_URL from "Base/api";
import { formatCurrency } from "@/components/utils/formatHelper";

export default function TableData({ status }) {
  const optionDetails = JSON.parse(localStorage.getItem("QuotationDetails"));
  const [items, setItems] = useState([]);
  const [patternItem, setPatternItem] = useState({
    quantity: 0,
    totalCost: 0,
    unitCost: 0,
  });
  const [patternQuantity, setPatternQuantity] = useState(0);
  const [patternTotalCost, setPatternTotalCost] = useState(0);
  const [patternUCost, setPatternUCost] = useState(0);
  const [changedItems, setChangedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [noOfUnits, setNoOfUnits] = useState(0);
  const [finalUnitCost, setFinalUnitCost] = useState(0);
  const [profit, setProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(10);
  const [calculationValues, setCalculationValues] = useState([]);
  const [rawSellingPrice, setRawSellingPrice] = useState("");
  const [rawProfit, setRawProfit] = useState("");

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Inquiry/GetAllInquirySummeryTableItems?InquiryID=${optionDetails.inquiryID}&OptionId=${optionDetails.optionId}&WindowType=${optionDetails.windowType}`,
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
      const updatedItems = data.result.map((item) => ({
        ...item,
        totalCost: item.quantity * item.unitCost,
      }));
      setItems(updatedItems);
      setNoOfUnits(data.result[0].quantity);
    } catch (error) {
      console.error("Error fetching Size List:", error);
    }
  };

  const fetchPattern = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Inquiry/GetAllInquirySummeryLinesPattern?InquiryID=${optionDetails.inquiryID}&OptionId=${optionDetails.optionId}&WindowType=${optionDetails.windowType}`,
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
      const pattern = data.result[0];
      const patternUnitCost = pattern.totalCost / pattern.quantity;
      setPatternQuantity(pattern.quantity);
      setPatternTotalCost(pattern.totalCost);
      setPatternUCost(patternUnitCost);
      setPatternItem({
        ...pattern,
        unitCost: patternUnitCost,
      });
    } catch (error) {
      console.error("Error fetching Size List:", error);
    }
  };

  const handleItemUnitCostChange = (index, value) => {
    Calculation(false);
    const newItems = [...items];
    newItems[index].unitCost = parseFloat(value);
    newItems[index].totalCost = parseFloat(newItems[index].quantity * value);
    setItems(newItems);
    setChangedItems(newItems);
  };

  const handlePatternTotalCostChange = (value) => {
    Calculation(false);
    setPatternTotalCost(value);
    const newUnitCost = value / patternQuantity;
    const newPatternItem = {
      ...patternItem,
      totalCost: parseFloat(value),
      unitCost: parseFloat(newUnitCost),
    };
    setPatternUCost(newUnitCost);
    setPatternItem(newPatternItem);
  };

  const fetchQuotationDataList = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Inquiry/GetInquirySummeryHeaderBYOptionID?InquiryID=${optionDetails.inquiryID}&OptionId=${optionDetails.optionId}&WindowType=${optionDetails.windowType}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Quotation List");
      }
      const data = await response.json();
      const approved = localStorage.getItem("approveddata");
      if (data.result) {
        setRawProfit(
          approved
            ? data.result.apprvedUnitProfit
            : status == "1"
              ? data.result.apprvedUnitProfit
              : data.result.unitProfit
        );
        setFinalUnitCost(
          approved
            ? data.result.apprvedUnitCost
            : status === "1"
              ? data.result.apprvedUnitCost
              : data.result.unitCost
        );
        setTotalCost(
          approved
            ? data.result.apprvedTotalCost
            : status === "1"
              ? data.result.apprvedTotalCost
              : data.result.totalCost
        );

        setRawSellingPrice(
          approved
            ? data.result.apprvedSellingPrice
            : status === "1"
              ? data.result.apprvedSellingPrice
              : data.result.sellingPrice
        );
        setRevenue(
          approved
            ? data.result.apprvedRevanue
            : status === "1"
              ? data.result.apprvedRevanue
              : data.result.revanue
        );
        setTotalProfit(
          approved
            ? data.result.apprvedTotalProfit
            : status === "1"
              ? data.result.apprvedTotalProfit
              : data.result.totalProfit
        );
        setProfitPercentage(
          approved
            ? data.result.apprvedProfitPercentage
            : status === "1"
              ? data.result.apprvedProfitPercentage
              : data.result.profitPercentage
        );
      }
    } catch (error) {
      console.error("Error fetching Quotation List:", error);
    }
  };

  const handleProfitChange = (value) => {
    Calculation(false);
    const profitValue = parseFloat(value);
    setRawProfit(value);
    setProfit(profitValue);
  };

  const handleCalculate = () => {
    Calculation(true);
    const calculatedValues = items.map((item) => ({
      ...item,
      totalCost: item.quantity * item.unitCost,
    }));
    calculatedValues.push({
      ...patternItem,
      totalCost: patternTotalCost,
      unitCost: patternTotalCost / patternQuantity,
    });
    setCalculationValues(calculatedValues);

    fetch(`${BASE_URL}/Inquiry/UpdateSummeryLine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(calculatedValues),
    });

    const totalCostSum = calculatedValues.reduce(
      (acc, item) => acc + item.totalCost,
      0
    );


    const calcUnitCost = parseFloat(totalCostSum) / patternQuantity;
    const calcSellingPrice = parseFloat(calcUnitCost) + parseFloat(rawProfit);
    const calcTotalProfit = parseFloat(rawProfit) * parseFloat(noOfUnits);
    const calcRev = parseFloat(calcTotalProfit) + parseFloat(totalCostSum);

    const newProfitPercentage = (
      (rawProfit / (totalCostSum && noOfUnits ? totalCostSum / noOfUnits : 1)) *
      100
    ).toFixed(2);

    setTotalCost(totalCostSum);
    setProfitPercentage(newProfitPercentage);
    setFinalUnitCost(calcUnitCost);
    setSellingPrice(calcSellingPrice);
    setTotalProfit(calcTotalProfit);
    setRevenue(calcRev);

    const data = {
      revenue: calcRev,
      totalProfit: calcTotalProfit,
      sellingPrice: calcSellingPrice,
      profitPercentage: newProfitPercentage,
      unitCost: calcUnitCost,
      totalCost: totalCostSum,
      totalUnits: noOfUnits,
      profit: rawProfit,
    };

    localStorage.setItem("approveddata", JSON.stringify(data));
  };

  useEffect(() => {
    handleCalculate();
    fetchItems();
    fetchPattern();
    fetchQuotationDataList();
    Calculation(true);
  }, []);



  const Calculation = (calculated) => {
    localStorage.setItem("calculated", calculated);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table" className="dark-table">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell align="right">Total Cost</TableCell>
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
                  <input
                    value={item.unitCost}
                    style={{
                      width: "60px",
                      border: "1px solid #e5e5e5",
                    }}
                    onChange={(e) =>
                      handleItemUnitCostChange(index, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell align="right">
                  {Number(item.totalCost).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Pattern
              </TableCell>
              <TableCell>{patternUCost.toFixed(2)}</TableCell>
              <TableCell>{patternQuantity}</TableCell>
              <TableCell align="right">
                <input
                  value={patternTotalCost}
                  style={{
                    width: "60px",
                    border: "1px solid #e5e5e5",
                  }}
                  onChange={(e) =>
                    handlePatternTotalCostChange(parseFloat(e.target.value))
                  }
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer sx={{ mt: 2 }}>
        <Table size="small" aria-label="simple table" className="dark-table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }} colSpan={3}>
                Total Cost
              </TableCell>
              <TableCell align="right">
                {formatCurrency(totalCost)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>No of Units</TableCell>
              <TableCell align="right">{noOfUnits}</TableCell>
              <TableCell sx={{ color: "#90a4ae" }}>Unit Cost</TableCell>
              <TableCell align="right">{formatCurrency(finalUnitCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Profit</TableCell>
              <TableCell align="right">
                <input
                  value={rawProfit}
                  style={{
                    width: "60px",
                    border: "1px solid #e5e5e5",
                  }}
                  onChange={(e) => handleProfitChange(e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ color: "#90a4ae" }}>Profit (%)</TableCell>
              <TableCell align="right">
                {formatCurrency(profitPercentage)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }}>Selling Price</TableCell>
              <TableCell align="right">
                {formatCurrency(sellingPrice)}
              </TableCell>

              <TableCell sx={{ color: "#90a4ae" }}>Total Profit</TableCell>
              <TableCell align="right">{formatCurrency(totalProfit)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: "#90a4ae" }} colSpan={3}>
                Revenue
              </TableCell>
              <TableCell align="right">{formatCurrency(revenue)}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Box mt={2}>
        <Button variant="contained" onClick={handleCalculate}>
          Calculate
        </Button>
      </Box>
    </>
  );
}
