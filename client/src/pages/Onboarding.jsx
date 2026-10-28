import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [college, setCollege] = useState(user?.college || "");
  const [course, setCourse] = useState(user?.course || "");
  const [semester, setSemester] = useState(user?.semester || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", {
        college,
        course,
        semester: Number(semester),
      });
      updateUser({
        college: data.college,
        course: data.course,
        semester: data.semester,
      });
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
        <h1 className="text-2xl font-bold text-indigo-600">Welcome, {user?.name}</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          Tell us a bit about your studies
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700">College</label>
        <input
          type="text"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          required
          className="mt-1 mb-4 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />

        <label className="block text-sm font-medium text-slate-700">
          Course / Branch
        </label>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          placeholder="e.g. B.Tech Computer Science"
          className="mt-1 mb-4 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />

        <label className="block text-sm font-medium text-slate-700">
          Current semester
        </label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
          className="mt-1 mb-6 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        >
          <option value="" disabled>
            Select semester
          </option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default Onboarding;