
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import logo from "../assets/dentaflow_logo.png";

export default function Navbar() {
  return (
    <header className="dentaflow-navbar">
      <NavLink to="/" className="navbar-brand">
        <img
          src={logo}
          alt="DentaFlow Logo"
          className="navbar-logo"
        />
        <span>DentaFlow</span>
      </NavLink>

      <nav className="navbar-navigation">
        <div className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/services">
            Services
          </NavLink>

          <NavLink to="/about">
            About Us
          </NavLink>

          <NavLink to="/help">
            Help Center
          </NavLink>

          <NavLink
            to="/login"
            className="navbar-profile"
            aria-label="Login"
          />
        </div>
      </nav>
    </header>
  );
}
