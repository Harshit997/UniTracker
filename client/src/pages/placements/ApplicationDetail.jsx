import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getApplication,
  updateApplication,
  deleteApplication,
} from "../../api/applications";
import StatusBadge from "../../components/placements/StatusBadge";
import ApplicationForm from "../../components/placements/ApplicationForm";
import { formatDate, formatPackage } from "../../utils/format";
import HrSection from "../../components/placements/HrSection";
import CommentSection from "../../components/placements/CommentSection";

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

function Info({ label, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm capitalize text-slate-700">{children || "—"}</p>
    </div>
  );
}

function ExternalLink({ url }) {
  if (!url) return "—";
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="normal-case text-indigo-600 hover:underline"
    >
      Open link
    </a>
  );
}

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getApplication(id)
      .then(setApplication)
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load this company")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (e) => {
    try {
      const updated = await updateApplication(id, { status: e.target.value });
      setApplication(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    }
  };

  const handleEdit = async (payload) => {
    const updated = await updateApplication(id, payload);
    setApplication(updated);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this company? This cannot be undone.")) return;
    try {
      await deleteApplication(id);
      navigate("/placements");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  if (!application) {
    return (
      <div>
        <p className="rounded bg-red-50 p-2 text-sm text-red-600">
          {error || "Company not found"}
        </p>
        <Link to="/placements" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to placements
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link to="/placements" className="text-sm text-indigo-600 hover:underline">
        ← Back to placements
      </Link>

      {error && (
        <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {application.companyName}
            </h1>
            <p className="text-slate-500">{application.role}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">Change status:</label>
          <select
            value={application.status}
            onChange={handleStatusChange}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm capitalize outline-none focus:border-indigo-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="ml-auto rounded bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="rounded px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        <div className="mt-6 grid gap-5 border-t pt-6 sm:grid-cols-3">
          <Info label="Category">{application.category}</Info>
          <Info label="Job type">{application.jobType}</Info>
          <Info label="Work mode">{application.workMode}</Info>
          <Info label="Location">{application.location}</Info>
          <Info label="Source">{application.source}</Info>
          <Info label="Package">
            {formatPackage(application.packageAmount, application.packageUnit)}
          </Info>
          <Info label="Date applied">{formatDate(application.appliedDate)}</Info>
          <Info label="Deadline">{formatDate(application.deadline)}</Info>
          <Info label="Company LinkedIn">
            <ExternalLink url={application.companyLinkedin} />
          </Info>
          <Info label="Career page">
            <ExternalLink url={application.careerPage} />
          </Info>
        </div>
      </div>
      <HrSection application={application} onChange={setApplication} />
      <CommentSection application={application} onChange={setApplication} />
      {showForm && (
        <ApplicationForm
          initial={application}
          category={application.category}
          onSubmit={handleEdit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default ApplicationDetail;