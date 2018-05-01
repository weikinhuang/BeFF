interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
}

interface Cookie {
  get(name: string): string | null;
  set(name: string, value: any, options?: CookieOptions): void;
}

declare const _default: Cookie;
export default _default;
