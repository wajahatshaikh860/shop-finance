import { FiTrendingUp } from "react-icons/fi";
import { formatCurrency } from "@/utils/formatters";

export default function NetBalanceCard({ total = 0, cash = 0, online = 0 }) {
  return (
    <article className="rounded-xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-900/20 ring-1 ring-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-300">Net Balance</p>
          <p className="mt-3 text-3xl font-black tracking-tight">{formatCurrency(total)}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3 text-emerald-300">
          <FiTrendingUp className="text-xl" />
        </div>
      </div>
      <div className="my-5 h-px bg-white/10" />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/[0.06] p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Cash</p>
          <p className="mt-1 text-lg font-black">{formatCurrency(cash)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.06] p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Online</p>
          <p className="mt-1 text-lg font-black">{formatCurrency(online)}</p>
        </div>
      </div>
    </article>
  );
}
