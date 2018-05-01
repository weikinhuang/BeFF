interface UploadValidator {
  CMYK<T = any>(file: T): Promise<T>;
  isCMYK(file: any): boolean;
}

declare const _default: UploadValidator;
export default _default;
