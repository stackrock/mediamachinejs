export declare type Position = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
export declare type Watermark = TextWatermark | ImageWatermark;
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
export declare class ImageWatermark implements ImageWatermarkOptions {
    path?: string;
    image_name?: string;
    width?: number;
    height?: number;
    opacity?: number;
    position: Position;
    constructor(opts?: ImageWatermarkOptions);
    toJSON(): Record<string, unknown>;
}
export declare class TextWatermark implements TextWatermarkOptions {
    text: string;
    fontSize?: number;
    fontColor?: string;
    opacity?: number;
    position: Position;
    constructor(text: string, opts?: TextWatermarkOptions);
    toJSON(): Record<string, unknown>;
}
