import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentConstructorProps,
} from '../Component';
import {
  InfiniteLoaderInstance,
  InfiniteLoaderConstructorProps,
  InfiniteLoaderConstructor,
} from './InfiniteLoader';

export interface InfiniteContainerInstance extends InfiniteLoaderInstance {

  new(loaderOptions?: any): this;

  hasMoreResults<T = any>(...args: any[]): T;

  getNextOffset(...args: any[]): number;

  loaded(...args: any[]): void;

  at($context: JQuery): this;

  of(Klass: any): this;

  bind(model: any, firstLoad: boolean): this;

  isEmpty(): boolean;
}

export interface InfiniteContainerConstructorProps extends ComponentConstructorProps<InfiniteContainerInstance> {
  new(loaderOptions?: any): InfiniteContainerInstance;

  init(loaderOptions?: any): InfiniteContainerInstance;
}

export interface InfiniteContainerConstructor<I extends InfiniteContainerInstance = InfiniteContainerInstance> extends InfiniteContainerConstructorProps, ClassBuilder<I> {
  new(loaderOptions?: any): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): InfiniteContainerConstructor<T> & G & InfiniteContainerConstructorProps;
}

declare const _default: InfiniteContainerConstructor;
export default _default;
