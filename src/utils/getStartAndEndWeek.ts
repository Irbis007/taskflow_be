export const getStartAndEndWeek = (weekOffset = 0) => {
  const now = new Date();

  const day = now.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  const start = new Date(now);

  start.setDate(now.getDate() - daysFromMonday - weekOffset * 7);

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return {
    start,
    end,
  };
};
