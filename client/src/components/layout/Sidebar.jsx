import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/placements", label: "Placements" },
  { to: "/academics", label: "Academics", soon: true },
  { to: "/notes", label: "Notes", soon: true },
  { to: "/exams", label: "Exam Prep", soon: true },
  { to: "/documents", label: "Documents", soon: true },
];

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-60 flex-col bg-white p-4 shadow">
      <h1 className="mb-6 text-xl font-bold text-indigo-600">UniTracker</h1>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between rounded px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {link.label}
            {link.soon && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                Soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t pt-4">
        <p className="truncate text-sm font-medium text-slate-700">{user?.name}</p>
        <p className="truncate text-xs text-slate-500">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-3 text-sm text-red-600 hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;