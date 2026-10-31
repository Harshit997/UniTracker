const styles = {
  wishlist: "bg-slate-100 text-slate-600",
  applied: "bg-blue-100 text-blue-700",
  "online test": "bg-amber-100 text-amber-700",
  interview: "bg-purple-100 text-purple-700",
  offer: "bg-green-100 text-green-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-200 text-gray-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        styles[status] || styles.wishlist
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;