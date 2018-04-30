import {
  ViewConstructorProps as BeffViewConstructorProps,
} from '../../View';
import {
  ViewConstructor as BeffViewDialogConstructor,
  ViewInstance as BeffViewDialogInstance,
} from '../Dialog';

export interface ViewInstance extends BeffViewDialogInstance {
}

export interface ViewConstructor<I extends ViewInstance> extends BeffViewDialogConstructor<I> {
}

declare const _default: ViewConstructor<ViewInstance>;
export default _default;
