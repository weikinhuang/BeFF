interface CsrfCookie {
  get(): string;
  expire(): void;
}

declare const _default: CsrfCookie;
export default _default;
