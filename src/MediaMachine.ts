import { Watermark, WatermarkOptions } from "./watermark";
import { ThumbnailJob } from "./thumbnail";
import { Blob, Store } from "./blob";
import { Bitrate, Container, Encoder, TranscodeJob, TranscodeOpts } from "./transcode";
import { SummaryJob, SummaryType } from "./summary";
import { parseApiKey } from "./utils";
import { WorkerConfig } from "./WorkerConfig";

class WorkerTarget<T extends WorkerConfig<any, any>> {
  workerConfig: T;
  fromConfig: Blob | string;

  constructor (transcoder: T, fromConfig: Blob | string) {
    this.workerConfig = transcoder;
    this.fromConfig = fromConfig;
  }

  async toAzure (accountKey: string, accountName: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        accountKey,
        accountName,
        type: Store.AZURE_BLOB,
      });

    const config = this.workerConfig.getConfig(this.fromConfig, outputFile);
    const job = await config.execute();
    return job;
  }

  async toGCloud (json: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        json,
        type: Store.GOOGLE_BLOB,
      });

    const config = this.workerConfig.getConfig(this.fromConfig, outputFile);
    const job = await config.execute();
    return job;
  }

  async toS3 (region: string, accessKeyId: string, secretAccessKey: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        region,
        accessKeyId,
        secretAccessKey,
        type: Store.S3,
      });

    const config = this.workerConfig.getConfig(this.fromConfig, outputFile);
    const job = await config.execute();
    return job;
  }
}


// transcoding

class TranscodeTarget extends WorkerTarget<Transcoder> {
  workerConfig: Transcoder;
  fromConfig: Blob | string;

  constructor (transcoder: Transcoder, fromConfig: Blob | string) {
    super(transcoder, fromConfig);
  }

}

interface TranscodeOptions {
  width?: number;
  watermarkFromText?: string;
  watermark?: Watermark;
  encoder: Encoder;
  bitrateKbps: Bitrate;
  container: Container;
  height?: number;
  successUrl?: string;
  failureUrl?: string;
}

class Transcoder extends WorkerConfig<TranscodeOptions, TranscodeTarget> {

  constructor (apiKey: string, opts: TranscodeOptions) {
    super(apiKey, opts, TranscodeTarget);
  }

  getConfig (fromConfig: string | Blob, outputFile: string | Blob) {
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
      .to(outputFile)
      .opts(opts)

    if (options.width) {
      config = config.width(150);
    }
    if (options.height) {
      config = config.height(150);
    }

    if (options.watermarkFromText) {
      config = config.watermarkFromText(options.watermarkFromText);
    }

    if (options.watermark) {
      config = config.watermark(options.watermark);
    }
    return config;

  } 

}

interface ThumbnailOptions {
  width?: number;
  watermarkFromText?: string;
  watermark?: Watermark;
  successUrl?: string;
  failureUrl?: string;
}

class ThumbnailTarget extends WorkerTarget<Thumbnailer> {
  thumbnailer: Thumbnailer;
  inputBlob: Blob;

  constructor (thumbnailer: Thumbnailer, inputBlob: Blob) {
    super(thumbnailer, inputBlob);
  }

}

class Thumbnailer extends WorkerConfig<ThumbnailOptions, ThumbnailTarget> {
  constructor (apiKey: string, opts: ThumbnailOptions) {
    super(apiKey, opts, ThumbnailTarget);
  }
  getConfig (fromConfig: string | Blob, outputFile: string | Blob) {
    
    const options = this.options;

    let config = ThumbnailJob.withDefaults()
      .apiKey(this.apiKey)
      .from(fromConfig)
      .webhooks({
        successUrl: options.successUrl,
        failureUrl: options.failureUrl,
      })
      .to(outputFile)

    if (options.width) {
      config = config.width(150);
    }

    if (options.watermarkFromText) {
      config = config.watermarkFromText(options.watermarkFromText);
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
  watermarkFromText?: string;
  format?: SummaryType;
  removeAudio?: boolean;
}

class SummaryTarget extends WorkerTarget<Summarizer> {
  summarizer: Summarizer;
  inputBlob: Blob;

  constructor (summarizer: Summarizer, inputBlob: Blob) {
    super(summarizer, inputBlob);
  }

}

class Summarizer extends WorkerConfig<SummaryOptions, SummaryTarget> {
  constructor (apiKey: string, opts: SummaryOptions) {
    super(apiKey, opts, SummaryTarget);
  }
  getConfig (fromConfig: string | Blob, outputFile: string | Blob) {
    const options = this.options;

    let config = SummaryJob.withDefaults()
      .apiKey(this.apiKey)
      .from(fromConfig)
      .to(outputFile)

    if (options.width) {
      config = config.width(150);
    }

    config = config.type(options.format ? options.format : SummaryType.MP4); 

    if (options.watermarkFromText) {
      config = config.watermarkFromText(options.watermarkFromText);
    }
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

  watermark (opts: WatermarkOptions = {}) {
    return new Watermark(opts);
  }
}

