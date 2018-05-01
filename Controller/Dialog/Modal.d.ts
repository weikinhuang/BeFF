import { PromiseTrait } from '@behance/nbd/trait/promise';
import { ControllerConstructorProps as NbdControllerConstructorProps } from '@behance/nbd/Controller';
import {
  ControllerConstructor as DialogControllerConstructor,
  ControllerInstance as DialogControllerInstance,
} from '../Dialog';

export interface ControllerInstance<T = any> extends DialogControllerInstance, PromiseTrait<T> {
  confirm(): void;
  cancel(): void;
}

export interface ControllerConstructorProps<T> extends NbdControllerConstructorProps<T> {
  init(options: any, promiseGenerator?: any): T;

  // VIEW_CLASS: Popup,
}

export interface ControllerConstructor<I extends ControllerInstance> extends DialogControllerConstructor<I> {
  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ControllerConstructor<T> & G & ControllerConstructorProps<T>;
}

declare const _default: ControllerConstructor<ControllerInstance>;
export default _default;
