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
import Commande from "./Commande";
import AddProduct from "./AddProduct";
import AllProduct from "./AllProduct";
import AddComment from "./AddComment";
import OngoingOrders from "./OngoingOrders";
import CompletedOrders from "./CompletedOrders";
import Invoices from "./Invoices";
import Reviews from "./Reviews";
import TableUsers from "./TableUsers";
import PaymentPage from "./PaymentPage";
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/addcomment/:productId" element={<AddComment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shopping" element={<ShoppingCart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/allproduct" element={<AllProduct />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/register" element={<Register />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/ongoingorders" element={<OngoingOrders />} />
          <Route path="/completedorders" element={<CompletedOrders />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/tableusers" element={<TableUsers />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
