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
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");

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

  // Bulk Upload Form States
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkSummary, setBulkSummary] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);

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

  const handleDeletePayslip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payslip?"))
      return;

    try {
      await api.delete(`/payslips/${id}`);
      setPayslips((prev) => prev.filter((item) => item._id !== id));
      alert("Payslip deleted successfully.");
    } catch (error) {
      console.error("Error deleting payslip:", error);
      alert(error.response?.data?.error || "Failed to delete payslip.");
    }
  };

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

  // 3. Bulk Excel Upload Handler
  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      setErrorMsg("Please select an Excel file (.xlsx / .xls).");
      return;
    }

    setBulkLoading(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("excelFile", bulkFile);

      const response = await api.post("/payslips/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBulkSummary(response.data.summary);
      setSuccessMsg(response.data.message);
      fetchPayslips(); // Refresh list
    } catch (err) {
      console.error("Bulk upload error:", err);
      setErrorMsg(err.response?.data?.error || "Bulk upload failed.");
    } finally {
      setBulkLoading(false);
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

  const filteredPayslips = payslips.filter((p) => {
    const matchesMonth = selectedMonth === "ALL" || p.month === selectedMonth;
    const matchesYear =
      selectedYear === "ALL" || String(p.year) === String(selectedYear);

    const name = p.userId?.name || "";
    const employeeCode = p.empId || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMonth && matchesYear && matchesSearch;
  });

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Payslip Management & Distribution
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload individual or bulk Excel salary statements for employees.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setBulkSummary(null);
              setBulkFile(null);
              setIsBulkModalOpen(true);
            }}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all gap-2"
          >
            📊 Bulk Excel Upload
          </button>

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
            Upload Single Payslip
          </button>
        </div>
      </div>

      {/* Dynamic Filters Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by Employee ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Month Dropdown Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Months</option>
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Year Dropdown Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
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
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Date Uploaded</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    Loading records...
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
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.fileType === "PDF"
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {item.fileType || "PDF"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Download PDF Button */}
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

                        {/* Delete Action Button */}
                        <button
                          onClick={() => handleDeletePayslip(item._id)}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-all"
                          title="Delete Payslip"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    No payslips found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. SINGLE UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">
                Upload Single Payslip
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 font-bold"
              >
                ✕
              </button>
            </div>
            {successMsg && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-600 text-xs rounded-lg text-center font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  required
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="e.g. TB0000128"
                  className="w-full px-3 py-2 rounded-lg border text-sm uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Month *
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Net Salary (PKR) *
                </label>
                <input
                  type="number"
                  required
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  placeholder="150000"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Payslip File (PDF / Excel) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => setPayslipFile(e.target.files[0])}
                  className="w-full text-xs border rounded-lg p-1.5"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. BULK EXCEL UPLOAD MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-emerald-50">
              <h2 className="text-lg font-bold text-emerald-900">
                Bulk Upload Payslips (Excel)
              </h2>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-200 hover:bg-emerald-300 font-bold"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg text-center font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleBulkUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Select Excel Sheet (.xlsx / .xls) *
                </label>
                <input
                  type="file"
                  required
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                  className="w-full text-xs border rounded-lg p-1.5 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Make sure columns include: empId, month, year, basicSalary,
                  taxDeduction, etc.
                </p>
              </div>

              {bulkSummary && (
                <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1 text-slate-700">
                  <p>
                    <strong>Total Rows:</strong> {bulkSummary.totalRows}
                  </p>
                  <p>
                    <strong>Processed Successfully:</strong>{" "}
                    {bulkSummary.processed}
                  </p>
                  <p>
                    <strong>Skipped:</strong> {bulkSummary.skipped}
                  </p>
                  {bulkSummary.errors?.length > 0 && (
                    <div className="text-red-500 max-h-24 overflow-y-auto">
                      <p className="font-bold">Errors:</p>
                      {bulkSummary.errors.map((err, i) => (
                        <p key={i}>- {err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={bulkLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  {bulkLoading ? "Processing Excel..." : "Upload & Parse Excel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
