"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_mock_adapter_1 = require("axios-mock-adapter");
var index_1 = require("./index");
var FAKE_SUCCESS_URL = "http://stackrock.io/success";
var FAKE_FAILURE_URL = "http://stackrock.io/failure";
var FAKE_INPUT_URL = "http://stackrock.io/path/to/image.png";
var FAKE_OUTPUT_URL = "http://stackrock.io/path/to/output/image";
var FAKE_TRANSCODE_OPTS = index_1.TranscodeOpts.withDefaults();
var FAKE_S3_BLOB = index_1.Blob.withDefaults()
    .bucket("test-bucket")
    .key("test-key")
    .credentials({
    region: "us-east-1",
    accessKeyId: "123",
    secretAccessKey: "abc",
    type: index_1.Store.S3,
});
var FAKE_GCP_BLOB = index_1.Blob.withDefaults()
    .credentials({
    type: index_1.Store.GOOGLE_BLOB,
    json: "{}",
})
    .bucket("test-bucket")
    .key("test-key");
var FAKE_AZURE_BLOB = index_1.Blob.withDefaults()
    .credentials({
    type: index_1.Store.AZURE_BLOB,
    accountKey: "123",
    accountName: "abc",
})
    .bucket("test-bucket")
    .key("test-key");
var FAKE_IMAGE_WATERMARK = index_1.Watermark.withDefaults().image({
    height: 200,
    width: 400,
    path: "http://path.com/to/your/image",
});
describe("Mediamachine", function () {
    describe("thumbnail", function () {
        var mock;
        var retData = { reqId: "12" };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test.only("with all required properties, using URLs does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: 150,
                        };
                        mock
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            watermark: {
                                text: "stackrock.io",
                                fontSize: 12,
                                fontColor: "white",
                                opacity: 0.9,
                                position: "bottomRight",
                            },
                            width: 150,
                        };
                        mock
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermarkFromText("stackrock.io")
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermark(FAKE_IMAGE_WATERMARK)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: 720,
                        };
                        mock
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_AZURE_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_GCP_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using AWS for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_S3_BLOB)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_AZURE_BLOB)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/thumbnail", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.ThumbnailJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with a null apikey throws an error", function () {
            expect(index_1.ThumbnailJob.withDefaults()
                .apiKey(null)
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with empty string apikey throws an error", function () {
            expect(index_1.ThumbnailJob.withDefaults()
                .apiKey("")
                .webhooks({
                successUrl: FAKE_INPUT_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with apikey only using spaces throws an error", function () {
            expect(index_1.ThumbnailJob.withDefaults()
                .apiKey("       ")
                .webhooks({
                successUrl: FAKE_INPUT_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with no input_url or input_blob provided", function () {
            expect(index_1.ThumbnailJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_INPUT_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with no output_url or output_blob provided", function () {
            expect(index_1.ThumbnailJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .width(150)
                .execute()).rejects.toThrow();
        });
    });
    describe("Gif Summary", function () {
        var mock;
        var retData = { reqId: "12" };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: 150,
                        };
                        mock
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            watermark: {
                                text: "stackrock.io",
                                fontSize: 12,
                                fontColor: "white",
                                opacity: 0.9,
                                position: "bottomRight",
                            },
                            width: 150,
                        };
                        mock
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermarkFromText("stackrock.io")
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermark(FAKE_IMAGE_WATERMARK)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: 720,
                        };
                        mock
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_AZURE_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_GCP_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_AZURE_BLOB)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/gif", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .type(index_1.SummaryType.GIF)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with a null apikey throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .type(index_1.SummaryType.GIF)
                .execute()).rejects.toThrow();
        });
        test("with empty string apikey throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .type(index_1.SummaryType.GIF)
                .execute()).rejects.toThrow();
        });
        test("with apikey only using spaces throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("         ")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .type(index_1.SummaryType.GIF)
                .execute()).rejects.toThrow();
        });
        test("with no input_url or input_blob provided throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .type(index_1.SummaryType.GIF)
                .execute()).rejects.toThrow();
        });
        test("with no output_url or output_blob provided throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .width(150)
                .type(index_1.SummaryType.GIF)
                .execute()).rejects.toThrow();
        });
        test("with null summaryType throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .execute()).rejects.toThrow();
        });
    });
    describe("MP4 Summary", function () {
        var mock;
        var retData = { reqId: "12" };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mock.onPost("https://api.stackrock.io/summary/mp4").reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            watermark: {
                                text: "stackrock.io",
                                fontSize: 12,
                                fontColor: "white",
                                opacity: 0.9,
                                position: "bottomRight",
                            },
                            width: 150,
                        };
                        mock
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermarkFromText("stackrock.io")
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermark(FAKE_IMAGE_WATERMARK)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: 720,
                        };
                        mock
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_AZURE_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_GCP_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_AZURE_BLOB)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/summary/mp4", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.SummaryJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .type(index_1.SummaryType.MP4)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with a null apikey throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .type(index_1.SummaryType.MP4)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with empty string apikey throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .type(index_1.SummaryType.MP4)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with apikey only using spaces throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("     ")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .type(index_1.SummaryType.MP4)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with no input_url or input_blob provided throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .to(FAKE_OUTPUT_URL)
                .type(index_1.SummaryType.MP4)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with no output_url or output_blob provided throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .type(index_1.SummaryType.MP4)
                .width(150)
                .execute()).rejects.toThrow();
        });
        test("with null summaryType throws an error", function () {
            expect(index_1.SummaryJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .type(null)
                .width(150)
                .execute()).rejects.toThrow();
        });
    });
    describe("Transcode", function () {
        var mock;
        var retData = { reqId: "12" };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties does not fail", function () {
            mock.onPost("https://api.stackrock.io/transcode").reply(201, retData);
            expect(index_1.TranscodeJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .opts(FAKE_TRANSCODE_OPTS)
                .execute()).resolves.toEqual(retData);
        });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: "test-123",
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: 150,
                            watermark: {
                                text: "stackrock.io",
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermarkFromText("stackrock.io")
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .watermark(FAKE_IMAGE_WATERMARK)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_OUTPUT_URL)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_AZURE_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_GCP_BLOB)
                                .to(FAKE_OUTPUT_URL)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_AZURE_BLOB)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_INPUT_URL)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            .onPost("https://api.stackrock.io/transcode", expectedBody)
                            .reply(201, retData);
                        return [4 /*yield*/, expect(index_1.TranscodeJob.withDefaults()
                                .apiKey("test-123")
                                .webhooks({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .from(FAKE_S3_BLOB)
                                .to(FAKE_GCP_BLOB)
                                .width(150)
                                .opts(FAKE_TRANSCODE_OPTS)
                                .execute()).resolves.toEqual(retData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("with a null apikey throws an error", function () {
            expect(index_1.TranscodeJob.withDefaults()
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .opts(FAKE_TRANSCODE_OPTS)
                .execute()).rejects.toThrow();
        });
        test("with empty string apikey throws an error", function () {
            expect(index_1.TranscodeJob.withDefaults()
                .apiKey("")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .opts(FAKE_TRANSCODE_OPTS)
                .execute()).rejects.toThrow();
        });
        test("with apikey only using spaces throws an error", function () {
            expect(index_1.TranscodeJob.withDefaults()
                .apiKey("         ")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .opts(FAKE_TRANSCODE_OPTS)
                .execute()).rejects.toThrow();
        });
        test("with no input_url or input_blob provided throws an error", function () {
            expect(index_1.TranscodeJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .opts(FAKE_TRANSCODE_OPTS)
                .execute()).rejects.toThrow();
        });
        test("with no output_url or output_blob provided throws an error", function () {
            expect(index_1.TranscodeJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .width(150)
                .opts(FAKE_TRANSCODE_OPTS)
                .execute()).rejects.toThrow();
        });
        test("with null transcodeOpts throws an error", function () {
            expect(index_1.TranscodeJob.withDefaults()
                .apiKey("test-123")
                .webhooks({
                successUrl: FAKE_SUCCESS_URL,
                failureUrl: FAKE_FAILURE_URL,
            })
                .from(FAKE_INPUT_URL)
                .to(FAKE_OUTPUT_URL)
                .width(150)
                .opts(null)
                .execute()).rejects.toThrow();
        });
    });
});
