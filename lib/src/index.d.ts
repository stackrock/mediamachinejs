import { ThumbnailJob } from "./thumbnail";
import { Blob } from "./blob";
import { Encoder, TranscodeJob } from "./transcode";
import { SummaryJob, SummaryType } from "./summary";
import { WorkerConfig } from "./WorkerConfig";
import { ImageWatermark, ImageWatermarkOptions, TextWatermark, TextWatermarkOptions, Watermark } from "./watermark";
import { Executable } from "./Executable";
import { WorkerTarget } from "./WorkerTarget";
declare class TranscodeMp4Target extends WorkerTarget<TranscodeJob> {
    workerConfig: TranscodeJob;
    constructor(transcoder: TranscodeJob);
}
interface TranscodeMp4Options {
    height?: number;
    width?: number;
    watermark?: Watermark;
    encoder?: Encoder;
    successUrl?: string;
    failureUrl?: string;
}
declare class TranscoderMp4 extends WorkerConfig<TranscodeMp4Target> {
    options: TranscodeMp4Options;
    constructor(apiKey: string, opts: TranscodeMp4Options);
    getExecutable(fromConfig: string | Blob): TranscodeJob;
}
declare class TranscodeWebmTarget extends WorkerTarget<TranscodeJob> {
    workerConfig: TranscodeJob;
    constructor(transcoder: TranscodeJob);
}
interface TranscodeWebmOptions {
    height?: number;
    width?: number;
    watermark?: Watermark;
    encoder: "vp8" | "vp9";
    successUrl?: string;
    failureUrl?: string;
}
declare class TranscoderWebm extends WorkerConfig<TranscodeWebmTarget> {
    options: TranscodeWebmOptions;
    constructor(apiKey: string, opts: TranscodeWebmOptions);
    getExecutable(fromConfig: string | Blob): TranscodeJob;
}
interface ThumbnailOptions {
    width?: number;
    watermarkText?: string;
    watermark?: Watermark;
    successUrl?: string;
    failureUrl?: string;
}
declare class ThumbnailTarget extends WorkerTarget<ThumbnailJob> {
    thumbnailer: Thumbnailer;
    inputBlob: Blob;
    constructor(thumbnailer: ThumbnailJob);
}
declare class Thumbnailer extends WorkerConfig<ThumbnailTarget> {
    options: ThumbnailOptions;
    constructor(apiKey: string, options: ThumbnailOptions);
    getExecutable(fromConfig: string | Blob): ThumbnailJob;
}
interface SummaryOptions {
    width?: number;
    watermark?: Watermark;
    format?: SummaryType;
    removeAudio?: boolean;
    successUrl?: string;
    failureUrl?: string;
}
declare class SummaryTarget extends WorkerTarget<SummaryJob> {
    summarizer: Summarizer;
    constructor(summarizer: SummaryJob);
}
declare class Summarizer extends WorkerConfig<SummaryTarget> {
    options: SummaryOptions;
    constructor(apiKey: string, opts: SummaryOptions);
    getExecutable(fromConfig: string | Blob): Executable;
}
export declare class MediaMachine {
    apiKey: string;
    constructor(apiKey: string);
    transcodeToWebm(opts: TranscodeWebmOptions): TranscoderWebm;
    transcodeToMp4(opts: TranscodeMp4Options): TranscoderMp4;
    thumbnail(opts: ThumbnailOptions): Thumbnailer;
    summary(opts: SummaryOptions): Summarizer;
    textWatermark(text: string, opts?: TextWatermarkOptions): TextWatermark;
    imageWatermark(opts?: ImageWatermarkOptions): ImageWatermark;
}
export { Job } from "./job";
