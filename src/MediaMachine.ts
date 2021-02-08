import { ThumbnailJob } from "./thumbnail";
import { Blob } from "./blob";
import { Bitrate, Container, Encoder, TranscodeJob, TranscodeOpts } from "./transcode";
import { SummaryJob, SummaryType } from "./summary";
import { parseApiKey } from "./utils";
import { WorkerConfig } from "./WorkerConfig";
import { ImageWatermark, ImageWatermarkOptions, TextWatermark, TextWatermarkOptions, Watermark } from "./watermark";
import { Executable } from "./Executable";
import { WorkerTarget } from "./WorkerTarget";


// transcoding

class TranscodeTarget extends WorkerTarget<TranscodeJob> {
  workerConfig: TranscodeJob;

  constructor (transcoder: TranscodeJob) {
    super(transcoder);
  }

}

interface TranscodeOptions {
  width?: number;
  watermark?: Watermark;
  encoder: Encoder;
  bitrateKbps: Bitrate;
  container: Container;
  height?: number;
  successUrl?: string;
  failureUrl?: string;
}

class Transcoder extends WorkerConfig<TranscodeTarget> {

  options: TranscodeOptions;

  constructor (apiKey: string, opts: TranscodeOptions) {
    super(apiKey, TranscodeTarget);
    this.options = opts;
  }

  getExecutable (fromConfig: string | Blob) {
    const opts = TranscodeOpts.withDefaults();
    const options = this.options;
    if (options.bitrateKbps) {
      opts.bitrateKbps(options.bitrateKbps);
    }
    if (options.container) {
      opts.container(options.container);
    }
    if (options.encoder) {
      opts.encoder(options.encoder);
    }

    let config = TranscodeJob.withDefaults()
      .apiKey(this.apiKey)
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

    let config = ThumbnailJob.withDefaults()
      .apiKey(this.apiKey)
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

    let config = SummaryJob.withDefaults()
      .apiKey(this.apiKey)
      .from(fromConfig)

    if (options.width) {
      config = config.width(150);
    }

    config = config.type(options.format ? options.format : SummaryType.MP4); 

    if (options.watermark) {
      config = config.watermark(options.watermark);
    }
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

  transcode(opts: TranscodeOptions) {
    return new Transcoder(this.apiKey, opts);    
  }

  thumbnail(opts: ThumbnailOptions) {
    return new Thumbnailer(this.apiKey, opts);
  }

  summary(opts: SummaryOptions) {
    return new Summarizer(this.apiKey, opts);
  }

  textWatermark (text: string, opts: TextWatermarkOptions = {}) {
    opts.text = text;
    return new TextWatermark(opts);
  }
  imageWatermark (opts: ImageWatermarkOptions = {}) {
    return new ImageWatermark(opts);
  }
}

