import React, { useEffect, useRef, useState, useCallback } from "react";
import { Container, Typography, Button, Box, Fab } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";
import { addPost, fetcher } from "../services/post_api";
import { PostType } from "../@types/postTypes";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 6;
const API_URL = "http://localhost:3000";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("username") || "eden123";
    setUsername(stored);
    localStorage.setItem("username", stored);
  }, []);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.posts.length === 0) return null;
    return `${API_URL}/Posts?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);

  const fetchedPosts = data ? data.flatMap((page) => page.posts) : [];

  const observer = useRef<IntersectionObserver | null>(null);
  const totalPages = data?.[0]?.totalPages ?? 1;

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isValidating) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (size < totalPages) {
            console.log("👀 Last post is visible. Fetching more...");
            setSize((prev) => prev + 1);
          } else {
            console.log("✅ Reached last page. No more posts to fetch.");
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [isValidating, size, totalPages, setSize]
  );

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
      imagePath: newPost.imagePath,
    });
    setIsModalOpen(false);
  };

  return (
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
            {fetchedPosts.length > 0 ? (
              fetchedPosts.map((post, idx) => {
                const isLastPost = idx === fetchedPosts.length - 1;
                return (
                  <div
                    key={post._id}
                    ref={isLastPost ? lastPostElementRef : null}
                  >
                    <Post
                      {...post}
                      imagePath={post.imagePath || ""}
                      hasLiked={post.hasLiked ?? false}
                      onClick={() => navigate(`/post/${post._id}`)}
                    />
                  </div>
                );
              })
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
  );
};

export default HomePage;
