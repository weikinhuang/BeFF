interface SearchObject {
  [k: number]: SearchObject | string;
  [k: string]: SearchObject | string;
}

export interface BeWindow {
  getOrigin(): string;

  getLocation<K extends keyof Location>(key?: K): string;

  open(url?: string, target?: string, features?: string, replace?: boolean): Window | null;

  isIframe(): boolean;

  setLocation(location: string): void;

  replaceLocation(location: string): void;

  reloadLocation(): void;

  getProtocol(): string;

  getPath(): string;

  getSearchObject(): SearchObject;
}

declare const _default: BeWindow;
export default _default;
