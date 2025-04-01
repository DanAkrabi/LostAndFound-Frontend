import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { updateUser } from "../services/user_api";
import Post from "../components/Post";
import "./ProfilePage.css";
import "./HomePage.css";
import { uploadProfileImage } from "../services/file_api";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../services/post_api";
import { usePaging } from "../useHooks/usePaging";

const PAGE_SIZE = 6;
// const API_URL = "http://localhost:3000";

const API_URL = " https://node23.cs.colman.ac.il";

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [formUsername, setFormUsername] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formProfileImage, setFormProfileImage] = useState<string>("");

  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedImage = localStorage.getItem("profileImage") || "";

    setUsername(storedUsername);
    setEmail(storedEmail);
    setProfileImage(storedImage);

    setFormUsername(storedUsername);
    setFormEmail(storedEmail);
    setFormProfileImage(storedImage);
  }, []);

  const {
    items: userPosts,
    lastElementRef,
    isValidating,
  } = usePaging(
    (page) =>
      `${API_URL}/Posts?sender=${username}&page=${page}&limit=${PAGE_SIZE}&refresh=${refreshKey}`,
    fetcher,
    (page) => page.posts,
    PAGE_SIZE
  );

  const handleLogout = () => {
    localStorage.clear();
    alert("התנתקת בהצלחה");
    navigate("/");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadProfileImage(file);
      setFormProfileImage(uploadedUrl);
    } catch (err) {
      console.error("שגיאה בהעלאת תמונה:", err);
      alert("העלאת התמונה נכשלה");
    }
  };

  const handleUpdate = async () => {
    const userId = localStorage.getItem("userId");
    const oldUsername = localStorage.getItem("username");
    const oldEmail = localStorage.getItem("email");
    const oldImagePath = localStorage.getItem("profileImage");

    if (!userId) {
      alert("משתמש לא מזוהה");
      return;
    }

    const updates: {
      username?: string;
      email?: string;
      profileImage?: string;
    } = {};

    if (formUsername !== oldUsername) updates.username = formUsername;
    if (formEmail !== oldEmail) updates.email = formEmail;
    if (formProfileImage !== oldImagePath)
      updates.profileImage = formProfileImage;

    if (Object.keys(updates).length === 0) {
      alert("לא בוצעו שינויים בפרופיל");
      return;
    }

    try {
      const updatedUser = (await updateUser(userId, updates)) as {
        username: string;
        email: string;
        profileImage: string;
      };

      // עדכון בלוקל סטורג'
      if (updates.username) {
        localStorage.setItem("username", updatedUser.username);
        setUsername(updatedUser.username);
      }
      if (updates.email) {
        localStorage.setItem("email", updatedUser.email);
        setEmail(updatedUser.email);
      }
      if (updates.profileImage) {
        localStorage.setItem("profileImage", updatedUser.profileImage);
        setProfileImage(updatedUser.profileImage);
      }

      // סגירת הדיאלוג וריענון רשימת הפוסטים
      setEditDialogOpen(false);
      setRefreshKey((prev) => prev + 1);

      alert("הפרופיל עודכן בהצלחה!");
    } catch (error) {
      console.error("שגיאה בעדכון פרופיל:", error);
      alert("אירעה שגיאה בעדכון הפרופיל.");
    }
  };

  return (
    <Box className="profile-page">
      <Paper className="profile-container" elevation={3}>
        <Box className="top-actions">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setEditDialogOpen(true)}
          >
            ערוך פרופיל
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleLogout}
          >
            התנתק
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src={profileImage || "/default-avatar.png"}
            alt={username}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #ff4081",
              margin: "0 auto",
            }}
          />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Box>

        {isValidating && userPosts.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : userPosts.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>
              הפוסטים שלי
            </Typography>
            <Box className="instagram-grid">
              {userPosts.map((post, idx) => {
                const isLast = idx === userPosts.length - 1;
                return (
                  <Box
                    key={post._id}
                    className="instagram-post-wrapper"
                    ref={isLast ? lastElementRef : null}
                  >
                    <Post
                      {...post}
                      imagePath={post.imagePath || ""}
                      onClick={() => navigate(`/post/${post._id}`)}
                    />
                  </Box>
                );
              })}
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 4 }}>
            אין לך פוסטים כרגע.
          </Typography>
        )}
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>עריכת פרופיל</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={formProfileImage || "/default-avatar.png"}
              alt={formUsername}
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                mb: 2,
              }}
            />
            <input
              accept="image/*"
              id="upload-photo"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="upload-photo">
              <IconButton component="span" color="primary">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <TextField
            fullWidth
            label="שם משתמש"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="אימייל"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
          <Button variant="contained" onClick={handleUpdate}>
            שמור שינויים
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
