import React, { useState } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "@/components/Authentication/Authentication.module.css";
import BASE_URL from "Base/api";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import "react-toastify/dist/ReactToastify.css";

const SignInForm = () => {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setShowError(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/User/SignIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      const responseData = await response.json();
      const token = responseData.result.accessToken;
      const user = responseData.result.email;
      const usertype = responseData.result.userType;
      const warehouse = responseData.result.warehouseId;
      const company = responseData.result.companyId;
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
      localStorage.setItem("userid", responseData.result.id);
      localStorage.setItem("name", responseData.result.firstName);
      localStorage.setItem("type", usertype);
      localStorage.setItem("warehouse", warehouse);
      localStorage.setItem("company", company);
      localStorage.setItem("role", responseData.result.userRole);
      router.push("/");
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="authenticationBox">
        <Box
          component="main"
          sx={{
            maxWidth: "510px",
            ml: "auto",
            mr: "auto",
            padding: "50px 0 100px",
          }}
        >
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Box>
              <Typography as="h1" fontSize="28px" fontWeight="700" mb="5px">
                Sign In{" "}
                <img
                  src="/images/favicon.png"
                  alt="favicon"
                  className={styles.favicon}
                />
              </Typography>

              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Box
                  sx={{
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                  }}
                  className="bg-black"
                >
                  <Grid container alignItems="center" spacing={2}>
                    {showError && (
                      <Grid item xs={12}>
                        <Typography
                          component="label"
                          color="error"
                          sx={{
                            fontWeight: "500",
                            fontSize: "12px",
                            mb: "10px",
                            display: "block",
                          }}
                        >
                          Please fill in all required fields.
                        </Typography>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Email
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Password
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox value="allowExtraEmails" color="primary" />
                      }
                      label="Remember me."
                    />
                  </Grid>

                  <Grid item xs={6} sm={6} textAlign="end">
                    <Link
                      href="/authentication/forgot-password"
                      className="primaryColor text-decoration-none"
                    >
                      Forgot your password?
                    </Link>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  // href="/"
                  sx={{
                    mt: 2,
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "16px",
                    padding: "12px 10px",
                    color: "#fff !important",
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default SignInForm;
