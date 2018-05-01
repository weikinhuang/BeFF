import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface FormInstance extends ComponentInstance {
  $form: JQuery;
  xhr: any;

  new($context: JQuery): this;

  reset(): this;

  validator(...args: any[]): any;

  commit(): this;

  submit<T = any>(e: Event): Promise<T>;

  toJSON(): { url: string; type: string; data: { [k: string]: any; }; };
}

export interface FormConstructorProps extends ComponentConstructorProps<FormInstance> {
  new($context: JQuery): FormInstance;

  init($context: JQuery): FormInstance;

  decompose(): { [k: string]: any; };

  Error(messages: any[]): void;
}

export interface FormConstructor<I extends FormInstance = FormInstance> extends FormConstructorProps, ClassBuilder<I> {
  new($context: JQuery): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): FormConstructor<T> & G & FormConstructorProps;
}

declare const _default: FormConstructor;
export default _default;
