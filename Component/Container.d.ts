import { ClassBuilder } from '@behance/nbd/Class';
import {ControllerInstance} from "../Controller";
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface ContainerInstance extends ComponentInstance {
  new($view: JQuery): this;

  decorate<T = ControllerInstance>(dataOrEl: any): T;

  forwardEvents(event: string, ...args: any[]): void;

  add<T = ControllerInstance>(resultset: any): T[];
  remove<T = ControllerInstance>(node: T): void;
  empty(): JQuery;
  isEmpty(): boolean;
  getNodes(): any[];
}

export interface ContainerConstructorProps extends ComponentConstructorProps<ContainerInstance> {
  new($view: JQuery): ContainerInstance;

  init<T = ControllerInstance>($view: JQuery, Controller: T): T;
}

export interface ContainerConstructor<I extends ContainerInstance = ContainerInstance> extends ContainerConstructorProps, ClassBuilder<I> {
  new($view: JQuery): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ContainerConstructor<T> & G & ContainerConstructorProps;
}

declare const _default: ContainerConstructor;
export default _default;
