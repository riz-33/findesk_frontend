import React, { useState } from "react";

export const EmployeePayslips = () => {
  // Mock payslip data for the logged-in employee
  const [payslips] = useState([
    {
      id: "PAY-2026-06",
      month: "June 2026",
      grossSalary: "\$4,200.00",
      deductions: "\$750.00",
      netSalary: "\$3,450.00",
      status: "Dispatched",
      issueDate: "2026-07-01",
      breakdown: {
        basic: "\$3,000.00",
        allowances: "\$1,200.00",
        taxTds: "\$550.00",
        providentFund: "\$200.00",
      },
      fileName: "EMP-101_June_2026_Payslip.pdf",
    },
    {
      id: "PAY-2026-05",
      month: "May 2026",
      grossSalary: "\$4,200.00",
      deductions: "\$750.00",
      netSalary: "\$3,450.00",
      status: "Dispatched",
      issueDate: "2026-06-01",
      breakdown: {
        basic: "\$3,000.00",
        allowances: "\$1,200.00",
        taxTds: "\$550.00",
        providentFund: "\$200.00",
      },
      fileName: "EMP-101_May_2026_Payslip.pdf",
    },
    {
      id: "PAY-2026-04",
      month: "April 2026",
      grossSalary: "\$4,000.00",
      deductions: "\$700.00",
      netSalary: "\$3,300.00",
      status: "Dispatched",
      issueDate: "2026-05-01",
      breakdown: {
        basic: "\$2,800.00",
        allowances: "\$1,200.00",
        taxTds: "\$500.00",
        providentFund: "\$200.00",
      },
      fileName: "EMP-101_April_2026_Payslip.pdf",
    },
  ]);

  const [selectedPayslip, setSelectedPayslip] = useState(null); // Detail modal

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Payslips & Salary Statements</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View monthly payroll breakdowns, tax withholdings, and download official PDF statements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
            🟢 Payroll Active
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Net Salary</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{payslips[0]?.netSalary}</h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">June 2026</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Statements</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{payslips.length}</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Archived</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Withheld (YTD)</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">\$1,600.00</h3>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Verified</span>
          </div>
        </div>
      </div>

      {/* Payslips Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Payslip History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Pay Cycle Month</th>
                <th className="py-3 px-6">Gross Salary</th>
                <th className="py-3 px-6">Deductions</th>
                <th className="py-3 px-6">Net Salary</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {payslips.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">{item.month}</td>
                  <td className="py-4 px-6 text-slate-600">{item.grossSalary}</td>
                  <td className="py-4 px-6 text-red-600 font-medium">-{item.deductions}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{item.netSalary}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedPayslip(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                    >
                      View Breakdown
                    </button>
                    <button
                      onClick={() => alert(`Downloading ${item.fileName}`)}
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

      {/* Payslip Breakdown Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedPayslip.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Salary Breakdown - {selectedPayslip.month}</h2>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Earnings */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Earnings</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Basic Salary</span>
                    <span className="font-semibold text-slate-900">{selectedPayslip.breakdown.basic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Allowances & Bonuses</span>
                    <span className="font-semibold text-slate-900">{selectedPayslip.breakdown.allowances}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                    <span className="text-slate-900">Gross Total</span>
                    <span className="text-slate-900">{selectedPayslip.grossSalary}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Deductions</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax / TDS Withholding</span>
                    <span className="font-semibold text-red-600">-{selectedPayslip.breakdown.taxTds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Provident Fund (PF)</span>
                    <span className="font-semibold text-red-600">-{selectedPayslip.breakdown.providentFund}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                    <span className="text-slate-900">Total Deductions</span>
                    <span className="text-red-600">-{selectedPayslip.deductions}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Net Take-Home Pay</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{selectedPayslip.netSalary}</p>
                </div>
                <button
                  onClick={() => alert(`Downloading ${selectedPayslip.fileName}`)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  Download Official PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};