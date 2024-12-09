import React, { useState, useEffect } from "react";
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import BusinessIcon from "@mui/icons-material/Business";
import Badge from "@mui/material/Badge";
import axios from "axios";
import Cookies from "js-cookie";

import ComplaintsTable from "../ComplaintsTable/ComplaintsTable";
import { Button } from "@mui/material";

const URL = "http://localhost:8000";

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
  const [activeDataset, setActiveDataset] = useState(allComplaints);
  const [closedComplaints, setClosedComplaints] = useState([]);
  const [complaintType, setComplaintType] = useState(null);
  const [constituentComplaints, setConstituentComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [openComplaints, setOpenComplaints] = useState([]);
  const [topComplaints, setTopComplaints] = useState([]);
  const [user, setUser] = useState([]);

  const navigate = useNavigate();
  const routeParams = useParams();

  const datasets = [
    {
      id: "allComplaints",
      label: `All Complaints In District ${user?.formatted_district}`,
      data: allComplaints,
    },
    {
      id: "constituentComplaints",
      label: "Complaints By My Constituents",
      data: constituentComplaints,
    },
    {
      id: "openCases",
      label: "Open Cases",
      data: openComplaints,
    },
    {
      id: "closedCases",
      label: "Closed Cases",
      data: closedComplaints,
    },
  ];

  const getComplaints = async () => {
    const token = Cookies.get("token");

    const token_config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    const topComplaintsUrl = complaintType
      ? `${URL}/api/complaints/topComplaints/?complaint_type=${complaintType}`
      : `${URL}/api/complaints/topComplaints/`;

    try {
      const [
        allUserDistComlaints,
        openUserDistComplaints,
        closedUserDistComplaints,
        topUserDistComplaints,
        userConstituentsComplaints,
      ] = await axios.all([
        axios.get(`${URL}/api/complaints/allComplaints/`, token_config),
        axios.get(`${URL}/api/complaints/openCases/`, token_config),
        axios.get(`${URL}/api/complaints/closedCases/`, token_config),
        axios.get(topComplaintsUrl, token_config),
        axios.get(
          `${URL}/api/complaints/constituentsComplaints/`,
          token_config
        ),
      ]);

      setAllComplaints(allUserDistComlaints.data.complaints);
      setActiveDataset(allUserDistComlaints.data.complaints);
      setOpenComplaints(openUserDistComplaints.data);
      setClosedComplaints(closedUserDistComplaints.data);
      complaintType &&
        setFilteredComplaints(topUserDistComplaints.data.complaint_details);
      setTopComplaints(topUserDistComplaints.data.top_complaints);
      setConstituentComplaints(userConstituentsComplaints.data);
      setUser(allUserDistComlaints.data.user);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (routeParams["*"] === "") {
      setActiveDataset(allComplaints);
    }
  }, [routeParams, allComplaints]);

  useEffect(() => {
    const fetchComplaints = async () => {
      await getComplaints();
    };

    fetchComplaints();
  }, [complaintType]);

  const USERNAME = (user) => {
    if (!user?.full_name) {
      return "Guest";
    }

    const splitName = user?.full_name.split(" ");
    const lastInital = splitName[1].slice(0, 1).toUpperCase();

    return `${splitName[0]} ${lastInital}.`;
  };

  const NAVIGATION = [
    {
      kind: "header",
      title: <>{user ? `Welcome Back, ${USERNAME(user)}!` : "Welcome Back!"}</>,
    },
    {
      segment: "allComplaints",
      title: "All Complaints",
      icon: <BarChartIcon />,
    },
    {
      segment: "openCases",
      title: (
        <>
          Open Complaints
          <Badge
            sx={{ left: "20px" }}
            badgeContent={openComplaints.length}
            color="success"
            showZero
          />
        </>
      ),
      icon: <DescriptionIcon />,
    },
    {
      segment: "closedCases",
      title: (
        <>
          Closed Complaints
          <Badge
            sx={{ left: "20px" }}
            badgeContent={closedComplaints.length}
            color="error"
            showZero
          />
        </>
      ),
      icon: <DescriptionIcon />,
    },
    {
      segment: "constituentComplaints",
      title: "Complaints By My Constituents",
      icon: <BusinessIcon />,
    },
    { kind: "divider" },
    {
      segment: "topComplaints",
      title: "Top 3 Complaints",
      children: topComplaints.map(({ complaint_type, count }) => ({
        title: (
          <div
            key={complaint_type}
            onClick={() => handleComplaintTypeChange(complaint_type)}
            style={{ cursor: "pointer" }}
          >
            {complaint_type}
            <Badge
              sx={{ left: "20px" }}
              badgeContent={count}
              color="warning"
              showZero
            />
          </div>
        ),
        segment: `?complaint_type=${complaint_type}`,
      })),
    },
  ];

  const logoSrc =
    user.party === "Democrat"
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiXyhGeNRn3bbgY63dhF75dQzv5aFcgyvSzrlnR7SZrtyBmxgYs6aDQcEUq2jC20my1bk&usqp=CAU"
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKibgnDq5LPiOUcZKir40bmtFOTyuylriVBw&s";

  const altText = `${user.party} logo`;

  const router = {
    navigate: (path) => {
      if (path === "/topComplaints/") {
        navigate(`/dashboard/topComplaints${window.location.search}`);
      } else {
        navigate(`/dashboard${path}`);
      }
    },
    pathname: window.location.pathname,
    searchParams: new URLSearchParams(window.location.search),
  };

  const handleComplaintTypeChange = (type) => {
    setComplaintType(type);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("complaint_type", type);

    navigate(`/dashboard/topComplaints?${searchParams}`);
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={style}
      branding={{
        logo: (
          <img src={logoSrc} alt={altText} style={{ borderRadius: "50%" }} />
        ),
        title: "NYC Complaints",
      }}
      router={router}
    >
      <DashboardLayout>
        <div style={{ marginBottom: "16px" }}>
          {datasets.map((dataset) => (
            <Button
              key={dataset.id}
              variant="contained"
              onClick={() => {
                setActiveDataset(dataset.data);
                navigate(`/dashboard/${dataset.id}`);
              }}
              style={{ marginRight: "8px" }}
            >
              {dataset.label}
            </Button>
          ))}
        </div>
        <Routes>
          <Route
            path="/"
            element={<ComplaintsTable complaints={activeDataset} />}
          />
          <Route
            path="allComplaints"
            element={<ComplaintsTable complaints={allComplaints} />}
          />
          <Route
            path="openCases"
            element={<ComplaintsTable complaints={openComplaints} />}
          />
          <Route
            path="closedCases"
            element={<ComplaintsTable complaints={closedComplaints} />}
          />
          <Route
            path="topComplaints/*"
            element={<ComplaintsTable complaints={filteredComplaints} />}
          ></Route>
          <Route
            path="constituentComplaints"
            element={<ComplaintsTable complaints={constituentComplaints} />}
          />
        </Routes>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;
