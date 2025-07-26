import React, { useEffect, useState } from "react";
import {
  Grid,
  TableContainer,
  Paper,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import styles from "@/styles/PageTitle.module.css";
import Link from "next/link";
import CompanyProfit from "@/components/UIElements/Modal/Reports/Summery/CompanyProfit";
import DailyDepositSummary from "@/components/UIElements/Modal/Reports/Summery/DailyDepositSummary";
import ProfitabilityReport from "@/components/UIElements/Modal/Reports/Summery/ProfitabilityReport";
import OutstandingReport from "@/components/UIElements/Modal/Reports/Summery/OutstandingReport";
import StockBalanceReport from "@/components/UIElements/Modal/Reports/Summery/StockBalanceReport";
import SalesSummaryReport from "@/components/UIElements/Modal/Reports/Summery/SalesSummaryReport";
import ApointmentReport from "@/components/UIElements/Modal/Reports/Summery/ApointmentReport";
import ReservationStatusReport from "@/components/UIElements/Modal/Reports/Summery/ReservationStatusReport";
import ReservationSalesReport from "@/components/UIElements/Modal/Reports/Summery/ReservationSalesReport";
import IsReportSettingEnabled from "@/components/utils/IsReportSettingEnabled";
import FiscalPeriodReport from "@/components/UIElements/Modal/Reports/Summery/FiscalPeriodReport";
import CashFlowSummaryReport from "@/components/UIElements/Modal/Reports/Summery/CashFlowSummaryReport";

const rawReports = [
  { id: 1, name: "Company Profit Report", reportName: "CompanyWiseProfit", component: CompanyProfit, docName: "PrintDocumentsSupplierDateLocal" },
  { id: 2, name: "Stock Balance", reportName: "StockBalance", component: StockBalanceReport, docName: "PrintDocumentsStockFilterLocal" },
  { id: 3, name: "Daily Deposit Summary", reportName: "DailyDepositSummary", component: DailyDepositSummary, docName: "PrintDocumentsBankLocal" },
  { id: 4, name: "Profitability Report", reportName: "ProfitabilityReport", component: ProfitabilityReport, docName: "PrintDocumentsCustomerDateLocal" },
  { id: 5, name: "Customer Outstanding Report", reportName: "OutstandingReport", component: OutstandingReport, docName: "PrintDocumentsByCustomerIdLocal" },
  { id: 6, name: "Sales Summary Report", reportName: "SalesSummaryReport", component: SalesSummaryReport, docName: "PrintDocumentsDateRangeLocal" },
  { id: 7, name: "Next Appointment Type Report", reportName: "ReservationAppointmentTypeReport", component: ApointmentReport, docName: "PrintNextAppointmentLocal" },
  { id: 8, name: "Reservation Status Report", reportName: "ReservationTypeReport", component: ReservationStatusReport, docName: "PrintReservationTypeLocal" },
  { id: 9, name: "Reservation Sales Report", reportName: "ReservationSalesReport", component: ReservationSalesReport, docName: "PrintReservationSalesLocal" },
  { id: 10, name: "Fiscal Period Report", reportName: "FiscalPeriodReport", component: FiscalPeriodReport, docName: "PrintDocumentsLocal" },
  { id: 11, name: "Cash Flow Summary Report", reportName: "CashFlowSummaryReport", component: CashFlowSummaryReport, docName: "PrintCashFlowSummaryReportLocal" },
];


const SummeryReports = () => {
  const [enabledReports, setEnabledReports] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const results = await Promise.all(
        rawReports.map(async (report) => {
          const isEnabled = await IsReportSettingEnabled(report.reportName);
          return isEnabled
            ? {
                ...report,
                component: React.createElement(report.component, {
                  docName: report.docName,
                  reportName: report.reportName,
                }),
              }
            : null;
        })
      );
      setEnabledReports(results.filter(Boolean));
    };

    fetchSettings();
  }, []);

  return (
    <>
      <div className={styles.pageTitle}>
        <h1>Reports</h1>
        <ul>
          <li>
            <Link href="/reports/summery-report">Reports</Link>
          </li>
        </ul>
      </div>

      <Grid container my={2} spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className="dark-table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Report Name</TableCell>
                  <TableCell align="right">View Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enabledReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>No Reports Available</TableCell>
                  </TableRow>
                ) : (
                  enabledReports.map((report, index) => (
                    <TableRow key={report.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell align="right">{report.component}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default SummeryReports;
