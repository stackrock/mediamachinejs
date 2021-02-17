import { Blob } from "./blob";
import { Watermark } from "./watermark";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
import { Executable } from "./Executable";
export declare type Encoder = "h264" | "h265" | "vp8" | "vp9";
export declare type Bitrate = "1000" | "2000" | "4000";
export declare enum Container {
    MP4 = "mp4",
    WEBM = "webm"
}
export declare class TranscodeJob implements Executable {
    apiKey: string;
    successUrl?: string;
    failureUrl?: string;
    inputUrl?: string;
    inputBlob?: Blob;
    outputUrl?: string;
    outputBlob?: Blob;
    transcodeWidth?: number;
    transcodeHeight?: number;
    transcodeWatermark?: Watermark;
    transcodeOpts: TranscodeOpts;
    constructor(apiKey: string);
    webhooks(webhooks: Webhooks): TranscodeJob;
    from(source: string | Blob): TranscodeJob;
    to(destination: string | Blob): TranscodeJob;
    watermark(watermark: Watermark): TranscodeJob;
    width(value: number): TranscodeJob;
    height(value: number): TranscodeJob;
    opts(value: TranscodeOpts): TranscodeJob;
    execute(): Promise<Job>;
}
export declare class TranscodeOpts {
    transcoderEncoder: Encoder;
    transcoderBitrateKbps: Bitrate;
    transcoderContainer: Container;
    constructor();
    encoder(value: Encoder): TranscodeOpts;
    bitrateKbps(value: Bitrate): TranscodeOpts;
    container(value: Container): TranscodeOpts;
    toJSON(): {
        encoder: Encoder;
        bitrateKbps: Bitrate;
        container: Container;
    };
}
