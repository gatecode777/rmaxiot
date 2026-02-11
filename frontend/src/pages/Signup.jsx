import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { userAuth } from "../services/api";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = { firstName, lastName, email, password };

    try {
      setLoading(true);

      const res = await userAuth.register(userData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/login");
      } else {
        // backend error like "email already exists"
        setErrors({ email: res.data.message });
      }
    } catch (error) {
      console.error("Signup Error:", error);

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

        <h1 className="welcome-text">CREATE ACCOUNT</h1>

        <form id="signupForm" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors({ ...errors, firstName: "" });
              }}
            />
            {errors.firstName && (
              <small style={{ color: "red" }}>{errors.firstName}</small>
            )}
          </div>

          {/* Last Name */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setErrors({ ...errors, lastName: "" });
              }}
            />
            {errors.lastName && (
              <small style={{ color: "red" }}>{errors.lastName}</small>
            )}
          </div>

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

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            className="create-acc-btn"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Signup;
