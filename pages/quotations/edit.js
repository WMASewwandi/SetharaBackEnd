import React, { useEffect, useState } from "react";
import styles from "@/styles/PageTitle.module.css";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Box, Button, Modal, Typography } from "@mui/material";
import BASE_URL from "Base/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SummarySleeve from "pages/inquiry/tshirt/summary-sleeve";
import DocumentListShirt from "pages/inquiry/shirt/document-list";
import DocumentListCap from "pages/inquiry/cap/document-list";
import DocumentListVisor from "pages/inquiry/visor/document-list";
import DocumentListHat from "pages/inquiry/hat/document-list";
import DocumentListBag from "pages/inquiry/bag/document-list";
import DocumentListBottom from "pages/inquiry/bottom/document-list";
import DocumentListShort from "pages/inquiry/short/document-list";
import FabList from "./summary-fab";
import SizesList from "./summary-sizes";
import DocumentListTShirt from "pages/inquiry/tshirt/document-list";
import SumTable from "./sum-table";
import { useRouter } from "next/router";
import SumTableTest from "./summary-table";
import TableData from "./table";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function EditQuotation() {
  const QuotationDetails = JSON.parse(localStorage.getItem("QuotationDetails"));
  const router = useRouter();
  const status = router.query.status;
  const [open, setOpen] = React.useState(false);
  const [calculatedValue, setCalculatedValue] = useState();
  const handleClose = () => setOpen(false);
  
  const GetCalculatedValue = () => {
    const calculated = localStorage.getItem("calculated");
    setCalculatedValue(calculated);
    handleSaveApprovedValues(calculated);
  }
  
  const handleSaveApprovedValues = (value) => {
    if (value === "true") {
      const dataFromLocalStorage = JSON.parse(
        localStorage.getItem("approveddata")
      );
      const token = localStorage.getItem("token");

      const bodyData = {
        InquiryID: QuotationDetails.inquiryID,
        InqCode: QuotationDetails.inqCode,
        WindowType: QuotationDetails.windowType,
        OptionId: QuotationDetails.optionId,
        InqOptionName: QuotationDetails.inqOptionName,
        TotalUnits: QuotationDetails.totalUnits,
        UnitCost: QuotationDetails.unitCost,
        TotalCost: QuotationDetails.totalCost,
        ProfitPercentage: QuotationDetails.profitPercentage,
        UnitProfit: QuotationDetails.unitProfit,
        TotalProfit: QuotationDetails.totalProfit,
        SellingPrice: QuotationDetails.sellingPrice,
        Revenue: QuotationDetails.revanue,
        ApprovedStatus: 1,
        ApprvedUnitCost: parseFloat(dataFromLocalStorage.unitCost) || 0,
        ApprvedTotalCost: parseFloat(dataFromLocalStorage.totalCost) || 0,
        ApprvedProfitPercentage:
          parseFloat(dataFromLocalStorage.profitPercentage) || 0,
        ApprvedUnitProfit: parseFloat(dataFromLocalStorage.profit) || 0,
        ApprvedTotalProfit: parseFloat(dataFromLocalStorage.totalProfit) || 0,
        ApprvedSellingPrice: parseFloat(dataFromLocalStorage.sellingPrice) || 0,
        ApprvedRevanue: parseFloat(dataFromLocalStorage.revenue) || 0,
        ApprvedTotalUnits: parseFloat(dataFromLocalStorage.totalUnits) || 0,
      };

      fetch(`${BASE_URL}/Inquiry/CreateOrUpdateInquirySummeryHeader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.statusCode == 200) {
            toast.success(data.message);
            window.location.href = '/quotations/pending-quotation/';
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          toast.error(error.message || "");
        });
    } else {
      setOpen(true);
    }
  };

  const navigateToBack = () => {
    if (status == "1") {
      router.push({
        pathname: "/quotations/approved-quotation",
      });
    } else {
      router.push({
        pathname: "/quotations/pending-quotation",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.pageTitle}>
        <h1>Edit Quotations</h1>
        <ul>
          <li>
            {status == "1" ? (
              <Link href="/quotations/approved-quotation">
                Approved Quotations
              </Link>
            ) : (
              <Link href="/quotations/pending-quotation">
                Pending Quotations
              </Link>
            )}
          </li>
          <li>Edit Quotation</li>
        </ul>
      </div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Box display="flex" sx={{ gap: "10px" }}>
            {QuotationDetails.customerDetils ? (
              <>
                {QuotationDetails.customerDetils.firstName}{" "}
                {QuotationDetails.customerDetils.lastName}
              </>
            ) : (
              <Typography color="error">Customer Not Fount</Typography>
            )}
            / {QuotationDetails.inqCode} / {QuotationDetails.inqOptionName} /{" "}
            {QuotationDetails.styleName}
          </Box>
          <Box display="flex" sx={{ gap: "10px" }}>
            <Button
              onClick={() => navigateToBack()}
              variant="outlined"
              color="primary"
            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outlined"
              color="error"
            >
              Reset
            </Button>
            <Button
              onClick={GetCalculatedValue}
              variant="contained"
              color="primary"
            >
              approve
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} p={1} lg={5}>
              {/* <SumTable /> */}
              {/* <SumTableTest/> */}
              <TableData status={status} />
              {QuotationDetails.windowType === 1 ? <SummarySleeve /> : ""}
            </Grid>
            <Grid item xs={12} p={1} lg={7}>
              <Grid container>
                <Grid item xs={12}>
                  {QuotationDetails.windowType === 1 ? (
                    <DocumentListTShirt />
                  ) : QuotationDetails.windowType === 2 ? (
                    <DocumentListShirt />
                  ) : QuotationDetails.windowType === 3 ? (
                    <DocumentListCap />
                  ) : QuotationDetails.windowType === 4 ? (
                    <DocumentListVisor />
                  ) : QuotationDetails.windowType === 5 ? (
                    <DocumentListHat />
                  ) : QuotationDetails.windowType === 6 ? (
                    <DocumentListBag />
                  ) : QuotationDetails.windowType === 7 ? (
                    <DocumentListBottom />
                  ) : QuotationDetails.windowType === 8 ? (
                    <DocumentListShort />
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <FabList />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} p={1}>
              <SizesList />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-black">
          <Box mt={2}>
            <Grid container>
              <Grid item xs={12} mt={2}>
                <Typography
                  as="h5"
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    mb: "12px",
                  }}
                >
                  You have uncalculated items. Please click "Calculate" after
                  making any edits, or reset all.
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
              sx={{
                mt: 2,
                textTransform: "capitalize",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "13px",
                padding: "12px 20px",
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
