import { useState } from "react";
import { addComment, deleteComment } from "../../api/applications";
import { formatDateTime } from "../../utils/format";

function CommentSection({ application, onChange }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const comments = [...application.comments].reverse();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setError("");
    setLoading(true);
    try {
      const updated = await addComment(application._id, text);
      onChange(updated);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const updated = await deleteComment(application._id, commentId);
      onChange(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment");
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Comments</h2>

      {error && (
        <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleAdd} className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Write a note about this company..."
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="rounded bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add comment"}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No comments yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {comments.map((comment) => (
            <li key={comment._id} className="rounded-lg bg-slate-50 p-3">
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {comment.text}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {formatDateTime(comment.createdAt)}
                </span>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentSection;