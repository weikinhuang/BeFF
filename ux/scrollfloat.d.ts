export interface scrollfloat {
  (breakpoint: string | number, callback?: Function, context?: any, contentContext?: any): void;
  (callback?: Function, context?: any, contentContext?: any): string;
  on: scrollfloat;
  off(fn: Function, context?: any, contentContext?: any): void;
  check(context?: any, contentContext?: any): void;
}

declare const _default: scrollfloat;
export default _default;
