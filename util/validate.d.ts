interface Test {
  test: (body: string, ...args: any[]) => boolean;
  message: string | Function;
}

export interface validate {
  (body: string, rules: string): string;
  tests: { [k: string]: Test; };
  message?: string;
}

declare const _default: validate;
export default _default;
