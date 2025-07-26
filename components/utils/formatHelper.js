export const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "0.00";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};


export const formatDate = (date) => {
  if (date === null) {
    return "";
  } else {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
};

export const formatDateWithTime = (dateStr) => {
  const date = new Date(dateStr);

  const options = {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const parts = formatter.formatToParts(date);

  const yyyy = parts.find(p => p.type === 'year').value;
  const mm = parts.find(p => p.type === 'month').value;
  const dd = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  const ampm = parts.find(p => p.type === 'dayPeriod').value.toUpperCase();

  return `${yyyy}-${mm}-${dd}, ${hour}:${minute}${ampm}`;
};


