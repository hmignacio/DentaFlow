import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard.jsx";

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

        <Route
          path="/services"
          element={
            <Placeholder
              title="Our Services"
              description="Explore our dental care services. Replace this placeholder with your existing Services page."
            />
          }
        />

        <Route
          path="/about"
          element={
            <Placeholder
              title="About Us"
              description="Learn more about DentaFlow. Replace this placeholder with your existing About Us page."
            />
          }
        />

        <Route
          path="/help"
          element={<HelpCenter />}
        />

        <Route
          path="/login"
          element={
            <Placeholder
              title="Log In"
              description="Connect your login form and authentication API here."
            />
          }
        />
      </Route>

      {/* ADMIN PAGES */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/patient"
        element={<PatientDashboard />}
      />

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
