export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(dateStringOrObj: string | Date): string {
  const d = new Date(dateStringOrObj);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateOnly(dateStringOrObj: string | Date): string {
  const d = new Date(dateStringOrObj);
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimeOnly(dateStringOrObj: string | Date): string {
  const d = new Date(dateStringOrObj);
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function calculateDurationInHours(startTime: string | Date, endTime: string | Date): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffMs = end - start;
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
}
