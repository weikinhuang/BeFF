import { ClassBuilder } from '@behance/nbd/Class';
import {
  ComponentInstance,
  ComponentConstructorProps,
  ComponentConstructor,
} from '../Component';

export interface ImageInstance extends ComponentInstance {
  image: HTMLImageElement;

  new(imageElement?: HTMLImageElement): this;

  isComplete(): boolean;

  displayWidth(): number;

  displayHeight(): number;

  width(): number;

  height(): number;

  src(imageData: string): void;

  isAnimatedGif(): boolean;

  isCMYK(): boolean;
}

export interface ImageConstructorProps extends ComponentConstructorProps {
  getDimensions(url: string): Promise<{
    displayWidth: number;
    displayHeight: number;
    width: number;
    height: number;
  }>;

  whenComplete(imgElement: HTMLImageElement): Promise<void>;

  load(src: string): Promise<ImageInstance>;
}

export interface ImageConstructor<I extends ImageInstance = ImageInstance> extends ImageConstructorProps, ClassBuilder<I> {
  new(imageElement?: HTMLImageElement): I;

  // we have to override here because we want to return a classbuilder that has additional props
  extend<T extends I, G extends {} = {}>(a: T, b?: G): ImageConstructor<T> & G & ImageConstructorProps;
}

declare const _default: ImageConstructor;
export default _default;
