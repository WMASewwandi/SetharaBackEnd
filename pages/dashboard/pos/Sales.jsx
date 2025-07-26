import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";

// Dummy data
const generateDailyData = (date) => {
  const days = [];
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 6); // Last 7 days

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const sales = 15000 + Math.random() * 20000;
    const profit = sales * (0.3 + Math.random() * 0.1);
    const margin = (profit / sales) * 100;
    days.push({
      name: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
      sales: Math.round(sales),
      profit: Math.round(profit),
      margin: parseFloat(margin.toFixed(1)),
    });
  }
  return days;
};

const generateMonthlyData = (month) => {
  const months = [];
  const startMonth = new Date(month);
  startMonth.setMonth(startMonth.getMonth() - 5); // Last 6 months

  for (let i = 0; i < 6; i++) {
    const currentMonth = new Date(startMonth);
    currentMonth.setMonth(startMonth.getMonth() + i);
    const sales = 80000 + Math.random() * 100000;
    const profit = sales * (0.3 + Math.random() * 0.1);
    const margin = (profit / sales) * 100;
    months.push({
      name: currentMonth.toLocaleDateString("en-US", { month: "short" }),
      sales: Math.round(sales),
      profit: Math.round(profit),
      margin: parseFloat(margin.toFixed(1)),
    });
  }
  return months;
};

const generateYearlyData = (year) => {
  const years = [];
  const startYear = year.getFullYear() - 4; // Last 5 years

  for (let i = 0; i < 5; i++) {
    const currentYear = startYear + i;
    const sales = 1000000 + Math.random() * 1000000;
    const profit = sales * (0.3 + Math.random() * 0.1);
    const margin = (profit / sales) * 100;
    years.push({
      name: currentYear.toString(),
      sales: Math.round(sales),
      profit: Math.round(profit),
      margin: parseFloat(margin.toFixed(1)),
    });
  }
  return years;
};

const Sales = () => {
  const theme = useTheme();
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date());

  useEffect(() => {
    switch (timeFrame) {
      case "daily":
        setChartData(generateDailyData(selectedDate));
        break;
      case "monthly":
        setChartData(generateMonthlyData(selectedMonth));
        break;
      case "yearly":
        setChartData(generateYearlyData(selectedYear));
        break;
      default:
        setChartData(generateDailyData(selectedDate));
    }
  }, [timeFrame, selectedDate, selectedMonth, selectedYear]);

  const getChartTitle = () => {
    switch (timeFrame) {
      case "daily":
        return `Daily: ${selectedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "monthly":
        return `Monthly: ${selectedMonth.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}`;
      case "yearly":
        return `Yearly: ${selectedYear.getFullYear()}`;
      default:
        return "Sales & Profit with Margin";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography as="h3" sx={{ fontSize: 18, fontWeight: 500 }}>
              Sales & Profit
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {getChartTitle()}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel>View</InputLabel>
                    <Select
                      value={timeFrame}
                      label="View"
                      onChange={(e) => setTimeFrame(e.target.value)}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>

                  {timeFrame === "daily" && (
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  )}

                  {timeFrame === "monthly" && (
                    <DatePicker
                      views={["month", "year"]}
                      label="Select Month"
                      value={selectedMonth}
                      onChange={(newValue) => setSelectedMonth(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  )}

                  {timeFrame === "yearly" && (
                    <DatePicker
                      views={["year"]}
                      label="Select Year"
                      value={selectedYear}
                      onChange={(newValue) => setSelectedYear(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  )}
                </Stack>
              </Box>

              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke={theme.palette.primary.main}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={theme.palette.secondary.main}
                      domain={[0, 50]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Profit Margin (%)")
                          return [`${value}%`, name];
                        return [`$${value.toLocaleString()}`, name];
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="sales"
                      name="Total Sales"
                      fill={theme.palette.primary.main}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="profit"
                      name="Profit"
                      fill={theme.palette.success.main}
                    />
                    <Line
                      yAxisId="right"
                      dataKey="margin"
                      name="Profit Margin (%)"
                      stroke={theme.palette.secondary.main}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Sales;
