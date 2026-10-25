import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleLogin(event) {
    event.preventDefault();

    // Temporary navigation while authentication is not implemented.
    // Replace this with your Express login API later.
    navigate("/admin");
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

            <button type="submit" className="login-submit">
              Login
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