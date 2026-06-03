"use client";

import { FiDownload, FiRefreshCcw } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function TransactionFilters({
  filters,
  setFilters,
  onDownloadAll,
  onDownloadFiltered,
  downloading,
  hasRows,
}) {
  const clearFilters = () => setFilters({ date: "", month: "" });

  return (
    <div id="reports" className="rounded-xl bg-white p-5 shadow-md shadow-slate-200/70 ring-1 ring-slate-200">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-end">
        <Input
          label="Date filter"
          type="date"
          value={filters.date}
          onChange={(event) => setFilters({ date: event.target.value, month: "" })}
        />
        <Input
          label="Month filter"
          type="month"
          value={filters.month}
          onChange={(event) => setFilters({ date: "", month: event.target.value })}
        />
        <Button variant="secondary" onClick={clearFilters} type="button">
          <FiRefreshCcw />
          Clear
        </Button>
        <Button variant="dark" onClick={onDownloadAll} type="button" loading={downloading === "all"} disabled={!hasRows}>
          <FiDownload />
          Download All
        </Button>
        <Button onClick={onDownloadFiltered} type="button" loading={downloading === "filtered"} disabled={!hasRows}>
          <FiDownload />
          Download Filtered
        </Button>
      </div>
    </div>
  );
}
