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
import AddComposition from "@/components/UIElements/Modal/AddComposition";
import BASE_URL from "Base/api";
import { ToastContainer } from "react-toastify";
import { Typography } from "@mui/material";
import DeleteConfirmationById from "@/components/UIElements/Modal/DeleteConfirmationById";
import EditComposition from "@/components/UIElements/Modal/EditComposition";
import IsPermissionEnabled from "@/components/utils/IsPermissionEnabled";
import AccessDenied from "@/components/UIElements/Permission/AccessDenied";
import { formatDate } from "@/components/utils/formatHelper";

export default function Composition() {
  const cId = sessionStorage.getItem("category")
  const { navigate, create, update, remove, print } = IsPermissionEnabled(cId);
  const [compositionList, setCompositionList] = useState([]);
  const controller = "Composition/DeleteComposition";

  const fetchCompositionList = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Composition/GetAllComposition`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Composition List");
      }

      const data = await response.json();
      setCompositionList(data.result);
    } catch (error) {
      console.error("Error fetching Composition List:", error);
    }
  };

  useEffect(() => {
    fetchCompositionList();
  }, []);

  if (!navigate) {
    return <AccessDenied />;
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.pageTitle}>
        <h1>Composition</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Composition</li>
        </ul>
      </div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} mb={2} display="flex" justifyContent="end">
          {create ? <AddComposition fetchItems={fetchCompositionList} /> : ""}
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" className="dark-table">
              <TableHead>
                <TableRow sx={{ background: "#757fef" }}>
                  <TableCell sx={{ color: "#fff" }}>Composition Name</TableCell>
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
                {compositionList.length === 0 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={3} component="th" scope="row">
                      <Typography color="error">
                        No Compositions Available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  compositionList.map((composition, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {composition.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {formatDate(composition.createdOn)}
                      </TableCell>
                      <TableCell align="right">
                        {composition.isActive == true ? (
                          <span className="successBadge">Active</span>
                        ) : (
                          <span className="dangerBadge">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {update ? <EditComposition
                          fetchItems={fetchCompositionList}
                          item={composition}
                        /> : ""}
                        {remove ? <DeleteConfirmationById id={composition.id} controller={controller} fetchItems={fetchCompositionList} /> : ""}
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
