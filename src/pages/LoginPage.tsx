import React from "react";
import AuthBox from "../components/AuthBox";
import "./LoginPage.css";
const LoginPage: React.FC = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle login logic here
  //   console.log("Email:", email);
  //   console.log("Password:", password);
  // };

  return (
    <div className="login-container">
      <AuthBox />
    </div>
  );
};

export default LoginPage;
