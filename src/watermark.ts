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

export class Watermark {
  watermarkText?: string;
  watermarkImage?: WatermarkImage;
  watermarkFontSize?: number;
  watermarkFontColor?: string;
  watermarkOpacity?: number;
  watermarkPosition: Position;

  constructor() {}

  static withDefaults() {
    const w = new Watermark();
    w.watermarkFontSize = 12;
    w.watermarkFontColor = "white";
    w.watermarkPosition = Position.BOTTOM_RIGHT;
    w.watermarkOpacity = 0.9;
    return w;
  }

  text(text: string): Watermark {
    this.watermarkText = text;
    return this;
  }

  image(image: WatermarkImage): Watermark {
    this.watermarkImage = image;
    return this;
  }

  fontSize(fontSize: number): Watermark {
    this.watermarkFontSize = fontSize;
    return this;
  }

  fontColor(fontColor: string): Watermark {
    this.watermarkFontColor = fontColor;
    return this;
  }

  opacity(opacity: number): Watermark {
    this.watermarkOpacity = opacity;
    return this;
  }

  position(position: Position): Watermark {
    this.watermarkPosition = position;
    return this;
  }

  toJSON() {
    const ret = {
      fontSize: `${this.watermarkFontSize}`,
      text: this.watermarkText,
      image: this.watermarkImage,
      fontColor: this.watermarkFontColor,
      opacity: `${this.watermarkOpacity}`,
      position: this.watermarkPosition,
    };

    return removeUndefinedFromObj(ret);
  }
}
