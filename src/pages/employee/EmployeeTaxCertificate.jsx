import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

export const EmployeeTaxCertificate = () => {
  // Mock tax certificate records for the employee
  const [certificates, setCertificates] = useState([
    {
      id: "TAX-CERT-2025-26",
      year: "2025 - 2026",
      totalIncome: "\$50,400.00",
      taxAmount: "\$6,600.00",
      status: "Verified & Issued",
      createdAt: "2026-05-15",
      fileName: "EMP-101_Tax_Certificate_2025_26.pdf",
      breakdown: {
        q1Tax: "\$1,650.00",
        q2Tax: "\$1,650.00",
        q3Tax: "\$1,650.00",
        q4Tax: "\$1,650.00",
        exemptionClaimed: "\$1,200.00",
      },
    },
    {
      id: "TAX-CERT-2024-25",
      year: "2024 - 2025",
      totalIncome: "\$46,000.00",
      taxAmount: "\$5,800.00",
      status: "Verified & Issued",
      createdAt: "2025-05-10",
      fileName: "EMP-101_Tax_Certificate_2024_25.pdf",
      breakdown: {
        q1Tax: "\$1,450.00",
        q2Tax: "\$1,450.00",
        q3Tax: "\$1,450.00",
        q4Tax: "\$1,450.00",
        exemptionClaimed: "\$950.00",
      },
    },
  ]);

  const [selectedCert, setSelectedCert] = useState(null);

  const fetchTaxCertificate = async () => {
    try {
      const response = await api.get("/taxcertificate/my-certificates");
      setCertificates(response.data);
      console.log(response.data);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching taxcertificate:", error);
      // setErrorMsg("Failed to load payslips from database.");
    }
  };

  useEffect(() => {
    fetchTaxCertificate();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Tax Certificates & Withholding Statements
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Access and download your official annual tax deduction certificates
            (TDS) for corporate tax filing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200">
            🛡️ Tax Compliance Verified
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current FY Tax Withheld
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {certificates[0]?.taxAmount}
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              FY 2025-26
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Available Certificates
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {certificates.length}
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Archived
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tax Exemption Claimed
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              0{/* {certificates[0]?.breakdown.exemptionClaimed || 0} */}
            </h3>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              Approved
            </span>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            Annual Tax Withholding Documents
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Financial Year & ID</th>
                <th className="py-3 px-6">Total Gross Income</th>
                <th className="py-3 px-6">Total Tax Withheld</th>
                <th className="py-3 px-6">Compliance Status</th>
                <th className="py-3 px-6">Issued Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">{cert.year}</p>
                    <span className="text-xs font-mono text-blue-600 font-medium">
                      {cert.empId}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {cert.totalIncome || 0}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {cert.taxAmount}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
                      {cert.status || "status"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                    {cert.createdAt.toString().split("T")[0]}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {/* <button
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                    >
                      View Summary
                    </button> */}
                    <button
                      onClick={() =>
                        handleDownloadPDF(cert._id, cert.empId, cert.year)
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Breakdown Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedCert.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Tax Certificate - FY {selectedCert.financialYear}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Q1 Tax Deduction (Jul - Sep)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedCert.breakdown.q1Tax}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Q2 Tax Deduction (Oct - Dec)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedCert.breakdown.q2Tax}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Q3 Tax Deduction (Jan - Mar)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedCert.breakdown.q3Tax}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Q4 Tax Deduction (Apr - Jun)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedCert.breakdown.q4Tax}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Approved Tax Exemptions
                  </span>
                  <span className="font-semibold text-purple-600">
                    -{selectedCert.breakdown.exemptionClaimed}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-base">
                  <span className="text-slate-900">
                    Total Tax Withheld (TDS)
                  </span>
                  <span className="text-slate-900">
                    {selectedCert.totalTaxWithheld}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Official Filing Document
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate max-w-[240px]">
                    {selectedCert.fileName}
                  </p>
                </div>
                <button
                  onClick={() => alert(`Downloading ${selectedCert.fileName}`)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
