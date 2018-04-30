import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface CharCounterInstance extends ComponentInstance {
}


export interface CharCounterConstructor<I extends CharCounterInstance = CharCounterInstance> extends ComponentConstructorProps<CharCounterInstance>, ClassBuilder<I> {
  new(...args: any[]): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): CharCounterConstructor<T> & G & ComponentConstructorProps;
}

declare const _default: CharCounterConstructor;
export default _default;
