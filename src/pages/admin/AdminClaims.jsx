import React, { useState, useEffect } from "react";
import api from "../../services/api.js";

export const AdminClaims = () => {
  // Mock data for employee reimbursement & tax claims
  const [claims, setClaims] = useState([
    {
      ticketId: "CLM-501",
      employeeName: "Muhammad Rizwan",
      employeeId: "EMP-101",
      type: "Reimbursement",
      category: "Client Travel & Dining",
      description: "\$180.00",
      createdAt: "2026-06-10",
      status: "Open",
      subject: "Dinner meeting with enterprise client at Downtown Grill.",
      attachment: "Receipt_Downtown_Grill.pdf",
    },
    {
      ticketId: "CLM-502",
      employeeName: "Sara Ahmed",
      employeeId: "EMP-108",
      type: "Payroll & Tax",
      category: "Health Insurance Premium",
      description: "\$650.00",
      createdAt: "2026-06-08",
      status: "In Progress",
      subject: "Annual family health insurance premium tax exemption proof.",
      attachment: "Health_Insurance_Policy_2026.pdf",
    },
    {
      ticketId: "CLM-503",
      employeeName: "Bilal Khan",
      employeeId: "EMP-045",
      type: "Reimbursement",
      category: "Internet & Utility Allowance",
      description: "\$75.00",
      createdAt: "2026-06-02",
      status: "Resolved",
      subject: "Home broadband bill for May 2026.",
      attachment: "Broadband_Bill_May.pdf",
    },
  ]);

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Approve or Reject
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await api.put(`/tickets/update-status/${selectedClaim._id}`, {
        status: newStatus,
      });
      console.log("Status updated successfully:", response.data);

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim._id === id || claim.id === id
            ? { ...claim, status: newStatus }
            : claim,
        ),
      );

      if (
        selectedClaim &&
        (selectedClaim._id === id || selectedClaim.id === id)
      ) {
        setSelectedClaim((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setErrorMsg &&
        setErrorMsg("Status update fail. Please try again.");
    }
  };

  // Filter claims
  const filteredClaims = claims.filter((claim) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "Open" && claim.status === "Open") ||
      (activeTab === "Reimbursement" && claim.type === "Reimbursement") ||
      (activeTab === "Payroll & Tax" && claim.type === "Payroll & Tax");

    const matchesSearch =
      claim.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Open":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getTickets = async () => {
    try {
      const response = await api.get("/tickets/all-tickets");
      setClaims(response.data);
      console.log("Fetched tickets:", response.data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setErrorMsg("Failed to load tickets from database.");
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Reimbursements & Tax Proof Approvals
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review employee expense claims, medical/travel bills, and tax
            exemption documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
            ⏳ {claims.filter((c) => c.status === "Open").length} Pending Review
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by ID, Employee, or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {["ALL", "Open", "Reimbursement", "Payroll & Tax"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Claim ID & Employee</th>
                <th className="py-3 px-6">Type & Category</th>
                <th className="py-3 px-6">Claim Description</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">
                        {claim.employeeName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-medium text-blue-600">
                          {claim.ticketId}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {claim.employeeId}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 mb-1">
                        {claim.category}
                      </span>
                      <p className="text-xs text-slate-600 font-medium">
                        {claim.subject}
                      </p>
                    </td>
                    <td className="py-4 px-6  text-slate-700">
                      {claim.description}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(claim.status)}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {claim.createdAt
                        ? new Date(claim.createdAt).toLocaleDateString()
                        : claim.createdAt}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                      >
                        Inspect
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
                    No claims found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail & Approval Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedClaim.ticketId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(selectedClaim.status)}`}
                  >
                    {selectedClaim.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedClaim.category}
                </h2>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase block">
                    Employee
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedClaim.employeeName} ({selectedClaim.employeeId})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase block">
                    Claim
                  </span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {selectedClaim.subject}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedClaim.description}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Attached Verification Document
                </p>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="font-semibold text-slate-800">
                      {selectedClaim.attachment}
                    </span>
                  </div>
                  <button className="text-blue-600 font-semibold hover:underline">
                    Preview
                  </button>
                </div>
              </div>

              {/* Approval Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Update Claim Status:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedClaim.id, "In Progress")
                    }
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-semibold text-xs rounded-xl border border-amber-200 transition-all"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedClaim.id, "Resolved")
                    }
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Resolve Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
