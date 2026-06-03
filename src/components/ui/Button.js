export default function Button({
  children,
  className = "",
  variant = "primary",
  loading = false,
  disabled = false,
  ...props
}) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  );
}
