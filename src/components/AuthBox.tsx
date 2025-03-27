// AuthBox.tsx
import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import "./AuthBox.css";

const AuthBox = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setFormValues({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", formValues);

    // 🧪 FOR NOW: Navigate on "Sign In" click
    if (tab === 0) {
      navigate("/home");
    }
  };

  return (
    <Box className="auth-container">
      <Paper className="auth-paper">
        <Box className="auth-header">
          <Typography variant="h6">Welcome to LostAndFound</Typography>
        </Box>

        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        <Box component="form" className="auth-form" onSubmit={handleSubmit}>
          {tab === 0 ? (
            <TextField
              label="Username or Email"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          ) : (
            <>
              <TextField
                label="Username"
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </>
          )}

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          {tab === 1 && (
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="auth-submit"
          >
            {tab === 0 ? "Sign In" : "Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthBox;
