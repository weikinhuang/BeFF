import { ClassBuilder } from '@behance/nbd/Class';
import { PubSubTrait } from '@behance/nbd/trait/pubsub';
import { LogTrait } from '@behance/nbd/trait/log';

export interface ComponentInstance extends PubSubTrait, LogTrait {
  new(...args: any[]): this;

  // from nbd class
  _super(...args: any[]): any;
  init(config?: any): void;

  bind(...args: any[]): this;
  unbind(...args: any[]): this;
  destroy(...args: any[]): void;
}

export interface ComponentConstructorProps<I = ComponentInstance> {
  displayName: string;

  init(...args: any[]): I;
}

export interface ComponentConstructor<I extends ComponentInstance = ComponentInstance> extends ComponentConstructorProps<I>, ClassBuilder<I> {
  new(...args: any[]): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ComponentConstructor<T> & G & ComponentConstructorProps;
}

declare const Component: ComponentConstructor;
export default Component;
