export interface AttachDomTrait {
  attach($els: JQuery): void;

  attachCheckbox(key: string, $context: JQuery): this;

  attachRadio(key: string, $context: JQuery): this;

  attachSelect(key: string, $field: JQuery): this;

  attachTextArea(key: string, $field: JQuery): this;

  attachText(key: string, $field: JQuery): this;

  attachSearch(key: string, $field: JQuery): this;

  attachEmail(key: string, $field: JQuery): this;

  attachUrl(key: string, $field: JQuery): this;

  attachTel(key: string, $field: JQuery): this;

  attachPassword(key: string, $field: JQuery): this;
}

declare const _default: AttachDomTrait;
export default _default;
