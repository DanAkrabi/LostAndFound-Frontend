import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, Avatar, Chip, useTheme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { formatDistanceToNow } from "date-fns";
import "./Post.css";
import LikeButton from "./LikeButton"; // Adjust the path if needed

interface PostProps {
  _id: string;
  title: string;
  content: string;
  owner: string;
  createdAt: string;
  likes: number;
  imageUrl: string;
  numOfComments: number;
  hasLiked: boolean;
  onClick: () => void;
  location?: string;
}

const Post: React.FC<PostProps> = ({
  _id,
  title,
  content,
  owner,
  createdAt,
  likes,
  imageUrl,
  numOfComments,
  hasLiked,
  onClick,
  location,
}) => {
  const theme = useTheme();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);

  useEffect(() => {
    setAvatarLoading(true);
    setTimeout(() => {
      setAvatarUrl("https://via.placeholder.com/80"); // mock
      setAvatarLoading(false);
    }, 500);
  }, [owner]);

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const hasImage = imageUrl && imageUrl.trim() !== "";

  return (
    <Paper className="post-card" onClick={onClick}>
      {hasImage ? (
        <div className="post-image">
          <img src={imageUrl} alt={title} loading="lazy" />
        </div>
      ) : (
        <div className="post-image fallback">
          <LocationOnIcon className="fallback-icon" />
        </div>
      )}

      <div className="post-content">
        <div className="post-header">
          <Avatar src={!avatarLoading ? avatarUrl : undefined}>
            {getInitials(owner)}
          </Avatar>
          <div>
            <Typography variant="subtitle1">{owner}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </div>
        </div>

        <Typography variant="h6" className="post-title">
          {title}
        </Typography>
        <Typography variant="subtitle2" className="post-location">
          Location: {location || "Unknown"}
        </Typography>
        <Typography variant="body2" className="post-description">
          {content}
        </Typography>

        <div className="post-footer">
          <div className="post-actions">
            <LikeButton
              postId={_id}
              initialLiked={hasLiked}
              initialLikeCount={likes}
            />

            <div>
              <ChatBubbleOutlineIcon />
              <span>{numOfComments}</span>
            </div>
          </div>
          <Chip label="Read more" size="small" />
        </div>
      </div>
    </Paper>
  );
};

export default Post;
