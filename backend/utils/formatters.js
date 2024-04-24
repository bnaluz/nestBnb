const createdAndUpdatedFormatter = (date) => {
  const under10Formatter = (num) => {
    if (num < 10) {
      return '0' + num;
    } else return num;
  };

  const year = date.getFullYear();
  const month = under10Formatter(date.getMonth());
  const day = under10Formatter(date.getDate());
  const hours = under10Formatter(date.getHours());
  const min = under10Formatter(date.getMinutes());
  const sec = under10Formatter(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
};

const startAndEndDateFormatter = (date) => {
  return date.toISOString().split('T')[0];
};

module.exports = { createdAndUpdatedFormatter, startAndEndDateFormatter };
