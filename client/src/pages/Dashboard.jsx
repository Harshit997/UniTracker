import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Logged in as {user?.name}</p>
      <button
        onClick={logout}
        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white"
      >
        Log out
      </button>
    </div>
  );
}

export default Dashboard;