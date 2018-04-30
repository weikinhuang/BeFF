import {
  ViewConstructorProps as BeffViewConstructorProps,
} from '../../View';
import {
  ViewConstructor as BeffViewDialogConstructor,
  ViewInstance as BeffViewDialogInstance,
} from '../Dialog';

export interface ViewInstance extends BeffViewDialogInstance {
  _selector: string;
}

export interface ViewConstructorProps extends BeffViewConstructorProps {
  Z_INDEX: number;
}

export interface ViewConstructor<I extends ViewInstance> extends ViewConstructorProps, BeffViewDialogConstructor<I> {
  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ViewConstructor<T> & G & ViewConstructorProps;
}

declare const _default: ViewConstructor<ViewInstance>;
export default _default;
