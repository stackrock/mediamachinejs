import { API } from "./api";
import { removeUndefinedFromObj } from "./utils";
import { Blob } from "./blob";
import { Watermark } from "./watermark";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
import { Executable } from "./Executable";

export type Encoder = "h264" | "h265" | "vp8" | "vp9";

export type Bitrate = "1000" | "2000" | "4000";

export enum Container {
  MP4 = "mp4",
  WEBM = "webm",
}

export class TranscodeJob implements Executable {
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

  constructor(apiKey: string) {
    this.transcodeWidth = 720;
    this.apiKey = apiKey;
  }

  webhooks(webhooks: Webhooks): TranscodeJob {
    this.successUrl = webhooks.successUrl;
    this.failureUrl = webhooks.failureUrl;
    return this;
  }

  from(source: string | Blob): TranscodeJob {
    if (typeof source === "string") {
      this.inputUrl = source;
    } else {
      this.inputBlob = source;
    }

    return this;
  }

  to(destination: string | Blob): TranscodeJob {
    if (typeof destination === "string") {
      this.outputUrl = destination;
    } else {
      this.outputBlob = destination;
    }
    return this;
  }

  watermark(watermark: Watermark): TranscodeJob {
    this.transcodeWatermark = watermark;
    return this;
  }

  width(value: number): TranscodeJob {
    this.transcodeWidth = value;
    return this;
  }

  height(value: number): TranscodeJob {
    this.transcodeHeight = value;
    return this;
  }

  opts(value: TranscodeOpts): TranscodeJob {
    this.transcodeOpts = value;
    return this;
  }

  async execute() {
    if (this.apiKey === null) {
      throw new Error("Missing apiKey");
    }

    if (this.apiKey.trim() == "") {
      throw new Error("Missing apiKey");
    }

    const emptyInputUrl = !this.inputUrl || this.inputUrl.trim() === "";

    if (!this.inputBlob && emptyInputUrl) {
      throw new Error("Missing inputBlob or inputUrl");
    }

    const emptyOutputUrl = !this.outputUrl || this.outputUrl.trim() == "";
    if (!this.outputBlob && emptyOutputUrl) {
      throw new Error("Missing outputBlob or outputUrl");
    }

    if (!this.transcodeOpts) {
      throw new Error("Missing transcodeOpts");
    }

    const body = {
      apiKey: this.apiKey,
      successURL: this.successUrl,
      failureURL: this.failureUrl,
      inputCreds: this.inputBlob?.toApiCredentials(),
      outputCreds: this.outputBlob?.toApiCredentials(),
      inputURL: this.inputUrl || this.inputBlob.toApiUrl(),
      outputURL: this.outputUrl || this.outputBlob.toApiUrl(),
      width: `${this.transcodeWidth}`,
      height: `${this.transcodeHeight}`,
      watermark: this.transcodeWatermark?.toJSON(),
      transcode: this.transcodeOpts?.toJSON(),
    };

    const resp = await API.createJob("transcode", removeUndefinedFromObj(body));

    const job = new Job(resp.data.id);
    return job;
  }
}

export class TranscodeOpts {
  transcoderEncoder: Encoder;
  transcoderBitrateKbps: Bitrate;
  transcoderContainer: Container;

  constructor() {
    this.transcoderEncoder = "h264";
    this.transcoderBitrateKbps = "4000";
    this.transcoderContainer = Container.MP4;
  }

  encoder(value: Encoder): TranscodeOpts {
    this.transcoderEncoder = value;
    return this;
  }

  bitrateKbps(value: Bitrate): TranscodeOpts {
    this.transcoderBitrateKbps = value;
    return this;
  }

  container(value: Container): TranscodeOpts {
    this.transcoderContainer = value;
    return this;
  }

  toJSON() {
    return {
      encoder: this.transcoderEncoder,
      bitrateKbps: this.transcoderBitrateKbps,
      container: this.transcoderContainer,
    };
  }
}
