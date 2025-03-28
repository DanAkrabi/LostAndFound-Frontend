import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Post from "../components/Post"; // ⬅️ Make sure the path is correct!
// import AppMenu from "../components/AppMenu"; // ⬅️ Make sure the path is correct!

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  const [posts, setPosts] = useState([
    {
      _id: "1",
      title: "Lost Dog",
      content: "Black Labrador found near the park.",
      owner: "eden123",
      createdAt: new Date().toISOString(),
      likes: 5,
      imageUrl: "C:\\Users\\avner\\OneDrive\\תמונות\\Screenshots\\3.png",
      numOfComments: 2,
      hasLiked: false,
      location: "Central Park",
    },
    {
      _id: "2",
      title: "Lost Keys",
      content: "Set of car keys with red keychain.",
      owner: "johndoe",
      createdAt: new Date().toISOString(),
      likes: 3,
      imageUrl: "C:\\Users\\avner\\OneDrive\\תמונות\\Screenshots\\1.png",
      numOfComments: 1,
      hasLiked: true,
      location: "Library",
    },
  ]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      localStorage.setItem("username", "eden123");
      setUsername("eden123");
    } else {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <>
      <Container className="homepage">
        <div className="homepage-header">
          <LocationOnIcon fontSize="large" className="homepage-icon" />
          <Typography variant="h4" className="homepage-title">
            Lost & Found Board
          </Typography>
        </div>

        <Typography variant="subtitle1" className="homepage-subtitle">
          Report lost or found items to help the community
        </Typography>

        {username && (
          <>
            <Box className="homepage-buttons">
              <Button
                variant="contained"
                color="primary"
                className="homepage-btn"
                onClick={() => navigate("/profilePage")}
              >
                Go to Profile
              </Button>
            </Box>

            <Box
              className="homepage-posts"
              sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {posts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              ))}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default HomePage;
