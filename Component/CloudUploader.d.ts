// @todo: add types from fine uploader
import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

interface CloudUploaderConfig {
  multiple?: boolean;
  disabled?: boolean;
  messages?: {
    [k: string]: string;
  };
  text?: {
    defaultResponseError?: string;
  };

  // additional options for cloud uploader
  [k: string]: any;
}

export interface CloudUploaderInstance extends ComponentInstance {
  new(config: CloudUploaderConfig): this;

  addFiles(files: any): void;

  reset(): void;

  setDropElement(element: HTMLElement): this;

  getUploadEndpoint(): string;

  getUploadPath(id: number): string;

  choose(idx?: number): void;

  cancelAll(): void;

  formatSize(sizeInBytes: number): string;

  setMultiple(multiple: boolean, idx?: number): this;
}

export interface CloudUploaderConstructorProps extends ComponentConstructorProps<CloudUploaderInstance> {
  new(config: CloudUploaderConfig): CloudUploaderInstance;

  init(config: CloudUploaderConfig): CloudUploaderInstance;

  promises(options: CloudUploaderConfig, files: any[]): any; // extended promises
  promise(options: CloudUploaderConfig, files: any[]): any; // extended promises
  setDropElement(element: HTMLElement, cb: Function): any;
}

export interface CloudUploaderConstructor<I extends CloudUploaderInstance = CloudUploaderInstance> extends CloudUploaderConstructorProps, ClassBuilder<I> {
  new(config: CloudUploaderConfig): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): CloudUploaderConstructor<T> & G & CloudUploaderConstructorProps;
}

declare const _default: CloudUploaderConstructor;
export default _default;
