import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MediaMachine } from "./index";

const FAKE_SUCCESS_URL = "http://mediamachine.io/success";
const FAKE_FAILURE_URL = "http://mediamachine.io/failure";
const FAKE_INPUT_URL = "http://mediamachine.io/path/to/image.png";
const FAKE_OUTPUT_URL = "http://mediamachine.io/path/to/output/image";
const FAKE_AWS_REGION = "us-east-1";
const FAKE_AWS_ACCESS_KEY_ID = "123";
const FAKE_AWS_SECRET_ACCESS_KEY = "abc";
const FAKE_AZURE_ACCOUNT_KEY = "azure-account-key";
const FAKE_AZURE_ACCOUNT_NAME = "azure-account-name";

describe("Mediamachine", () => {
  const API_KEY = "test-jest-123-test-c123a980-7173-11eb-8a10-1fc5d5c9c235";
  const BASE_URL = "https://api.mediamachine.io";
  let mediamachine;

  beforeEach(() => {
    mediamachine = new MediaMachine(API_KEY);
  });

  describe("mediamachine", () => {
    test("with a null apikey throws an error", () => {
      expect(() => new MediaMachine(null)).toThrow();
    });

    test("with empty string apikey throws an error", () => {
      expect(() => new MediaMachine("")).toThrow();
    });

    test("with apikey only using spaces throws an error", () => {
      expect(() => new MediaMachine("       ")).toThrow();
    });
  });

  describe("thumbnail", () => {
    let mock;
    const reqId = "42";
    const retData = { id: reqId, status: "queued", createdAt: new Date() };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties, using URLs does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);

      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          text: "mediamachine.io",
          fontSize: "12",
          fontColor: "white",
          opacity: "0.9",
          position: "bottomRight",
        },
        width: "150",
      };
      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
          watermark: mediamachine.textWatermark("mediamachine.io"),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);

      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
        watermark: {
          width: 400,
          height: 200,
          imageUrl: "http://path.com/to/your/image",
          opacity: "0.9",
          position: "bottomRight",
        },
      };
      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
          watermark: mediamachine.imageWatermark({
            height: 200,
            width: 400,
            url: "http://path.com/to/your/image",
          }),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "720",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "azure://test-bucket/test-key",
        inputCreds: {
          accountName: FAKE_AZURE_ACCOUNT_NAME,
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
        },
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };
      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "gcp://test-bucket/test-key",
        inputCreds: {},
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromGCloud("{}", "test-bucket", "test-key")
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using AWS for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "s3://test-bucket/test-key",
        outputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        );
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        outputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "azure://test-bucket/test-key",
        width: "150",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        );
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        width: "150",
      };
      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        outputURL: "gcp://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputCreds: {},
        width: "150",
      };

      mock.onPost(`${BASE_URL}/thumbnail`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .thumbnail({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });
  });

  describe("Gif Summary", () => {
    let mock;
    const reqId = "42";
    const retData = { id: reqId, status: "queued", createdAt: new Date() };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          text: "mediamachine.io",
          fontSize: "12",
          fontColor: "white",
          opacity: "0.9",
          position: "bottomRight",
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
          watermark: mediamachine.textWatermark("mediamachine.io"),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          imageUrl: "http://path.com/to/your/image",
          width: 400,
          height: 200,
          opacity: "0.9",
          position: "bottomRight",
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
          watermark: mediamachine.imageWatermark({
            url: "http://path.com/to/your/image",
            width: 400,
            height: 200,
          }),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "720",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };
      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "azure://test-bucket/test-key",
        inputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "gcp://test-bucket/test-key",
        inputCreds: {},
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromGCloud("{}", "test-bucket", "test-key")
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "azure://test-bucket/test-key",
        outputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        );
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: "150",
        })
        .fromUrl(FAKE_INPUT_URL)
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/gif`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "gif",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });

    test("with null summaryType throws an error", () => {
      expect(() => {
        return mediamachine
          .summary({
            successUrl: FAKE_SUCCESS_URL,
            failureUrl: FAKE_FAILURE_URL,
            width: 150,
          })
          .fromUrl(FAKE_INPUT_URL)
          .toUrl(FAKE_OUTPUT_URL);
      }).rejects.toThrow();
    });
  });

  describe("MP4 Summary", () => {
    let mock;
    const reqId = "42";
    const retData = { id: reqId, status: "queued", createdAt: new Date() };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };
      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          text: "mediamachine.io",
          fontSize: "12",
          fontColor: "white",
          opacity: "0.9",
          position: "bottomRight",
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          watermark: mediamachine.textWatermark("mediamachine.io"),
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        watermark: {
          imageUrl: "http://path.com/to/your/image",
          width: 400,
          height: 200,
          opacity: "0.9",
          position: "bottomRight",
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
          watermark: mediamachine.imageWatermark({
            url: "http://path.com/to/your/image",
            width: 400,
            height: 200,
          }),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "720",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "azure://test-bucket/test-key",
        inputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);
      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "gcp://test-bucket/test-key",
        inputCreds: {},
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromGCloud("{}", "test-bucket", "test-key")
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "azure://test-bucket/test-key",
        outputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        );
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          failureUrl: FAKE_FAILURE_URL,
          successUrl: FAKE_SUCCESS_URL,
          width: 150,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        width: "150",
      };

      mock.onPost(`${BASE_URL}/summary/mp4`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .summary({
          format: "mp4",
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });
  });

  describe("Transcode", () => {
    let mock;

    const reqId = "42";
    const retData = { id: reqId, status: "queued", createdAt: new Date() };
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    test("with all required properties does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
        height: "200",
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          encoder: "h264",
          width: 150,
          height: 200,
          failureUrl: FAKE_FAILURE_URL,
          successUrl: FAKE_SUCCESS_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using a text watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
        height: "200",
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
        watermark: {
          text: "mediamachine.io",
          fontSize: "12",
          fontColor: "white",
          opacity: "0.9",
          position: "bottomRight",
        },
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          width: 150,
          height: 200,
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          watermark: mediamachine.textWatermark("mediamachine.io"),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using an image watermark", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
        height: "200",
        watermark: {
          imageUrl: "http://path.com/to/your/image",
          width: 400,
          height: 200,
          opacity: "0.9",
          position: "bottomRight",
        },
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          height: 200,
          width: 150,
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          watermark: mediamachine.imageWatermark({
            url: "http://path.com/to/your/image",
            width: 400,
            height: 200,
          }),
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, and no width", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: FAKE_OUTPUT_URL,
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
        width: "720",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties, using AWS for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputURL: FAKE_OUTPUT_URL,
        width: "150",
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
          width: 150,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "azure://test-bucket/test-key",
        inputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        width: "150",
        outputURL: FAKE_OUTPUT_URL,
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          width: 150,
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        )
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for input does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "gcp://test-bucket/test-key",
        inputCreds: {},
        outputURL: FAKE_OUTPUT_URL,
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
        width: "150",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          width: 150,
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromGCloud("{}", "test-bucket", "test-key")
        .toUrl(FAKE_OUTPUT_URL);
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using Azure for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "azure://test-bucket/test-key",
        outputCreds: {
          accountKey: FAKE_AZURE_ACCOUNT_KEY,
          accountName: FAKE_AZURE_ACCOUNT_NAME,
        },
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
        width: "150",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          width: 150,
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toAzure(
          FAKE_AZURE_ACCOUNT_KEY,
          FAKE_AZURE_ACCOUNT_NAME,
          "test-bucket",
          "test-key"
        );
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties using GCP for output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: FAKE_INPUT_URL,
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
        width: "150",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          width: 150,
          failureUrl: FAKE_FAILURE_URL,
          successUrl: FAKE_SUCCESS_URL,
        })
        .fromUrl(FAKE_INPUT_URL)
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });

    test("with all required properties with Blob for input and output does not fail", async () => {
      const expectedBody = {
        apiKey: API_KEY,
        successURL: FAKE_SUCCESS_URL,
        failureURL: FAKE_FAILURE_URL,
        inputURL: "s3://test-bucket/test-key",
        inputCreds: {
          region: FAKE_AWS_REGION,
          accessKeyId: FAKE_AWS_ACCESS_KEY_ID,
          secretAccessKey: FAKE_AWS_SECRET_ACCESS_KEY,
        },
        outputURL: "gcp://test-bucket/test-key",
        outputCreds: {},
        encoder: "h264",
        bitrateKBPS: "2000",
        container: "mp4",
        width: "150",
      };

      mock.onPost(`${BASE_URL}/transcode`, expectedBody).reply(201, retData);

      const job = await mediamachine
        .transcodeToMp4({
          width: 150,
          successUrl: FAKE_SUCCESS_URL,
          failureUrl: FAKE_FAILURE_URL,
        })
        .fromS3(
          FAKE_AWS_REGION,
          FAKE_AWS_ACCESS_KEY_ID,
          FAKE_AWS_SECRET_ACCESS_KEY,
          "test-bucket",
          "test-key"
        )
        .toGCloud("{}", "test-bucket", "test-key");
      expect(job.reqId).toEqual(reqId);
    });
  });
});
