// Function to format the date as "DD.MM.YYYY"
function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("de-DE", options);
};

module.exports = formatDate;