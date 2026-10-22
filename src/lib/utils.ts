export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatYearRange(startDate: string, endDate?: string, isCurrent?: boolean) {
  const start = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
    new Date(startDate),
  );

  if (isCurrent) {
    return `${start} — Present`;
  }

  if (!endDate) {
    return start;
  }

  const end = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
    new Date(endDate),
  );

  return `${start} — ${end}`;
}
