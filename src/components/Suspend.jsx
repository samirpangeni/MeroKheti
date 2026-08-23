import React from "react";

const Suspend = ({ isSuspend, onClose, onConfirm, type, message, reason, setReason, days, setDays }) => {
    if (!isSuspend) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-card shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="border-b px-6 py-4">
                    <h2 className="text-2xl font-bold text-foreground">
                        {type} User
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        {message}
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">

                    {/* Reason */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Suspension Reason
                        </label>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Enter the reason for suspending this user..."
                            className=" w-full resize-none rounded-xl border border-input-border bg-input px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30" />
                    </div>

                    {/* Days */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-muted">
                            Suspension Duration (Days)
                        </label>

                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="w-full rounded-xl border p-3 text-background">
                            <option value={1}>1 Day</option>
                            <option value={3}>3 Days</option>
                            <option value={7}>7 Days (Default)</option>
                            <option value={14}>14 Days</option>
                            <option value={30}>30 Days</option>
                            <option value={90}>90 Days</option>
                        </select>
                        <p className="mt-2 text-xs text-muted">
                            Default suspension is <strong>7 days</strong>. You can increase or decrease it.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t bg-background px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-border px-5 py-2.5 font-medium text-muted transition hover:bg-muted"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(days, reason)}
                        className=" rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 active:scale-95 dark:bg-red-500 dark:hover:bg-red-600">
                        Confirm {type}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Suspend;