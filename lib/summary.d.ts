import { Watermark } from "./watermark";
import { Blob } from "./blob";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
export declare enum SummaryType {
    MP4 = "mp4",
    GIF = "gif"
}
export declare class SummaryJob {
    apikey: string;
    successUrl?: string;
    failureUrl?: string;
    inputUrl?: string;
    inputBlob?: Blob;
    outputUrl?: string;
    outputBlob?: Blob;
    summaryWidth?: number;
    summaryWatermark?: Watermark;
    summaryType: SummaryType;
    summaryRemoveAudio?: boolean;
    constructor();
    static withDefaults(): SummaryJob;
    apiKey(apiKey: string): SummaryJob;
    webhooks(webhooks: Webhooks): SummaryJob;
    from(source: string | Blob): SummaryJob;
    to(destination: string | Blob): SummaryJob;
    watermark(watermark: Watermark): SummaryJob;
    watermarkFromText(text: string): SummaryJob;
    type(type: SummaryType): SummaryJob;
    width(width: number): SummaryJob;
    removeAudio(value: boolean): SummaryJob;
    execute(): Promise<Job>;
}
