import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartAPI, addressAPI } from "../services/api";
import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressMenu, setShowAddressMenu] = useState(null);

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

  const checkLoginAndFetch = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const cartResponse = await cartAPI.getCart();
      if (cartResponse.data.success) {
        setCart(cartResponse.data.cart);

        const selectedItemIds = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
        
        if (selectedItemIds.length === 0) {
          toast.warning("No items selected for checkout");
          navigate("/cart");
          return;
        }

        const items = cartResponse.data.cart.items.filter((item) =>
          selectedItemIds.includes(item._id)
        );
        setCheckoutItems(items);
      }

      const addressResponse = await addressAPI.getAll();
      if (addressResponse.data.success) {
        setAddresses(addressResponse.data.addresses);
        const defaultAddr = addressResponse.data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load checkout data");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

    try {
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
        await fetchData();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
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
        await fetchData();
        if (selectedAddress === addressId) {
          setSelectedAddress(null);
        }
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
        await fetchData();
        setSelectedAddress(addressId);
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

  const getImageUrl = (filename) => {
    const apiUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${apiUrl}/uploads/products/${filename}`;
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const calculateTotals = () => {
    const subtotal = checkoutItems.reduce(
      (total, item) => total + item.priceAtAdd * item.quantity,
      0
    );
    const deliveryCharges = subtotal >= 5000 ? 0 : 250;
    const total = subtotal + deliveryCharges;

    return { subtotal, deliveryCharges, total };
  };

  const getTotalItems = () => {
    return checkoutItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    toast.success("Order placed successfully! (Demo)");
    localStorage.removeItem("checkoutItems");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="checkout-body">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "40px", color: "#667eea" }}></i>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  const { subtotal, deliveryCharges, total } = calculateTotals();

  return (
    <div className="checkout-body">
      <main className="checkout-container">
        <div className="checkout-left">
          <div className="address-section border-blue">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3 style={{ margin: 0 }}>Delivery Address</h3>
              <i className="fa-solid fa-plus" style={{ cursor: "pointer", fontSize: "18px", color: "#333" }}
                onClick={() => { resetForm(); setShowModal(true); }}></i>
            </div>

            {addresses.length > 0 ? (
              <div className="saved-addresses">
                {addresses.map((address) => (
                  <div key={address._id} className={`address-item ${selectedAddress === address._id ? "selected" : ""}`}
                    onClick={() => setSelectedAddress(address._id)}
                    style={{ cursor: "pointer", border: selectedAddress === address._id ? "2px solid #667eea" : "1px solid #ddd",
                      backgroundColor: selectedAddress === address._id ? "#f0f4ff" : "white" }}>
                    <div className="address-text">
                      <strong>{address.fullName}</strong>
                      {address.isDefault && (
                        <span style={{ marginLeft: "10px", padding: "2px 8px", background: "#667eea", color: "white",
                          borderRadius: "4px", fontSize: "10px", float: "right" }}>DEFAULT</span>
                      )}
                      <p>{address.shippingAddress}{address.landmark && `, ${address.landmark}`}</p>
                      <p>{address.city}, {address.state} - {address.pinCode}</p>
                      <p style={{ fontSize: "12px", color: "#666" }}>Mobile: {address.mobileNumber}</p>
                    </div>
                    <div className="address-options">
                      <i className="fa-solid fa-ellipsis-vertical dots-icon"
                        onClick={(e) => { e.stopPropagation(); setShowAddressMenu(showAddressMenu === address._id ? null : address._id); }}></i>
                      {showAddressMenu === address._id && (
                        <div className="options-menu" style={{ display: "block" }}>
                          <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleEditAddress(address); }}>Edit Address</div>
                          {!address.isDefault && (
                            <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleSetDefaultAddress(address._id); }}>Set as Default</div>
                          )}
                          <div className="menu-item delete" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address._id); }}>Delete Address</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses. Please add a delivery address.</p>
            )}

            <button className="yellow-btn" onClick={() => { resetForm(); setShowModal(true); }}>Add New Delivery Address</button>
          </div>

          <div className="payment-section grey-box">
            <h3 className="section-title" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onClick={() => setShowPayment(!showPayment)}>
              Payment Method
              <i className="fa-solid fa-chevron-down" style={{ transform: showPayment ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}></i>
            </h3>

            {showPayment && (
              <form className="payment-options">
                <div className="option-row">
                  <input type="radio" id="card" name="payment" value="card" checked={selectedPayment === "card"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <label htmlFor="card">Card or Debit Card</label>
                </div>
                <div className="option-row">
                  <input type="radio" id="netbanking" name="payment" value="netbanking" checked={selectedPayment === "netbanking"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <label htmlFor="netbanking">Net Banking</label>
                </div>
                <div className="option-row">
                  <input type="radio" id="upi" name="payment" value="upi" checked={selectedPayment === "upi"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <label htmlFor="upi">Scan and Pay with UPI</label>
                </div>
                <div className="option-row">
                  <input type="radio" id="other_upi" name="payment" value="other_upi" checked={selectedPayment === "other_upi"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <label htmlFor="other_upi">Other UPI Apps</label>
                </div>
                <div className="option-row">
                  <input type="radio" id="emi" name="payment" value="emi" checked={selectedPayment === "emi"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <label htmlFor="emi">EMI</label>
                </div>
                <div className="option-row">
                  <input type="radio" id="cod" name="payment" value="cod" checked={selectedPayment === "cod"} onChange={(e) => setSelectedPayment(e.target.value)} />
                  <label htmlFor="cod">Cash on Delivery<p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>A convenience fee of ₹15 will apply</p></label>
                </div>
              </form>
            )}
          </div>

          {/* <div className="payment-section grey-box" style={{ marginTop: "20px" }}>
            <h3 className="section-title">Order Items ({getTotalItems()})</h3>
            <div style={{ marginTop: "15px" }}>
              {checkoutItems.map((item) => (
                <div key={item._id} style={{ display: "flex", gap: "15px", padding: "15px", borderBottom: "1px solid #eee" }}>
                  <img src={item.product?.images?.[0] ? getImageUrl(item.product.images[0]) : "https://via.placeholder.com/80x80?text=No+Image"}
                    alt={item.product?.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0" }}>{item.product?.name}</h4>
                    {item.selectedColor && (<p style={{ fontSize: "12px", color: "#666", margin: "3px 0" }}>Color: {item.selectedColor.name}</p>)}
                    <p style={{ fontSize: "12px", color: "#666", margin: "3px 0" }}>Quantity: {item.quantity}</p>
                    <p style={{ fontWeight: "600", color: "#333", margin: "5px 0 0 0" }}>₹{formatPrice(item.priceAtAdd * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <div className="checkout-right">
          <div className="summary-card grey-box">
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div className="summary-line"><span>No. Of Items:</span><span className="line">{getTotalItems()}</span></div>
            <div className="summary-line"><span>Subtotal:</span><span className="line">₹{formatPrice(subtotal)}</span></div>
            <div className="summary-line"><span>Delivery Charges:</span><span className="line" style={{ color: deliveryCharges === 0 ? "green" : "#333" }}>
              {deliveryCharges === 0 ? "FREE" : `₹${formatPrice(deliveryCharges)}`}</span></div>
            <hr />
            <div className="summary-line total"><span>Order Total:</span><span className="line" style={{ fontWeight: "bold" }}>₹{formatPrice(total)}</span></div>
            <button className="deliver-here-btn" onClick={handlePlaceOrder} disabled={!selectedAddress || !selectedPayment}
              style={{ opacity: !selectedAddress || !selectedPayment ? 0.6 : 1, cursor: !selectedAddress || !selectedPayment ? "not-allowed" : "pointer" }}>
              Place Order
            </button>
            {(!selectedAddress || !selectedPayment) && (
              <p style={{ fontSize: "12px", color: "#ff4444", marginTop: "10px", textAlign: "center" }}>
                {!selectedAddress && "Please select an address"}{!selectedAddress && !selectedPayment && " and "}{!selectedPayment && "select a payment method"}
              </p>
            )}
          </div>
        </div>
      </main>

      <div className="help-content">
        <p>Need help? Check our <a href="#">Help Page</a> or <a href="#">Contact Us</a></p>
        <p>When your order is placed, we'll send you an e-mail message acknowledging receipt of your order. If you
            choose to pay using an electronic payment method (credit card, debit card or net banking), you will be
            directed to your bank's website to complete your payment. Your contract to purchase an item will not be
            complete until we receive your electronic payment and dispatch your item. If you choose to pay using Pay on
            Delivery (POD), you can pay using cash/card/net banking when you receive your item.</p>
        <p className="help-content-pstyle">See Rmax Solutions's <a href="#">Return Policy</a></p>
      </div>

      <div className="cart-btn"><button className="deliver-here-btna" onClick={() => navigate("/cart")}>Back to Cart</button></div>

      <footer className="dark-footer">
        <div className="footer-links"><a href="#">Conditions of Use</a><a href="#">Privacy Policy</a><a href="#">Help</a></div>
        <p>© 2022–2026, RMAX Solutions Private Limited.com, Inc. or its affiliates</p>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
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
                <button type="submit" className="save-btn">{editingAddress ? "UPDATE" : "SAVE"}</button>
                <div className="footer-note">By continuing, you agree to RMAX Solution's <a href="#">Conditions of Use</a> and <a href="#">Privacy Policy</a>.</div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;