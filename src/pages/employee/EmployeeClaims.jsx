import React, { useState } from "react";

export const EmployeeClaims = () => {
  // Mock data for employee's submitted claims
  const [claims, setClaims] = useState([
    {
      id: "CLM-501",
      type: "Reimbursement",
      category: "Client Travel & Dining",
      amount: "\$180.00",
      submissionDate: "2026-06-10",
      status: "Pending",
      description: "Dinner meeting with enterprise client at Downtown Grill.",
      attachment: "Receipt_Downtown_Grill.pdf",
    },
    {
      id: "CLM-502",
      type: "Tax Declaration",
      category: "Health Insurance Premium",
      amount: "\$650.00",
      submissionDate: "2026-06-08",
      status: "Approved",
      description: "Annual family health insurance premium tax exemption proof.",
      attachment: "Health_Insurance_Policy_2026.pdf",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimType, setClaimType] = useState("Reimbursement");
  const [category, setCategory] = useState("Travel & Transport");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!attachmentFile) return;

    const newClaim = {
      id: `CLM-${Math.floor(100 + Math.random() * 900)}`,
      type: claimType,
      category: category,
      amount: `$${parseFloat(amount).toFixed(2)}`,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      description: description,
      attachment: attachmentFile.name,
    };

    setClaims([newClaim, ...claims]);
    setSuccessMsg("Claim submitted successfully and sent for finance approval!");

    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMsg("");
      setClaimType("Reimbursement");
      setCategory("Travel & Transport");
      setAmount("");
      setDescription("");
      setAttachmentFile(null);
    }, 1500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reimbursements & Tax Declarations</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit out-of-pocket business expenses, travel claims, and annual tax saving exemption proofs.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Submit New Claim
        </button>
      </div>

      {/* Claims Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Claims Submitted</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{claims.length}</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">YTD</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Review</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {claims.filter(c => c.status === "Pending").length}
            </h3>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">In queue</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approved Payouts</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {claims.filter(c => c.status === "Approved").length}
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
          </div>
        </div>
      </div>

      {/* Claims History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">My Claim Submissions History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Claim ID & Category</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Attachment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {claims.length > 0 ? (
                claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">{claim.category}</p>
                      <span className="text-xs font-mono text-blue-600 font-medium">{claim.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                        {claim.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{claim.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">{claim.submissionDate}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {claim.attachment}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                    No claims submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Submit New Claim / Tax Proof</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-lg font-medium text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmitClaim} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Claim Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={claimType}
                    onChange={(e) => {
                      setClaimType(e.target.value);
                      setCategory(e.target.value === "Reimbursement" ? "Travel & Transport" : "Health Insurance");
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Reimbursement">Reimbursement</option>
                    <option value="Tax Declaration">Tax Declaration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {claimType === "Reimbursement" ? (
                      <>
                        <option value="Travel & Transport">Travel & Transport</option>
                        <option value="Client Dining">Client Dining</option>
                        <option value="Internet & Utilities">Internet & Utilities</option>
                        <option value="Office Supplies">Office Supplies</option>
                      </>
                    ) : (
                      <>
                        <option value="Health Insurance">Health Insurance</option>
                        <option value="Provident Fund Voluntary">Provident Fund Voluntary</option>
                        <option value="Education Allowance">Education Allowance</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Claim Amount (\$) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 150.00"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context or receipt details..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Attach Receipt / Proof PDF <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setAttachmentFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-lg p-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Submit Claim
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};