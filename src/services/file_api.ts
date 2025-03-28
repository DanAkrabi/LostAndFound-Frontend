import axios from "axios";
const API_URL = "https://10.10.246.3";

// Assuming a structure for the server's response for an image upload
interface ImageUploadResponse {
  url: string;
}

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post<{ url: string }>(
      `${API_URL}/file/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

const saveImg = async (imageUrl: string): Promise<string> => {
  try {
    const response = await axios.post<{ imageUrl: string }>(
      `${API_URL}/auth/myuser/saveImg`,
      {
        username: localStorage.getItem("username"),
        imageUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save image");
  }
};

const getImg = async (username: string): Promise<string> => {
  try {
    const response = await axios.get<{ imageUrl: string }>(
      `${API_URL}/auth/getImg`,
      {
        params: { username },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image");
  }
};

export { uploadImage, saveImg, getImg };
