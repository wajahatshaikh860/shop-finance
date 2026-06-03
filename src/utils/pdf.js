"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "./formatters";

export const downloadDailyReportPdf = (rows, filename = "daily-finance-report.pdf") => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Daily Finance Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDate(new Date())}`, 14, 26);

  autoTable(doc, {
    startY: 34,
    head: [["Date", "Cash Income", "Online Income", "Cash Expense", "Online Expense", "Net"]],
    body: rows.map((row) => [
      formatDate(row.date),
      formatCurrency(row.cashIncome),
      formatCurrency(row.onlineIncome),
      formatCurrency(row.cashExpense),
      formatCurrency(row.onlineExpense),
      formatCurrency(row.net),
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(filename);
};

export const downloadRentReportPdf = (rents, filename = "shop-rent-report.pdf") => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Shop Rent Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${formatDate(new Date())}`, 14, 26);

  autoTable(doc, {
    startY: 34,
    head: [["Month", "Amount", "Paid Date"]],
    body: rents.map((rent) => [
      rent.month,
      formatCurrency(rent.amount),
      rent.paidDate ? formatDate(rent.paidDate) : "-",
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(filename);
};
