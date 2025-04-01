import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import { addLike, removeLike } from "../services/post_api";
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
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = liked ? await removeLike(postId) : await addLike(postId);

      setLiked(res.liked);
      setLikeCount(res.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <IconButton onClick={handleLikeClick} aria-label="like">
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
// import { toggleLike } from "../services/post_api";

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

//   const handleLikeClick = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       const res = await toggleLike(postId, liked); // שולחים את המצב הנוכחי
//       setLiked(res.liked); // מקבלים את המצב החדש מהשרת
//       setLikeCount(res.likes);
//     } catch (err) {
//       console.error("Error toggling like:", err);
//     }
//   };

//   return (
//     <IconButton onClick={handleLikeClick} aria-label="like">
//       {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
//       <span>{likeCount}</span>
//     </IconButton>
//   );
// };

// export default LikeButton;
