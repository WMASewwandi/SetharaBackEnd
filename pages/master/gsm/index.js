import React, { useEffect, useState } from "react";
import styles from "@/styles/PageTitle.module.css";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import AddGSM from "@/components/UIElements/Modal/AddGSM";
import { ToastContainer } from "react-toastify";
import BASE_URL from "Base/api";
import EditGSM from "@/components/UIElements/Modal/EditGSM";
import DeleteConfirmationById from "@/components/UIElements/Modal/DeleteConfirmationById";
import { formatDate } from "@/components/utils/formatHelper";
import AccessDenied from "@/components/UIElements/Permission/AccessDenied";
import IsPermissionEnabled from "@/components/utils/IsPermissionEnabled";

export default function GSM() {
  const [gsmList, setGSMList] = useState([]);
  const controller = "GSM/DeleteGSM";
  const cId = sessionStorage.getItem("category")
  const { navigate, create, update, remove, print } = IsPermissionEnabled(cId);

  const fetchGSMList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/GSM/GetAllGSM`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch GSM List");
      }

      const data = await response.json();
      setGSMList(data.result);
    } catch (error) {
      console.error("Error fetching GSM List:", error);
    }
  };

  useEffect(() => {
    fetchGSMList();
  }, []);

  if (!navigate) {
    return <AccessDenied />;
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.pageTitle}>
        <h1>GSM</h1>
        <ul>
          <li>
            <Link href="/">Master</Link>
          </li>
          <li>GSM</li>
        </ul>
      </div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} mb={2} display="flex" justifyContent="end">
          {create ? <AddGSM fetchItems={fetchGSMList} /> : ""}
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" className="dark-table">
              <TableHead>
                <TableRow sx={{ background: "#757fef" }}>
                  <TableCell sx={{ color: "#fff" }}>GSM Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Created On</TableCell>
                  <TableCell sx={{ color: "#fff" }} align="right">
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }} align="right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gsmList.length === 0 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={3} component="th" scope="row">
                      <Typography color="error">No GSM Available</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  gsmList.map((gsm, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {gsm.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {formatDate(gsm.createdOn)}
                      </TableCell>
                      <TableCell align="right">
                        {gsm.isActive == true ? (
                          <span className="successBadge">Active</span>
                        ) : (
                          <span className="dangerBadge">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {update ? <EditGSM fetchItems={fetchGSMList} item={gsm} /> : ""}
                        {remove ? <DeleteConfirmationById id={gsm.id} controller={controller} fetchItems={fetchGSMList} /> : ""}
                      </TableCell>
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
}
