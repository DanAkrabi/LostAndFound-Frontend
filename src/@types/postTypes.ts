// src/types/postTypes.ts

export interface PostType {
  _id: string;
  title: string;
  content: string;
  owner: string;
  likes: number;
  imageUrl?: string;
  createdAt: string;
  location?: string;
  numOfComments: number;
  comments: CommentType[];
  hasLiked: boolean;
}

// You can also define other related types here, like:
export interface CommentType {
  _id: string;
  postId: string;
  owner: string;
  content: string;
  createdAt: string;
}
