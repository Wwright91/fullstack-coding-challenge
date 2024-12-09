import React from "react";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const SignOut = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      <Button variant="contained" onClick={handleLogout}>
        Log Out
      </Button>
      <ThemeSwitcher />
    </div>
  );
};

export default SignOut;
