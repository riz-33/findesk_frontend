import React, { useState } from "react";

export const AdminTaxDeclaration = () => {
  // Mock data for existing uploaded tax declarations
  const [taxDeclarations, setTaxDeclarations] = useState([
    {
      id: "TAX-2026-05-101",
      employeeName: "Muhammad Rizwan",
      employeeId: "EMP-101",
      month: "May 2026",
      taxAmount: "\$345.00",
      uploadDate: "2026-06-01",
      fileName: "EMP-101_May_2026_TaxDeclaration.pdf",
    },
    {
      id: "TAX-2026-05-108",
      employeeName: "Sara Ahmed",
      employeeId: "EMP-108",
      month: "May 2026",
      taxAmount: "\$345.00",
      uploadDate: "2026-06-01",
      fileName: "EMP-108_May_2026_TaxDeclaration.pdf",
    },
    {
      id: "TAX-2026-04-101",
      employeeName: "Muhammad Rizwan",
      employeeId: "EMP-101",
      month: "April 2026",
      taxAmount: "\$345.00",
      uploadDate: "2026-05-01",
      fileName: "EMP-101_April_2026_TaxDeclaration.pdf",
    },
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("ALL");

  // Form states for uploading new tax declaration
  const [employeeId, setEmployeeId] = useState("");
  const [payMonth, setPayMonth] = useState("June 2026");
  const [taxAmount, setTaxAmount] = useState("");
  const [taxDeclarationFile, setTaxDeclarationFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!taxDeclarationFile) return;

    const newEntry = {
      id: `TAX-${Date.now()}`,
      employeeName:
        employeeId === "EMP-101" ? "Muhammad Rizwan" : "Corporate Employee",
      employeeId: employeeId,
      month: payMonth,
      taxAmount: `$${taxAmount}`,
      uploadDate: new Date().toISOString().split("T")[0],
      fileName: taxDeclarationFile.name,
    };

    setTaxDeclarations([newEntry, ...taxDeclarations]);
    setSuccessMsg("Tax declaration uploaded and dispatched successfully!");

    setTimeout(() => {
      setIsUploadModalOpen(false);
      setSuccessMsg("");
      setEmployeeId("");
      setTaxAmount("");
      setTaxDeclarationFile(null);
    }, 1200);
  };

  // Filter tax declarations
  const filteredTaxDeclarations = taxDeclarations.filter((t) => {
    const matchesMonth =
      selectedMonthFilter === "ALL" || t.month === selectedMonthFilter;
    const matchesSearch =
      t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Payslip Management & Distribution
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload monthly salary statements and tax deduction breakdowns for
            employee portals.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            ></path>
          </svg>
          Upload Tax Declaration
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Employee ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {["ALL", "June 2026", "May 2026", "April 2026"].map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonthFilter(month)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedMonthFilter === month
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Tax Declarations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Employee & Record ID</th>
                <th className="py-3 px-6">Pay Cycle</th>
                <th className="py-3 px-6">Tax Amount</th>
                <th className="py-3 px-6">Document Name</th>
                <th className="py-3 px-6">Upload Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredTaxDeclarations.length > 0 ? (
                filteredTaxDeclarations.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">
                        {item.employeeName}
                      </p>
                      <span className="text-xs font-mono text-blue-600 font-medium">
                        {item.employeeId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                        {item.month}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {item.taxAmount}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <svg
                          className="w-4 h-4 text-red-500"
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
                        <span className="truncate max-w-[180px]">
                          {item.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {item.uploadDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => alert(`Downloading ${item.fileName}`)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-all"
                      >
                        Download PDF
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
                    No tax declaration records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                Upload Employee Tax Declaration
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
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

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. EMP-101"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pay Cycle Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="June 2026">June 2026</option>
                    <option value="May 2026">May 2026</option>
                    <option value="April 2026">April 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tax Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  placeholder="e.g. 3,450.00"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tax Declaration PDF Document{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setTaxDeclarationFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-lg p-1.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Upload & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
