import React, { useState } from "react";
import { CommentType } from "../@types/postTypes";
import "./CommentSection.css";

interface CommentSectionProps {
  comments?: CommentType[];
  addComment: (newComment: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments = [],
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

  console.log("🧪 Loaded comments:", comments);

  return (
    <div className="comment-section">
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <img
              src={comment.senderProfileImage || "/default-avatar.png"}
              alt={comment.senderUsername || "User"}
              className="comment-avatar"
            />
            <div className="comment-details">
              <span className="comment-author">
                {comment.senderUsername || "משתמש לא ידוע"}
              </span>
              <p className="comment-content">{comment.content}</p>
            </div>
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
