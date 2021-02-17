export declare enum Position {
    TOP_LEFT = "topLetf",
    TOP_RIGHT = "topRight",
    BOTTOM_LEFT = "bottomLeft",
    BOTTOM_RIGHT = "bottomRight"
}
export interface WatermarkImage {
    path?: string;
    image_name?: string;
    width?: number;
    height?: number;
}
export declare class Watermark {
    watermarkText?: string;
    watermarkImage?: WatermarkImage;
    watermarkFontSize?: number;
    watermarkFontColor?: string;
    watermarkOpacity?: number;
    watermarkPosition: Position;
    constructor();
    static withDefaults(): Watermark;
    text(text: string): Watermark;
    image(image: WatermarkImage): Watermark;
    fontSize(fontSize: number): Watermark;
    fontColor(fontColor: string): Watermark;
    opacity(opacity: number): Watermark;
    position(position: Position): Watermark;
    toJSON(): any;
}
