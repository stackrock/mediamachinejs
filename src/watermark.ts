import { removeUndefinedFromObj } from "./utils";

export enum Position {
  TOP_LEFT = "topLeft",
  TOP_RIGHT = "topRight",
  BOTTOM_LEFT = "bottomLeft",
  BOTTOM_RIGHT = "bottomRight",
}

export interface WatermarkImage {
  path?: string;
  image_name?: string;
  width?: number;
  height?: number;
}

 export interface WatermarkOptions {
  text?: string;
  image?: WatermarkImage;
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  position?: Position;
 }

export class Watermark implements WatermarkOptions {
  text?: string;
  image?: WatermarkImage;
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  position: Position;

  constructor(opts: WatermarkOptions = {}) {
    this.text = opts.text;
    this.image = opts.image;
    this.fontSize = opts.fontSize || 12;
    this.fontColor = opts.fontColor || "white";
    this.position = opts.position || Position.BOTTOM_RIGHT;
    if (opts.opacity === 0) {
      this.opacity = 0;
    } else {
      this.opacity = opts.opacity || 0.9;
    }
  }

  toJSON() {
    const ret = {
      fontSize: `${this.fontSize}`,
      text: this.text,
      image: this.image,
      fontColor: this.fontColor,
      opacity: `${this.opacity}`,
      position: this.position,
    };

    return removeUndefinedFromObj(ret);
  }
}
