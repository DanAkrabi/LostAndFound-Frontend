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
import { PostType } from "../@types/postTypes";
import "./ProfilePage.css";
import "./HomePage.css";
import { uploadProfileImage } from "../services/file_api";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../services/post_api";
import { usePaging } from "../useHooks/usePaging";

const PAGE_SIZE = 6;
const API_URL = "http://localhost:3000";

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedImage = localStorage.getItem("profileImage") || "";

    setUsername(storedUsername);
    setEmail(storedEmail);
    setProfileImage(storedImage);
  }, []);

  const {
    items: userPosts,
    lastElementRef,
    isValidating,
  } = usePaging(
    (page) =>
      `${API_URL}/Posts?sender=${username}&page=${page}&limit=${PAGE_SIZE}`,
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
      setProfileImage(uploadedUrl);
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

    if (username !== oldUsername) updates.username = username;
    if (email !== oldEmail) updates.email = email;
    if (profileImage !== oldImagePath) updates.profileImage = profileImage;

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

      if (updates.username)
        localStorage.setItem("username", updatedUser.username);
      if (updates.email) localStorage.setItem("email", updatedUser.email);
      if (updates.profileImage)
        localStorage.setItem("profileImage", updatedUser.profileImage);

      alert("הפרופיל עודכן בהצלחה!");
      setEditDialogOpen(false);
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
                      onClick={() => console.log("נלחץ על הפוסט:", post._id)}
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
              src={profileImage || "/default-avatar.png"}
              alt={username}
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

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
//   CircularProgress,
//   Paper,
// } from "@mui/material";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import { getPostsBySender } from "../services/post_api";
// import { updateUser } from "../services/user_api";
// import Post from "../components/Post";
// import { PostType } from "../@types/postTypes";
// import "./ProfilePage.css";
// import "./HomePage.css";
// import { uploadProfileImage } from "../services/file_api";
// import { useNavigate } from "react-router-dom";

// const ProfilePage: React.FC = () => {
//   const [username, setUsername] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [profileImage, setProfileImage] = useState<string>("");
//   const [userPosts, setUserPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     alert("התנתקת בהצלחה");
//     navigate("/");
//   };

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username") || "";
//     const storedEmail = localStorage.getItem("email") || "";
//     const storedImage = localStorage.getItem("profileImage") || "";

//     setUsername(storedUsername);
//     setEmail(storedEmail);
//     setProfileImage(storedImage);

//     if (storedUsername) {
//       fetchUserPosts(storedUsername);
//     }
//   }, []);

//   const fetchUserPosts = async (username: string) => {
//     try {
//       const posts = await getPostsBySender(username);
//       if (Array.isArray(posts)) {
//         setUserPosts(
//           posts.map((post) => ({
//             ...post,
//             imagePath: post.imagePath ?? "",
//             location: post.location ?? "לא צוינה מיקום",
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("שגיאה בטעינת הפוסטים של המשתמש:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const uploadedUrl = await uploadProfileImage(file);
//       setProfileImage(uploadedUrl);
//     } catch (err) {
//       console.error("שגיאה בהעלאת תמונה:", err);
//       alert("העלאת התמונה נכשלה");
//     }
//   };

//   const handleUpdate = async () => {
//     const userId = localStorage.getItem("userId");
//     const oldUsername = localStorage.getItem("username");
//     const oldEmail = localStorage.getItem("email");
//     const oldImagePath = localStorage.getItem("profileImage");

//     if (!userId) {
//       alert("משתמש לא מזוהה");
//       return;
//     }

//     const updates: {
//       username?: string;
//       email?: string;
//       profileImage?: string;
//     } = {};

//     if (username !== oldUsername) updates.username = username;
//     if (email !== oldEmail) updates.email = email;
//     if (profileImage !== oldImagePath) updates.profileImage = profileImage;

//     if (Object.keys(updates).length === 0) {
//       alert("לא בוצעו שינויים בפרופיל");
//       return;
//     }

//     try {
//       const updatedUser = (await updateUser(userId, updates)) as {
//         username: string;
//         email: string;
//         profileImage: string;
//       };

//       if (updates.username)
//         localStorage.setItem("username", updatedUser.username);
//       if (updates.email) localStorage.setItem("email", updatedUser.email);
//       if (updates.profileImage)
//         localStorage.setItem("profileImage", updatedUser.profileImage);

//       alert("הפרופיל עודכן בהצלחה!");
//       setEditDialogOpen(false);
//     } catch (error) {
//       console.error("שגיאה בעדכון פרופיל:", error);
//       alert("אירעה שגיאה בעדכון הפרופיל.");
//     }
//   };

//   return (
//     <Box className="profile-page">
//       <Paper className="profile-container" elevation={3}>
//         <Box className="top-actions">
//           <Button
//             variant="outlined"
//             color="primary"
//             size="small"
//             onClick={() => setEditDialogOpen(true)}
//           >
//             ערוך פרופיל
//           </Button>
//           <Button
//             variant="outlined"
//             color="error"
//             size="small"
//             onClick={handleLogout}
//           >
//             התנתק
//           </Button>
//         </Box>

//         <Box sx={{ textAlign: "center", mb: 3 }}>
//           <Avatar
//             src={profileImage || "/default-avatar.png"}
//             alt={username}
//             sx={{
//               width: 120,
//               height: 120,
//               border: "4px solid #ff4081",
//               margin: "0 auto",
//             }}
//           />
//           <Typography variant="h6" sx={{ mt: 1 }}>
//             {username}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {email}
//           </Typography>
//         </Box>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : userPosts.length > 0 ? (
//           <>
//             <Typography variant="h6" sx={{ mt: 4 }}>
//               הפוסטים שלי
//             </Typography>
//             <Box className="instagram-grid">
//               {userPosts.map((post) => (
//                 <Box key={post._id} className="instagram-post-wrapper">
//                   <Post
//                     {...post}
//                     imagePath={post.imagePath || ""}
//                     onClick={() => console.log("נלחץ על הפוסט:", post._id)}
//                   />
//                 </Box>
//               ))}
//             </Box>
//           </>
//         ) : (
//           <Typography variant="body1" sx={{ mt: 4 }}>
//             אין לך פוסטים כרגע.
//           </Typography>
//         )}
//       </Paper>

//       {/* דיאלוג עריכת פרופיל */}
//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
//         <DialogTitle>עריכת פרופיל</DialogTitle>
//         <DialogContent>
//           <Box sx={{ textAlign: "center" }}>
//             <Avatar
//               src={profileImage || "/default-avatar.png"}
//               alt={username}
//               sx={{
//                 width: 100,
//                 height: 100,
//                 margin: "0 auto",
//                 mb: 2,
//               }}
//             />
//             <input
//               accept="image/*"
//               id="upload-photo"
//               type="file"
//               hidden
//               onChange={handleImageChange}
//             />
//             <label htmlFor="upload-photo">
//               <IconButton component="span" color="primary">
//                 <PhotoCamera />
//               </IconButton>
//             </label>
//           </Box>

//           <TextField
//             fullWidth
//             label="שם משתמש"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="אימייל"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
//           <Button variant="contained" onClick={handleUpdate}>
//             שמור שינויים
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ProfilePage;
