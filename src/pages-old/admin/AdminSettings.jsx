import { useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin/AdminDashboard.css';

const AdminSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "RMAX Solutions",
    supportEmail: "support@rmaxsolutions.com",
    contactNumber: "+91 98765 43210",
    address: "Mansarovar, Jaipur, Rajasthan, India",
    enableCod: true,
    enableSandbox: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard" style={{ padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600", color: "#333" }}>System Settings</h2>
        </div>

        <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", maxWidth: "800px" }}>
          <form onSubmit={handleSaveSettings}>
            <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px", color: "#444" }}>General Info</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#666" }}>Site Name</label>
                <input 
                  type="text" 
                  name="siteName" 
                  value={settings.siteName} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#666" }}>Support Email</label>
                <input 
                  type="email" 
                  name="supportEmail" 
                  value={settings.supportEmail} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#666" }}>Contact Number</label>
                <input 
                  type="text" 
                  name="contactNumber" 
                  value={settings.contactNumber} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#666" }}>Site Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={settings.address} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>
            </div>

            <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px", color: "#444" }}>Payment Settings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input 
                  type="checkbox" 
                  id="enableCod"
                  name="enableCod" 
                  checked={settings.enableCod} 
                  onChange={handleInputChange}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="enableCod" style={{ fontSize: "15px", color: "#444", fontWeight: "500", cursor: "pointer" }}>Enable Cash On Delivery (COD)</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input 
                  type="checkbox" 
                  id="enableSandbox"
                  name="enableSandbox" 
                  checked={settings.enableSandbox} 
                  onChange={handleInputChange}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="enableSandbox" style={{ fontSize: "15px", color: "#444", fontWeight: "500", cursor: "pointer" }}>Enable Payment Sandbox Testing Mode</label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                background: "#f5a623",
                color: "#fff",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 2px 8px rgba(245,166,35,0.3)",
                transition: "all 0.2s"
              }}
            >
              {isSubmitting ? "SAVING..." : "SAVE SETTINGS"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
