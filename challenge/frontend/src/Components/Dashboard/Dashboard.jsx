import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";
import Cookies from "js-cookie";

import AllComplaints from "../Complaints/AllComplaints";

const URL = process.env.REACT_APP_API_URL;

const NAVIGATION = [
  {
    kind: "header",
    title: "Welcome Back User",
  },
  {
    segment: "all complaints",
    title: "All Complaints",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "open complaints",
        title: "Open Complaints",
        icon: <DescriptionIcon />,
      },
      {
        segment: "closed complaints",
        title: "Closed Complaints",
        icon: <DescriptionIcon />,
      },
    ],
  },
];

const style = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const Dashboard = () => {
  const [allComplaints, setAllComplaints] = useState([]);

  const getComplaints = async () => {
    const token = Cookies.get("token");

    try {
      const res = await axios.get(`${URL}/api/complaints/allComplaints/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      console.log("user dist complaints", res.data);
      setAllComplaints(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={style}
      branding={{
        logo: <BusinessIcon fontSize="large" />,
        title: "NYC Complaints",
      }}
    >
      <DashboardLayout>
        <Box
          sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <AllComplaints complaints={allComplaints} />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;
