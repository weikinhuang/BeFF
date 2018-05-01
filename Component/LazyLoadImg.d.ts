import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface LazyLoadImgInstance extends ComponentInstance {
  new($elem: JQuery): this;
}

export interface LazyLoadImgConstructorProps extends ComponentConstructorProps<LazyLoadImgInstance> {
  new($elem: JQuery): LazyLoadImgInstance;

  init($elem: JQuery): LazyLoadImgInstance;

  createObserver(): void;

  changeHandler(changes: any[]): void;
}

export interface LazyLoadImgConstructor<I extends LazyLoadImgInstance = LazyLoadImgInstance> extends LazyLoadImgConstructorProps, ClassBuilder<I> {
  new($elem: JQuery): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): LazyLoadImgConstructor<T> & G & LazyLoadImgConstructorProps;
}

declare const _default: LazyLoadImgConstructor;
export default _default;
