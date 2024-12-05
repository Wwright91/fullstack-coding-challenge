import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
// import BusinessIcon from "@mui/icons-material/Business";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import Cookies from "js-cookie";

import AllComplaints from "../Complaints/AllComplaints";

const URL = process.env.REACT_APP_API_URL;

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
  const [openComplaints, setOpenComplaints] = useState([]);
  const [closedComplaints, setClosedComplaints] = useState([]);
  const [topComplaints, setTopComplaints] = useState([]);
  const [user, setUser] = useState([])

  const getComplaints = async () => {
    const token = Cookies.get("token");
  
    const token_config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      }
    }

    try {
      const [allUserDistComlaints, openUserDistComplaints, closedUserDistComplaints, topUserDistComplaints] = await axios.all([
        axios.get(`${URL}/api/complaints/allComplaints/`, token_config),
        axios.get(`${URL}/api/complaints/openCases/`, token_config),
        axios.get(`${URL}/api/complaints/closedCases/`, token_config),
        axios.get(`${URL}/api/complaints/topComplaints/`, token_config)
      ]);

      console.log("user dist complaints", allUserDistComlaints.data, openUserDistComplaints.data, closedUserDistComplaints.data, topUserDistComplaints.data);
      setAllComplaints(allUserDistComlaints.data.complaints);
      setOpenComplaints(openUserDistComplaints.data)
      setClosedComplaints(closedUserDistComplaints.data)
      setTopComplaints(topUserDistComplaints.data)
      setUser(allUserDistComlaints.data.user)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  const USERNAME = (user) => {
    if(!user?.full_name){
      return "Guest"
    }

    const splitName = user?.full_name.split(" ")
    const lastInital = splitName[1].slice(0, 1).toUpperCase()

    return `${splitName[0]} ${lastInital}.`
  }

  const NAVIGATION = [
    {
      kind: "header",
      title: (
        <>
        {user ? `Welcome Back, ${USERNAME(user)}!` : "Welcome Back!"}
          <Avatar fontSize="small" alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiXyhGeNRn3bbgY63dhF75dQzv5aFcgyvSzrlnR7SZrtyBmxgYs6aDQcEUq2jC20my1bk&usqp=CAU" />
        </>
      ),
    },
    {
      segment: "all complaints",
      title: "All Complaints",
      icon: <BarChartIcon />,
      children: [
        {
          segment: "open complaints",
          title: (
            <>
              Open Complaints
  
              <Badge sx={{ left: "20px" }} badgeContent={openComplaints.length} color="success" />
            </>
          ),
          icon: <DescriptionIcon />,
        },
        {
          segment: "closed complaints",
          title: (
            <>
              Closed Complaints
  
              <Badge sx={{ left: "20px" }} badgeContent={closedComplaints.length} color="error" />
            </>
          ),
          icon: <DescriptionIcon />,
        },
      ],
    },
  ];
  
  const logoSrc = user.party === "Democrat"
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiXyhGeNRn3bbgY63dhF75dQzv5aFcgyvSzrlnR7SZrtyBmxgYs6aDQcEUq2jC20my1bk&usqp=CAU"
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKibgnDq5LPiOUcZKir40bmtFOTyuylriVBw&s";

  const altText = `${user.party} logo`;

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={style}
      branding={{
        logo: <img src={logoSrc} alt={altText} style={{borderRadius:"50%"}} />,
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
