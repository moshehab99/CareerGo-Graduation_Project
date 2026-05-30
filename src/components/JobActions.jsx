import React from "react";

const ActionButton = ({ onClick, children, variant = "ghost" }) => {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/30";
  const styles = {
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
    primary:
      "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800",
  };

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
};

const JobActions = ({
  isSaved,
  onToggleSave,
  onShare,
  onHide,
  onApply,
  showApply = true,
  showHide = true,
}) => {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton onClick={onToggleSave}>
          <span className="text-sm leading-none">{isSaved ? "★" : "☆"}</span>
          <span>{isSaved ? "Saved" : "Save"}</span>
        </ActionButton>

        <ActionButton onClick={onShare}>
          <span className="text-sm leading-none">↗</span>
          <span>Share</span>
        </ActionButton>

        {showHide && (
          <ActionButton onClick={onHide}>
            <span className="text-sm leading-none">⊘</span>
            <span>Hide</span>
          </ActionButton>
        )}
      </div>

      {showApply && (
        <ActionButton onClick={onApply} variant="primary">
          Apply
        </ActionButton>
      )}
    </div>
  );
};

export default JobActions;
