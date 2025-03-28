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
export interface PostData {
  title: string;
  content: string;
  location: string; // Added location property
  imgUrl: string;
  owner: string;
}
// You can also define other related types here, like:
export interface CommentType {
  _id: string;
  postId: string;
  owner: string;
  content: string;
  createdAt: string;
}
