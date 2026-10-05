const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const todayString = () => {
  const tz = process.env.APP_TIMEZONE || "Asia/Kolkata";
  return new Date().toLocaleDateString("en-CA", { timeZone: tz });
};

const isValidDateString = (s) => {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
};

const toDayNumber = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};

module.exports = { todayString, isValidDateString, toDayNumber };
