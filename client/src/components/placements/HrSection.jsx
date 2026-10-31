import { useState } from "react";
import { addHr, updateHr, deleteHr } from "../../api/applications";

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

function Row({ label, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm text-slate-700">{children || "—"}</p>
    </div>
  );
}

function HrForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    designation: initial?.designation || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    linkedin: initial?.linkedin || "",
    response: initial?.response || "No response yet",
    notes: initial?.notes || "",
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
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-lg bg-slate-50 p-4">
      {error && (
        <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </Field>
        <Field label="Designation">
          <input name="designation" value={form.designation} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Email">
          <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Phone">
          <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="LinkedIn">
          <input name="linkedin" value={form.linkedin} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Response">
          <input name="response" value={form.response} onChange={handleChange} className={inputClass} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Notes">
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={inputClass} />
        </Field>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save HR"}
        </button>
      </div>
    </form>
  );
}

function HrSection({ application, onChange }) {
  const [selectedId, setSelectedId] = useState("");
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");

  const hrs = application.hrs;
  const selected = hrs.find((h) => h._id === selectedId) || hrs[0];

  const handleAdd = async (data) => {
    const updated = await addHr(application._id, data);
    onChange(updated);
    setSelectedId(updated.hrs[updated.hrs.length - 1]._id);
    setMode(null);
  };

  const handleEdit = async (data) => {
    const updated = await updateHr(application._id, selected._id, data);
    onChange(updated);
    setMode(null);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${selected.name}?`)) return;
    try {
      const updated = await deleteHr(application._id, selected._id);
      onChange(updated);
      setSelectedId("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove HR");
    }
  };

  const linkedinHref = selected?.linkedin
    ? selected.linkedin.startsWith("http")
      ? selected.linkedin
      : `https://${selected.linkedin}`
    : "";

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">HRs</h2>
        {mode === null && (
          <button
            onClick={() => setMode("add")}
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Add HR
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      {mode === "add" && (
        <HrForm onSubmit={handleAdd} onCancel={() => setMode(null)} />
      )}

      {hrs.length === 0 && mode !== "add" && (
        <p className="mt-3 text-sm text-slate-500">No HRs added yet.</p>
      )}

      {selected && mode !== "add" && (
        <div className="mt-4">
          <select
            value={selected._id}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setMode(null);
            }}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 sm:w-72"
          >
            {hrs.map((hr) => (
              <option key={hr._id} value={hr._id}>
                {hr.name}
                {hr.designation && ` — ${hr.designation}`}
              </option>
            ))}
          </select>

          {mode === "edit" ? (
            <HrForm
              initial={selected}
              onSubmit={handleEdit}
              onCancel={() => setMode(null)}
            />
          ) : (
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Name">{selected.name}</Row>
                <Row label="Designation">{selected.designation}</Row>
                <Row label="Email">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="text-indigo-600 hover:underline">
                      {selected.email}
                    </a>
                  )}
                </Row>
                <Row label="Phone">
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="text-indigo-600 hover:underline">
                      {selected.phone}
                    </a>
                  )}
                </Row>
                <Row label="LinkedIn">
                  {linkedinHref && (
                    <a href={linkedinHref} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                      Open profile
                    </a>
                  )}
                </Row>
                <Row label="Response">{selected.response}</Row>
              </div>
              {selected.notes && (
                <div className="mt-4">
                  <Row label="Notes">{selected.notes}</Row>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setMode("edit")}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HrSection;