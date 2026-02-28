import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlantCatalog from "./pages/PlantCatalog";
import PurchasePlants from "./pages/PurchasePlants";
import PlantRentals from "./pages/PlantRentals";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSales from "./pages/AdminSales";
import Login from "./pages/Login";
import GardeningHelp from "./pages/GardeningHelp";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import MyRentals from "./pages/MyRentals";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<PlantCatalog />} />
        <Route path="/purchase" element={<PurchasePlants />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/sales" element={<AdminSales />} />
        <Route path="/rentals" element={<MyRentals />} />
        <Route path="/plant-rentals" element={<PlantRentals />} />
        <Route path="/help" element={<GardeningHelp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
