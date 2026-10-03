function getCurrentDateValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function resolveDateInput(value, fallbackValue = getCurrentDateValue()) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return getCurrentDateValue(value);
  }

  return fallbackValue;
}

module.exports = {
  getCurrentDateValue,
  resolveDateInput,
};
