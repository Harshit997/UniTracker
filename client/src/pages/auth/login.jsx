import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold text-indigo-600">UniTracker</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">Log in to continue</p>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 mb-4 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />

        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 mb-6 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          New here?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;