import axios from "axios";
import { PostType } from "../@types/postTypes";

const API_URL = "http://localhost:3000";

interface PostData {
  title: string;
  content: string;
  imgUrl?: string;
  owner: string;
  location?: string;
}

interface CommentData {
  comment: string;
  owner: string;
}

// export const postDetails = async (postId: string): Promise<PostType> => {
//   try {
//     const response = await axios.get<PostType>(`${API_URL}/Posts/${postId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching post details:", error);
//     throw error; // Re-throwing the error to be handled by the caller
//   }
// };
export const postDetails = async (postId: string): Promise<PostType> => {
  const mockPosts = [
    {
      _id: "1",
      title: "Lost Dog",
      content: "Black Labrador found near the park.",
      owner: "eden123",
      createdAt: new Date().toISOString(),
      likes: 5,
      imageUrl: "../images/1.png",
      comments: [],
      numOfComments: 0,
      hasLiked: false,
    },
    {
      _id: "2",
      title: "Lost Keys",
      content: "Set of car keys with red keychain.",
      owner: "johndoe",
      createdAt: new Date().toISOString(),
      likes: 3,
      imageUrl: "../images/2.png",
      comments: [
        {
          _id: "c1",
          text: "dsa",
          content: "Comment content 1",
          postId: "2",
          owner: "user1",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c2",
          text: "dsa",
          content: "Comment content 2",
          postId: "2",
          owner: "user2",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c3",
          text: "dsa",
          content: "Comment content 3",
          postId: "2",
          owner: "user3",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c4",
          text: "dsam",
          content: "Comment content 4",
          postId: "2",
          owner: "user4",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c5",
          text: "123",
          content: "Commentsad content 5",
          postId: "2",
          owner: "user5",
          createdAt: new Date().toISOString(),
        },
      ],
      numOfComments: 5,
      hasLiked: false,
    },
  ];
  return mockPosts.find((p) => p._id === postId)!;
};

export const addPost = async (postData: PostData) => {
  try {
    const response = await axios.post(`${API_URL}/Posts`, postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/Posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const updatePost = async (postId: string, postData: PostData) => {
  try {
    const response = await axios.put(`${API_URL}/Posts/${postId}`, postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const isLiked = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URL}/Posts/isLiked/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking like status:", error);
    throw error;
  }
};

export const addLike = async (postId: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/Posts/like/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding like:", error);
    throw error;
  }
};

export const unlike = async (postId: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/Posts/unlike/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing like:", error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/Comments/getCommentsByPostId/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addComment = async (commentData: CommentData) => {
  try {
    const response = await axios.post(`${API_URL}/Comments`, commentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/Comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const updateComment = async (
  commentId: string,
  commentData: CommentData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/Comments/${commentId}`,
      commentData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};
