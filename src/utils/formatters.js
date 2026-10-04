export function formatCLP(value) {
  if (isNaN(value) || value === null) return '$0';
  return Number(value).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });
}

export function parseCLPInput(value) {
  if (!value) return '';
  const clean = String(value).replace(/\D/g, '');
  return clean === '' ? '' : Number(clean).toLocaleString('es-CL');
}

export function rawNumber(value) {
  if (!value) return 0;
  return Number(String(value).replace(/\D/g, '')) || 0;
}