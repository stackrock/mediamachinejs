import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MediaMachine } from "./index";
import { Store, Blob } from "./blob";
import { SummaryJob } from "./summary";
import { ThumbnailJob } from "./thumbnail";
import { TranscodeJob, TranscodeOpts } from "./transcode";
import { ImageWatermark, TextWatermark } from "./watermark";

const FAKE_SUCCESS_URL = "http://mediamachine.io/success";
const FAKE_FAILURE_URL = "http://mediamachine.io/failure";
const FAKE_INPUT_URL = "http://mediamachine.io/path/to/image.png";
const FAKE_OUTPUT_URL = "http://mediamachine.io/path/to/output/image";
const FAKE_TRANSCODE_OPTS = new TranscodeOpts();
const FAKE_S3_BLOB = new Blob(
  {
    region: "us-east-1",
    accessKeyId: "123",
    secretAccessKey: "abc",
    type: Store.S3,
  },
  "test-bucket",
  "test-key"
);
const FAKE_GCP_BLOB = new Blob(
  {
    type: Store.GOOGLE_BLOB,
    json: "{}",
  },
  "test-bucket",
  "test-key"
);
const FAKE_AZURE_BLOB = new Blob(
  {
    type: Store.AZURE_BLOB,
    accountKey: "123",
    accountName: "abc",
  },
  "test-bucket",
  "test-key"
);
const FAKE_IMAGE_WATERMARK = new ImageWatermark({
  height: 200,
  width: 400,
  url: "http://path.com/to/your/image",
});
const textWatermark = new TextWatermark("mediamachine.io");

describe("Mediamachine", () => {
  const API_KEY = "test-jest-123-test-c123a980-7173-11eb-8a10-1fc5d5c9c235";
  describe("thumbnail", () => {
    let mock;
    const retData = { reqId: "12" };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test.only("with all required properties, using URLs does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };

      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      const mediamachine = new MediaMachine(API_KEY);
      await expect(
        mediamachine
          .thumbnail({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
            width: 150,
          })
          .fromUrl(FAKE_INPUT_URL)
          .toUrl(FAKE_OUTPUT_URL)
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          text: "mediamachine.io",
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(textWatermark)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          image: {
            width: 400,
            height: 200,
            path: "http://path.com/to/your/image",
          },
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(FAKE_IMAGE_WATERMARK)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 720,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_AZURE_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_GCP_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using AWS for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_S3_BLOB)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_AZURE_BLOB)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/thumbnail", expectedBody)
        .reply(201, retData);

      await expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with a null apikey throws an error", () => {
      expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with empty string apikey throws an error", () => {
      expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_INPUT_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with apikey only using spaces throws an error", () => {
      expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_INPUT_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with no input_url or input_blob provided", () => {
      expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_INPUT_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with no output_url or output_blob provided", () => {
      expect(
        new ThumbnailJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });
  });

  describe("Gif Summary", () => {
    let mock;
    const retData = { reqId: "12" };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };

      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          text: "mediamachine.io",
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(textWatermark)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          image: {
            width: 400,
            height: 200,
            path: "http://path.com/to/your/image",
          },
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(FAKE_IMAGE_WATERMARK)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 720,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_AZURE_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_GCP_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_AZURE_BLOB)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/gif", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .type("gif")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with empty string apikey throws an error", () => {
      expect(
        new SummaryJob("")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).rejects.toThrow();
    });

    test("with apikey only using spaces throws an error", () => {
      expect(
        new SummaryJob("     ")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).rejects.toThrow();
    });

    test("with no input_url or input_blob provided throws an error", () => {
      expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).rejects.toThrow();
    });

    test("with no output_url or output_blob provided throws an error", () => {
      expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .width(150)
          .type("gif")
          .execute()
      ).rejects.toThrow();
    });

    test("with null summaryType throws an error", () => {
      expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });
  });

  describe("MP4 Summary", () => {
    let mock;
    const retData = { reqId: "12" };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties does not fail", async () => {
      mock
        .onPost("https://api.mediamachine.io/summary/mp4")
        .reply(201, retData);
      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          text: "mediamachine.io",
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(textWatermark)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          image: {
            width: 400,
            height: 200,
            path: "http://path.com/to/your/image",
          },
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(FAKE_IMAGE_WATERMARK)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 720,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_AZURE_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_GCP_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_AZURE_BLOB)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/summary/mp4", expectedBody)
        .reply(201, retData);

      await expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .type("mp4")
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with empty string apikey throws an error", () => {
      expect(
        new SummaryJob("")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .type("mp4")
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with apikey only using spaces throws an error", () => {
      expect(
        new SummaryJob("     ")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .type("mp4")
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with no input_url or input_blob provided throws an error", () => {
      expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .to(FAKE_OUTPUT_URL)
          .type("mp4")
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with no output_url or output_blob provided throws an error", () => {
      expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .type("mp4")
          .width(150)
          .execute()
      ).rejects.toThrow();
    });

    test("with null summaryType throws an error", () => {
      expect(
        new SummaryJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .type(null)
          .width(150)
          .execute()
      ).rejects.toThrow();
    });
  });

  describe("Transcode", () => {
    let mock;
    const retData = { reqId: "12" };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties does not fail", () => {
      mock.onPost("https://api.mediamachine.io/transcode").reply(201, retData);
      expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
        watermark: {
          text: "mediamachine.io",
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(textWatermark)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: 150,
        watermark: {
          image: {
            width: 400,
            height: 200,
            path: "http://path.com/to/your/image",
          },
          fontSize: 12,
          fontColor: "white",
          opacity: 0.9,
          position: "bottomRight",
        },
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .watermark(FAKE_IMAGE_WATERMARK)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 720,
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputURL: FAKE_OUTPUT_URL,
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 150,
      };

      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        outputURL: FAKE_OUTPUT_URL,
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_AZURE_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        outputURL: FAKE_OUTPUT_URL,
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_GCP_BLOB)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "azblob",
          key: "test-key",
          bucket: "test-bucket",
          azureCreds: { accountKey: "123", accountName: "abc" },
        },
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_AZURE_BLOB)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: "test-123",
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputBlob: {
          store: "s3",
          key: "test-key",
          bucket: "test-bucket",
          awsCreds: {
            region: "us-east-1",
            accessKeyId: "123",
            secretAccessKey: "abc",
          },
        },
        outputBlob: {
          store: "gcp",
          key: "test-key",
          bucket: "test-bucket",
          gcpCreds: { json: "{}" },
        },
        transcodeOpts: {
          encoder: "h264",
          bitrateKbps: "4000",
          container: "mp4",
          videoSize: "720",
        },
        width: 150,
      };
      mock
        .onPost("https://api.mediamachine.io/transcode", expectedBody)
        .reply(201, retData);

      await expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_S3_BLOB)
          .to(FAKE_GCP_BLOB)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).resolves.toEqual(retData);
    });

    test("with empty string apikey throws an error", () => {
      expect(
        new TranscodeJob("")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).rejects.toThrow();
    });

    test("with apikey only using spaces throws an error", () => {
      expect(
        new TranscodeJob("     ")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).rejects.toThrow();
    });

    test("with no input_url or input_blob provided throws an error", () => {
      expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).rejects.toThrow();
    });

    test("with no output_url or output_blob provided throws an error", () => {
      expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .width(150)
          .opts(FAKE_TRANSCODE_OPTS)
          .execute()
      ).rejects.toThrow();
    });

    test("with null transcodeOpts throws an error", () => {
      expect(
        new TranscodeJob("test-123")
          .webhooks({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
          })
          .from(FAKE_INPUT_URL)
          .to(FAKE_OUTPUT_URL)
          .width(150)
          .opts(null)
          .execute()
      ).rejects.toThrow();
    });
  });
});
