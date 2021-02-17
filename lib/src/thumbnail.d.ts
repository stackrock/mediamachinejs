import { Watermark } from "./watermark";
import { Blob } from "./blob";
import { Webhooks } from "./webhooks";
import { Job } from "./job";
import { Executable } from "./Executable";
export declare class ThumbnailJob implements Executable {
    apiKey: string;
    successUrl?: string;
    failureUrl?: string;
    inputUrl?: string;
    inputBlob?: Blob;
    outputUrl?: string;
    outputBlob?: Blob;
    thumbWidth?: number;
    thumbWatermark?: Watermark;
    constructor(apiKey: string);
    webhooks(webhooks: Webhooks): ThumbnailJob;
    from(source: string | Blob): ThumbnailJob;
    to(destination: string | Blob): ThumbnailJob;
    watermark(watermark: Watermark): ThumbnailJob;
    width(width: number): ThumbnailJob;
    execute(): Promise<Job>;
}
