export function formatCurrencyNOK(value: number) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function packagePrice(pricePerSqm: number, sqmPerPackage: number) {
  return Math.round(pricePerSqm * sqmPerPackage);
}

export function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}
