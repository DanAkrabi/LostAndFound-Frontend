import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { getPostsBySender } from "../services/post_api";
import Post from "../components/Post";
import { PostType } from "../@types/postTypes";
import "./ProfilePage.css"; // אם יש דברים כלליים שם
import "./HomePage.css"; // כדי לייבא את הסגנון של הפוסטים

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedImage = localStorage.getItem("imagePath") || "";

    setUsername(storedUsername);
    setEmail(storedEmail);
    setImagePath(storedImage);

    if (storedUsername) {
      fetchUserPosts(storedUsername);
    }
  }, []);

  const fetchUserPosts = async (username: string) => {
    try {
      const posts = await getPostsBySender(username);
      setUserPosts(
        posts.map((post) => ({
          ...post,
          imagePath: post.imagePath ?? "",
          location: post.location ?? "לא צוינה מיקום",
        }))
      );
    } catch (error) {
      console.error("שגיאה בטעינת הפוסטים של המשתמש:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    alert("פונקציונליות העדכון טרם יושמה.");
  };

  return (
    <Box className="profile-page">
      <Paper className="profile-container" elevation={3}>
        <Typography variant="h5" gutterBottom>
          פרופיל משתמש
        </Typography>

        <Box className="profile-avatar-section">
          <Avatar
            src={imagePath || "/default-avatar.png"}
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : userPosts.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mt: 4 }}>
              הפוסטים שלי
            </Typography>
            <Box className="homepage-posts" style={{ marginTop: "20px" }}>
              {userPosts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  imagePath={post.imagePath || ""}
                  onClick={() => console.log("נלחץ על הפוסט:", post._id)}
                />
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

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   TextField,
//   Button,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import { getPostsBySender } from "../services/post_api";
// import Post from "../components/Post";
// import { PostType } from "../@types/postTypes";

// const ProfilePage: React.FC = () => {
//   const [username, setUsername] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [imagePath, setImagePath] = useState<string>("");
//   const [userPosts, setUserPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username") || "";
//     const storedEmail = localStorage.getItem("email") || "";
//     const storedImage = localStorage.getItem("imagePath") || "";

//     setUsername(storedUsername);
//     setEmail(storedEmail);
//     setImagePath(storedImage);

//     if (storedUsername) {
//       fetchUserPosts(storedUsername);
//     }
//   }, []);

//   const fetchUserPosts = async (username: string) => {
//     try {
//       const posts = await getPostsBySender(username);
//       setUserPosts(
//         posts.map((post) => ({
//           ...post,
//           imagePath: post.imagePath ?? "",
//           location: post.location ?? "לא צוינה מיקום",
//         }))
//       );
//     } catch (error) {
//       console.error("שגיאה בטעינת הפוסטים של המשתמש:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = () => {
//     alert("פונקציונליות העדכון טרם יושמה.");
//   };

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//       <Paper sx={{ p: 4, width: "100%", maxWidth: 600 }}>
//         <Typography variant="h5" gutterBottom>
//           פרופיל משתמש
//         </Typography>

//         <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//           <Avatar
//             src={imagePath || "/default-avatar.png"}
//             alt={username}
//             sx={{ width: 100, height: 100 }}
//           />
//         </Box>

//         <TextField
//           fullWidth
//           label="שם משתמש"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           margin="normal"
//         />

//         <TextField
//           fullWidth
//           label="אימייל"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           margin="normal"
//           disabled
//         />

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpdate}
//           sx={{ mt: 2 }}
//         >
//           עדכן פרופיל
//         </Button>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : userPosts.length > 0 ? (
//           <>
//             <Typography variant="h6" sx={{ mt: 4 }}>
//               הפוסטים שלי
//             </Typography>
//             <Box sx={{ mt: 2 }}>
//               {userPosts.map((post) => (
//                 <Post
//                   key={post._id}
//                   {...post}
//                   imagePath={post.imagePath || ""}
//                   onClick={() => console.log("נלחץ על הפוסט:", post._id)}
//                 />
//               ))}
//             </Box>
//           </>
//         ) : (
//           <Typography variant="body1" sx={{ mt: 4 }}>
//             אין לך פוסטים כרגע.
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default ProfilePage;

// // import { useEffect, useState } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Avatar,
// //   TextField,
// //   Button,
// //   Paper,
// // } from "@mui/material";
// // import "./ProfilePage.css";

// // const ProfilePage = () => {
// //   const [username, setUsername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [imagePath, setImagePath] = useState("");

// //   useEffect(() => {
// //     const storedUsername = localStorage.getItem("username") || "";
// //     const storedEmail = localStorage.getItem("email") || "";
// //     const storedImage = localStorage.getItem("imagePath") || "";

// //     setUsername(storedUsername);
// //     setEmail(storedEmail);
// //     setImagePath(storedImage);
// //   }, []);

// //   const handleUpdate = () => {
// //     // later implementation for updating profile
// //     alert("Update functionality not implemented yet.");
// //   };

// //   return (
// //     <Box className="profile-page">
// //       <Paper className="profile-container" elevation={3}>
// //         <Typography variant="h5" gutterBottom>
// //           פרופיל משתמש
// //         </Typography>

// //         <Box className="profile-avatar-section">
// //           <Avatar
// //             src={imagePath || "/default-avatar.png"}
// //             alt={username}
// //             sx={{ width: 100, height: 100, mb: 2 }}
// //           />
// //         </Box>

// //         <TextField
// //           fullWidth
// //           label="שם משתמש"
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //           margin="normal"
// //         />

// //         <TextField
// //           fullWidth
// //           label="אימייל"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           margin="normal"
// //           disabled
// //         />

// //         <Button
// //           variant="contained"
// //           color="primary"
// //           fullWidth
// //           onClick={handleUpdate}
// //           sx={{ mt: 2 }}
// //         >
// //           עדכן פרופיל
// //         </Button>
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default ProfilePage;
