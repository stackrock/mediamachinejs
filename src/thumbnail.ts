import { API } from "./api";
import { removeUndefinedFromObj } from "./utils";
import { Watermark } from "./watermark";
import { Blob } from "./blob";
import { Webhooks } from "./webhooks";
import { Job } from "./job";
import { Executable } from "./Executable";

export class ThumbnailJob implements Executable {
  apiKey: string;
  successUrl?: string;
  failureUrl?: string;
  inputUrl?: string;
  inputBlob?: Blob;
  outputUrl?: string;
  outputBlob?: Blob;
  thumbWidth?: number;
  thumbWatermark?: Watermark;

  constructor(apiKey: string) {
    this.thumbWidth = 720;
    this.apiKey = apiKey;
  }

  webhooks(webhooks: Webhooks): ThumbnailJob {
    this.successUrl = webhooks.successUrl;
    this.failureUrl = webhooks.failureUrl;
    return this;
  }

  from(source: string | Blob): ThumbnailJob {
    if (typeof source === "string") {
      this.inputUrl = source;
    } else {
      this.inputBlob = source;
    }

    return this;
  }

  to(destination: string | Blob): ThumbnailJob {
    if (typeof destination === "string") {
      this.outputUrl = destination;
    } else {
      this.outputBlob = destination;
    }
    return this;
  }

  watermark(watermark: Watermark): ThumbnailJob {
    this.thumbWatermark = watermark;
    return this;
  }

  width(width: number): ThumbnailJob {
    this.thumbWidth = width;
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

    const body: any = {
      apiKey: this.apiKey,
      inputCreds: this.inputBlob?.toApiCredentials(),
      outputCreds: this.inputBlob?.toApiCredentials(),
      successURL: this.successUrl,
      failureURL: this.failureUrl,
      inputURL: this.inputUrl || this.inputBlob.toApiUrl(),
      outputURL: this.outputUrl || this.outputBlob.toApiUrl(),
      width: `${this.thumbWidth}`,
      watermark: this.thumbWatermark?.toJSON(),
    };

    const resp = await API.createJob("thumbnail", removeUndefinedFromObj(body));

    const job = new Job(resp.data.id);
    return job;
  }
}
