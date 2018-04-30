import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface TwitterTrackInstance extends ComponentInstance {
  trackPageView(): Promise<void>;
}

export interface TwitterTrackConstructorProps extends ComponentConstructorProps<TwitterTrackInstance> {
}

export interface TwitterTrackConstructor<I extends TwitterTrackInstance = TwitterTrackInstance> extends TwitterTrackConstructorProps, ClassBuilder<I> {
  new(...args: any[]): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): TwitterTrackConstructor<T> & G & TwitterTrackConstructorProps;
}

declare const _default: TwitterTrackConstructor;
export default _default;
