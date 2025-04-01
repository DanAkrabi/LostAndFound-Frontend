import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import {
  postDetails,
  addComment,
  deletePost,
  updatePost,
} from "../services/post_api";
import { PostType, CommentType } from "../@types/postTypes";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";

const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const location = useLocation();

  const passedState = location.state as {
    postId: string;
    hasLiked: boolean;
    likes: number;
    numOfComments: number;
  };

  const [commentCount, setCommentCount] = useState(
    passedState?.numOfComments || 0
  );

  useEffect(() => {
    if (id) {
      fetchPost(id);
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

  const handleAddComment = async (
    newCommentText: string
  ): Promise<CommentType> => {
    if (!id) throw new Error("Missing post ID");
    setCommentCount((prev) => prev + 1);

    const sender = localStorage.getItem("userId") || "anonymous";
    const senderUsername = localStorage.getItem("username") || "משתמש לא ידוע";
    const senderProfileImage =
      localStorage.getItem("profileImage") || "/default-avatar.png";

    const newComment = await addComment({
      comment: newCommentText,
      postId: id,
      sender,
    });

    if (!newComment) {
      throw new Error("Failed to add comment");
    }

    return {
      ...newComment,
      senderUsername,
      senderProfileImage,
    };
  };

  const handleDeletePost = async () => {
    if (id) {
      try {
        await deletePost(id);
        const currentPath = location.pathname;

        if (currentPath.includes("post")) {
          navigate("/home");
        } else if (currentPath.includes("profile")) {
          navigate("/profile");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("❌ Error deleting post:", error);
      }
    }
  };

  const handleUpdatePost = async () => {
    if (post) {
      navigate(`/update-post/${post._id}`, { state: { post } });
    }
  };

  // פונקציה זו תעדכן את המצב של הלייק בפוסט
  const handleLikeChange = (newLiked: boolean, newLikeCount: number) => {
    if (post) {
      setPost({
        ...post,
        hasLiked: newLiked,
        likes: newLikeCount,
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/home")}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        חזרה לפיד
      </Button>

      {post && (
        <Card sx={{ maxWidth: 500, mx: "auto" }}>
          {post.imagePath && (
            <div className="post-image-wrapper">
              <img src={post.imagePath} alt={post.title} />
            </div>
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
              onLikeChange={handleLikeChange} // כאן מעבירים את הפונקציה
            />

            {localStorage.getItem("username") === post.sender && (
              <div>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeletePost}
                  sx={{ mt: 2, mr: 2 }}
                >
                  מחק פוסט
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdatePost}
                  sx={{ mt: 2 }}
                >
                  עדכן פוסט
                </Button>
              </div>
            )}

            <CommentSection postId={post._id} addComment={handleAddComment} />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PostDetails;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import {
//   postDetails,
//   addComment,
//   deletePost,
//   updatePost,
// } from "../services/post_api";
// import { PostType, CommentType } from "../@types/postTypes";
// import CommentSection from "../components/CommentSection";
// import LikeButton from "../components/LikeButton";

// const PostDetails: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [post, setPost] = useState<PostType | null>(null);
//   const location = useLocation();

//   const passedState = location.state as {
//     postId: string;
//     hasLiked: boolean;
//     likes: number;
//     numOfComments: number;
//   };

//   const [commentCount, setCommentCount] = useState(
//     passedState?.numOfComments || 0
//   );

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
//       console.error("❌ Error fetching post:", error);
//     }
//   };

//   const handleAddComment = async (
//     newCommentText: string
//   ): Promise<CommentType> => {
//     if (!id) throw new Error("Missing post ID");
//     setCommentCount((prev) => prev + 1);

//     const sender = localStorage.getItem("userId") || "anonymous";
//     const senderUsername = localStorage.getItem("username") || "משתמש לא ידוע";
//     const senderProfileImage =
//       localStorage.getItem("profileImage") || "/default-avatar.png";

//     const newComment = await addComment({
//       comment: newCommentText,
//       postId: id,
//       sender,
//     });

//     if (!newComment) {
//       throw new Error("Failed to add comment");
//     }

//     return {
//       ...newComment,
//       senderUsername,
//       senderProfileImage,
//     };
//   };

//   const handleDeletePost = async () => {
//     if (id) {
//       try {
//         await deletePost(id);
//         const currentPath = location.pathname;

//         if (currentPath.includes("post")) {
//           navigate("/home");
//         } else if (currentPath.includes("profile")) {
//           navigate("/profile");
//         } else {
//           navigate("/home");
//         }
//       } catch (error) {
//         console.error("❌ Error deleting post:", error);
//       }
//     }
//   };

//   const handleUpdatePost = async () => {
//     if (post) {
//       navigate(`/update-post/${post._id}`, { state: { post } });
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Button
//         startIcon={<ArrowBack />}
//         onClick={() => navigate("/home")}
//         variant="outlined"
//         sx={{ mb: 2 }}
//       >
//         חזרה לפיד
//       </Button>

//       {post && (
//         <Card sx={{ maxWidth: 500, mx: "auto" }}>
//           {post.imagePath && (
//             <div className="post-image-wrapper">
//               <img src={post.imagePath} alt={post.title} />
//             </div>
//           )}
//           <CardContent>
//             <Typography gutterBottom variant="h5">
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

//             {localStorage.getItem("username") === post.sender && (
//               <div>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleDeletePost}
//                   sx={{ mt: 2, mr: 2 }}
//                 >
//                   מחק פוסט
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleUpdatePost}
//                   sx={{ mt: 2 }}
//                 >
//                   עדכן פוסט
//                 </Button>
//               </div>
//             )}

//             <CommentSection postId={post._id} addComment={handleAddComment} />
//           </CardContent>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default PostDetails;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import {
//   postDetails,
//   addComment,
//   deletePost,
//   updatePost,
// } from "../services/post_api";
// import { PostType, CommentType } from "../@types/postTypes";
// import CommentSection from "../components/CommentSection";
// import LikeButton from "../components/LikeButton";

// const PostDetails: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [post, setPost] = useState<PostType | null>(null);
//   const location = useLocation();

//   const passedState = location.state as {
//     postId: string;
//     hasLiked: boolean;
//     likes: number;
//     numOfComments: number;
//   };

//   const [commentCount, setCommentCount] = useState(
//     passedState?.numOfComments || 0
//   );

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
//       console.error("❌ Error fetching post:", error);
//     }
//   };

//   const handleAddComment = async (
//     newCommentText: string
//   ): Promise<CommentType> => {
//     if (!id) throw new Error("Missing post ID");
//     setCommentCount((prev) => prev + 1);

//     const sender = localStorage.getItem("userId") || "anonymous";
//     const senderUsername = localStorage.getItem("username") || "משתמש לא ידוע";
//     const senderProfileImage =
//       localStorage.getItem("profileImage") || "/default-avatar.png";

//     const newComment = await addComment({
//       comment: newCommentText,
//       postId: id,
//       sender,
//     });

//     if (!newComment) {
//       throw new Error("Failed to add comment");
//     }

//     return {
//       ...newComment,
//       senderUsername,
//       senderProfileImage,
//     };
//   };

//   const handleDeletePost = async () => {
//     if (id) {
//       try {
//         await deletePost(id);
//         const currentPath = location.pathname;

//         if (currentPath.includes("post")) {
//           navigate("/home");
//         } else if (currentPath.includes("profile")) {
//           navigate("/profile");
//         } else {
//           navigate("/home");
//         }
//       } catch (error) {
//         console.error("❌ Error deleting post:", error);
//       }
//     }
//   };

//   const handleUpdatePost = async () => {
//     if (post) {
//       navigate(`/update-post/${post._id}`, { state: { post } }); // הנחות על דף לעדכון הפוסט
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Button
//         startIcon={<ArrowBack />}
//         onClick={() => navigate("/home")}
//         variant="outlined"
//         sx={{ mb: 2 }}
//       >
//         חזרה לפיד
//       </Button>

//       {post && (
//         <Card sx={{ maxWidth: 500, mx: "auto" }}>
//           {post.imagePath && (
//             <div className="post-image-wrapper">
//               <img src={post.imagePath} alt={post.title} />
//             </div>
//           )}
//           <CardContent>
//             <Typography gutterBottom variant="h5">
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

//             {/* כפתורי Update ו-Delete רק אם המשתמש הוא בעל הפוסט */}
//             {localStorage.getItem("username") === post.sender && (
//               <div>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleDeletePost}
//                   sx={{ mt: 2, mr: 2 }}
//                 >
//                   מחק פוסט
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleUpdatePost}
//                   sx={{ mt: 2 }}
//                 >
//                   עדכן פוסט
//                 </Button>
//               </div>
//             )}

//             <CommentSection postId={post._id} addComment={handleAddComment} />
//           </CardContent>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default PostDetails;
