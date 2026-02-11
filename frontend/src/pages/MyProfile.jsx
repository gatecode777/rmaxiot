import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAuth } from "../services/api";
import "../styles/profile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    checkLoginAndFetchProfile();
  }, []);

  const checkLoginAndFetchProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }
    fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAuth.getProfile();

      if (response.data.success) {
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          phone: response.data.user.phone || "",
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      console.log("Form Data to Send:", formData);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);

      if (profileImage) {
        console.log("Appending profile image:", profileImage);
        formDataToSend.append("profile", profileImage);
      }

      // Use fetch for FormData
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully");
        setUser(data.user);

        // Update localStorage user data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...storedUser, ...data.user }));

        // Trigger header update
        window.dispatchEvent(new Event("authChange"));

        setShowEditModal(false);
        setProfileImage(null);
        setImagePreview(null);
      } else {
        toast.error(data.message || "Failed to update profile");
      }

      setUploading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getProfileImageUrl = () => {
    if (!user?.profile) return null;
    const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${apiUrl}/uploads/profiles/${user.profile}`;
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="main-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "40px", color: "#667eea" }}></i>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="main-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Unable to load profile</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="account-card">
        {/* Page Header */}
        <div className="page-title-section">
          <div className="title-left">
            <h1>My Account</h1>
            <p className="welcome-text">
              Welcome to your Rmax Solutions Account, Manage your Profile, Orders, and Support
              requests easily from here.
            </p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {/* Account Overview */}
        <div className="overview-section">
          <h3 className="section-label">Account Overview</h3>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-info">
              <div className="avatar" style={{ position: "relative" }}>
                {user.profile ? (
                  <img
                    src={getProfileImageUrl()}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#667eea",
                    position: "absolute",
                    top: "15px",
                    left: "19px",
                  }}>
                    {getInitials()}
                  </span>
                )}
              </div>

              <div className="details">
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <p>✉ {user.email}</p>
                {user.phone && <p>📞 {user.phone}</p>}
              </div>
            </div>
            <button className="edit-btn" onClick={() => setShowEditModal(true)}>
              Edit
            </button>
          </div>

          {/* Quick Links */}
          <div className="quick-links-grid">
            <div className="q-card" onClick={() => navigate("/orders")}>
              <img src="/myorders.png" alt="Orders" className="q-icon" />
              <div className="q-text">
                <h4>My Orders</h4>
                <p>View and Track Orders</p>
              </div>
            </div>

            <div className="q-card" onClick={() => navigate("/addresses")}>
              <img src="/addressbook.png" alt="Address Book" className="q-icon" />
              <div className="q-text">
                <h4>Address Book</h4>
                <p>Manage Address</p>
              </div>
            </div>

            <div className="q-card" onClick={() => navigate("/wishlist")}>
              <img src="/wishlist.png" alt="My Wishlist" className="q-icon" />
              <div className="q-text">
                <h4>My Wishlist</h4>
                <p>Saved Products</p>
              </div>
            </div>

            <div className="q-card" onClick={() => navigate("/support")}>
              <img src="/support.png" alt="Support Tickets" className="q-icon" />
              <div className="q-text">
                <h4>Support Tickets</h4>
                <p>Get Help & Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          {/* Order History */}
          <div className="grid-column">
            <h3 className="column-title">Order History</h3>
            <div className="list-container">
              <div className="list-item-my active-list">Recent Orders</div>
              <div className="list-item-my">
                #1025 In Process <span className="arrow">›</span>
              </div>
              <div className="list-item-my">
                #1025 Delivered <span className="arrow">›</span>
              </div>
              <div className="list-item-my">
                #1025 Completed <span className="arrow">›</span>
              </div>
              <div className="list-item-my">
                #1025 Completed <span className="arrow">›</span>
              </div>
            </div>
            <a href="#" className="view-all" onClick={() => navigate("/orders")}>
              View All Orders ›
            </a>
          </div>

          {/* Saved Items */}
          <div className="grid-column">
            <h3 className="column-title">Saved Items</h3>
            <div className="saved-items-container">
              <div className="item-placeholder"></div>
              <div className="item-placeholder"></div>
            </div>
            <button className="blue-action-btn" onClick={() => navigate("/wishlist")}>
              View Wishlist
            </button>
          </div>

          {/* Support Tickets */}
          <div className="grid-column">
            <h3 className="column-title">Support Tickets</h3>
            <div className="list-container">
              <div className="list-item-my active-list">My Tickets</div>
              <div className="list-item-my">
                Installation Report Open <span className="arrow">›</span>
              </div>
              <div className="list-item-my">
                Billing Issues Resolved <span className="arrow">›</span>
              </div>
            </div>
            <button className="blue-action-btn contact-btn" onClick={() => navigate("/support")}>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-container"
            style={{ maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleUpdateProfile}>
                {/* Profile Image Upload */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      width: "120px",
                      height: "120px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview || user.profile ? (
                      <img
                        src={imagePreview || getProfileImageUrl()}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: "50px", fontWeight: "600", color: "#667eea",
                        position: "absolute",
                        top: "20px",
                        left: "30px",
                      }}>
                        {getInitials()}
                      </span>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        background: "#667eea",
                        color: "white",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <i className="fas fa-camera"></i>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                    Click to upload profile picture (Max 5MB)
                  </p>
                </div>

                {/* First Name */}
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                {/* Email (Read Only) */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                  />
                  <small style={{ color: "#666", fontSize: "12px" }}>
                    Email cannot be changed
                  </small>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "2px solid #ddd",
                      background: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: uploading ? "#ccc" : "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: uploading ? "not-allowed" : "pointer",
                      fontWeight: "600",
                    }}
                  >
                    {uploading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;