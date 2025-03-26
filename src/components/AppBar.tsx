import React from "react";
import "./AppBar.css"; // 🔗 חשוב לייבא את קובץ ה-CSS
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const ResponsiveAppBar = () => {
  return (
    <AppBar position="static" className="app-bar">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className="app-title" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>

        <Button className="nav-button">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;
