import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api.js";

export const EmployeeProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  console.log(user);

  // Editable form state initialized from user context
  const [formData, setFormData] = useState({
    email: "",
    contact: "",
    department: "",
    designation: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Sync user data to form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        contact: user.contact || "",
        department: user.department || "",
        designation: user.designation || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500">Loading profile...</div>
    );
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await api.put(`/auth/update/${user.id}`, formData);
      console.log("Response:", response.data);

      // Update global AuthContext user state
      if (setUser) {
        setUser(response.data.user || response.data);
      }

      setSuccessMsg("Profile details updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      setErrorMsg(error.response?.data?.error || "Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword || !newPassword) return;

    try {
      await api.put(`/auth/update-password`, {
        currentPassword,
        newPassword,
      });
      setPasswordMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError(
        error.response?.data?.error || "Failed to change password.",
      );
    }
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Employee Profile & Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View and manage your personal corporate credentials, bank details,
            and security settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 font-mono">
            👤 {user.empId}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl font-medium text-center">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
          {errorMsg}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {user.designation} • {user.department}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="EXECUTIVE">EXECUTIVE</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="ADMINISTRATION">ADMINISTRATION</option>
                  <option value="MARKETING / SALES">MARKETING / SALES</option>
                  <option value="INFORMATION TECHNOLOGY">
                    INFORMATION TECHNOLOGY
                  </option>
                  <option value="OPERATIONS">OPERATIONS</option>
                  <option value="HUMAN RESOURCE">HUMAN RESOURCE</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Email
              </span>
              <span className="font-medium text-slate-900">{user.email}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Phone Number
              </span>
              <span className="font-medium text-slate-900">
                {user.contact || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Office Location
              </span>
              <span className="font-medium text-slate-900">
                {user.officeLocation || "Karachi HQ, Floor 4"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Salary Bank Account
              </span>
              <span className="font-medium text-slate-900">
                {user.bankDetails?.bankName || user.bank?.bankName || "HBL"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Account Number
              </span>
              <span className="font-medium text-slate-900 font-mono">
                {user.bankDetails?.accountNumber ||
                  user.bank?.accountNumber ||
                  "•••• 4092"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Date Joined
              </span>
              <span className="font-medium text-slate-900">
                {user.joiningDate?.toString().split("T")[0] ||
                  "February 15, 2025"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Security / Password Change Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Security & Password
        </h3>
        <p className="text-xs text-slate-500">
          Update your account password regularly to keep your financial portal
          secure.
        </p>

        {passwordMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl font-medium text-center">
            {passwordMsg}
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
            {passwordError}
          </div>
        )}

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4 max-w-lg pt-2"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
