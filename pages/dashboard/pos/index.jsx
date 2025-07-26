import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Outlet from "./Outlet";
import Sales from "./Sales";
import OutstandingCustomers from "./OutstandingCustomers";
import OutstandingSuppliers from "./OutstandingSuppliers";
import StockValueCard from "./StockValueCard";
import TotalOutstandingCard from "./TotalOutstandingCard";
import TotalPurchaseCard from "./TotalPurchaseCard";
import TotalSalesCard from "./TotalSalesCard";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

// Utility function to format currency
const formatCurrency = (value) => {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
};

const Index = () => {
  // Dummy data for pos
  const pos = {
    Cash: 150000,
    Card: 250000,
    BankTransfer: 100000,
    Cheque: 50000,
  };

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleStartDateChange = (newValue) => {
    setDateRange(prev => ({
      ...prev,
      startDate: newValue
    }));
  };

  const handleEndDateChange = (newValue) => {
    setDateRange(prev => ({
      ...prev,
      endDate: newValue
    }));
  };

  const posData = [
    {
      id: "1",
      subTitle: "Cash Payments",
      title: formatCurrency(pos.Cash ? pos.Cash : 0),
      iconName: "ri-wallet-line",
    },
    {
      id: "2",
      subTitle: "Card Payments",
      title: formatCurrency(pos.Card ? pos.Card : 0),
      iconName: "ri-bank-card-line",
    },
    {
      id: "3",
      subTitle: "Bank Transfers",
      title: formatCurrency(pos.BankTransfer ? pos.BankTransfer : 0),
      iconName: "ri-bank-line",
    },
    {
      id: "4",
      subTitle: "Cheque",
      title: formatCurrency(pos.Cheque ? pos.Cheque : 0),
      iconName: "ri-file-paper-line",
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Outlet />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap' 
        }}>
          <DatePicker
            label="From Date"
            value={dateRange.startDate}
            onChange={handleStartDateChange}
            renderInput={(params) => (
              <TextField 
                {...params} 
                size="small" 
                sx={{ width: '160px' }} 
              />
            )}
          />
          <DatePicker
            label="To Date"
            value={dateRange.endDate}
            onChange={handleEndDateChange}
            minDate={dateRange.startDate}
            renderInput={(params) => (
              <TextField 
                {...params} 
                size="small" 
                sx={{ width: '160px' }} 
              />
            )}
          />
        </Box>
      </Box>
      
      <Grid
        container
        justifyContent="center"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 2 }}
      >
        {/* Payment Cards */}
        {posData.map((feature) => (
          <Grid item xs={12} sm={6} md={6} lg={6} xl={3} key={feature.id}>
            <Card
              sx={{
                boxShadow: "none",
                borderRadius: "10px",
                p: "20px 15px",
                mb: "15px",
                background: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: "58px",
                      height: "58px",
                      lineHeight: "58px",
                      background: "#757FEF",
                      color: "#fff",
                      fontSize: "30px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                    className="mr-10px"
                  >
                    <i className={feature.iconName}></i>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "13px" }}>
                      {feature.subTitle}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{ fontSize: 25, fontWeight: 700, marginTop: "4px" }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}

        {/* Sales Section */}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Sales />
          
          {/* Financial Summary Cards After Sales */}
          <Grid container spacing={2}>
            {/* First Row */}
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TotalSalesCard />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TotalOutstandingCard />
              </Grid>
            </Grid>
            
            {/* Second Row */}
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TotalPurchaseCard />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <StockValueCard />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Outstanding Section */}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <OutstandingCustomers />
          <OutstandingSuppliers />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Index;