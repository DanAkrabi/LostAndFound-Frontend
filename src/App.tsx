// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWithMenu from "./components/LayoutWithMenu";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PostDetails from "./pages/PostDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />{" "}
        {/* Login page might not need the layout */}
        <Route path="/" element={<LayoutWithMenu />}>
          {/* Nested routes here will have the AppMenu */}
          <Route path="home" element={<HomePage />} />
          <Route path="post/:id" element={<PostDetails />} />
          <Route path="profilePage" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<div>❌Page Not Found❌</div>} />
      </Routes>
    </Router>
  );
}

export default App;
