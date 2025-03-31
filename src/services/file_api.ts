import axios from "axios";
const API_ROOT = "http://localhost:3000";

// Function to upload image and track progress
export const uploadProfileImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file); // חשוב: "image" תואם ל־upload.single("image")

  interface UploadProfileHeaders {
    "Content-Type": string;
    Authorization: string | null;
  }

  interface UploadProfileConfig {
    headers: UploadProfileHeaders;
    onUploadProgress: (progressEvent: ProgressEvent) => void;
  }

  const res = await axios.post<{ imageUrl: string }>(
    `${API_ROOT}/file/uploadProfileImage`, // ✅ זה הנתיב הנכון!
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "jwt " + localStorage.getItem("accessToken"), // אם יש
      } as UploadProfileHeaders,
      onUploadProgress: (progressEvent: ProgressEvent) => {
        if (onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          onProgress(percent);
        }
      },
    } as UploadProfileConfig
  );

  return res.data.imageUrl;
};
export const uploadImage = async (
  imageFile: File,
  setUploadProgress: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  interface UploadHeaders {
    "Content-Type": string;
    Authorization: string;
  }

  interface UploadConfig {
    headers: UploadHeaders;
    onUploadProgress: (progressEvent: ProgressEvent) => void;
  }

  const config: UploadConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `jwt ${localStorage.getItem("accessToken") || ""}`,
    },
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setUploadProgress(percentCompleted); // Update the state with the progress
    },
  };

  try {
    const { data } = await axios.post<{ url: string }>(
      `${API_ROOT}/file/upload`,
      formData,
      config
    );
    return data.url;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err;
  }
};

// import axios from "axios";

// const API_ROOT = "http://localhost:3000";

// export const uploadImage = async (imageFile: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", imageFile);

//   try {
//     const { data } = await axios.post<{ url: string }>(
//       `${API_ROOT}/file/upload`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `jwt ${localStorage.getItem("accessToken") || ""}`,
//         },
//       }
//     );

//     return data.url;
//   } catch (err) {
//     console.error("Image upload failed:", err);
//     throw err;
//   }
// };
