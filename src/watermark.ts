import { removeUndefinedFromObj } from "./utils";

export type Position = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type Watermark = TextWatermark | ImageWatermark;

export interface TextWatermarkOptions {
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  position?: Position;
}

export interface ImageWatermarkOptions {
  url?: string;
  uploaded_image_name?: string;
  width?: number;
  height?: number;
  opacity?: number;
  position?: Position;
}

export class ImageWatermark implements ImageWatermarkOptions {
  path?: string;
  image_name?: string;
  width?: number;
  height?: number;
  opacity?: number;
  position: Position;

  constructor(opts: ImageWatermarkOptions = {}) {
    this.position = opts.position || "bottomRight";
    if (opts.height) {
      this.height = opts.height;
    }
    if (opts.width) {
      this.width = opts.width;
    }
    if (opts.url) {
      this.path = opts.url;
    }
    if (opts.uploaded_image_name) {
      this.image_name = opts.uploaded_image_name;
    }
    if (opts.url) {
      this.path = opts.url;
    }

    if (opts.opacity === 0) {
      this.opacity = 0;
    } else {
      this.opacity = opts.opacity || 0.9;
    }
  }

  toJSON() {
    const ret = {
      width: this.width,
      height: this.height,
      imageName: this.image_name,
      imageUrl: this.path,
      opacity: `${this.opacity}`,
      position: this.position,
    };

    return removeUndefinedFromObj(ret);
  }
}

export class TextWatermark implements TextWatermarkOptions {
  text: string;
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  position: Position;

  constructor(text: string, opts: TextWatermarkOptions = {}) {
    this.text = text;
    this.fontSize = opts.fontSize || 12;
    this.fontColor = opts.fontColor || "white";
    this.position = opts.position || "bottomRight";
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
      fontColor: this.fontColor,
      opacity: `${this.opacity}`,
      position: this.position,
    };

    return removeUndefinedFromObj(ret);
  }
}
