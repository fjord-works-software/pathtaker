const _base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  return `${_base}${path.startsWith('/') ? path : `/${path}`}`;
}
