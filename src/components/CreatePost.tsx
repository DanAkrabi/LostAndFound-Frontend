// components/CreatePost.tsx
import React, { useRef, useState, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { addPost } from "../services/post_api";
import "./CreatePost.css";

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPost: {
    title: string;
    content: string;
    location?: string;
    imageUrl?: string;
  }) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and description are required.");
      return;
    }

    const owner = localStorage.getItem("username") || "unknown";
    try {
      await addPost({ title, content, location, imgUrl: imageUrl, owner });
      setTitle("");
      setContent("");
      setLocation("");
      setImageUrl("");
      onClose();
    } catch (err) {
      console.error("Post failed:", err);
      setError("Failed to submit post.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a Post</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Location"
          fullWidth
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div
          className={`dropzone ${dragActive ? "active" : ""}`}
          onClick={handleUploadClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
          <AddPhotoAlternateIcon />
          <Typography variant="caption">
            {imageUrl ? "Image selected!" : "Click or drag to upload image"}
          </Typography>
        </div>

        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="image-preview" />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Post
        </Button>
      </DialogActions>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CreatePost;
