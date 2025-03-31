import axios from "axios";
import { PostType } from "../@types/postTypes";
import { CommentType } from "../@types/postTypes";
const API_URL = "http://localhost:3000";

interface PostData {
  title: string;
  content: string;
  imagePath?: string;
  sender: string;
  location?: string;
}

interface CommentData {
  comment: string;
  sender: string;
}

// services/comment_api.ts
export const commentFetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  console.log("Fetched comments data:", data);

  if (!data.comments) {
    console.warn("⚠️ Unexpected comment structure:", data);
    return { comments: [] };
  }

  return data;
};

export const getPostsBySender = async (
  username: string
): Promise<PostType[]> => {
  try {
    const response = await axios.get<{ posts: PostType[] }>(
      `${API_URL}/Posts?sender=${username}`
    );

    if (!Array.isArray(response.data.posts)) {
      throw new Error("Expected posts to be an array");
    }

    return response.data.posts;

    // ✅ הדפסה לדיבוג
    console.log("📦 Posts received for sender:", username);
    console.log(response.data);

    return response.data.posts;
  } catch (error) {
    console.error("Error fetching posts by sender:", error);
    throw error;
  }
};

export const postDetails = async (postId: string): Promise<PostType> => {
  try {
    const res = await axios.get(`${API_URL}/Posts/${postId}`);
    return res.data as PostType;
  } catch (error) {
    console.error("❌ Error fetching post details:", error);
    throw error;
  }
};

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  console.log("Fetched data:", data); // Log the fetched data for debugging
  if (Array.isArray(data)) {
    return { posts: data }; // Adjust to wrap the array in an object with a `posts` key
  }

  if (!data.posts) {
    console.warn("⚠️ Unexpected data structure:", data);
    return { posts: [] }; // Fallback to prevent crashes
  }

  return data;
};

export const addPost = async (postData: {
  title: string;
  content: string;
  imagePath?: string; // ודא ששם זה משתמש בקונבנציה אחידה עם השרת, אולי תצטרך לשנות ל imagePath
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

    // ודא שהמידע שאתה שולח כולל את שדה התמונה עם השם הנכון
    const responsePostData = {
      ...postData,
      sender,
      imagePath: postData.imagePath || "", // שינוי ל imagePath אם זה מה שהשרת מצפה לקבל
    };
    console.log("🚀 Posting to:", `${API_URL}/Posts`);
    const response = await axios.post(
      `${API_URL}/Posts/create`, // ודא שהנתיב נכון ותואם את השרת
      responsePostData,
      {
        headers: {
          Authorization: `jwt ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Post created:", response.data);
    return response.data as CommentType;
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
    return response.data as CommentType;
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
    return response.data as CommentType;
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
    return response.data as CommentType[]; // החזר את התגובה כ־CommentType[]
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// export const addComment = async ({
//   comment,
//   sender,
//   postId,
// }: {
//   comment: string;
//   sender: string;
//   postId: string;
// }) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/Comments`, // שליחה לנתיב הקיים
//       {
//         content: comment, // חשוב: לא comment אלא content
//         postId,
//         sender,
//       },
//       {
//         headers: {
//           Authorization: `jwt ${localStorage.getItem("accessToken")}`,
//         },
//       }
//     );

//     return response.data as CommentType;
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     throw error;
//   }
// };

export const addComment = async ({
  comment,
  sender,
  postId,
}: {
  comment: string;
  sender: string;
  postId: string;
}) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");

    const response = await axios.post(
      `${API_URL}/Comments`,
      {
        content: comment,
        postId,
        sender,
      },
      {
        headers: {
          Authorization: `jwt ${token}`, // ✅ פורמט נכון
          "Content-Type": "application/json",
        },
      }
    );

    return response.data as CommentType;
  } catch (error) {
    console.error("❌ Error adding comment:", error);
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
