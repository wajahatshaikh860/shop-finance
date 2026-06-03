import { FiCreditCard, FiDollarSign, FiTrendingDown } from "react-icons/fi";
import NetBalanceCard from "@/components/NetBalanceCard";
import { formatCurrency } from "@/utils/formatters";

const cards = [
  { key: "totalCash", label: "Total Cash Till Date", icon: FiDollarSign, tone: "bg-emerald-50 text-emerald-700" },
  { key: "totalOnline", label: "Total Online Till Date", icon: FiCreditCard, tone: "bg-sky-50 text-sky-700" },
  { key: "totalExpense", label: "Total Expense Till Date", icon: FiTrendingDown, tone: "bg-rose-50 text-rose-700" },
];

export default function SummaryCards({ summary, balanceBreakdown }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <NetBalanceCard total={balanceBreakdown?.total} cash={balanceBreakdown?.cash} online={balanceBreakdown?.online} />
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="rounded-xl bg-white p-5 shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(summary?.[card.key])}</p>
              </div>
              <div className={`rounded-xl p-3 ${card.tone}`}>
                <Icon className="text-xl" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
