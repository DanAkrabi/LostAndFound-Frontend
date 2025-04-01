// src/types/postTypes.ts

export interface PostType {
  _id: string;
  title: string;
  content: string;
  sender: string;
  likes: number;
  imagePath?: string;
  createdAt: string;
  location?: string;
  numOfComments: number;
  comments: CommentType[];
  hasLiked: boolean;
  userId: string; // Added userId property
  onLikeChange: (newLiked: boolean, newLikeCount: number) => void;
}

// You can also define other related types here, like:
// export interface CommentType {
//   _id: string;
//   postId: string;
//   sender: string;
//   content: string;
//   createdAt: string;
// }

export interface CommentType {
  _id: string;
  postId: string;
  sender: string; // זה ה־ObjectId
  content: string;
  senderUsername: string;
  senderProfileImage: string;
  addComment: (newCommentText: string) => Promise<void>;
  comments: CommentType[];
}
