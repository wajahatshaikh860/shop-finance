"use client";

import { FiAlertTriangle } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function ConfirmationModal({ open, title, message, loading, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8">
      <button className="absolute inset-0 bg-slate-950/60" onClick={onCancel} />
      <section className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <FiAlertTriangle className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </section>
    </div>
  );
}
