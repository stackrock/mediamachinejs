import { ThumbnailJob } from "./thumbnail";
import { Blob } from "./blob";
import { Container, Encoder, TranscodeJob, TranscodeOpts } from "./transcode";
import { SummaryJob, SummaryType } from "./summary";
import { parseApiKey } from "./utils";
import { WorkerConfig } from "./WorkerConfig";
import { ImageWatermark, ImageWatermarkOptions, TextWatermark, TextWatermarkOptions, Watermark } from "./watermark";
import { Executable } from "./Executable";
import { WorkerTarget } from "./WorkerTarget";


// mp4 transcoding

class TranscodeMp4Target extends WorkerTarget<TranscodeJob> {
  workerConfig: TranscodeJob;

  constructor (transcoder: TranscodeJob) {
    super(transcoder);
  }

}

interface TranscodeMp4Options {
  height?: number;
  width?: number;
  watermark?: Watermark;
  encoder?: Encoder;
  successUrl?: string;
  failureUrl?: string;
}

class TranscoderMp4 extends WorkerConfig<TranscodeMp4Target> {

  options: TranscodeMp4Options;

  constructor (apiKey: string, opts: TranscodeMp4Options) {
    super(apiKey, TranscodeMp4Target);
    this.options = opts;
  }

  getExecutable (fromConfig: string | Blob) {
    const opts = new TranscodeOpts();
    const options = this.options;
    opts.container(Container.MP4);
    if (options.encoder) {
      opts.encoder(options.encoder);
    }

    let config = new TranscodeJob(this.apiKey)
      .from(fromConfig)
      .webhooks({
        successUrl: options.successUrl,
        failureUrl: options.failureUrl,
      })
      .opts(opts)

    if (options.width) {
      config = config.width(options.width);
    }
    if (options.height) {
      config = config.height(options.height);
    }

    if (options.watermark) {
      config = config.watermark(options.watermark);
    }
    return config;

  }

}

// transcoding

class TranscodeWebmTarget extends WorkerTarget<TranscodeJob> {
  workerConfig: TranscodeJob;

  constructor (transcoder: TranscodeJob) {
    super(transcoder);
  }

}

interface TranscodeWebmOptions {
  height?: number;
  width?: number;
  watermark?: Watermark;
  encoder: "vp8" | "vp9";
  successUrl?: string;
  failureUrl?: string;
}

class TranscoderWebm extends WorkerConfig<TranscodeWebmTarget> {

  options: TranscodeWebmOptions;

  constructor (apiKey: string, opts: TranscodeWebmOptions) {
    super(apiKey, TranscodeWebmTarget);
    this.options = opts;
  }

  getExecutable (fromConfig: string | Blob) {
    const opts = new TranscodeOpts();
    opts.container(Container.WEBM);
    const options = this.options;
    if (options.encoder) {
      opts.encoder(options.encoder);
    }

    let config = new TranscodeJob(this.apiKey)
      .from(fromConfig)
      .webhooks({
        successUrl: options.successUrl,
        failureUrl: options.failureUrl,
      })
      .opts(opts)

    if (options.width) {
      config = config.width(options.width);
    }
    if (options.height) {
      config = config.height(options.height);
    }

    if (options.watermark) {
      config = config.watermark(options.watermark);
    }
    return config;

  }

}

interface ThumbnailOptions {
  width?: number;
  watermarkText?: string;
  watermark?: Watermark;
  successUrl?: string;
  failureUrl?: string;
}

class ThumbnailTarget extends WorkerTarget<ThumbnailJob> {
  thumbnailer: Thumbnailer;
  inputBlob: Blob;

  constructor (thumbnailer: ThumbnailJob) {
    super(thumbnailer);
  }

}

class Thumbnailer extends WorkerConfig<ThumbnailTarget> {

  options: ThumbnailOptions

  constructor (apiKey: string, options: ThumbnailOptions) {
    super(apiKey, ThumbnailTarget);
    this.options = options;
  }
  getExecutable (fromConfig: string | Blob) {

    const options = this.options;

    let config = new ThumbnailJob(this.apiKey)
      .from(fromConfig)
      .webhooks({
        successUrl: options.successUrl,
        failureUrl: options.failureUrl,
      })

    if (options.width) {
      config = config.width(150);
    }

    if (options.watermark) {
      config = config.watermark(options.watermark);
    }

    return config;
  }
}

interface SummaryOptions {
  width?: number;
  watermark?: Watermark;
  format?: SummaryType;
  removeAudio?: boolean;
}

class SummaryTarget extends WorkerTarget<SummaryJob> {
  summarizer: Summarizer;

  constructor (summarizer: SummaryJob) {
    super(summarizer);
  }

}

class Summarizer extends WorkerConfig<SummaryTarget> {

  options: SummaryOptions;

  constructor (apiKey: string, opts: SummaryOptions) {
    super(apiKey, SummaryTarget);
    this.options = opts;
  }
  getExecutable (fromConfig: string | Blob): Executable {
    const options = this.options;

    let config = new SummaryJob(this.apiKey)
      .from(fromConfig)

    if (options.width) {
      config = config.width(150);
    }

    config = config.type(options.format ? options.format : "gif");

    if (options.watermark) {
      config = config.watermark(options.watermark);
    }
    options.removeAudio = !!options.removeAudio;
    if (options.removeAudio) {
      config = config.removeAudio(options.removeAudio);
    }
    return config;

  }
}


// MediaMachine
// ==============================

export class MediaMachine {

  apiKey: string;

  constructor (apiKey: string) {
    parseApiKey(apiKey);
    this.apiKey = apiKey;
  }

  transcodeToWebm(opts: TranscodeWebmOptions): TranscoderWebm {
    return new TranscoderWebm(this.apiKey, opts);
  }

  transcodeToMp4(opts: TranscodeMp4Options): TranscoderMp4 {
    return new TranscoderMp4(this.apiKey, opts);
  }

  thumbnail(opts: ThumbnailOptions): Thumbnailer {
    return new Thumbnailer(this.apiKey, opts);
  }

  summary(opts: SummaryOptions): Summarizer {
    return new Summarizer(this.apiKey, opts);
  }

  textWatermark (text: string, opts: TextWatermarkOptions = {}): TextWatermark {
    return new TextWatermark(text, opts);
  }
  imageWatermark (opts: ImageWatermarkOptions = {}): ImageWatermark {
    return new ImageWatermark(opts);
  }
}

// Job
// =========================
export { Job } from "./job";
