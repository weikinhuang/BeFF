import { ClassBuilder } from '@behance/nbd/Class';
import { LogTrait } from '@behance/nbd/trait/log';
import { PubSubTrait } from '@behance/nbd/trait/pubsub';
import {
  ViewConstructorProps as NbdViewConstructorProps,
  ViewConstructor as NbdViewConstructor,
  ViewInstance as NbdViewInstance,
} from '@behance/nbd/View';
import { EventMappableTrait } from './trait/eventMappable';

export interface ViewInstance extends NbdViewInstance, PubSubTrait, LogTrait, EventMappableTrait {
  mustache: any;
}

export interface ViewConstructorProps extends NbdViewConstructorProps {
  domify(html: string): JQuery;
}

export interface ViewConstructor<I extends ViewInstance> extends ViewConstructorProps, ClassBuilder<I> {
  new(...args: any[]): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ViewConstructor<T> & G & ViewConstructorProps;
}

declare const _default: ViewConstructor<ViewInstance>;
export default _default;
