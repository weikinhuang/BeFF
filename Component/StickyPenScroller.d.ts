import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

interface StickyPenScrollerConfig {
  penMargin?: number;
  dropDownMargin?: number;
  moduleClass?: string;
  offset?: number;
  $context?: JQuery;
  leftBoundaryWidth?: number;

  [k: string]: any;
}

export interface StickyPenScrollerInstance extends ComponentInstance {
  new(config: StickyPenScrollerConfig): this;
}

export interface StickyPenScrollerConstructorProps extends ComponentConstructorProps<StickyPenScrollerInstance> {
  new(config: StickyPenScrollerConfig): StickyPenScrollerInstance;

  init(config: StickyPenScrollerConfig): StickyPenScrollerInstance;
}

export interface StickyPenScrollerConstructor<I extends StickyPenScrollerInstance = StickyPenScrollerInstance> extends StickyPenScrollerConstructorProps, ClassBuilder<I> {
  new(config: StickyPenScrollerConfig): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): StickyPenScrollerConstructor<T> & G & StickyPenScrollerConstructorProps;
}

declare const _default: StickyPenScrollerConstructor;
export default _default;
