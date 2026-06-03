"use client";

import { useEffect } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-2xl ring-1 ring-slate-200">
      {isError ? <FiXCircle className="text-rose-500" /> : <FiCheckCircle className="text-emerald-500" />}
      {toast.message}
    </div>
  );
}
