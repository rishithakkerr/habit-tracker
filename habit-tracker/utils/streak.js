const { toDayNumber } = require("./dates");

const calculateStreak = (dates, today) => {
  const days = [...new Set(dates.map(toDayNumber))].sort((a, b) => a - b);
  const todayNum = toDayNumber(today);

  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0, loggedToday: false };
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  const set = new Set(days);
  const loggedToday = set.has(todayNum);
  let cursor = loggedToday ? todayNum : todayNum - 1;
  let current = 0;
  while (set.has(cursor)) {
    current++;
    cursor--;
  }

  return { currentStreak: current, longestStreak: longest, loggedToday };
};

module.exports = { calculateStreak };