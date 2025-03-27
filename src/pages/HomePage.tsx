import React from "react";
import "./HomePage.css";
import { Container, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const HomePage: React.FC = () => {
  return (
    <Container className="homepage">
      <div className="homepage-header">
        <LocationOnIcon fontSize="large" />
        <Typography variant="h4" className="homepage-title">
          Lost & Found Board
        </Typography>
      </div>

      <Typography variant="subtitle1" className="homepage-subtitle">
        Report lost or found items to help the community
      </Typography>
    </Container>
  );
};

export default HomePage;
