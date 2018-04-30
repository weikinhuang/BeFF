import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

interface ZenDeskConfig {
  subdomain?: string;

  identify?: {
    name?: string;
    email?: string;
    externalId?: string;
  };

  [k: string]: any;
}

export interface ZenDeskInstance extends ComponentInstance {
  new(config: ZenDeskConfig): this;
}

export interface ZenDeskConstructorProps extends ComponentConstructorProps<ZenDeskInstance> {
  new(config: ZenDeskConfig): ZenDeskInstance;

  init(config: ZenDeskConfig): ZenDeskInstance;
}

export interface ZenDeskConstructor<I extends ZenDeskInstance = ZenDeskInstance> extends ZenDeskConstructorProps, ClassBuilder<I> {
  new(config: ZenDeskConfig): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ZenDeskConstructor<T> & G & ZenDeskConstructorProps;
}

declare const _default: ZenDeskConstructor;
export default _default;
