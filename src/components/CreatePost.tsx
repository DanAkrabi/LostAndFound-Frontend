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
  LinearProgress,
  Box,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./CreatePost.css";
import { uploadImage } from "../services/file_api"; // Adjust the import path as necessary

interface CreatePostProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPost: {
    title: string;
    content: string;
    location?: string;
    imagePath?: string;
  }) => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // const handleFile = (file: File) => {
  //   setUploading(true);
  //   setUploadProgress(30);
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setImagePath(reader.result as string);
  //     setUploading(false);
  //     setUploadProgress(100);
  //   };
  //   reader.readAsDataURL(file);
  //   setFile(file);
  // };
  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, setUploadProgress);
      setImagePath(imageUrl);
      setUploading(false);
      setUploadProgress(100);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload image.");
      setUploading(false);
    }
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

    try {
      if (file) {
        const imageUrl = await uploadImage(file, setUploadProgress);
        setImagePath(imageUrl);
      }

      await onSubmit({
        title,
        content,
        location,
        imagePath,
      });

      // Reset the form after successful submission
      setTitle("");
      setContent("");
      setLocation("");
      setImagePath("");
      setFile(null);
      setUploadProgress(0);
      onClose(); // Close the dialog after submission
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
            {file ? `Selected: ${file.name}` : "Click or drag to upload image"}
          </Typography>
        </div>

        {uploading && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">Uploading...</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        {imagePath && !uploading && (
          <img
            src={imagePath}
            alt="Preview"
            className="image-preview"
            style={{
              marginTop: "10px",
              borderRadius: "6px",
              maxHeight: "150px",
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Post"}
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
