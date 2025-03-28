import axios from "axios";

const API_URL = "http://localhost:3000";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  imgUrl?: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  imagePath?: string;
}

interface UserResponse {
  _id: string;
  email: string;
  username: string;
  imagePath?: string;
}

// REGISTER
export const registerUser = async (
  userData: RegisterData
): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${API_URL}/auth/register`,
    userData
  );
  return response.data;
};

// LOGIN
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
  localStorage.setItem("imageUrl", data.imagePath || "");

  return data;
};

// LOGOUT
export const logoutUser = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  await axios.post(`${API_URL}/auth/logout`, { refreshToken });
  localStorage.clear();
};

// GET USER DATA
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

// UPDATE USER
export const updateUser = async (
  oldUsername: string,
  newUsername: string
): Promise<UserResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put<UserResponse>(
    `${API_URL}/auth/myuser/updateAccount`,
    { oldUsername, newUsername },
    { headers: { Authorization: "jwt " + token } }
  );
  return response.data;
};

// DELETE ACCOUNT
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

// REFRESH TOKEN (optional auto-refresh helper)
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
