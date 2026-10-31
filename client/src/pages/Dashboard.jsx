import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/applications";
import StatusBadge from "../components/placements/StatusBadge";
import { formatDate } from "../utils/format";

const statusOrder = [
  "wishlist",
  "applied",
  "online test",
  "interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

const daysLeftText = (deadline) => {
  const days = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
};

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function CompanyRow({ app, right }) {
  return (
    <Link
      to={`/placements/${app._id}`}
      className="flex items-center justify-between gap-3 rounded-lg p-3 hover:bg-slate-50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">
          {app.companyName}
        </p>
        <p className="truncate text-xs text-slate-500">{app.role}</p>
      </div>
      {right}
    </Link>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your stats")
      );
  }, []);

  const count = (status) => stats?.byStatus[status] || 0;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
      <p className="mt-1 text-slate-500">
        {user?.course} · Semester {user?.semester} · {user?.college}
      </p>

      {error && (
        <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      {!stats && !error && <p className="mt-6 text-slate-500">Loading...</p>}

      {stats && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-slate-800">
            Placement journey
          </h2>

          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Companies tracked" value={stats.total} />
            <StatCard
              label="In progress"
              value={count("applied") + count("online test") + count("interview")}
            />
            <StatCard label="Offers" value={count("offer") + count("accepted")} />
            <StatCard label="Rejected" value={count("rejected")} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800">By status</h3>
              <p className="mt-1 text-xs text-slate-500">
                On-campus: {stats.byCategory["on-campus"]} · Off-campus:{" "}
                {stats.byCategory["off-campus"]}
              </p>

              {stats.total === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  Nothing tracked yet.{" "}
                  <Link to="/placements" className="text-indigo-600 hover:underline">
                    Add your first company
                  </Link>
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {statusOrder.map((status) => (
                    <li key={status}>
                      <div className="flex justify-between text-sm">
                        <span className="capitalize text-slate-600">{status}</span>
                        <span className="text-slate-500">{count(status)}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${(count(status) / stats.total) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-800">Upcoming deadlines</h3>
                {stats.upcomingDeadlines.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">No upcoming deadlines.</p>
                ) : (
                  <div className="mt-2">
                    {stats.upcomingDeadlines.map((app) => (
                      <CompanyRow
                        key={app._id}
                        app={app}
                        right={
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-700">
                              {daysLeftText(app.deadline)}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatDate(app.deadline)}
                            </p>
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-800">Recently added</h3>
                {stats.recent.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">No companies yet.</p>
                ) : (
                  <div className="mt-2">
                    {stats.recent.map((app) => (
                      <CompanyRow
                        key={app._id}
                        app={app}
                        right={<StatusBadge status={app.status} />}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;