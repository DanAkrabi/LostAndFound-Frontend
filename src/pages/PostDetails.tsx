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
import { postDetails } from "../services/post_api"; // Make sure this path is correct
import { PostType } from "../@types/postTypes";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton"; // Adjust the path if needed

const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    console.log("🧪 Mounted PostDetails");
    console.log("🧪 useParams:", id);

    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const data = await postDetails(postId);
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setPost(null); // Handling error by setting post to null
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
        <Card sx={{ maxWidth: 345, mx: "auto" }}>
          {post.imagePath && (
            <CardMedia
              component="img"
              height="194"
              image={post.imagePath}
              alt="Post image"
              className="card-media"
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
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
            <CommentSection
              comments={post.comments}
              addComment={(newComment: string) => console.log(newComment)}
            />
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
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Button
//         startIcon={<ArrowBack />}
//         onClick={() => navigate(-1)}
//         variant="outlined"
//         sx={{ mb: 2 }}
//       >
//         Return to Feed
//       </Button>

//       {post && (
//         <Card sx={{ mb: 2, overflow: "hidden", borderRadius: "16px" }}>
//           <CardContent>
//             <Typography variant="h5" gutterBottom>
//               {post.title}
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               {post.content}
//             </Typography>
//             <Typography variant="caption" display="block" sx={{ mt: 2 }}>
//               Posted by: {post.sender}
//             </Typography>
//             <Typography variant="caption" display="block">
//               On: {new Date(post.createdAt).toLocaleDateString()}
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
