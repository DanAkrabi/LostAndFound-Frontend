import React, { useState } from "react";
import { CommentType } from "../@types/postTypes"; // Adjust the import path as necessary
import "./CommentSection.css";

interface CommentSectionProps {
  comments?: CommentType[]; // הפכנו ל־optional
  addComment: (newComment: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  addComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="comment-section">
      <div className="comments">
        {(comments ?? []).map((comment, index) => (
          <div key={index} className="comment">
            <p className="comment-content">{comment.content}</p>
            <span className="comment-author">{comment.sender}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
