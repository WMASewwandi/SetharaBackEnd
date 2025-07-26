import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Autocomplete,
  Button,
  TextField,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "Base/api";
import { useRouter } from "next/router";
import useApi from "@/components/utils/useApi";
import getNext from "@/components/utils/getNext";
import { formatDate } from "@/components/utils/formatHelper";
import { debounce } from "lodash";
import LoadingButton from "@/components/UIElements/Buttons/LoadingButton";
import useShiftCheck from "@/components/utils/useShiftCheck";

const Salesreturn = () => {
  const today = new Date();
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(formatDate(today));
  const [remark, setRemark] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [address4, setAddress4] = useState("");
  const router = useRouter();
  const [grossTotal, setGrossTotal] = useState(0);
  const [salesPerson, setSalesPerson] = useState("");
  const [outstandingAmounts, setOutstandingAmounts] = useState("");
  const [invoice, setInvoice] = useState("");
  const [invoicesForCustomer, setInvoicesForCustomer] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceFocused, setInvoiceFocused] = useState(false);
  const [returnAmount, setReturnAmount] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const { result: shiftResult, message: shiftMessage } = useShiftCheck();

  const {
    data: customerList,
    loading: customerLoading,
    error: customerError,
  } = useApi("/Customer/GetAllCustomer");

  const {
    data: salesPersonList,
    loading: salesPersonLoading,
    error: salesPersonError,
  } = useApi("/SalesPerson/GetAllSalesPerson");

  // const {
  //   data: invoiceList,
  //   loading: invoiceLoading,
  //   error: invoiceError,
  // } = useApi("/Invoice/GetAllInvoices");

  const { data: invoiceNo } = getNext(`10`);

  const navigateToBack = () => {
    router.push({
      pathname: "/sales/sales-return",
    });
  };

  const fetchInvoices = debounce(async (query, customerId) => {
    if (!query || !customerId) {
      setFilteredInvoices([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/SalesInvoice/GetInvoicesByCustomerId?customerId=${customerId}&keyWord=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredInvoices(data.result || []);
      } else {
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setFilteredInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (customerId && searchQuery) {
      fetchInvoices(searchQuery, customerId);
    } else {
      setFilteredInvoices([]);
    }
    return () => {
      fetchInvoices.cancel();
    };
  }, [searchQuery, customerId]);

  const fetchInvoiceDetails = async (documentNo) => {
    if (!documentNo) {
      toast.error("Document No is required.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/SalesInvoice/GetSalesInvoiceBySalesInvoiceIdSearch?DocumentNo=${documentNo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.result && jsonResponse.result.length > 0) {
          setSelectedRows(jsonResponse.result);
        }
      } else {
        // toast.error("Failed to fetch invoice details.");
      }
    } catch (error) {
      // toast.error("Error fetching invoice details.");
    }
  };

  const handleSubmit = async () => {
    if (shiftResult) {
      toast.warning(shiftMessage);
      return;
    }
    if (!customer) {
      toast.error("Please Select Customer.");
      return;
    }

    if (!selectedInvoice || !selectedInvoice.documentNo) {
      toast.error("Please select an invoice.");
      return;
    }

    if (isNaN(returnAmount) || returnAmount <= 0) {
      toast.error("Return Amount must be a positive number.");
      return;
    }

    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select at least one item to return.");
      return;
    }
    //returnQuantity <= 0
    const invalidReturnQuantityRows = selectedRows.filter(
      (row, index) => checkedRows[index] && row.returnQuantity <= 0
    );
    if (invalidReturnQuantityRows.length > 0) {
      toast.error("Return quantity must be greater than 0 for all selected items.");
      return;
    }
    //returnAmount <= 0
    const invalidReturnAmountRows = selectedRows.filter(
      (row, index) => checkedRows[index] && row.returnAmount <= 0
    );

    if (invalidReturnAmountRows.length > 0) {
      toast.error("Return amount must be greater than 0 for all selected items.");
      return;
    }

    //grosstotal
    if (grossTotal <= 0) {
      toast.error("Total Price must be a positive number.");
      return;
    }

    const salesReturnData = {
      CustomerId: customer.id,
      CustomerName: customer.firstName,
      AddressLine1: address1,
      AddressLine2: address2,
      AddressLine3: address3,
      SalespersonId: salesPerson.id,
      SalespersonCode: salesPerson.code,
      SalespersonName: salesPerson.name,
      SalesReturnDate: invoiceDate,
      DocumentNo: invoiceNo,
      InvoiceId: selectedInvoice.id,
      InvoiceNo: selectedInvoice.documentNo,
      ReturnAmount: parseFloat(returnAmount),
      OutstandingAmount: parseFloat(grossTotal),
      TotalInvoiceAmount: selectedInvoice.grossTotal,
      FiscalPeriodId: 202501,
      SalesReturnLineDetails: selectedRows.map((row) => ({
        DocumentNo: invoiceNo,
        Reason: remark,
        ProductId: row.productId,
        ProductCode: row.productCode,
        ProductName: row.productName,
        InvoiceQuantity: row.qty,
        ReturnQuantity: row.returnQuantity,
        SoldUnitPrice: row.soldUnitPrice,
        ReturnAmount: row.returnAmount,
        FiscalPeriodId: 202501,
      })),
    };
    try {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/SalesReturn/CreateSalesReturn`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salesReturnData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        toast.error("Error: " + (errorResponse.message || "Please fill all required fields"));
        return;
      }

      const jsonResponse = await response.json();

      if (jsonResponse && jsonResponse.result) {
        toast.success("Sales Return Submitted Successfully!");
        setTimeout(() => {
          window.location.href = "/sales/sales-return";
        }, 100);
      } else if (jsonResponse && jsonResponse.message) {

        toast.success(jsonResponse.message);
        setTimeout(() => {
          window.location.href = "/sales/sales-return";
        }, 100);
      } else {
        toast.error("Unexpected response from the server");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while submitting the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchOutstandingAmount = async (customerId) => {
    if (!customerId) {
      toast.error("Customer ID is required.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/Outstanding/GetCustomerWiseTotalOutstandingAmount?customerId=${customerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse.result) {
          setOutstandingAmounts(jsonResponse.result || 0);
        } else {
          setOutstandingAmounts("");
        }
      } else {
        // toast.error("Failed to fetch outstanding amount.");
        setOutstandingAmounts("");
      }
    } catch (error) {
      console.error("Error fetching outstanding amount:", error);
      toast.error("Error fetching outstanding amount.");
      setOutstandingAmounts("");
    }
  };

  const fetchInvoicesForCustomer = async (customerId) => {
    if (!customerId) {
      toast.error("Customer ID is required.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/Outstanding/GetAllCustomerwiseOustandingsByIsSettled?customerId=${customerId}&isSettled=false`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.result && jsonResponse.result.length > 0) {
          setInvoicesForCustomer(
            jsonResponse.result.map((item) => ({
              invoiceId: item.invoiceId,
              invoiceNumber: item.invoiceNumber,
              totalInvoiceAmount: item.totalInvoiceAmount,
            }))
          );
        }
      } else {
        // toast.error("Failed to fetch invoices.");
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Error fetching invoices.");
    }
  };


  const calculateReturnAmount = (index, returnQuantity) => {
    const updatedRows = [...selectedRows];
    const row = updatedRows[index];
    row.returnQuantity = returnQuantity;
    row.returnAmount = returnQuantity * row.unitPrice;
    row.totalPrice = row.qty * row.unitPrice;
    setSelectedRows(updatedRows);

    const newGrossTotal = updatedRows.reduce((total, row) => total + (row.returnAmount || 0), 0);
    setGrossTotal(newGrossTotal);
  };

  useEffect(() => {
    if (customerId) {
      fetchInvoicesForCustomer(customerId);
    } else {
      setInvoicesForCustomer([]);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId && invoiceFocused) {
      fetchInvoicesForCustomer(customerId);
    }
  }, [invoiceFocused, customerId]);

  const handleInvoiceFocus = () => {
    setInvoiceFocused(true);
  };

  const handleInvoiceBlur = () => {
    setInvoiceFocused(false);
  };

  const handleCheckboxChange = (index) => {
    setCheckedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    setReturnAmount(grossTotal);
  }, [grossTotal]);

  useEffect(() => {
    if (customerList) {
      setCustomers(customerList);
    }
  }, [invoiceNo, customerList]);

  return (
    <>
      <ToastContainer />
      <div className={styles.pageTitle}>
        <h1>Sales Return</h1>
        <ul>
          <li>
            <Link href="/sales/sales-return">Sales Return</Link>
          </li>
          <li>Sales Return Create</li>
        </ul>
      </div>

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} sx={{ background: "#fff" }}>
          <Grid container p={1}>
            <Grid item xs={12} gap={2} display="flex" justifyContent="end" mb={1}>
              <Button variant="outlined" onClick={() => navigateToBack()}>
                <Typography sx={{ fontWeight: "bold" }}>Go Back</Typography>
              </Button>
            </Grid>

            <Grid item xs={12} lg={6} display="flex" flexDirection="column">
              <Grid item xs={12} display="flex" justifyContent="space-between" mt={0} mb={1}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: "500",
                    p: 1,
                    fontSize: "14px",
                    display: "block",
                    width: "35%",
                  }}
                >
                  Customer Name
                </Typography>
                <Autocomplete
                  sx={{ width: "60%" }}
                  options={customers}
                  getOptionLabel={(option) => option.firstName || ""}
                  value={customer}
                  onChange={(event, newValue) => {
                    setCustomer(newValue);
                    setCustomerId(newValue?.id || null);
                    setInvoice("");
                    setAddress1("");
                    setAddress2("");
                    setAddress3("");
                    setAddress4("");
                    setOutstandingAmounts("");
                    setInvoicesForCustomer([]);
                    setSelectedInvoice(null);
                    setRemark("");

                    if (newValue) {
                      setAddress1(newValue.addressLine1 || "");
                      setAddress2(newValue.addressLine2 || "");
                      setAddress3(newValue.addressLine3 || "");
                      fetchOutstandingAmount(newValue.id);
                    } else {
                      setAddress1("");
                      setAddress2("");
                      setAddress3("");
                      setOutstandingAmounts("");
                      setInvoicesForCustomer([]);
                    }
                  }}
                  renderInput={(params) => (

                    <TextField {...params} size="small" fullWidth placeholder="Customer Name" />
                  )}
                />
              </Grid>

              <Grid item xs={12} display="flex" flexDirection="column" mt={0} mb={1}>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: "500",
                      p: 1,
                      fontSize: "14px",
                      display: "block",
                      width: "35%",
                    }}
                  >
                    Address
                  </Typography>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    fullWidth
                    placeholder="Address Line 1"
                    value={address1}
                    disabled

                  />
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="end" mt={1}>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    fullWidth
                    placeholder="Address Line 2"
                    value={address2}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end" mt={1}>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    fullWidth
                    placeholder="Address Line 3"
                    value={address3}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end" mt={1}>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    fullWidth
                    placeholder="Address Line 4"
                    value={address4}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between" mt={0} mb={1}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: "500",
                    p: 1,
                    fontSize: "14px",
                    display: "block",
                    width: "35%",
                  }}
                >
                  Remark
                </Typography>
                <TextField
                  sx={{ width: "60%" }}
                  size="small"
                  fullWidth
                  value={remark}
                  placeholder="Remark"
                  onChange={(e) => setRemark(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between" mt={0} mb={1}>
                <Typography
                  component="label"
                  sx={{
                    fontWeight: "500",
                    p: 1,
                    fontSize: "14px",
                    display: "block",
                    width: "35%",
                  }}
                >
                  Invoice
                </Typography>
                <Autocomplete
                  sx={{ width: "60%" }}
                  options={filteredInvoices}
                  getOptionLabel={(option) => option.documentNo || ""}
                  isLoading={isLoading}
                  onInputChange={(event, newInputValue) => {
                    setSearchQuery(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      placeholder="Search Invoice"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2">
                        {option.documentNo} / {option.grossTotal}
                      </Typography>
                    </li>
                  )}
                  onChange={(event, newValue) => {
                    setSelectedInvoice(newValue);
                    if (newValue && newValue.documentNo) {
                      fetchInvoiceDetails(newValue.documentNo);
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} lg={6} display="flex" flexDirection="column">
              <Grid container>
                <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mt={0} mb={1}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: "500",
                      p: 1,
                      fontSize: "14px",
                      display: "block",
                      width: "35%",
                    }}
                  >
                    Salesperson
                  </Typography>
                  <Autocomplete
                    sx={{ width: "60%" }}
                    options={salesPersonList || []}
                    getOptionLabel={(option) => option.name || ""}
                    value={salesPerson}
                    onChange={(event, newValue) => {
                      setSalesPerson(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        placeholder="Salesperson"
                        error={salesPersonError}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="space-between" mt={0} mb={1}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: "500",
                      p: 1,
                      fontSize: "14px",
                      display: "block",
                      width: "35%",
                    }}
                  >
                    Sales Return Date
                  </Typography>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    type="date"
                    fullWidth
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="space-between" mt={0} mb={1}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: "500",
                      p: 1,
                      fontSize: "14px",
                      display: "block",
                      width: "35%",
                    }}
                  >
                    Return Amount
                  </Typography>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    fullWidth
                    value={returnAmount}
                    placeholder="Return Amount"
                    onChange={(e) => setReturnAmount(e.target.value)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mt={0} mb={1}>
                  <Typography
                    component="label"
                    sx={{
                      fontWeight: "500",
                      p: 1,
                      fontSize: "14px",
                      display: "block",
                      width: "35%",
                    }}
                  >
                    Total Invoice Amount
                  </Typography>
                  <TextField
                    sx={{ width: "60%" }}
                    size="small"
                    fullWidth
                    value={selectedInvoice ? `${selectedInvoice.grossTotal}` : ""}
                    placeholder="Total Invoice Amount"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} mt={3}>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="simple table" className="dark-table">
                  <TableHead>
                    <TableRow sx={{ background: "#757fef" }}>
                      <TableCell sx={{ color: "#fff" }} align="right"></TableCell>
                      <TableCell sx={{ color: "#fff" }}>#</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Product&nbsp;Code</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Product&nbsp;Name</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Invoice&nbsp;Quantity</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Return&nbsp;Quantity</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Sold&nbsp;Unit&nbsp;Price</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Total&nbsp;Price</TableCell>
                      <TableCell sx={{ color: "#fff" }}>Return&nbsp;Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ p: 1 }}>
                          <Checkbox
                            checked={checkedRows[index] || false}
                            onChange={() => handleCheckboxChange(index)}
                            aria-label="select row"
                            disabled={row.itemType != 1}
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>{index + 1}</TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            type="text"
                            sx={{ width: "150px" }}
                            fullWidth
                            value={row.productCode}
                            disabled
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            type="text"
                            sx={{ width: "150px" }}
                            fullWidth
                            value={row.productName}
                            disabled
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            sx={{ width: "150px" }}
                            size="small"
                            type="text"
                            fullWidth
                            name=""
                            value={row.qty}
                            disabled
                          />
                        </TableCell>

                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            sx={{ width: "150px" }}
                            size="small"
                            type="number"
                            fullWidth
                            name=""
                            value={row.returnQuantity}
                            disabled={!checkedRows[index]}
                            onChange={(e) => {
                              const returnQuantity = parseFloat(e.target.value) || 0;
                              if (returnQuantity > row.qty) {
                                toast.error("Return quantity cannot be greater than invoice quantity.");
                                return;
                              }
                              calculateReturnAmount(index, returnQuantity);
                            }}
                            inputProps={{
                              max: row.qty,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            fullWidth
                            name=""
                            sx={{ width: "150px" }}
                            value={row.unitPrice}
                            disabled
                          />
                        </TableCell>

                        <TableCell align="right" sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            fullWidth
                            name="totalPrice"
                            sx={{ width: "150px" }}
                            value={(row.qty * row.unitPrice).toFixed(2)}
                            disabled
                          />
                        </TableCell>

                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            fullWidth
                            name=""
                            sx={{ width: "150px" }}
                            value={row.returnAmount}
                            disabled
                          />
                        </TableCell>


                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell align="right" colSpan="8">
                        <Typography fontWeight="bold">Total</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ p: 1 }}>
                        {grossTotal}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} my={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <LoadingButton
                loading={isSubmitting}
                handleSubmit={() => handleSubmit()}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Salesreturn;