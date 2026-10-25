import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Registration from "./pages/Registration.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import Services from "./pages/Services.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Login from "./pages/Login.jsx";

// Layout for public pages
function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

// Main application
export default function App() {
  return (
    <Routes>
      {/* PUBLIC PAGES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Route>

      {/* ADMIN PAGES */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/patient" element={<PatientDashboard />} />

      {/* PAGE NOT FOUND */}
      <Route
        path="*"
        element={
          <Placeholder
            title="Page not found"
            description="The page you requested does not exist."
          />
        }
      />
    </Routes>
  );
}
