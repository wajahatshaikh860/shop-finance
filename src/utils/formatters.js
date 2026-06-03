export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const padDatePart = (value) => String(value).padStart(2, "0");

export const toDateKey = (date = new Date()) => {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return [
    parsed.getFullYear(),
    padDatePart(parsed.getMonth() + 1),
    padDatePart(parsed.getDate()),
  ].join("-");
};

export const formatDate = (date) => {
  const dateKey = toDateKey(date);
  if (!dateKey) return "";

  const [year, month, day] = dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

export const toInputDate = (date = new Date()) => toDateKey(date);

export const toInputMonth = (date = new Date()) =>
  toDateKey(date).slice(0, 7);
