import { ClassBuilder } from '@behance/nbd/Class';
import { PubSubTrait } from "@behance/nbd/trait/pubsub";
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface InfiniteLoaderInstance extends ComponentInstance, PubSubTrait {
  breakpoint: number;
  offsetKey: string;
  offset: number;
  data: any;
  url: string;
  type: string;

  new(context?: any, offset?: number, contentContext?: any): this;

  hasMoreResults(...args: any[]): any;

  getNextOffset(...args: any[]): any;

  loaded(...args: any[]): any;

  resetParams(offset: number, data: any, url: string): this;

  setParams(offset: number, data: any, url: string): this;

  load(): Promise<any>;

  reload(offset: number, data: any, url: string): Promise<any>;
}

export interface InfiniteLoaderConstructorProps extends ComponentConstructorProps<InfiniteLoaderInstance> {
  new(context?: any, offset?: number, contentContext?: any): InfiniteLoaderInstance;

  init(context?: any, offset?: number, contentContext?: any): InfiniteLoaderInstance;
}

export interface InfiniteLoaderConstructor<I extends InfiniteLoaderInstance = InfiniteLoaderInstance> extends InfiniteLoaderConstructorProps, ClassBuilder<I> {
  new(context?: any, offset?: number, contentContext?: any): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): InfiniteLoaderConstructor<T> & G & InfiniteLoaderConstructorProps;
}

declare const _default: InfiniteLoaderConstructor;
export default _default;
