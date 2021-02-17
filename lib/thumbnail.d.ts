import { Watermark } from "./watermark";
import { Blob } from "./blob";
import { Webhooks } from "./webhooks";
import { Job } from "./job";
export declare class ThumbnailJob {
    apikey: string;
    successUrl?: string;
    failureUrl?: string;
    inputUrl?: string;
    inputBlob?: Blob;
    outputUrl?: string;
    outputBlob?: Blob;
    thumbWidth?: number;
    thumbWatermark?: Watermark;
    constructor();
    static withDefaults(): ThumbnailJob;
    apiKey(key: string): ThumbnailJob;
    webhooks(webhooks: Webhooks): ThumbnailJob;
    from(source: string | Blob): ThumbnailJob;
    to(destination: string | Blob): ThumbnailJob;
    watermark(watermark: Watermark): ThumbnailJob;
    watermarkFromText(text: string): ThumbnailJob;
    width(width: number): ThumbnailJob;
    execute(): Promise<Job>;
}
