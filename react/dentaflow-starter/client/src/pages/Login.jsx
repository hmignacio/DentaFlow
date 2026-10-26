import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


async function handleLogin(event) {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid email or password.");
      return;
    }

    const user = data.user;

    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user?.role === "patient") {
      navigate("/patient", { replace: true });
    } else {
      setError("Your account role is not recognized.");
    }

  } catch (error) {
    setError("Unable to connect to the server. Please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <section className="login-left">
        <Link to="/" className="login-home-link">
          <i className="fa-solid fa-house"></i>
          <span> ← Home Page</span>
        </Link>

        <div className="login-welcome">
          <h1>
            Welcome To
            <br />
            DentaFlow!
          </h1>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="login-right">
        <Link to="/help" className="login-help-link">
          Need Help?
        </Link>

        <div className="login-form-container">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            {error && <p className="login-error">{error}</p>}
            <div className="login-field">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-forgot">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            
            <button
              type="submit"
              className="login-submit"
               disabled={loading}
        >
                {loading ? "Logging in..." : "Login"}
</button>

          </form>

          <p className="login-register">
            Don't have an account?{" "}
            <Link to="/register">Register Here</Link>
          </p>
        </div>
      </section>
    </div>
  );
}