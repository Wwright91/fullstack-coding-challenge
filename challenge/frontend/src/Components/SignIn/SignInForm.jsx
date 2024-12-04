import React, { useState } from "react";
import "./SignInForm.scss";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 650,
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  display: "grid",
  alignItems: "center",
};

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });

  const handleTextChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div style={style}>
      <Box
        component="form"
        onSubmit={""}
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
          Login
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
  );
};

export default SignInForm;
