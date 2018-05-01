export interface BeImage {
  isAnimatedGif(bits: any): boolean;

  getDimensions(bits: any): { width: number; height: number; };

  getBinaryFromDataUri(dataUri: string): string;

  isCMYK(bits: any): boolean;
}

declare const _default: BeImage;
export default _default;
