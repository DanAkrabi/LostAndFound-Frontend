import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Input,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { postDetails, updatePost } from "../services/post_api"; // שירותים להשלמת הפונקציות
import "./EditPost.css"; // קובץ ה-CSS

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePath, setImagePath] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const data = await postDetails(postId);
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setImagePath(data.imagePath || "");
      setOpen(true);
    } catch (error) {
      console.error("❌ Error fetching post:", error);
    }
  };

  const handleUpdatePost = async () => {
    if (id) {
      try {
        const updatedPost = {
          title,
          content,
          imagePath,
          sender: post?.sender || "defaultSender", // Replace "defaultSender" with appropriate logic
        };

        // עדכון הפוסט בשרת
        await updatePost(id, updatedPost);

        // עכשיו נווט לפוסט הספציפי או לפיד הראשי
        navigate(`/post/${id}`); // ניווט לפוסט המעודכן
      } catch (error) {
        console.error("❌ Error updating post:", error);
      }
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePath(URL.createObjectURL(file)); // שמירה של הנתיב החדש בתמונת ה-local
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // סגירת ה-Modal וחזרה אחורה אם לא מעוניינים בשינוי
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <Typography variant="h6" className="modal-title">
          ערוך פוסט
        </Typography>
        <TextField
          label="כותרת"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modal-input"
        />
        <TextField
          label="תוכן"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="modal-input"
        />
        <Input
          type="file"
          onChange={handleImageChange}
          className="modal-input"
        />
        {imagePath && (
          <div className="image-preview">
            <img src={imagePath} alt="Preview" width="100%" />
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdatePost}
          className="modal-button"
        >
          עדכן פוסט
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          className="modal-button"
        >
          סגור
        </Button>
      </Box>
    </Modal>
  );
};

export default EditPost;
