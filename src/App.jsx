import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

import AppLayout from "./components/layout/AppLayout";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminEmployees } from "./pages/admin/AdminEmployees";
import { AdminPayslips } from "./pages/admin/AdminPayslips";
import { AdminTaxDeclaration } from "./pages/admin/AdminTaxDeclaration";
import { AdminClaims } from "./pages/admin/AdminClaims";

import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { EmployeePayslips } from "./pages/employee/EmployeePayslips";
import { EmployeeTaxCertificate } from "./pages/employee/EmployeeTaxCertificate";
import { EmployeeClaims } from "./pages/employee/EmployeeClaims";
import { EmployeeProfile } from "./pages/employee/EmployeeProfile";
import { EmployeeAddTicket } from "./pages/employee/EmployeeAddTicket";

function App() {
  return (
    <Router>
      <SpeedInsights />
      <Analytics />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/payslips" element={<AdminPayslips />} />
          <Route
            path="/admin/tax-declarations"
            element={<AdminTaxDeclaration />}
          />
          <Route path="/admin/claims" element={<AdminClaims />} />

          <Route path="/emp/dashboard" element={<EmployeeDashboard />} />
          <Route path="/emp/payslips" element={<EmployeePayslips />} />
          <Route
            path="/emp/tax-certificate"
            element={<EmployeeTaxCertificate />}
          />
          <Route path="/emp/add-ticket" element={<EmployeeAddTicket />} />
          <Route path="/emp/claims" element={<EmployeeClaims />} />

          <Route path="/emp/profile" element={<EmployeeProfile />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
