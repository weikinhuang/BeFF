import {ClassBuilder} from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

interface LazyLoadPictureConfig {
  removeAttributes?: boolean;
  keepDataAttributes?: boolean;

  // used by jquery-lazyload
  [k: string]: any;
}

export interface LazyLoadPictureInstance extends ComponentInstance {
  new($elem: JQuery, options?: LazyLoadPictureConfig): this;
}

export interface LazyLoadPictureConstructorProps extends ComponentConstructorProps<LazyLoadPictureInstance> {
  new($elem: JQuery, options?: LazyLoadPictureConfig): LazyLoadPictureInstance;

  init($elem: JQuery, options?: LazyLoadPictureConfig): LazyLoadPictureInstance;
}

export interface LazyLoadPictureConstructor<I extends LazyLoadPictureInstance = LazyLoadPictureInstance> extends LazyLoadPictureConstructorProps, ClassBuilder<I> {
  new($elem: JQuery, options?: LazyLoadPictureConfig): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): LazyLoadPictureConstructor<T> & G & LazyLoadPictureConstructorProps;
}

declare const _default: LazyLoadPictureConstructor;
export default _default;
