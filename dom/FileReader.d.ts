import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

interface FileReaderLoadResponse {
  size: number;
  name: string;
  mode: string;
  mime: string;
  result: any;
  source: string;
  isImage: boolean;
}

export interface FileReaderInstance extends ComponentInstance {
  reader: FileReader;

  new(): this;

  load(file: File | Blob): Promise<FileReaderLoadResponse>;
}

export interface FileReaderConstructorProps extends ComponentConstructorProps {
  promise(file: File | Blob): Promise<FileReaderLoadResponse>;
}

export interface FileReaderConstructor<I extends FileReaderInstance = FileReaderInstance> extends FileReaderConstructorProps, ClassBuilder<I> {
  new(): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): FileReaderConstructor<T> & G & FileReaderConstructorProps;
}

declare const _default: FileReaderConstructor;
export default _default;
