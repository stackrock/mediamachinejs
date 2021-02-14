import { API } from "./api";
import { removeUndefinedFromObj } from "./utils";
import { Blob } from "./blob";
import { Job } from "./job";
import { Webhooks } from "./webhooks";
import { Executable } from "./Executable";
import { ImageWatermark, TextWatermark, Watermark } from "./watermark";

export enum SummaryType {
  MP4 = "mp4",
  GIF = "gif",
}

export class SummaryJob implements Executable {
  apikey: string;
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

  constructor() {}

  static withDefaults(): SummaryJob {
    const sj = new SummaryJob();
    sj.summaryWidth = 720;
    return sj;
  }

  apiKey(apiKey: string): SummaryJob {
    this.apikey = apiKey;
    return this;
  }

  webhooks(webhooks: Webhooks): SummaryJob {
    this.successUrl = webhooks.successUrl;
    this.failureUrl = webhooks.failureUrl;
    return this;
  }

  from(source: string | Blob): SummaryJob {
    if (typeof source === "string") {
      this.inputUrl = source;
    } else {
      this.inputBlob = source;
    }

    return this;
  }

  to(destination: string | Blob): SummaryJob {
    if (typeof destination === "string") {
      this.outputUrl = destination;
    } else {
      this.outputBlob = destination;
    }
    return this;
  }

  watermark(watermark: Watermark): SummaryJob {
    this.summaryWatermark = watermark;
    return this;
  }

  type(type: SummaryType): SummaryJob {
    this.summaryType = type;
    return this;
  }

  width(width: number): SummaryJob {
    this.summaryWidth = width;
    return this;
  }

  removeAudio(value: boolean): SummaryJob {
    this.summaryRemoveAudio = value;
    return this;
  }

  async execute() {
    let jobType = "gif_summary";
    if (this.summaryType === "mp4") {
      jobType = "mp4_summary";
    }

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

    if (!this.summaryType) {
      throw new Error("Missing summaryType");
    }

    const body = {
      apiKey: this.apikey,
      successURL: this.successUrl,
      failureURL: this.failureUrl,
      width: `${this.summaryWidth}`,
      watermark: this.summaryWatermark?.toJSON(),
      inputURL: this.inputUrl,
      inputBlob: this.inputBlob?.toJSON(),
      outputURL: this.outputUrl,
      outputBlob: this.outputBlob?.toJSON(),
      removeAudio: this.summaryRemoveAudio,
    };

    const resp = await API.createJob(jobType, removeUndefinedFromObj(body));

    const job = new Job(resp.data.id);
    return job;
  }
}
