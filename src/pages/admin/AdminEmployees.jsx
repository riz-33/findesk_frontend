import React, { useState, useContext, useEffect } from "react";
import api from "../../services/api.js";

export const AdminEmployees = () => {
  // Mock data for registered corporate employees
  const [employees, setEmployees] = useState([
    {
      empId: "EMP-101",
      name: "Muhammad Rizwan",
      email: "rizwan.quettawala@findesk.com",
      department: "Engineering",
      role: "Employee",
      status: "Active",
      joinedDate: "2025-02-15",
    },
    {
      empId: "EMP-108",
      name: "Sara Ahmed",
      email: "sara.ahmed@findesk.com",
      department: "Marketing",
      role: "Employee",
      status: "Active",
      joinedDate: "2025-05-10",
    },
    {
      empId: "EMP-045",
      name: "Bilal Khan",
      email: "bilal.khan@findesk.com",
      department: "Finance & Accounts",
      role: "Admin",
      status: "Active",
      joinedDate: "2024-11-20",
    },
    {
      empId: "EMP-092",
      name: "Ayesha Malik",
      email: "ayesha.malik@findesk.com",
      department: "HR",
      role: "Admin",
      status: "Active",
      joinedDate: "2025-01-05",
    },
    {
      empId: "EMP-210",
      name: "Usman Tariq",
      email: "usman.tariq@findesk.com",
      department: "Operations",
      role: "Employee",
      status: "Inactive",
      joinedDate: "2025-08-12",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding new employee via modal
  const [newEmpId, setNewEmpId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newRole, setNewRole] = useState("Employee");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle adding employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Backend API call with await
      const response = await api.post("/auth/register", {
        empId: newEmpId,
        name: newName,
        email: newEmail,
        department: newDept,
        role: newRole,
        password: newPassword,
      });

      const newEmployee = {
        empId: newEmpId,
        name: newName,
        email: newEmail,
        department: newDept,
        role: newRole,
        status: "Active",
        joinedDate: new Date().toISOString().split("T")[0],
      };

      setEmployees([newEmployee, ...employees]);
      setIsAddModalOpen(false);

      // Reset form
      setNewEmpId("");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMsg(
        error.response?.data?.error ||
          "Failed to register employee. Try again.",
      );
    }
  };

  // Toggle status (Active / Inactive)
  const toggleStatus = (id) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.empId === id
          ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" }
          : emp,
      ),
    );
  };

  // Filtered employees list
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept =
      filterDepartment === "ALL" || emp.department === filterDepartment;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      setEmployees(response.data);
      console.log("Fetched users:", response.data);
      setErrorMsg("Failed to load employees from database.");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Corporate Employee Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage company personnel, departmental access, and role assignments.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add New Employee
        </button>
      </div>

      {/* Search & Department Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by ID, Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {[
              "ALL",
              "Information Technology",
              "Marketing / Sales",
              "Finance",
              "HR",
              "Operations",
            ].map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterDepartment === dept
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Employees Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Employee ID & Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Access Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Joined Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.empId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">{emp.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-medium text-blue-600">
                          {emp.empId}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {emp.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium text-xs">
                      {emp.department}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                          emp.role === "Admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : emp.joinedDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleStatus(emp.empId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          emp.status === "Active"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {emp.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    No employees found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                Add New Corporate Employee
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    placeholder="e.g. EMP-105"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. john.doe@findesk.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance & Accounts">
                      Finance & Accounts
                    </option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Temporary Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
