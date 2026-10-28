import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

export const EmployeeDashboard = () => {
  // Mock data for employee's raised tickets
  const [tickets, setTickets] = useState([
    // {
    //   id: "TICK-1024",
    //   category: "Tax / TDS Deduction",
    //   subject: "Discrepancy in Q3 tax withholding certificate",
    //   priority: "High",
    //   status: "In Progress",
    //   date: "2026-06-10",
    // },
    // {
    //   id: "TICK-1018",
    //   category: "Expense Reimbursement",
    //   subject: "Client dinner bill reimbursement claim",
    //   priority: "Medium",
    //   status: "Resolved",
    //   date: "2026-06-02",
    // },
    // {
    //   id: "TICK-0995",
    //   category: "Salary / Payslip",
    //   subject: "Overtime allowance missing in May payslip",
    //   priority: "Urgent",
    //   status: "Open",
    //   date: "2026-05-28",
    // },
  ]);

  // Status badge style helper
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

  // Priority badge style helper
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Medium":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getTickets = async () => {
    try {
      const response = await api.get("/tickets/my-tickets");
      setTickets(response.data);
      console.log("Fetched tickets:", response.data);
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
      {/* Top Header Banner & Raise Ticket Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Employee Financial Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track your finance queries, reimbursement requests, and payroll
            updates.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Queries
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {tickets.length}
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              All time
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Open / Pending
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {tickets.filter((t) => t.status !== "Resolved").length}
            </h3>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              In review
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Resolved
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {tickets.filter((t) => t.status === "Resolved").length}
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Completed
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Next Payslip
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900">June 30</h3>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Raised Queries
          </h2>
          <Link
            to="/emp/claims"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-6">Ticket ID & Subject</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">
                        {ticket.subject.toUpperCase()}
                      </p>
                      <span className="text-xs font-mono text-slate-500">
                        {ticket.ticketId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {ticket.category}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(ticket.priority)}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {ticket.createdAt.toString().split("T")[0]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    No claims submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
