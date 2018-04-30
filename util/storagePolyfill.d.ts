interface StoragePolyfill {
  storage: Storage;
  run(): void;
  _hasStorageAPI(): boolean;
  _attemptStoragePatch(): void;
}

declare const _default: StoragePolyfill;
export default _default;
