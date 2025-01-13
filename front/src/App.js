import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Shop from "./Shop";
import Product from "./Product";
import Contact from "./Contact";
import ShoppingCart from "./ShoppingCart";
import Register from "./Register";
import Connexion from "./Connexion";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shopping" element={<ShoppingCart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
