import React, { useEffect, useState } from "react";
import styles from "@/styles/PageTitle.module.css";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import InitialSummaryTable from "./ini-sum-table";
import ApprovedSummaryTable from "./apr-sum-table";
import { Box, Button, Typography } from "@mui/material";
import BASE_URL from "Base/api";
import { useRouter } from "next/router";
import TitlebarBelowMasonryImageList from "./image-list";

export default function Comparison() {
  const [customer, setCustomer] = useState({});
  const router = useRouter();
  const id = router.query.id;
  const QuotationDetails = JSON.parse(localStorage.getItem("QuotationDetails"));
  const fetchCustomer = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Customer/GetCustomerDetailByID?customerId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Neck Body List");
      }
      const data = await response.json();  
      if(id != ""){
        setCustomer(data.result.result[0]);
      } 
            
    } catch (error) {
      console.error("Error fetching Neck Body List:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <>
      <div className={styles.pageTitle}>
        <h1>Comparison Quotations</h1>
        <ul>
          <li>
            <Link href="/quotations/approved-quotation">
              Approved Quotations
            </Link>
          </li>
          <li>Comparison</li>
        </ul>
      </div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} mb={1} display="flex" justifyContent="space-between">
        <Box display="flex" sx={{ gap: "10px" }}>
        {customer.firstName} {customer.lastName} / {QuotationDetails.inqCode} / {QuotationDetails.inqOptionName}
          </Box>
          <Link href="/quotations/approved-quotation/">
            <Button variant="outlined" color="primary">
              Go Back
            </Button>
          </Link>
        </Grid>
        <Grid item lg={6} xs={12} pr={1} sx={{ background: "#fff" }}>
          {/* <h2>Initial Quotation</h2> */}
          <InitialSummaryTable />
        </Grid>
        <Grid item xs={6} pr={1}>
          <TitlebarBelowMasonryImageList inquiryID={QuotationDetails.inquiryID} optionId={QuotationDetails.optionId} windowType={QuotationDetails.windowType}/>
        </Grid>
      </Grid>
    </>
  );
}
