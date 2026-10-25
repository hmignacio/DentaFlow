
import { NavLink, Link } from "react-router-dom";

export default function DashboardSidebar({
  role = "patient",
  username = "Juan Dela Cruz",
}) {
  const isAdmin = role === "admin";

  const dashboardPath = isAdmin ? "/admin" : "/patient";
  const servicesPath = isAdmin
    ? "/admin/services"
    : "/patient/services";

  return (
    <div className="side-nav">
      <ul>
        {/* User Profile */}
        <li className="user-profile">
          <i className="fa-solid fa-circle-user"></i>

          <div className="user-info">
            <span>{username}</span>
            <small>{isAdmin ? "Admin" : "Patient"}</small>
          </div>
        </li>

        {/* Dashboard */}
        <li>
          <NavLink to={dashboardPath} end>
            <i className="fa-solid fa-house"></i>
            Dashboard
          </NavLink>
        </li>

        {/* Services */}
        <li>
          <NavLink to={servicesPath}>
            <i className="fa-solid fa-tooth"></i>
            Services
          </NavLink>
        </li>

        {/* Help Center */}
        <li className="help-link">
          <Link to="/help">
            <i className="fa-solid fa-circle-question"></i>
            Need Help?
          </Link>
        </li>

        {/* Sign Out */}
        <li className="sign-out">
          <Link to="/">
            <i className="fa-solid fa-right-from-bracket"></i>
            Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
}
