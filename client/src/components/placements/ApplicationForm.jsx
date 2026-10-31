import { useState } from "react";

const jobTypes = ["full-time", "internship", "internship + ppo"];
const workModes = ["on-site", "remote", "hybrid"];
const statuses = [
  "wishlist",
  "applied",
  "online test",
  "interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

const inputClass =
  "mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function ApplicationForm({ initial, category, onSubmit, onClose }) {
  const [form, setForm] = useState({
    category: initial?.category || category,
    companyName: initial?.companyName || "",
    role: initial?.role || "",
    jobType: initial?.jobType || "full-time",
    workMode: initial?.workMode || "on-site",
    location: initial?.location || "",
    status: initial?.status || "wishlist",
    appliedDate: initial?.appliedDate ? initial.appliedDate.slice(0, 10) : "",
    deadline: initial?.deadline ? initial.deadline.slice(0, 10) : "",
    packageAmount: initial?.packageAmount ?? "",
    packageUnit: initial?.packageUnit || "LPA",
    source: initial?.source || "",
    companyLinkedin: initial?.companyLinkedin || "",
    careerPage: initial?.careerPage || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        appliedDate: form.appliedDate || null,
        deadline: form.deadline || null,
        packageAmount:
          form.packageAmount === "" ? null : Number(form.packageAmount),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 className="mb-4 text-xl font-bold text-slate-800">
          {initial ? "Edit company" : "Add company"}
        </h2>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name *">
            <input name="companyName" value={form.companyName} onChange={handleChange} required className={inputClass} />
          </Field>
          <Field label="Role *">
            <input name="role" value={form.role} onChange={handleChange} required className={inputClass} />
          </Field>

          <Field label="Category">
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option value="on-campus">On-campus</option>
              <option value="off-campus">Off-campus</option>
            </select>
          </Field>
          <Field label="Status">
            <select name="status" value={form.status} onChange={handleChange} className={`${inputClass} capitalize`}>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Job type">
            <select name="jobType" value={form.jobType} onChange={handleChange} className={`${inputClass} capitalize`}>
              {jobTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Work mode">
            <select name="workMode" value={form.workMode} onChange={handleChange} className={`${inputClass} capitalize`}>
              {workModes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Source">
            <input name="source" value={form.source} onChange={handleChange} placeholder="e.g. LinkedIn, college portal" className={inputClass} />
          </Field>

          <Field label="Date applied">
            <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Deadline">
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} />
          </Field>

          <Field label="Package / stipend">
            <input type="number" min="0" name="packageAmount" value={form.packageAmount} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Unit">
            <select name="packageUnit" value={form.packageUnit} onChange={handleChange} className={inputClass}>
              <option value="LPA">LPA</option>
              <option value="per month">per month</option>
            </select>
          </Field>

          <Field label="Company LinkedIn">
            <input name="companyLinkedin" value={form.companyLinkedin} onChange={handleChange} className={inputClass} />
          </Field>
          <Field label="Career page">
            <input name="careerPage" value={form.careerPage} onChange={handleChange} className={inputClass} />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;