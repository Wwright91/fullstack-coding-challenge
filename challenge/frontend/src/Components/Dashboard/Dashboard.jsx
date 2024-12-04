import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import BusinessIcon from "@mui/icons-material/Business";

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
          <Typography>
            All Complaints In District "add user district"
          </Typography>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;
