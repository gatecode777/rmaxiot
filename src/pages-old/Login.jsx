import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { userAuth } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await userAuth.loginUser({ email, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(new Event("authChange"));

        navigate("/"); // change route if needed
      } else {
        // show backend error under email field
        setErrors({ email: res.data.message });
      }
    } catch (error) {
      console.error("Login Error:", error);

      const message =
        error.response?.data?.message || "Server error. Try again later.";

      setErrors({ email: message });
    } finally {
    setLoading(false);
  }
};

return (
  <main className="login-page-bg">
    <div className="login-card">
      <div className="profile-icon-circle">
        <i className="fa-solid fa-user"></i>
      </div>

      <h1 className="welcome-text">WELCOME TO RMAX SOLUTIONS</h1>

      <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="input-group">
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && (
            <small style={{ color: "red" }}>{errors.email}</small>
          )}
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && (
            <small style={{ color: "red" }}>{errors.password}</small>
          )}
        </div>

        <div className="forgot-link">
          <a href="#">Forget your password ?</a>
        </div>

        <button type="submit" className="signin-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <button
          type="button"
          className="create-acc-btn"
          onClick={() => navigate("/signup")}
        >
          Create an Account
        </button>
      </form>
    </div>
  </main>
);
};

export default Login;