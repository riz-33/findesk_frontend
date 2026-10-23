import React, { useState, useEffect } from "react";
import api from "../../services/api.js";

export const AdminTaxDeclaration = () => {
  const [taxCertificates, setTaxCertificates] = useState([
    {
      id: "TAX-2026-05-101",
      employeeName: "Muhammad Rizwan",
      empId: "EMP-101",
      year: "May 2026",
      taxAmount: "PKR 345.00",
      createdAt: "2026-06-01",
      fileName: "EMP-101_May_2026_TaxDeclaration.pdf",
    },
    {
      id: "TAX-2026-05-108",
      employeeName: "Sara Ahmed",
      empId: "EMP-108",
      year: "May 2026",
      taxAmount: "PKR 500.00",
      createdAt: "2026-06-01",
      fileName: "EMP-108_May_2026_TaxDeclaration.pdf",
    },
    {
      id: "TAX-2026-04-101",
      employeeName: "Muhammad Rizwan",
      empId: "EMP-101",
      year: "April 2026",
      taxAmount: "PKR 250.00",
      createdAt: "2026-05-01",
      fileName: "EMP-101_April_2026_TaxDeclaration.pdf",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");

  // Form States for Uploading Tax Certificate
  const [userId, setUserId] = useState("");
  const [empId, setEmpId] = useState("");
  const [year, setYear] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [certFile, setCertFile] = useState(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch Tax Certificates from Database
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await api.get("/taxcertificate/all");
      setTaxCertificates(response.data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching tax certificates:", error);
      setErrorMsg("Failed to load tax certificates from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // 2. Handle Tax Certificate Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!certFile) {
      setErrorMsg("Please select a PDF file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("empId", empId);
      formData.append("year", year);
      formData.append("taxAmount", taxAmount);
      formData.append("file", certFile);

      await api.post("/taxcertificate/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Tax certificate uploaded successfully!");
      fetchCertificates(); // Refresh list

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSuccessMsg("");
        setErrorMsg("");
        setUserId("");
        setEmpId("");
        setCertFile(null);
      }, 1200);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(
        err.response?.data?.error || "Failed to upload tax certificate.",
      );
    }
  };

  // 3. Delete Tax Certificate
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this tax certificate?")
    )
      return;

    try {
      await api.delete(`/taxcertificate/${id}`);
      setTaxCertificates((prev) => prev.filter((item) => item._id !== id));
      alert("Tax certificate deleted successfully.");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert(error.response?.data?.error || "Failed to delete record.");
    }
  };

  // 4. Download PDF Handler
  const handleDownloadPDF = async (certId, empId, year) => {
    try {
      const response = await api.get(`/taxcertificate/download/${certId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tax_Certificate_${year}_${empId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download tax certificate PDF.");
    }
  };

  // Filters
  const filteredCertificates = taxCertificates.filter((t) => {
    const matchesYear =
      selectedYear === "ALL" || String(t.year) === String(selectedYear);

    const name = t.userId?.name || "";
    const employeeCode = t.empId || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Tax Certificate Management & Distribution
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload and manage employee tax declaration certificates for portal
            access.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm transition-all gap-2"
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
          Upload Tax Declaration
        </button>
      </div>

      {/* Filters & Search Bar */}
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
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Years</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        {/* Tax Certificates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Employee & ID</th>
                <th className="py-3 px-6">Tax Year</th>
                <th className="py-3 px-6">Tax Amount</th>
                <th className="py-3 px-6">Document</th>
                <th className="py-3 px-6">Upload Date</th>
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
              ) : filteredCertificates.length > 0 ? (
                filteredCertificates.map((item) => (
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
                        {item.year}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {item.taxAmount}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">
                        PDF
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleDownloadPDF(item._id, item.empId, item.year)
                          }
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-all"
                        >
                          Download PDF
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-all"
                          title="Delete Record"
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
                    No tax certificate records found.
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
                Upload Employee Tax Declaration
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-600 text-xs rounded-lg font-medium text-center">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  Tax Amount Selection *
                </label>
                <input
                  type="number"
                  required
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Tax Declaration PDF Document *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setCertFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 border rounded-lg p-1.5 cursor-pointer"
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
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
