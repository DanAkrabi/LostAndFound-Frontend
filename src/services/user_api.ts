// src/services/user_api.ts
import axios from "axios";

const API_URL = "http://localhost:3000";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
}
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  profileImage?: string;
  _id: string; // ✅ הוסיפי את זה
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface UserResponse {
  _id: string;
  email: string;
  username: string;
  profileImage?: string;
}

export const registerUser = async (
  userData: RegisterData
): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${API_URL}/auth/register`,
    userData
  );
  return response.data;
};

export const loginUser = async (
  userData: LoginData
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    userData
  );
  const data = response.data;

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("username", data.username);
  localStorage.setItem("profileImage", data.profileImage || "");
  localStorage.setItem("userId", response.data._id);

  return data;
};

export const logoutUser = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  await axios.post(`${API_URL}/auth/logout`, { refreshToken });
  localStorage.clear();
};

export const googleSignIn = async (token: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/google-login`, {
    token,
  });

  const data = response.data;

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("username", data.username);
  localStorage.setItem("profileImage", data.profileImage || "");
  localStorage.setItem("userId", data._id || "");

  return data;
};

export const getUserData = async (username: string): Promise<UserResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get<UserResponse>(
    `${API_URL}/auth/myuser/${username}`,
    {
      headers: { Authorization: "jwt " + token },
    }
  );
  return response.data;
};

export const updateUser = async (
  userId: string,
  updateData: {
    username?: string;
    email?: string;
    profileImage?: string;
  }
) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Missing access token. Please login again.");
    }

    const response = await axios.put(
      `${API_URL}/auth/users/${userId}`, // ודא שזה הנתיב של עדכון יוזר אצלך בשרת
      updateData,
      {
        headers: {
          Authorization: `jwt ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("👤 User updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (
  username: string
): Promise<{ message: string }> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete<{ message: string }>(
    `${API_URL}/auth/myuser/deleteAccount?username=${username}`,
    {
      headers: { Authorization: "jwt " + token },
    }
  );
  localStorage.clear();
  return response.data;
};

export const refreshAccessToken = async (): Promise<
  LoginResponse | undefined
> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  const response = await axios.post<LoginResponse>(`${API_URL}/auth/refresh`, {
    refreshToken,
  });
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);

  return response.data;
};
