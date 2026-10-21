import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const EmployeeAddTicket = () => {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrorMessage("File size should not exceed 5MB.");
      setAttachment(null);
      return;
    }
    setErrorMessage("");
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create FormData if uploading files to backend (Multer)
      const formData = new FormData();
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("subject", subject);
      formData.append("description", description);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      // TODO: Replace with your actual backend API call
      // await axios.post('/api/tickets', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      // });

      console.log("Submitting Ticket:", {
        category,
        priority,
        subject,
        description,
        attachment,
      });

      setSuccessMessage("Financial query raised successfully! Redirecting...");

      setTimeout(() => {
        navigate("/emp/dashboard");
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to raise ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Raise Financial Query
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit salary, tax, reimbursement, or loan inquiries directly to the
            finance operations team.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-lg font-medium text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Query Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
              >
                <option value="">Select category</option>
                <option value="Salary">Salary / Payslip</option>
                <option value="Taxes">Tax / TDS Deduction</option>
                <option value="Reimbursement">
                  Expense Reimbursement (Travel/Food)
                </option>
                <option value="Loan">Loan / Advance</option>
                <option value="Other">Other Financial Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
              >
                <option value="Low">Low - General Question</option>
                <option value="Medium">Medium - Normal Processing</option>
                <option value="High">High - Urgent Verification Needed</option>
                <option value="Urgent">
                  Urgent - Immediate Action Required
                </option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Missing overtime allowance in May payslip"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete context, dates, or breakdown of your financial inquiry..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-medium"
            />
          </div>

          {/* File Attachment Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Supporting Document / Receipt{" "}
              <span className="text-slate-400 font-normal">
                (Optional, Max 5MB)
              </span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <svg
                    className="w-8 h-8 mb-2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  {attachment ? (
                    <p className="text-sm font-semibold text-blue-600 truncate max-w-xs">
                      {attachment.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-xs text-slate-600 font-medium">
                        <span className="font-semibold text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        PDF, PNG, JPG or DOCX (MAX. 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Submitting Query...
                </span>
              ) : (
                "Submit Financial Query"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
