interface RemoteLogger {
  xhr: any;

  log(level: string, channel: string, message: string, context: any): this;
  info(channel: string, message: string, context: any): this;
  error(channel: string, message: string, context: any): this;
  send<T = any>(): Promise<T>;
  getQueue(): any[];
  getSafeSearch(): any;
  init(): void;
  destroy(): void;
}

declare const _default: RemoteLogger;
export default _default;
