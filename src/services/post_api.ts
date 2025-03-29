import axios from "axios";
import { PostType } from "../@types/postTypes";

const API_URL = "http://localhost:3000";

interface PostData {
  title: string;
  content: string;
  imgUrl?: string;
  sender: string;
  location?: string;
}

interface CommentData {
  comment: string;
  sender: string;
}

export const getPostsBySender = async (
  username: string
): Promise<PostType[]> => {
  try {
    const response = await axios.get<PostType[]>(
      `${API_URL}/posts?sender=${username}`
    );

    // ✅ הדפסה לדיבוג
    console.log("📦 Posts received for sender:", username);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching posts by sender:", error);
    throw error;
  }
};

export const postDetails = async (postId: string): Promise<PostType> => {
  const mockPosts = [
    {
      _id: "1",
      title: "Lost Dog",
      content: "Black Labrador found near the park.",
      sender: "eden123",
      createdAt: new Date().toISOString(),
      likes: 5,
      imagePath: "../images/1.png",
      comments: [],
      numOfComments: 0,
      hasLiked: false,
    },
    {
      _id: "2",
      title: "Lost Keys",
      content: "Set of car keys with red keychain.",
      sender: "johndoe",
      createdAt: new Date().toISOString(),
      likes: 3,
      imagePath: "../images/2.png",
      comments: [
        {
          _id: "c1",
          text: "dsa",
          content: "Comment content 1",
          postId: "2",
          sender: "user1",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c2",
          text: "dsa",
          content: "Comment content 2",
          postId: "2",
          sender: "user2",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c3",
          text: "dsa",
          content: "Comment content 3",
          postId: "2",
          sender: "user3",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c4",
          text: "dsam",
          content: "Comment content 4",
          postId: "2",
          sender: "user4",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "c5",
          text: "123",
          content: "Commentsad content 5",
          postId: "2",
          sender: "user5",
          createdAt: new Date().toISOString(),
        },
      ],
      numOfComments: 5,
      hasLiked: false,
    },
  ];
  return mockPosts.find((p) => p._id === postId)!;
};

// export const addPost = async (postData: PostData) => {
//   try {
//     const response = await axios.post(`${API_URL}/create`, postData, {
//       headers: {
//         Authorization: `jwt ${localStorage.getItem("accessToken")}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding post:", error);
//     throw error;
//   }
// };

export const addPost = async (postData: {
  title: string;
  content: string;
  imgUrl?: string;
  location?: string;
  sender: string;
}) => {
  try {
    console.log("Adding Post - Input Data:", postData);

    const accessToken = localStorage.getItem("accessToken");
    const sender = localStorage.getItem("username") || postData.sender;

    if (!accessToken) {
      throw new Error("Access token not found. Please log in.");
    }

    const responsePostData = {
      ...postData,
      sender,
      imgUrl: postData.imgUrl || "",
    };

    const response = await axios.post(
      `${API_URL}/posts/create`,
      responsePostData,
      {
        headers: {
          Authorization: `jwt ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Post created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Detailed Error adding post:", {
      error,
      errorResponse: (error as any).response?.data,
      errorStatus: (error as any).response?.status,
    });
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
    const response = await axios.put(`${API_URL}/posts/${postId}`, postData, {
      headers: {
        Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
    const response = await axios.get(`${API_URL}/posts/isLiked/${postId}`, {
      headers: {
        Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
      `${API_URL}/posts/like/${postId}`,
      {},
      {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
      `${API_URL}/posts/unlike/${postId}`,
      {},
      {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
        Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
        Authorization: `jwt ${localStorage.getItem("accessToken")}`,
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
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};
