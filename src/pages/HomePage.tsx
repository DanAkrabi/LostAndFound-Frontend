import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Post from "../components/Post"; // ⬅️ Ensure the path is correct!
import CreatePost from "../components/CreatePost";
import { Fab } from "@mui/material";
// import { getPostsBySender } from "../services/post_api"; // Adjust the path if needed
import { addPost } from "../services/post_api"; // Adjust the path if needed
import { PostType } from "../@types/postTypes"; // Adjust the path if needed
import { fetchPaginatedPosts } from "../services/post_api";
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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      localStorage.setItem("username", "eden123");
      setUsername("eden123");
    } else {
      setUsername(storedUsername);
    }
  }, []);

  // const fetchPosts = async () => {
  //   if (!username) return;

  //   try {
  //     const fetchedPosts = await getPostsBySender(username);
  //     setPosts(
  //       fetchedPosts.map((post) => ({
  //         ...post,
  //         imagePath: post.imagePath ?? "",
  //         location: post.location ?? "Unknown",
  //         sender: post.sender ?? "Default Sender",
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Failed to fetch posts", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, [username]);

  // const loadPosts = async (page: number) => {
  //   try {
  //     setLoading(true);
  //     const data = (await fetchPaginatedPosts(page)) as {
  //       posts: PostType[];
  //       currentPage: number;
  //       totalPages: number;
  //     };
  //     setPosts(data.posts);
  //     setCurrentPage(data.currentPage);
  //     setTotalPages(data.totalPages);
  //   } catch (err) {
  //     console.error("Error loading posts:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadPosts(currentPage);
  // }, [currentPage]);
  const loadPosts = async (page: number) => {
    setLoading(true);
    try {
      const data = (await fetchPaginatedPosts(page, 6)) as {
        posts: PostType[];
        currentPage: number;
        totalPages: number;
      };
      // setPosts(data.posts);
      setPosts(
        data.posts.map((post) => ({
          ...post,
          imagePath: post.imagePath ?? "",
          location: post.location ?? "Unknown",
          hasLiked: post.hasLiked ?? false,
          sender: post.sender ?? "Default Sender",
          numOfComments: post.numOfComments ?? 0,
        }))
      );

      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);
  // const handlePostSubmit = async (newPost: {
  //   title: string;
  //   content: string;
  //   location?: string;
  //   imagePath?: string;
  // }) => {
  //   const sender = localStorage.getItem("username") || "unknown";
  //   await addPost({
  //     title: newPost.title,
  //     content: newPost.content,
  //     location: newPost.location,
  //     sender,
  //     imgUrl: newPost.imagePath,
  //   });

  //   setIsModalOpen(false);
  //   await fetchPosts(); // 📢 זה מה שיחזיר את הפוסט לפיד!
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
    await loadPosts(currentPage); // ← טוען מחדש רק את העמוד הפעיל
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
              {/* {posts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  imagePath={post.imagePath || ""}
                  imagePath={post.imagePath || ""} // Ensure imagePath is always a string
                  onClick={() => navigate(`/post/${post._id}`)}
                />
              ))} */}
              {loading ? (
                <Typography>Loading...</Typography>
              ) : Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post) => (
                  <Post
                    key={post._id}
                    {...post}
                    imagePath={post.imagePath || ""}
                    hasLiked={post.hasLiked ?? false}
                    onClick={() => console.log("Clicked post:", post._id)}
                  />
                ))
              ) : (
                <Typography>No posts found.</Typography>
              )}
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
