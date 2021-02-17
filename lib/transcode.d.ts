import { Blob } from "./blob";
import { Watermark } from "./watermark";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
export declare enum Encoder {
    H264 = "h264",
    H265 = "h265",
    VP8 = "vp8"
}
export declare enum Bitrate {
    EIGHT_MEGAKBPS = "8000",
    FOUR_MEGAKBPS = "4000",
    ONE_MEGAKBPS = "1000"
}
export declare enum Container {
    MP4 = "mp4",
    WEB = "web"
}
export declare enum VideoSize {
    FULL_HD = "1080",
    HD = "720",
    SD = "480"
}
export declare class TranscodeJob {
    apikey: string;
    successUrl?: string;
    failureUrl?: string;
    inputUrl?: string;
    inputBlob?: Blob;
    outputUrl?: string;
    outputBlob?: Blob;
    transcodeWidth?: number;
    transcodeWatermark?: Watermark;
    transcodeOpts: TranscodeOpts;
    constructor();
    static withDefaults(): TranscodeJob;
    apiKey(apiKey: string): TranscodeJob;
    webhooks(webhooks: Webhooks): TranscodeJob;
    from(source: string | Blob): TranscodeJob;
    to(destination: string | Blob): TranscodeJob;
    watermark(watermark: Watermark): TranscodeJob;
    watermarkFromText(text: string): TranscodeJob;
    width(value: number): TranscodeJob;
    opts(value: TranscodeOpts): TranscodeJob;
    execute(): Promise<Job>;
}
export declare class TranscodeOpts {
    transcoderEncoder: Encoder;
    transcoderBitrateKbps: Bitrate;
    transcoderContainer: Container;
    transcoderVideoSize: VideoSize;
    constructor();
    static withDefaults(): TranscodeOpts;
    encoder(value: Encoder): TranscodeOpts;
    bitrateKbps(value: Bitrate): TranscodeOpts;
    container(value: Container): TranscodeOpts;
    videoSize(value: VideoSize): TranscodeOpts;
    toJSON(): {
        encoder: Encoder;
        bitrateKbps: Bitrate;
        container: Container;
        videoSize: VideoSize;
    };
}
