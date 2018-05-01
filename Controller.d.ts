import { ViewInstance, ViewConstructor } from './View';
import { LogTrait } from '@behance/nbd/trait/log';
import { ResponsiveTrait } from '@behance/nbd/trait/responsive';
import {
  ControllerConstructorProps,
  ControllerConstructor as NbdControllerConstructor,
  ControllerInstance as NbdControllerInstance,
} from '@behance/nbd/Controller';
import { EventMappableTrait } from './trait/eventMappable';

export interface ControllerInstance extends NbdControllerInstance, ResponsiveTrait, LogTrait, EventMappableTrait {
  new(id: string, data: any, ...args: any[]): this;
}

export interface ControllerConstructor<I extends ControllerInstance> extends NbdControllerConstructor<I> {
  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ControllerConstructor<T> & G & ControllerConstructorProps<T>;
}

declare const _default: ControllerConstructor<ControllerInstance>;
export default _default;
