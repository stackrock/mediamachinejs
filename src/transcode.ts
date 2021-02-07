import { API } from "./api";
import { removeUndefinedFromObj } from "./utils";
import { Blob } from "./blob";
import { Watermark } from "./watermark";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
import { Executable } from "./Executable";

export enum Encoder {
  H264 = "h264",
  H265 = "h265",
  VP8 = "vp8",
}

export enum Bitrate {
  EIGHT_MEGAKBPS = "8000",
  FOUR_MEGAKBPS = "4000",
  ONE_MEGAKBPS = "1000",
}

export enum Container {
  MP4 = "mp4",
  WEBM = "webm",
}

export enum VideoSize {
  FULL_HD = "1080",
  HD = "720",
  SD = "480",
}


export class TranscodeJob implements Executable {
  apikey: string;
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

  constructor() {
  }

  static withDefaults() {
    const tj = new TranscodeJob();
    tj.transcodeWidth = 720;
    return tj;
  }

  apiKey(apiKey: string): TranscodeJob {
    this.apikey = apiKey;
    return this;
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

  watermarkFromText(text: string): TranscodeJob {
    const watermark = new Watermark({text})
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
    if (this.apikey === null) {
      throw new Error("Missing apiKey");
    }

    if (this.apikey.trim() == "") {
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
      apiKey: this.apikey,
      successURL: this.successUrl,
      failureURL: this.failureUrl,
      inputURL: this.inputUrl,
      inputBlob: this.inputBlob?.toJSON(),
      outputURL: this.outputUrl,
      outputBlob: this.outputBlob?.toJSON(),
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

export class OptionBuilder {
  toJSON () {
    return {};
  }

  static withDefaults() {
    throw new Error(`not implemented`);
  }
}

export class TranscodeOpts extends OptionBuilder {
  transcoderEncoder: Encoder;
  transcoderBitrateKbps: Bitrate;
  transcoderContainer: Container;

  constructor() {
    super();
  }

  static withDefaults() {
    const to = new TranscodeOpts();
    to.transcoderEncoder = Encoder.H264;
    to.transcoderBitrateKbps = Bitrate.FOUR_MEGAKBPS;
    to.transcoderContainer = Container.MP4;
    return to;
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
