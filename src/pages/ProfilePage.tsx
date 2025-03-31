import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { getPostsBySender } from "../services/post_api";
import { updateUser } from "../services/user_api";
import Post from "../components/Post";
import { PostType } from "../@types/postTypes";
import "./ProfilePage.css";
import "./HomePage.css";

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

    if (username !== oldUsername) {
      updates.username = username;
    }

    if (email !== oldEmail) {
      updates.email = email;
    }

    if (profileImage !== oldImagePath) {
      updates.profileImage = profileImage;
    }

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

      // עדכון הלוקאל סטורג'
      if (updates.username)
        localStorage.setItem("username", updatedUser.username);
      if (updates.email) localStorage.setItem("email", updatedUser.email);
      if (updates.profileImage)
        localStorage.setItem("profileImage", updatedUser.profileImage);

      alert("הפרופיל עודכן בהצלחה!");
    } catch (error) {
      console.error("שגיאה בעדכון פרופיל:", error);
      alert("אירעה שגיאה בעדכון הפרופיל.");
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedImage = localStorage.getItem("profileImage") || "";

    setUsername(storedUsername);
    setEmail(storedEmail);
    setProfileImage(storedImage);

    if (storedUsername) {
      fetchUserPosts(storedUsername);
    }
  }, []);

  const fetchUserPosts = async (username: string) => {
    try {
      const posts = await getPostsBySender(username);
      if (Array.isArray(posts)) {
        setUserPosts(
          posts.map((post) => ({
            ...post,
            imagePath: post.imagePath ?? "",
            location: post.location ?? "לא צוינה מיקום",
          }))
        );
      } else {
        console.error("Expected posts to be an array, but got:", posts);
        setUserPosts([]);
      }
    } catch (error) {
      console.error("שגיאה בטעינת הפוסטים של המשתמש:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    localStorage.setItem("profileImage", previewUrl);
  };

  // const handleUpdate = async () => {
  //   const oldUsername = localStorage.getItem("username");
  //   if (!oldUsername) return;

  //   try {
  //     const updatedUser = await updateUser(oldUsername, username);
  //     localStorage.setItem("username", updatedUser.username);
  //     alert("הפרופיל עודכן בהצלחה!");
  //   } catch (error) {
  //     console.error("שגיאה בעדכון פרופיל:", error);
  //     alert("אירעה שגיאה בעדכון הפרופיל.");
  //   }
  // };

  return (
    <Box className="profile-page">
      <Paper className="profile-container" elevation={3}>
        <Typography variant="h5" gutterBottom>
          פרופיל משתמש
        </Typography>

        {/* Profile Image + Upload Button */}
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Avatar
            src={profileImage || "/default-avatar.png"}
            alt={username}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #ff4081", // צבע ורוד בסגנון אינסטגרם
              margin: "0 auto",
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
            <IconButton
              color="primary"
              component="span"
              sx={{
                position: "absolute",
                bottom: -10,
                right: -10,
                backgroundColor: "white",
                border: "1px solid lightgray",
              }}
            >
              <PhotoCamera />
            </IconButton>
          </label>
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : userPosts.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>
              הפוסטים שלי
            </Typography>
            {/* <Box className="homepage-posts" style={{ marginTop: "20px" }}>
              {userPosts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  profileImage={post.imagePath || ""}
                  onClick={() => console.log("נלחץ על הפוסט:", post._id)}
                />
              ))}
            </Box> */}
            <Box className="instagram-grid">
              {userPosts.map((post) => (
                <Box key={post._id} className="instagram-post-wrapper">
                  <Post
                    {...post}
                    imagePath={post.imagePath || ""}
                    onClick={() => console.log("נלחץ על הפוסט:", post._id)}
                  />
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ mt: 4 }}>
            אין לך פוסטים כרגע.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
