interface ListenerMap {
  [key: string]: (e: KeyboardEvent) => void;
}

interface UxKeyboard {
  on(map: ListenerMap): void;
  off(): void;
  add(map: ListenerMap): void;
  global(map: ListenerMap): void;
}

declare const _default: UxKeyboard;
export default _default;
