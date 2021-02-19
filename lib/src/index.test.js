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
var FAKE_SUCCESS_URL = "http://mediamachine.io/success";
var FAKE_FAILURE_URL = "http://mediamachine.io/failure";
var FAKE_INPUT_URL = "http://mediamachine.io/path/to/image.png";
var FAKE_OUTPUT_URL = "http://mediamachine.io/path/to/output/image";
var FAKE_AWS_REGION = "us-east-1";
var FAKE_AWS_ACCESS_KEY_ID = "123";
var FAKE_AWS_SECRET_ACCESS_KEY = "abc";
var FAKE_AZURE_ACCOUNT_KEY = "azure-account-key";
var FAKE_AZURE_ACCOUNT_NAME = "azure-account-name";
describe("Mediamachine", function () {
    var API_KEY = "test-jest-123-test-c123a980-7173-11eb-8a10-1fc5d5c9c235";
    var BASE_URL = "https://api.mediamachine.io";
    var mediamachine;
    beforeEach(function () {
        mediamachine = new index_1.MediaMachine(API_KEY);
    });
    describe("mediamachine", function () {
        test("with a null apikey throws an error", function () {
            expect(function () { return new index_1.MediaMachine(null); }).toThrow();
        });
        test("with empty string apikey throws an error", function () {
            expect(function () { return new index_1.MediaMachine(""); }).toThrow();
        });
        test("with apikey only using spaces throws an error", function () {
            expect(function () { return new index_1.MediaMachine("       "); }).toThrow();
        });
    });
    describe("thumbnail", function () {
        var mock;
        var reqId = "42";
        var retData = { id: reqId, status: "queued", createdAt: new Date() };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties, using URLs does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                                watermark: mediamachine.textWatermark("mediamachine.io"),
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
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
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: "720",
                        };
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: "gcp://test-bucket/test-key",
                            inputCreds: "{}",
                            outputURL: FAKE_OUTPUT_URL,
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromGCloud("{}", "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using AWS for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: "gcp://test-bucket/test-key",
                            outputCreds: "{}",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            outputCreds: "{}",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/thumbnail", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .thumbnail({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Gif Summary", function () {
        var mock;
        var reqId = "42";
        var retData = { id: reqId, status: "queued", createdAt: new Date() };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                                watermark: mediamachine.textWatermark("mediamachine.io"),
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
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
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: "720",
                        };
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: "gcp://test-bucket/test-key",
                            inputCreds: "{}",
                            outputURL: FAKE_OUTPUT_URL,
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromGCloud("{}", "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: "gcp://test-bucket/test-key",
                            outputCreds: "{}",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: "150",
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            outputCreds: "{}",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/gif", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "gif",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with null summaryType throws an error", function () {
            expect(function () {
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
    describe("MP4 Summary", function () {
        var mock;
        var reqId = "42";
        var retData = { id: reqId, status: "queued", createdAt: new Date() };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                watermark: mediamachine.textWatermark("mediamachine.io"),
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
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
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: FAKE_OUTPUT_URL,
                            width: "720",
                        };
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: "gcp://test-bucket/test-key",
                            inputCreds: "{}",
                            outputURL: FAKE_OUTPUT_URL,
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromGCloud("{}", "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: "gcp://test-bucket/test-key",
                            outputCreds: "{}",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                failureUrl: FAKE_FAILURE_URL,
                                successUrl: FAKE_SUCCESS_URL,
                                width: 150,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            outputCreds: "{}",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/summary/mp4", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .summary({
                                format: "mp4",
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Transcode", function () {
        var mock;
        var reqId = "42";
        var retData = { id: reqId, status: "queued", createdAt: new Date() };
        beforeEach(function () {
            mock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(function () {
            mock.reset();
        });
        test("with all required properties does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                encoder: "h264",
                                width: 150,
                                height: 200,
                                failureUrl: FAKE_FAILURE_URL,
                                successUrl: FAKE_SUCCESS_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using a text watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                width: 150,
                                height: 200,
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                watermark: mediamachine.textWatermark("mediamachine.io"),
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using an image watermark", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
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
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, and no width", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties, using AWS for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                                width: 150,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                width: 150,
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for input does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: "gcp://test-bucket/test-key",
                            inputCreds: "{}",
                            outputURL: FAKE_OUTPUT_URL,
                            encoder: "h264",
                            bitrateKBPS: "2000",
                            container: "mp4",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                width: 150,
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromGCloud("{}", "test-bucket", "test-key")
                                .toUrl(FAKE_OUTPUT_URL)];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using Azure for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                width: 150,
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toAzure(FAKE_AZURE_ACCOUNT_KEY, FAKE_AZURE_ACCOUNT_NAME, "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties using GCP for output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
                            apiKey: API_KEY,
                            successURL: FAKE_SUCCESS_URL,
                            failureURL: FAKE_FAILURE_URL,
                            inputURL: FAKE_INPUT_URL,
                            outputURL: "gcp://test-bucket/test-key",
                            outputCreds: "{}",
                            encoder: "h264",
                            bitrateKBPS: "2000",
                            container: "mp4",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                width: 150,
                                failureUrl: FAKE_FAILURE_URL,
                                successUrl: FAKE_SUCCESS_URL,
                            })
                                .fromUrl(FAKE_INPUT_URL)
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
        test("with all required properties with Blob for input and output does not fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedBody, job;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedBody = {
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
                            outputCreds: "{}",
                            encoder: "h264",
                            bitrateKBPS: "2000",
                            container: "mp4",
                            width: "150",
                        };
                        mock.onPost(BASE_URL + "/transcode", expectedBody).reply(201, retData);
                        return [4 /*yield*/, mediamachine
                                .transcodeToMp4({
                                width: 150,
                                successUrl: FAKE_SUCCESS_URL,
                                failureUrl: FAKE_FAILURE_URL,
                            })
                                .fromS3(FAKE_AWS_REGION, FAKE_AWS_ACCESS_KEY_ID, FAKE_AWS_SECRET_ACCESS_KEY, "test-bucket", "test-key")
                                .toGCloud("{}", "test-bucket", "test-key")];
                    case 1:
                        job = _a.sent();
                        expect(job.reqId).toEqual(reqId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
