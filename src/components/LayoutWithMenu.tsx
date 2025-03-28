import { Outlet } from "react-router-dom";
import AppMenu from "./AppMenu";
import "./LayoutWithMenu.css"; // Import the CSS file

const LayoutWithMenu = () => {
  return (
    <div className="layout-with-menu">
      <AppMenu />
      <div className="layout-content">
        <Outlet /> {/* This will render the matched child route component */}
      </div>
    </div>
  );
};

export default LayoutWithMenu;

// // components/LayoutWithMenu.tsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import AppMenu from "./AppMenu";

// const LayoutWithMenu = () => {
//   return (
//     <div>
//       <AppMenu />
//       <div style={{ marginTop: "10px", width: "100vw" }}>
//         {" "}
//         {/* Adjust the top margin depending on your menu's height */}
//         <Outlet /> {/* This will render the matched child route component. */}
//       </div>
//     </div>
//   );
// };

// export default LayoutWithMenu;
