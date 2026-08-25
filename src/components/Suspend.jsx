import React from "react";

const Suspend = ({
  isSuspend,
  onClose,
  onConfirm,
  type,
  message,
  reason,
  setReason,
  days,
  setDays,
}) => {
  if (!isSuspend) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      {/* Modal */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">

        {/* ================= HEADER ================= */}
        <div className="border-b border-border px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <span className="text-lg text-red-600 dark:text-red-400">
                !
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                {type} User
              </h2>

              <p className="mt-1 text-sm text-muted">
                {message}
              </p>
            </div>
          </div>

        </div>

        {/* ================= BODY ================= */}
        <div className="space-y-6 px-6 py-6">

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Suspension Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Enter the reason for suspending this user..."
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/20"
            />

            <p className="mt-2 text-xs text-muted">
              Explain clearly why this user is being suspended.
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Suspension Duration
            </label>

            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
            </select>

            <p className="mt-2 text-xs text-muted">
              Default suspension duration is{" "}
              <span className="font-semibold text-foreground">
                7 days
              </span>
              .
            </p>
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/60 dark:bg-red-950/20">
            <p className="text-sm leading-5 text-red-700 dark:text-red-400">
              The user will not be able to access their account during the
              suspension period.
            </p>
          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-end gap-3 border-t border-border bg-card/50 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(days, reason)}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Confirm {type}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Suspend;