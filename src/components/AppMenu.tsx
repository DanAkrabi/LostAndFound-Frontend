// src/components/AppMenu.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const AppMenu = () => {
  const navigate = useNavigate();

  // Dummy user data - you can replace this with user data from your authentication context or similar
  const user = {
    name: "John Doe",
    profileImage: "", // You can use an actual image URL if available
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#4a752c", color: "white" }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => handleNavigate("/home")}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => handleNavigate("/home")}
        >
          LostAndFound
        </Typography>
        <Button color="inherit" onClick={() => handleNavigate("/profilePage")}>
          {user.profileImage ? (
            <Avatar src={user.profileImage} alt={user.name} />
          ) : (
            <AccountCircleIcon />
          )}
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppMenu;
