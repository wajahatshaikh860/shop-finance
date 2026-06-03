"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiDownload, FiFilter, FiRefreshCcw } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function FilterDropdown({ filters, setFilters, onDownload, downloading, hasRows }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const hasFilters = Boolean(filters.date || filters.month);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const updateDate = (date) => setFilters({ date, month: "" });
  const updateMonth = (month) => setFilters({ date: "", month });
  const clearFilters = () => setFilters({ date: "", month: "" });

  return (
    <section id="reports" className="rounded-xl bg-white p-4 shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div ref={menuRef} className="relative">
          <Button
            type="button"
            variant={open ? "dark" : "secondary"}
            onClick={() => setOpen((current) => !current)}
            className="min-w-28"
          >
            <FiFilter />
            Filter
            {hasFilters ? <span className="h-2 w-2 rounded-full bg-emerald-500" /> : null}
            <FiChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
          </Button>

          <div
            className={`absolute left-0 top-full z-30 mt-2 w-72 origin-top-left rounded-xl bg-white p-3 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 transition duration-200 ${
              open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            <div className="space-y-3">
              <Input label="Date filter" type="date" value={filters.date} onChange={(event) => updateDate(event.target.value)} />
              <Input label="Month filter" type="month" value={filters.month} onChange={(event) => updateMonth(event.target.value)} />
              <Button type="button" variant="secondary" onClick={clearFilters} className="w-full">
                <FiRefreshCcw />
                Clear filter
              </Button>
            </div>
          </div>
        </div>

        <Button type="button" onClick={onDownload} loading={downloading} disabled={!hasRows}>
          <FiDownload />
          Download Report
        </Button>
      </div>
    </section>
  );
}
