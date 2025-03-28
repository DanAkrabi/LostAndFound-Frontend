import axios from "axios";

const API_URL = "https://10.10.246.3"; // Adjust as necessary

interface RegisterData {
  username: string;
  email: string;
  password: string;
  imgUrl?: string;
}

interface LoginData {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  imageUrl: string;
}

interface UpdateUserData {
  oldUsername: string;
  newUsername: string;
}

// Register a new user
export const registerUser = async (userData: RegisterData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

// Login user
export const loginUser = async (
  userData: LoginData
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    userData
  );
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("username", response.data.username);
  localStorage.setItem("imageUrl", response.data.imageUrl);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  await axios.post(`${API_URL}/auth/logout`, {
    refreshToken: localStorage.getItem("refreshToken"),
  });
  localStorage.clear();
};

// Update user profile
export const updateUser = async (userData: UpdateUserData) => {
  return axios.put(`${API_URL}/auth/myuser/updateAccount`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
};

// Delete user account
export const deleteUserAccount = async (username: string) => {
  await axios.delete(
    `${API_URL}/auth/myuser/deleteAccount?username=${username}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  localStorage.clear();
};

// Fetch user data
export const getUserData = async (username: string) => {
  return axios.get(`${API_URL}/auth/myuser/${username}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
};
