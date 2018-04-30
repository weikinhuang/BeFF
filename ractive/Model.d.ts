import { Ractive, Observe } from 'ractive';
import { ClassBuilder } from '@behance/nbd/Class';
import { PubSubTrait } from '@behance/nbd/trait/pubsub';

export interface ModelInstance extends PubSubTrait /*, NbdModelInstance */ { // cannot use extends b/c of incompatible set return signature
  new(id: string, ractive: Ractive): this;

  // from nbd class
  _super(...args: any[]): any;
  init(id: string, ractive: Ractive): void;

  _id: string;
  _observer: Observe;

  _data: any;
  readonly ractive: any;

  destroy(): void;
  id(): void;
  get(prop: string): any;
  get(): Object; // from ractive's typedef
  set(prop: string, value: any): boolean;
  set(map: Object): boolean;
  updateModel(path: string): boolean;
  unset(path: string): void;
  data(): any;
  toJSON(): any;
}

export interface ModelConstructorProps {
  displayName: string;

  completePath(context: string, local: string): string;
  matchIdentity(ctxt: any, ident: string): boolean;
  findByIdentity(context: any, identity: string): any | void;
}

export interface ModelConstructor<I extends ModelInstance = ModelInstance> extends ModelConstructorProps, ClassBuilder<I> {
  new(...args: any[]): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ModelConstructor<T> & G;
}

declare const Model: ModelConstructor;
export default Model;
