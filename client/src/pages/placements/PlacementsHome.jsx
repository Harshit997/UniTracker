import { useEffect, useState } from "react";
import { getApplications, createApplication } from "../../api/applications";
import ApplicationCard from "../../components/placements/ApplicationCard";
import ApplicationForm from "../../components/placements/ApplicationForm";

const tabs = [
  { value: "on-campus", label: "On-campus" },
  { value: "off-campus", label: "Off-campus" },
];

function PlacementsHome() {
  const [category, setCategory] = useState("on-campus");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    getApplications(category)
      .then((data) => {
        if (!ignore) setApplications(data);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || "Could not load companies");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [category]);

  const handleCreate = async (payload) => {
    const created = await createApplication(payload);
    setShowForm(false);

    if (created.category === category) {
      setApplications([created, ...applications]);
    } else {
      setCategory(created.category);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Placements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add company
        </button>
      </div>

      <div className="mt-4 flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              category === tab.value
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {error && (
          <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
        )}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-slate-500">No companies here yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard key={app._id} application={app} />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ApplicationForm
          category={category}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default PlacementsHome;