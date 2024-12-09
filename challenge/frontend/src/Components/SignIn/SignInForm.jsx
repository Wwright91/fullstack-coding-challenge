import React, { useState } from "react";
import axios from "axios";
import "./SignInForm.scss";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { createTheme } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 650,
  width: 500,
  bgcolor: "background.paper",
  border: "10px solid #000",
  boxShadow: 24,
  p: 2,
  display: "grid",
  alignItems: "center",
};

const URL = "http://localhost:8000";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const TOKENEXPIRATION = 1 / 48;

  const fetchToken = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${URL}/login/`, {
      ...user,
    });

    const token = await res.data.token;
    Cookies.set("token", token, {
      expires: TOKENEXPIRATION,
    });

    navigate("/dashboard");
  };

  const theme = createTheme({
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

  return (
    <AppProvider theme={theme}>
      <div style={style}>
        <Box
          component="form"
          onSubmit={fetchToken}
          sx={{
            "& .MuiTextField-root": { my: 1, width: "30ch" },
          }}
          noValidate
          autoComplete="on"
          display="grid"
          justifyContent="center"
        >
          <Typography
            className="SignInModal__title"
            id="modal-modal-title"
            variant="h4"
            component="h2"
            align="center"
          >
            Council Member Login
          </Typography>
          <br />
          <div className="SignInForm__Input">
            <TextField
              id="username"
              label="Username"
              name="username"
              variant="outlined"
              required
              onChange={(e) => handleTextChange(e)}
              value={user.username}
              placeholder="Username"
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              required
              placeholder="Password"
              onChange={(e) => handleTextChange(e)}
              value={user.password}
              autoComplete="true"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className="SignInForm__Buttons">
            <Button
              variant="contained"
              sx={{ width: 110, padding: 1, margin: 2 }}
              type="submit"
            >
              Login
            </Button>
          </div>
        </Box>
      </div>
    </AppProvider>
  );
};

export default SignInForm;
