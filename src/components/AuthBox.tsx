// ✅ AuthBox.tsx - עם Google Login Custom
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { registerUser, loginUser, googleSignIn } from "../services/user_api";

const AuthBox = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleModeChange = (_: React.SyntheticEvent, newValue: number) => {
    setMode(newValue === 0 ? "login" : "register");
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        alert("Registration successful!");
        setMode("login");
      } catch (err: any) {
        alert(err.response?.data || "Registration failed.");
      }
    }

    if (mode === "login") {
      try {
        const res = (await loginUser({
          emailOrUsername: formData.username,
          password: formData.password,
        })) as { accessToken: string; refreshToken: string; username: string };
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("username", res.username);
        navigate("/home");
      } catch (err: any) {
        alert(err.response?.data || "Login failed.");
      }
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    console.log("✅ Google credential response:", credentialResponse); // ⭐️ הדפסת credentials

    if (!credentialResponse.credential) return;
    try {
      const token = credentialResponse.credential;
      const decoded: any = jwtDecode(token);

      console.log("🔍 Decoded token:", decoded); // ⭐️ הדפסת הטוקן המפורש

      localStorage.setItem("username", decoded.name || decoded.email);
      localStorage.setItem("imageUrl", decoded.picture);

      const res = (await googleSignIn(token)) as {
        accessToken: string;
        refreshToken: string;
      };

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      navigate("/home");
    } catch (err) {
      alert("Google Sign-In failed.");
      console.error("Google Sign-In error:", err);
    }
  };

  return (
    <Box className="auth-container">
      <Paper className="auth-paper">
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Welcome to LostAndFound
        </Typography>

        <Tabs
          value={mode === "login" ? 0 : 1}
          onChange={handleModeChange}
          centered
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          {mode === "register" && (
            <>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </>
          )}

          {mode === "login" && (
            <TextField
              label="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          )}

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {mode === "register" && (
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            {mode === "login" ? "Login" : "Register"}
          </Button>

          <Box mt={2}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthBox;
