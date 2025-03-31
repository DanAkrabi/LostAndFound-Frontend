// src/contexts/UserContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface UserContextType {
  username: string;
  email: string;
  profileImage: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setProfileImage: (profileImage: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("profileImage", profileImage);
  }, [username, email, profileImage]);

  return (
    <UserContext.Provider
      value={{
        username,
        email,
        profileImage,
        setUsername,
        setEmail,
        setProfileImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
