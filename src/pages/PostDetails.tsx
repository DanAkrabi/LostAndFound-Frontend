import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  CardMedia,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { postDetails, addComment, getComments } from "../services/post_api";
import { PostType, CommentType } from "../@types/postTypes";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";

const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    if (id) {
      fetchPost(id);
      fetchComments(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const data = await postDetails(postId);
      setPost(data);
    } catch (error) {
      console.error("❌ Error fetching post:", error);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  const handleAddComment = async (newCommentText: string) => {
    if (!id) return;

    const sender = localStorage.getItem("userId") || "anonymous";
    const senderUsername = localStorage.getItem("username") || "משתמש לא ידוע";
    const senderProfileImage =
      localStorage.getItem("profileImage") || "/default-avatar.png";

    try {
      const newComment = await addComment({
        comment: newCommentText,
        postId: id,
        sender,
      });

      const enrichedComment = {
        ...newComment,
        senderUsername,
        senderProfileImage,
      };

      setComments((prev) => [...prev, enrichedComment]);
      setPost((prev) =>
        prev ? { ...prev, numOfComments: prev.numOfComments + 1 } : prev
      );
    } catch (error) {
      console.error("❌ Failed to add comment:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Return to Feed
      </Button>

      {post && (
        <Card sx={{ maxWidth: 500, mx: "auto" }}>
          {post.imagePath && (
            <CardMedia
              component="img"
              height="194"
              image={post.imagePath}
              alt="Post image"
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>

            <LikeButton
              postId={post._id}
              initialLiked={post.hasLiked}
              initialLikeCount={post.likes}
            />

            <CommentSection comments={comments} addComment={handleAddComment} />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PostDetails;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Container,
//   CardMedia,
// } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import { postDetails } from "../services/post_api"; // Make sure this path is correct
// import { PostType } from "../@types/postTypes";
// import CommentSection from "../components/CommentSection";
// import LikeButton from "../components/LikeButton"; // Adjust the path if needed

// const PostDetails: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [post, setPost] = useState<PostType | null>(null);

//   useEffect(() => {
//     console.log("🧪 Mounted PostDetails");
//     console.log("🧪 useParams:", id);

//     if (id) {
//       fetchPost(id);
//     }
//   }, [id]);

//   const fetchPost = async (postId: string) => {
//     try {
//       const data = await postDetails(postId);
//       setPost(data);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//       setPost(null); // Handling error by setting post to null
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Button
//         startIcon={<ArrowBack />}
//         onClick={() => navigate(-1)}
//         variant="outlined"
//         sx={{ mb: 2 }}
//       >
//         Return to Feed
//       </Button>

//       {post && (
//         <Card sx={{ maxWidth: 345, mx: "auto" }}>
//           {post.imagePath && (
//             <CardMedia
//               component="img"
//               height="194"
//               image={post.imagePath}
//               alt="Post image"
//               className="card-media"
//             />
//           )}
//           <CardContent>
//             <Typography gutterBottom variant="h5" component="div">
//               {post.title}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {post.content}
//             </Typography>
//             <LikeButton
//               postId={post._id}
//               initialLiked={post.hasLiked}
//               initialLikeCount={post.likes}
//             />
//             <CommentSection
//               comments={post.comments}
//               addComment={(newComment: string) => console.log(newComment)}
//             />
//           </CardContent>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default PostDetails;
