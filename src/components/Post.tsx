import React, { useState, useEffect } from "react";
import { Paper, Typography, Avatar, Chip } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { formatDistanceToNow } from "date-fns";
import "./Post.css";
import LikeButton from "./LikeButton"; // Adjust the path if needed

interface PostProps {
  _id: string;
  title: string;
  content: string;
  sender: string;
  createdAt: string;
  likes: number;
  imagePath: string;
  numOfComments: number;
  hasLiked: boolean;
  onClick: () => void;
  location?: string;
}

const Post: React.FC<PostProps> = ({
  _id,
  title,
  content,
  sender,
  createdAt,
  likes,
  imagePath,
  numOfComments,
  hasLiked,
  onClick,
  location,
}) => {
  // const theme = useTheme();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(hasLiked);
  const [likeCount, setLikeCount] = useState<number>(likes);

  useEffect(() => {
    setAvatarLoading(true);
    setTimeout(() => {
      setAvatarUrl("https://via.placeholder.com/80"); // mock
      setAvatarLoading(false);
    }, 500);
  }, [sender]);

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

  const hasImage = imagePath && imagePath.trim() !== "";
  const API_URL = "http://localhost:3000"; // Adjust this to your API URL
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/Posts/toggle-like/${_id}`,
        {},
        {
          headers: {
            Authorization: `jwt ${token}`,
          },
        }
      );

      if (response.status === 200) {
        type ResponseData = { liked: boolean; likes: number };
        const { liked, likes } = response.data as ResponseData;
        setLiked(liked);
        setLikeCount(likes);
      }
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
  };

  return (
    <Paper className="post-card" onClick={onClick}>
      {/* פרופיל + שם */}
      <div className="post-header">
        <Avatar src={!avatarLoading ? avatarUrl : undefined}>
          {getInitials(sender)}
        </Avatar>
        <div>
          <Typography variant="subtitle1">{sender}</Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </div>
      </div>

      {/* תמונה של הפוסט */}
      {hasImage ? (
        <div className="post-image">
          <img src={imagePath} alt={title} loading="lazy" />
        </div>
      ) : (
        <div className="post-image fallback">
          <LocationOnIcon className="fallback-icon" />
        </div>
      )}

      {/* תוכן */}
      <div className="post-content">
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
// import React, { useState, useEffect } from "react";
// import { Paper, Typography, Avatar, Chip } from "@mui/material";
// // import FavoriteIcon from "@mui/icons-material/Favorite";
// // import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { formatDistanceToNow } from "date-fns";
// import "./Post.css";
// import LikeButton from "./LikeButton"; // Adjust the path if needed

// interface PostProps {
//   _id: string;
//   title: string;
//   content: string;
//   sender: string;
//   createdAt: string;
//   likes: number;
//   imagePath: string;
//   numOfComments: number;
//   hasLiked: boolean;
//   onClick: () => void;
//   location?: string;
// }

// const Post: React.FC<PostProps> = ({
//   _id,
//   title,
//   content,
//   sender,
//   createdAt,
//   likes,
//   imagePath,
//   numOfComments,
//   hasLiked,
//   onClick,
//   location,
// }) => {
//   // const theme = useTheme();
//   const [avatarUrl, setAvatarUrl] = useState<string>("");
//   const [avatarLoading, setAvatarLoading] = useState<boolean>(false);

//   useEffect(() => {
//     setAvatarLoading(true);
//     setTimeout(() => {
//       setAvatarUrl("https://via.placeholder.com/80"); // mock
//       setAvatarLoading(false);
//     }, 500);
//   }, [sender]);

//   const formattedDate = formatDistanceToNow(new Date(createdAt), {
//     addSuffix: true,
//   });

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);

//   const hasImage = imagePath && imagePath.trim() !== "";

//   return (
//     <Paper className="post-card" onClick={onClick}>
//       {/* פרופיל + שם */}
//       <div className="post-header">
//         <Avatar src={!avatarLoading ? avatarUrl : undefined}>
//           {getInitials(sender)}
//         </Avatar>
//         <div>
//           <Typography variant="subtitle1">{sender}</Typography>
//           <Typography variant="caption" color="text.secondary">
//             {formattedDate}
//           </Typography>
//         </div>
//       </div>

//       {/* תמונה של הפוסט */}
//       {hasImage ? (
//         <div className="post-image">
//           <img src={imagePath} alt={title} loading="lazy" />
//         </div>
//       ) : (
//         <div className="post-image fallback">
//           <LocationOnIcon className="fallback-icon" />
//         </div>
//       )}

//       {/* תוכן */}
//       <div className="post-content">
//         <Typography variant="h6" className="post-title">
//           {title}
//         </Typography>
//         <Typography variant="subtitle2" className="post-location">
//           Location: {location || "Unknown"}
//         </Typography>
//         <Typography variant="body2" className="post-description">
//           {content}
//         </Typography>

//         <div className="post-footer">
//           <div className="post-actions">
//             <LikeButton
//               postId={_id}
//               initialLiked={hasLiked}
//               initialLikeCount={likes}
//             />

//             <div>
//               <ChatBubbleOutlineIcon />
//               <span>{numOfComments}</span>
//             </div>
//           </div>
//           <Chip label="Read more" size="small" />
//         </div>
//       </div>
//     </Paper>
//   );
// };

// export default Post;
