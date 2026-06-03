export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${className}`}
        {...props}
      />
      {error ? <span className="mt-2 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}
