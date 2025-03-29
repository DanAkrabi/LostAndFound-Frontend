import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Post from "../components/Post"; // ⬅️ Make sure the path is correct!
import CreatePost from "../components/CreatePost";
import { Fab } from "@mui/material";
import { getPostsBySender } from "../services/post_api"; // Adjust the path if needed
import { addPost } from "../services/post_api"; // Adjust the path if needed
import { PostType } from "../@types/postTypes"; // Adjust the path if needed
// export interface PostType {
//   _id: string;
//   title: string;
//   content: string;
//   sender: string;
//   createdAt: string;
//   likes: number;
//   imagePath?: string;
//   numOfComments: number;
//   hasLiked: boolean;
//   location?: string;
// }

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState<PostType[]>([]);
  // const fakePosts = [
  //   {
  //     _id: "1",
  //     title: "Lost Dog",
  //     content: "Black Labrador found near the park.",
  //     owner: "eden123",
  //     createdAt: new Date().toISOString(),
  //     likes: 5,
  //     imagePath: "../images/1.png",
  //     numOfComments: 2,
  //     hasLiked: false,
  //     location: "Central Park",
  //   },
  //   {
  //     _id: "2",
  //     title: "Lost Keys",
  //     content: "Set of car keys with red keychain.",
  //     owner: "johndoe",
  //     createdAt: new Date().toISOString(),
  //     likes: 3,
  //     imagePath: "../images/2.png",
  //     numOfComments: 1,
  //     hasLiked: true,
  //     location: "Library",
  //   },
  // ];
  // setPosts(fakePosts);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      localStorage.setItem("username", "eden123");
      setUsername("eden123");
    } else {
      setUsername(storedUsername);
    }

    // 👇 הוספתי את זה כאן
  }, []);
  // useEffect(() => {
  //   if (!username) return;
  //   const fetchPosts = async () => {
  //     try {
  //       const fetchedPosts = await getPostsBySender(username);
  //       setPosts(
  //         fetchedPosts.map((post) => ({
  //           ...post,
  //           imagePath: post.imagePath ?? "", // Ensure imagePath is always a string
  //           location: post.location ?? "Unknown", // Ensure location is always a string
  //         }))
  //       ); // 💡 לא תהיה יותר שגיאת unknown!
  //     } catch (error) {
  //       console.error("Failed to fetch posts", error);
  //     }
  //   };
  //   fetchPosts();
  // }, [username]);

  const fetchPosts = async () => {
    if (!username) return;

    try {
      const fetchedPosts = await getPostsBySender(username);
      setPosts(
        fetchedPosts.map((post) => ({
          ...post,
          imagePath: post.imagePath ?? "",
          location: post.location ?? "Unknown",
          sender: post.sender ?? "Default Sender",
        }))
      );
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);

  // useEffect(() => {
  //   const updatedPosts = posts.map((post) => ({
  //     ...post,
  //     sender: post.sender || "Default Sender", // Add a default value if missing
  //   }));
  //   setPosts(updatedPosts);
  // }, [posts]);

  // const handleCreatePost = (newPost: {
  //   title: string;
  //   content: string;
  //   location?: string;
  //   imagePath?: string;
  // }) => {
  //   const fakeId = Math.random().toString(36).substring(7);
  //   const fakeCreatedAt = new Date().toISOString();
  //   const fullPost = {
  //     ...newPost,
  //     _id: fakeId,
  //     sender: username, // Map 'username' to 'sender'
  //     createdAt: fakeCreatedAt,
  //     likes: 0,
  //     numOfComments: 0,
  //     hasLiked: false,
  //     imagePath: newPost.imagePath || "", // Ensure imagePath is always a string
  //     location: newPost.location || "Unknown", // Ensure location is always a string
  //   };

  //   setPosts((prev) => [fullPost, ...prev]);
  //   setIsModalOpen(false);
  // };
  const handlePostSubmit = async (newPost: {
    title: string;
    content: string;
    location?: string;
    imagePath?: string;
  }) => {
    const sender = localStorage.getItem("username") || "unknown";
    await addPost({
      title: newPost.title,
      content: newPost.content,
      location: newPost.location,
      sender,
      imgUrl: newPost.imagePath,
    });

    setIsModalOpen(false);
    await fetchPosts(); // 📢 זה מה שיחזיר את הפוסט לפיד!
  };

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
              <Button
                variant="outlined"
                color="secondary"
                className="homepage-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Create New Post
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
                  imagePath={post.imagePath || ""} // Ensure imagePath is always a string
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              ))}
            </Box>
          </>
        )}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsModalOpen(true)}
          sx={{ position: "fixed", bottom: 30, right: 30 }}
        >
          <AddIcon />
        </Fab>
        <CreatePost
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handlePostSubmit}
        />
      </Container>
    </>
  );
};

export default HomePage;
