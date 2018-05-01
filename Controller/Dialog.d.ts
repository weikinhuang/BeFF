import {
  ControllerConstructor as BeffControllerConstructor,
  ControllerInstance as BeffControllerInstance,
} from '../Controller';

export interface ControllerInstance extends BeffControllerInstance {
  setContext($context: JQuery): void;
  render($context: JQuery): Promise<JQuery>;
  toggle($context: JQuery): void;
}

export interface ControllerConstructor<I extends ControllerInstance> extends BeffControllerConstructor<I> {
}

declare const _default: ControllerConstructor<ControllerInstance>;
export default _default;
