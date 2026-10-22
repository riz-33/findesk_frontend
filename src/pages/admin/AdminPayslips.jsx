import React, { useState, useEffect } from "react";
import api from "../../services/api.js";

export const AdminPayslips = () => {
  const [payslips, setPayslips] = useState([
    {
      id: "PAY-2026-05-101",
      name: "Muhammad Rizwan",
      empId: "EMP-101",
      month: "May",
      year: "2026",
      netPay: "\$3,450.00",
      createdAt: "2026-06-01",
      fileType: "EMP-101_May_2026_Payslip.pdf",
    },
    {
      id: "PAY-2026-05-108",
      name: "Sara Ahmed",
      empId: "EMP-108",
      month: "May",
      year: "2026",

      netPay: "\$2,900.00",
      createdAt: "2026-06-01",
      fileType: "EMP-108_May_2026_Payslip.pdf",
    },
    {
      id: "PAY-2026-04-101",
      name: "Muhammad Rizwan",
      empId: "EMP-101",
      month: "April",
      year: "2026",
      netPay: "\$3,450.00",
      createdAt: "2026-05-01",
      fileType: "EMP-101_April_2026_Payslip.pdf",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("ALL");

  // Form states for uploading new payslip
  const [userId, setUserId] = useState("");
  const [empId, setEmpId] = useState("");
  const [month, setMonth] = useState("October");
  const [year, setYear] = useState(2026);
  const [basicSalary, setBasicSalary] = useState("");
  const [houseRentAllowance, setHouseRentAllowance] = useState("0");
  const [utilityAllowance, setUtilityAllowance] = useState("0");
  const [medicalAllowance, setMedicalAllowance] = useState("0");
  const [taxDeduction, setTaxDeduction] = useState("0");
  const [payslipFile, setPayslipFile] = useState(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch Payslips from Database
  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const response = await api.get("/payslips/all-payslips");
      setPayslips(response.data);
      console.log(response.data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching payslips:", error);
      setErrorMsg("Failed to load payslips from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  // 2. Real API Form Submit Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!payslipFile) {
      setErrorMsg("Please select a PDF or Excel file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("empId", empId);
      formData.append("month", month);
      formData.append("year", year);
      formData.append("basicSalary", basicSalary);
      formData.append("houseRentAllowance", houseRentAllowance);
      formData.append("utilityAllowance", utilityAllowance);
      formData.append("medicalAllowance", medicalAllowance);
      formData.append("taxDeduction", taxDeduction);
      formData.append("file", payslipFile);

      await api.post("/payslips/add-payslip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Payslip uploaded and dispatched successfully!");
      fetchPayslips(); // Refresh list

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSuccessMsg("");
        setErrorMsg("");
        setUserId("");
        setEmpId("");
        setBasicSalary("");
        setPayslipFile(null);
      }, 1200);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.response?.data?.error || "Failed to upload payslip.");
    }
  };

  // 3. Real Dynamic PDF Download Handler
  const handleDownloadPDF = async (payslipId, empId, month, year) => {
    try {
      const response = await api.get(`/payslips/download-pdf/${payslipId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${empId}_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF payslip.");
    }
  };

  // 4. Fixed Search & Month Filter
  const filteredPayslips = payslips.filter((p) => {
    const matchesMonth =
      selectedMonthFilter === "ALL" || p.month === selectedMonthFilter;
    const name = p.userId?.name || "";
    const employeeCode = p.empId || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

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
            />
          </svg>
          Upload New Payslip
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
            {["ALL", "October", "September", "August"].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonthFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedMonthFilter === m
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Payslips Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Employee & ID</th>
                <th className="py-3 px-6">Pay Cycle</th>
                <th className="py-3 px-6">Net Pay</th>
                <th className="py-3 px-6">Document Type</th>
                <th className="py-3 px-6">Date Uploaded</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    Loading payslip records...
                  </td>
                </tr>
              ) : filteredPayslips.length > 0 ? (
                filteredPayslips.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">
                        {item.userId?.name || "N/A"}
                      </p>
                      <span className="text-xs font-mono text-blue-600 font-medium">
                        {item.empId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                        {item.month} {item.year}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      PKR {item.netPay?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.fileType === "PDF"
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {item.fileType || "PDF"}
                        </span>
                        {/* <span className="truncate max-w-[180px]">
                          {item.fileUrl}
                        </span> */}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          handleDownloadPDF(
                            item._id,
                            item.empId,
                            item.month,
                            item.year,
                          )
                        }
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
                    No payslip records found matching your filters.
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
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                Upload Employee Payslip
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

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    User Mongo ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User _id"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    placeholder="e.g. TB0000128"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pay Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="October">October</option>
                    <option value="September">September</option>
                    <option value="August">August</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pay Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Basic Salary (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Payslip File (PDF / Excel){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => setPayslipFile(e.target.files[0])}
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
