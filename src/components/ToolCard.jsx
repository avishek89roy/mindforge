import { Link } from "react-router-dom";

export default function ToolCard({
  title,
  description,
  icon,
  status,
  path,
}) {
  const isAvailable = status === "Available" || status === "Next Build";
  const statusColor = status === "Available" 
    ? "bg-green-500/20 text-green-300" 
    : status === "Next Build"
    ? "bg-yellow-500/20 text-yellow-300"
    : "bg-blue-500/20 text-blue-300";

  const CardContent = (
    <>
      <div className="text-blue-400 mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-gray-400 mb-4">
        {description}
      </p>

      <span className={`px-3 py-1 rounded-full text-xs ${statusColor}`}>
        {status}
      </span>
    </>
  );

  if (path && isAvailable) {
    return (
      <Link
        to={path}
        className="
          block
          group
          bg-white/5
          border border-white/10
          rounded-2xl
          p-6
          hover:border-blue-500/50
          hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]
          transition-all
          duration-300
          cursor-pointer
        "
      >
        {CardContent}
      </Link>
    );
  }

  return (
    <div
      className="
      group
      bg-white/5
      border border-white/10
      rounded-2xl
      p-6
      hover:border-blue-500/50
      hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]
      transition-all
      duration-300
      opacity-75
    "
    >
      {CardContent}
    </div>
  );
}
