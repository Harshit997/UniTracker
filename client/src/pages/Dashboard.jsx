import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
      <p className="mt-1 text-slate-500">
        {user?.course} · Semester {user?.semester} · {user?.college}
      </p>
    </div>
  );
}

export default Dashboard;