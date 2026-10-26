import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardSidebar({ role = "patient" }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Loading...");
  const [userRole, setUserRole] = useState(role);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch logged-in user's information
  useEffect(() => {
    let active = true;

    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to fetch user information.");
        }

        const data = await response.json();

        if (active) {
          setUsername(data.user.full_name);
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user:", error);

        if (active) {
          setUsername("Unknown User");
        }
      }
    }

    fetchUser();

    return () => {
      active = false;
    };
  }, []);

  const isAdmin = userRole === "admin";

  const dashboardPath = isAdmin ? "/admin" : "/patient";

  const servicesPath = isAdmin
    ? "/admin/services"
    : "/patient/services";

  // Logout functionality
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

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
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {loggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </li>
      </ul>
    </div>
  );
}