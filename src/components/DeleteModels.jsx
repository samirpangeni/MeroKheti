import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  message,
  confirmText
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        className=" w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full bg-red-100 p-3 dark:bg-red-950/40">
              <AlertTriangle
                className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">
                {type}
              </h2>
              <p className="text-sm text-muted">
                This action cannot be undone
              </p>
            </div>
          </div>
          {/* CLOSE */}
          <button
            onClick={onClose}
            className=" rounded-full p-2 text-muted transition hover:bg-muted-background hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        {/* BODY */}
        <div className="p-5">
          <p className="leading-relaxed text-muted">
            {message}
          </p>
        </div>
        {/* FOOTER */}
        <div
          className=" flex justify-end gap-3 border-t border-border bg-muted-background/50 p-5">

          {/* CANCEL */}
          <button
            onClick={onClose}
            className=" rounded-xl border border-border bg-card px-5 py-2 font-medium text-card-foreground transition hover:bg-muted-background">
            Cancel
          </button>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 font-semibold text-foreground transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;