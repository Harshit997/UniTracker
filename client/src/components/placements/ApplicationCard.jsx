import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate, formatPackage } from "../../utils/format";

function ApplicationCard({ application }) {
  return (
    <Link
      to={`/placements/${application._id}`}
      className="block rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {application.companyName}
          </h3>
          <p className="text-sm text-slate-500">{application.role}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <p className="mt-3 text-sm capitalize text-slate-600">
        {application.jobType} · {application.workMode}
        {application.location && ` · ${application.location}`}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
        <span>
          Package:{" "}
          {formatPackage(application.packageAmount, application.packageUnit)}
        </span>
        <span>Deadline: {formatDate(application.deadline)}</span>
        <span>HRs: {application.hrs.length}</span>
      </div>
    </Link>
  );
}

export default ApplicationCard;