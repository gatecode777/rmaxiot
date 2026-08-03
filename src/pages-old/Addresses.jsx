import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addressAPI } from "../services/api";
import "../styles/checkout.css";

const Addresses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressMenu, setShowAddressMenu] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    shippingAddress: "",
    landmark: "",
    pinCode: ["", "", "", "", "", ""],
    city: "",
    state: "",
    country: "India",
    isDefault: false,
    deliveryInstructions: "",
  });

  useEffect(() => {
    checkLoginAndFetch();
  }, []);

  useEffect(() => {
    const pinStr = formData.pinCode.join("");
    if (pinStr.length === 6) {
      fetchCityState(pinStr);
    }
  }, [formData.pinCode]);

  const fetchCityState = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          city: postOffice.District || "",
          state: postOffice.State || "",
        }));
        toast.info(`Location resolved: ${postOffice.District}, ${postOffice.State}`);
      }
    } catch (error) {
      console.error("Error fetching city/state from pincode:", error);
    }
  };

  const checkLoginAndFetch = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage addresses");
      navigate("/login");
      return;
    }
    fetchAddresses();
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAll();
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    if (name === "mobileNumber") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...formData.pinCode];
      newPin[index] = value;
      setFormData({ ...formData, pinCode: newPin });

      if (value && index < 5) {
        const nextInput = document.querySelectorAll(".pin-box")[index + 1];
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const pinCode = formData.pinCode.join("");
    if (pinCode.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }

    // Phone number validation: Indian mobile starts with 6-9 and exactly 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit Indian mobile number (starts with 6-9)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const addressData = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        shippingAddress: formData.shippingAddress,
        landmark: formData.landmark,
        pinCode: pinCode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        isDefault: formData.isDefault,
        deliveryInstructions: formData.deliveryInstructions,
      };

      let response;
      if (editingAddress) {
        response = await addressAPI.update(editingAddress, addressData);
        toast.success("Address updated successfully");
      } else {
        response = await addressAPI.create(addressData);
        toast.success("Address added successfully");
      }

      if (response.data.success) {
        await fetchAddresses();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address._id);
    setFormData({
      fullName: address.fullName,
      mobileNumber: address.mobileNumber,
      email: address.email,
      shippingAddress: address.shippingAddress,
      landmark: address.landmark || "",
      pinCode: address.pinCode.split(""),
      city: address.city,
      state: address.state,
      country: address.country,
      isDefault: address.isDefault,
      deliveryInstructions: address.deliveryInstructions || "",
    });
    setShowModal(true);
    setShowAddressMenu(null);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const response = await addressAPI.delete(addressId);
      if (response.data.success) {
        toast.success("Address deleted successfully");
        await fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
    setShowAddressMenu(null);
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await addressAPI.setDefault(addressId);
      if (response.data.success) {
        toast.success("Default address updated");
        await fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to update default address");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      email: "",
      shippingAddress: "",
      landmark: "",
      pinCode: ["", "", "", "", "", ""],
      city: "",
      state: "",
      country: "India",
      isDefault: false,
      deliveryInstructions: "",
    });
    setEditingAddress(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "40px", color: "#f5a623" }}></i>
        <p style={{ marginTop: "15px", color: "#666" }}>Loading Address Book...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f9f9fa", minHeight: "80vh", padding: "40px 5%" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate("/profile")} 
          style={{
            background: "none",
            border: "none",
            color: "#555",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "25px",
            padding: "0"
          }}
        >
          <span style={{ fontSize: "18px" }}>←</span> Back to Profile
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600", color: "#111" }}>Address Book</h2>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{
              background: "#f5a623",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(245,166,35,0.3)",
              transition: "all 0.2s ease"
            }}
          >
            + Add New Address
          </button>
        </div>

        {addresses.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {addresses.map((address) => (
              <div 
                key={address._id} 
                style={{ 
                  background: "#fff",
                  border: address.isDefault ? "2px solid #f5a623" : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px",
                  position: "relative",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <strong style={{ fontSize: "16px", color: "#2d3748" }}>{address.fullName}</strong>
                    <div style={{ position: "relative" }}>
                      <span 
                        style={{ cursor: "pointer", padding: "4px 8px", fontSize: "18px", color: "#718096" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddressMenu(showAddressMenu === address._id ? null : address._id);
                        }}
                      >
                        ⋮
                      </span>
                      {showAddressMenu === address._id && (
                        <div className="options-menu" style={{ display: "block", right: "0", top: "25px", position: "absolute" }}>
                          <div className="menu-item" onClick={() => handleEditAddress(address)}>Edit Address</div>
                          {!address.isDefault && (
                            <div className="menu-item" onClick={() => handleSetDefaultAddress(address._id)}>Set as Default</div>
                          )}
                          <div className="menu-item delete" onClick={() => handleDeleteAddress(address._id)}>Delete Address</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {address.isDefault && (
                    <span style={{ 
                      display: "inline-block", 
                      background: "#fff4e0", 
                      color: "#c47f00", 
                      padding: "2px 8px", 
                      borderRadius: "4px", 
                      fontSize: "10px", 
                      fontWeight: "700",
                      marginBottom: "10px"
                    }}>
                      DEFAULT
                    </span>
                  )}
                  <p style={{ fontSize: "14px", color: "#4a5568", margin: "5px 0", lineHeight: "1.5" }}>
                    {address.shippingAddress}{address.landmark && `, ${address.landmark}`}
                  </p>
                  <p style={{ fontSize: "14px", color: "#4a5568", margin: "5px 0" }}>
                    {address.city}, {address.state} - {address.pinCode}
                  </p>
                  <p style={{ fontSize: "13px", color: "#718096", margin: "10px 0 0 0" }}>
                    📞 Phone: {address.mobileNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e0" }}>
            <img src="/addressbook.png" alt="No Addresses" style={{ width: "80px", height: "auto", opacity: 0.5, marginBottom: "15px" }} />
            <h3 style={{ color: "#4a5568", margin: "0 0 10px 0" }}>No Saved Addresses</h3>
            <p style={{ color: "#718096", margin: "0 0 20px 0" }}>Add an address to start ordering and checkout faster.</p>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              style={{
                background: "#f5a623",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay active" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAddress ? "Edit" : "Enter a"} delivery address</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveAddress}>
                <div className="form-group">
                  <label htmlFor="fullName">Your Name</label>
                  <input type="text" id="fullName" name="fullName" placeholder="Type your full name" value={formData.fullName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <div className="phone-group">
                    <div style={{ flex: "0.3" }}><label>Country</label><input type="text" className="country-code" value="IN +91" readOnly style={{ backgroundColor: "#dcdcdc", border: "none" }} /></div>
                    <div style={{ flex: 1 }}><label htmlFor="mobileNumber">Mobile number</label><input type="text" id="mobileNumber" name="mobileNumber" placeholder="Mobile number" value={formData.mobileNumber} onChange={handleInputChange} required /></div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email ID</label>
                  <input type="email" id="email" name="email" placeholder="Type your email id" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="shippingAddress">Shipping Address</label>
                  <input type="text" id="shippingAddress" name="shippingAddress" placeholder="Type your shipping address" value={formData.shippingAddress} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="landmark">Landmark</label>
                  <input type="text" id="landmark" name="landmark" placeholder="E.g. near apollo hospital" value={formData.landmark} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <div className="pin-code-group">
                    {formData.pinCode.map((digit, index) => (
                      <input key={index} type="text" className="pin-box" maxLength="1" value={digit} onChange={(e) => handlePinChange(index, e.target.value)} />
                    ))}
                  </div>
                </div>
                <div className="city-state-group">
                  <div className="form-group"><label htmlFor="city">City</label><input type="text" id="city" name="city" placeholder="Type your City" value={formData.city} onChange={handleInputChange} required /></div>
                  <div className="form-group"><label htmlFor="state">State</label><input type="text" id="state" name="state" placeholder="Type your State" value={formData.state} onChange={handleInputChange} required /></div>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} />
                  <label htmlFor="isDefault">Make this my default address</label>
                </div>
                <div className="collapsible-section">
                  <div className="collapsible-header" onClick={() => setShowInstructions(!showInstructions)}>
                    <div><span className="instruction-title">Delivery instructions (optional)</span><br /><small className="instruction-subtitle">Add Preferences, notes, access codes and more</small></div>
                    <span className="arrow" style={{ transform: showInstructions ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                  </div>
                  {showInstructions && (
                    <div className="collapsible-content" style={{ display: "block" }}>
                      <textarea name="deliveryInstructions" placeholder="Enter delivery instructions..." value={formData.deliveryInstructions} onChange={handleInputChange}></textarea>
                    </div>
                  )}
                </div>
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                   {isSubmitting ? (editingAddress ? "UPDATING..." : "SAVING...") : (editingAddress ? "UPDATE" : "SAVE")}
                 </button>
                <div className="footer-note">By continuing, you agree to RMAX Solution's <a href="#">Conditions of Use</a> and <a href="#">Privacy Policy</a>.</div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
