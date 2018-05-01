interface SocialUrlValidator {
  isValid(pattern: RegExp, url: string): boolean;
  normalize(url: string): boolean;
}

declare const _default: SocialUrlValidator;
export default _default;
