// @todo: these cannot be defined because of the way this trait used
// type EventMappableTypeMap = {
//   [k: string]: any;
// };
// export type EventMappableDescriptor = {
//   [k: string]: string | EventMappableTypeMap | (string | EventMappableTypeMap)[];
// };

export interface EventMappableTrait {
  events: any; // for some reason, doesn't like EventMappableDescriptor as the type here, prob b/c it's static outside?

  _mapEvents(): void;
  _undelegateEvents(): void;
}

declare const _default: EventMappableTrait;
export default _default;
