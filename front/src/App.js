import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Shop from "./Shop";
import Product from "./Product";
import Contact from "./Contact";
import ShoppingCart from "./ShoppingCart";
import Register from "./Register";
import Connexion from "./Connexion";
import Favorites from "./Favorites";
import Profil from "./Profil";
import Dashboard from "./Dashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shopping" element={<ShoppingCart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/register" element={<Register />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
