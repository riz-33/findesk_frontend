import React, { useState } from "react";

export const EmployeeProfile = () => {
  // Mock logged-in employee profile data
  const [profile, setProfile] = useState({
    empId: "EMP-101",
    name: "Muhammad Rizwan",
    email: "rizwan.quettawala@findesk.com",
    phone: "+92 300 1234567",
    department: "Engineering",
    designation: "Full-Stack Software Engineer",
    role: "Employee",
    joinedDate: "February 15, 2025",
    officeLocation: "Karachi HQ, Floor 4",
    bankAccount: "HBL •••• 4092",
    emergencyContact: "Ameen Quettawala (+92 321 9876543)",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordMsg("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordMsg(""), 3000);
  };

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
          <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
            👤 {profile.empId}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl font-medium text-center">
          {successMsg}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {profile.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {profile.designation} • {profile.department}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={profile.emergencyContact}
                  onChange={(e) =>
                    setProfile({ ...profile, emergencyContact: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Corporate Email
              </span>
              <span className="font-medium text-slate-900">
                {profile.email}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Phone Number
              </span>
              <span className="font-medium text-slate-900">
                {profile.phone}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Office Location
              </span>
              <span className="font-medium text-slate-900">
                {profile.officeLocation}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Salary Bank Account
              </span>
              <span className="font-medium text-slate-900">
                {profile.bankAccount}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Emergency Contact
              </span>
              <span className="font-medium text-slate-900">
                {profile.emergencyContact}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Date Joined
              </span>
              <span className="font-medium text-slate-900">
                {profile.joinedDate}
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
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
