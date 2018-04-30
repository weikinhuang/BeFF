export interface errorHandler {
  (value?: any): Promise<any>;
  handlers: Function[],
}

declare const _default: errorHandler;
export default _default;
