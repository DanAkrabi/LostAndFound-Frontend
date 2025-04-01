import React, { useState } from "react";
import { CommentType } from "../@types/postTypes";
import "./CommentSection.css";
import { usePaging } from "../useHooks/usePaging";
import { commentFetcher } from "../services/post_api";

export interface CommentSectionProps {
  postId: string;
  addComment: (newCommentText: string) => Promise<CommentType>;
}

const PAGE_SIZE = 5;

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  addComment,
}) => {
  const [newComment, setNewComment] = useState("");
  const [manualComments, setManualComments] = useState<CommentType[]>([]);

  const {
    items: fetchedComments,
    lastElementRef,
    isValidating,
  } = usePaging(
    (page) =>
      `https://node23.cs.colman.ac.il/Comments/getCommentsByPostId/${postId}?page=${page}&limit=${PAGE_SIZE}`,
    commentFetcher,
    (page) => page.comments || [],
    PAGE_SIZE
  );

  const comments = [...manualComments, ...fetchedComments];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const newCommentObj = await addComment(newComment);
        setManualComments((prev) => [newCommentObj, ...prev]);
        setNewComment("");
      } catch (err) {
        console.error("❌ Failed to add comment:", err);
        alert("שגיאה בהוספת תגובה.");
      }
    }
  };

  return (
    <div className="comment-section">
      {/* Input ליצירת תגובה */}
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="הוסף תגובה..."
          className="comment-input"
        />
        <button type="submit" className="submit-button">
          פרסם
        </button>
      </form>

      {/* רשימת תגובות */}
      <div className="comments">
        {comments.map((comment, index) => {
          const isLast = index === comments.length - 1;
          return (
            <div
              key={comment._id}
              className="comment"
              ref={isLast ? lastElementRef : null}
            >
              <img
                src={comment.senderProfileImage || "/public/profilepicture.png"}
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
          );
        })}
        {/* לא נציג את "טוען..." אם כרגע יש תהליך של הוספה ידנית */}
        {isValidating && manualComments.length === 0 && (
          <p style={{ textAlign: "center" }}>טוען תגובות...</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
// setAvatarUrl("public\\profilepicture.png");
