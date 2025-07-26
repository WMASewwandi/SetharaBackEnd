import { Typography } from "@mui/material";
import Link from "next/link";

import styles from "@/styles/PageTitle.module.css";

export const DashboardSummaryHeader = (props) => {
  return (
    <div className={styles.pageTitle}>
      <Typography color="primary" variant="h6">
        {props.customerName} - {props.inquiryDetails} - {props.window} -{" "}
        {props.optionName}
      </Typography>
      <ul>
        <li>
          <Link href={props.href}>{props.link}</Link>
        </li>
        <li>{props.title}</li>
      </ul>
    </div>
  );
};
