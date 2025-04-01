import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import { addLike, removeLike } from "../services/post_api";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  onLikeChange?: (liked: boolean, likeCount: number) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLiked,
  initialLikeCount,
  onLikeChange,
}) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

  const handleLike = async () => {
    try {
      const response = await addLike(postId);
      setLiked(true);
      setLikeCount(response.likes);
      if (onLikeChange) onLikeChange(true, response.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await removeLike(postId);
      setLiked(false);
      setLikeCount(response.likes);
      if (onLikeChange) onLikeChange(false, response.likes);
    } catch (err) {
      console.error("Error unliking post:", err);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      await handleUnlike();
    } else {
      await handleLike();
    }
  };

  return (
    <IconButton onClick={handleToggleLike} aria-label="like">
      {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      <span>{likeCount}</span>
    </IconButton>
  );
};

export default LikeButton;
// import React, { useState } from "react";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import IconButton from "@mui/material/IconButton";
// import { addLike, removeLike } from "../services/post_api";

// // עדכון הפרופס
// interface LikeButtonProps {
//   postId: string;
//   initialLiked: boolean;
//   initialLikeCount: number;
//   onLikeChange: (newLiked: boolean, newLikeCount: number) => void; // הוספת פרופס חדש
// }

// const LikeButton: React.FC<LikeButtonProps> = ({
//   postId,
//   initialLiked,
//   initialLikeCount,
//   onLikeChange,
// }) => {
//   const [liked, setLiked] = useState<boolean>(initialLiked);
//   const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

//   const handleLike = async () => {
//     try {
//       const response = await addLike(postId);
//       const newLikeCount = response.likes;
//       setLiked(true);
//       setLikeCount(newLikeCount);
//       onLikeChange(true, newLikeCount); // עדכון מצב הלייק בפרופס של ה-PARENT
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };

//   const handleUnlike = async () => {
//     try {
//       const response = await removeLike(postId);
//       const newLikeCount = response.likes;
//       setLiked(false);
//       setLikeCount(newLikeCount);
//       onLikeChange(false, newLikeCount); // עדכון מצב הלייק בפרופס של ה-PARENT
//     } catch (err) {
//       console.error("Error unliking post:", err);
//     }
//   };

//   const handleToggleLike = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (liked) {
//       await handleUnlike();
//     } else {
//       await handleLike();
//     }
//   };

//   return (
//     <IconButton onClick={handleToggleLike} aria-label="like">
//       {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
//       <span>{likeCount}</span>
//     </IconButton>
//   );
// };

// export default LikeButton;

// import React, { useState, useEffect } from "react";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import IconButton from "@mui/material/IconButton";
// import {
//   addLike,
//   removeLike,
//   isLiked,
//   postDetails,
// } from "../services/post_api";

// interface LikeButtonProps {
//   postId: string;
//   initialLiked: boolean;
//   initialLikeCount: number;
// }

// const LikeButton: React.FC<LikeButtonProps> = ({
//   postId,
//   initialLiked,
//   initialLikeCount,
// }) => {
//   const [liked, setLiked] = useState<boolean>(initialLiked);
//   const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

//   useEffect(() => {
//     const fetchLikeStatus = async () => {
//       try {
//         const likedStatus = await isLiked(postId);
//         setLiked(likedStatus);

//         const postData = await postDetails(postId);
//         setLikeCount(postData.likes);
//       } catch (err) {
//         console.error("Error fetching like status:", err);
//       }
//     };

//     fetchLikeStatus();
//   }, [postId]);

//   const handleLike = async () => {
//     try {
//       const response = await addLike(postId);
//       setLiked(true);
//       setLikeCount(response.likes);
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };

//   const handleUnlike = async () => {
//     try {
//       const response = await removeLike(postId);
//       setLiked(false);
//       setLikeCount(response.likes);
//     } catch (err) {
//       console.error("Error unliking post:", err);
//     }
//   };

//   const handleToggleLike = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (liked) {
//       await handleUnlike();
//     } else {
//       await handleLike();
//     }
//   };

//   return (
//     <IconButton onClick={handleToggleLike} aria-label="like">
//       {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
//       <span>{likeCount}</span>
//     </IconButton>
//   );
// };

// export default LikeButton;
