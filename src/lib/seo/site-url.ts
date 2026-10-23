export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  return value && value.length > 0 ? value : "http://localhost:3000";
}

export function getAbsoluteUrl(path = "/") {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}
