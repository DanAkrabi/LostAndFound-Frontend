import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { ThumbUp, ThumbUpOffAlt } from "@mui/icons-material";
import { addLike, unlike } from "../services/post_api";
import "./LikeButton.css"; // Add this line

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialLikeCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLiked,
  initialLikeCount,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (liked) {
      try {
        await unlike(postId);
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } catch (error) {
        console.error("Error removing like:", error);
      }
    } else {
      try {
        await addLike(postId);
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      } catch (error) {
        console.error("Error adding like:", error);
      }
    }
  };

  return (
    <div className="like-button-container">
      <IconButton onClick={handleLikeClick} size="small" className="like-icon">
        {liked ? <ThumbUp color="primary" /> : <ThumbUpOffAlt />}
      </IconButton>
      <Typography variant="body2" className="like-count">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </Typography>
    </div>
  );
};

export default LikeButton;
