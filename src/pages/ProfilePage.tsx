import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedImage = localStorage.getItem("imageUrl") || "";

    setUsername(storedUsername);
    setEmail(storedEmail);
    setImageUrl(storedImage);
  }, []);

  const handleUpdate = () => {
    // later implementation for updating profile
    alert("Update functionality not implemented yet.");
  };

  return (
    <Box className="profile-page">
      <Paper className="profile-container" elevation={3}>
        <Typography variant="h5" gutterBottom>
          פרופיל משתמש
        </Typography>

        <Box className="profile-avatar-section">
          <Avatar
            src={imageUrl || "/default-avatar.png"}
            alt={username}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        </Box>

        <TextField
          fullWidth
          label="שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          disabled
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdate}
          sx={{ mt: 2 }}
        >
          עדכן פרופיל
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
