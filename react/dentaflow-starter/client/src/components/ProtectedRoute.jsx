import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuthentication() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const data = await response.json();

        if (active) {
          setUser(data.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/patient"}
        replace
      />
    );
  }

  return <Outlet />;
}