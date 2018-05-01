export interface scrollpoint {
  (breakpoint: string | number | { [bp: string]: Function; }, callback?: Function, context?: any): void;
  on: scrollpoint;
  off(): void;
}

declare const _default: scrollpoint;
export default _default;
