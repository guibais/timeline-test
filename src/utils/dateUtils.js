export const parseDate = (dateString) => new Date(dateString);

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const formatDateForDisplay = (date) => {
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatDateWithYear = (date) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const getDaysBetween = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const getDateRange = (items) => {
  const allDates = items.flatMap(item => [item.start, item.end]);
  const dates = allDates.map(parseDate);
  return {
    min: new Date(Math.min(...dates)),
    max: new Date(Math.max(...dates))
  };
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
