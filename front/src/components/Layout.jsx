import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Layouts/Header";

function Layout({ children }) {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/connexion" &&
        location.pathname !== "/register" && <Header />}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
