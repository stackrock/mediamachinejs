import { Blob } from "./blob";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
import { Executable } from "./Executable";
import { Watermark } from "./watermark";
export declare type SummaryType = "mp4" | "gif";
export declare class SummaryJob implements Executable {
    apiKey: string;
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
    constructor(apikey: string);
    webhooks(webhooks: Webhooks): SummaryJob;
    from(source: string | Blob): SummaryJob;
    to(destination: string | Blob): SummaryJob;
    watermark(watermark: Watermark): SummaryJob;
    type(type: SummaryType): SummaryJob;
    width(width: number): SummaryJob;
    removeAudio(value: boolean): SummaryJob;
    execute(): Promise<Job>;
}
