// Formatteert de datum naar yyyy-MM-dd,
export function formatDate(datum, jaarEerst) {
  datum = new Date(datum);
  const jaar = datum.getFullYear();
  const maand = String(datum.getMonth() + 1).padStart(2, '0');
  const dag = String(datum.getDate()).padStart(2, '0');
  if (jaarEerst) {
    return `${jaar}-${maand}-${dag}`;
  } else {
    return `${dag}-${maand}-${jaar}`;
  }
}  