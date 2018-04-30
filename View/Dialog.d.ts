import {
  ViewConstructor as BeffViewConstructor,
  ViewInstance as BeffViewInstance,
} from '../View';

export interface ViewInstance extends BeffViewInstance {
  init(model: any): this;

  dialogTemplate: any;
  dialogData: any;
  _shown: boolean;
  _shownClass: string;

  _bindButtons($view: JQuery): void;
  position(): void;
  _transitionEnd(): Promise<any>;
  show(): this;
  hide(): this;
  toggle(): this;
}

export interface ViewConstructor<I extends ViewInstance> extends BeffViewConstructor<I> {
}

declare const _default: ViewConstructor<ViewInstance>;
export default _default;
