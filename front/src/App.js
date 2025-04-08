import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Shop from "./Shop";
import Product from "./Product";
import Contact from "./Contact";
import MaintenancePage from "./components/MaintenancePage";
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
import CompletedOrders from "./CompletedOrders";
import Reviews from "./Reviews";
import TableUsers from "./TableUsers";
import PaymentPage from "./PaymentPage";
import UpdatePassword from "./UpdatePassword";
import AddDiscount from "./AddDiscount";
import AllCategory from "./AllCategory";
import AddCategory from "./AddCategory";
import CategoryPage from "./CategoryPage";

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
          <Route path="/shopping" element={<MaintenancePage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/allproduct" element={<AllProduct />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/register" element={<Register />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/completedorders" element={<CompletedOrders />} />
          <Route path="/adddiscount" element={<AddDiscount />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/tableusers" element={<TableUsers />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/allcategory" element={<AllCategory />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
