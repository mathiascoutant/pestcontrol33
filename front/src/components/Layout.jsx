import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
function Layout({ children }) {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/connexion" &&
        location.pathname !== "/register" && <Header />}
      <main>{children}</main>
      {location.pathname !== "/connexion" &&
        location.pathname !== "/register" && <Footer />}
    </div>
  );
}

export default Layout;
