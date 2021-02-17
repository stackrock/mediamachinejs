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
exports.TranscodeOpts = exports.TranscodeJob = exports.Container = void 0;
var api_1 = require("./api");
var utils_1 = require("./utils");
var job_1 = require("./job");
var Container;
(function (Container) {
    Container["MP4"] = "mp4";
    Container["WEBM"] = "webm";
})(Container = exports.Container || (exports.Container = {}));
var TranscodeJob = /** @class */ (function () {
    function TranscodeJob(apiKey) {
        this.transcodeWidth = 720;
        this.apiKey = apiKey;
    }
    TranscodeJob.prototype.webhooks = function (webhooks) {
        this.successUrl = webhooks.successUrl;
        this.failureUrl = webhooks.failureUrl;
        return this;
    };
    TranscodeJob.prototype.from = function (source) {
        if (typeof source === "string") {
            this.inputUrl = source;
        }
        else {
            this.inputBlob = source;
        }
        return this;
    };
    TranscodeJob.prototype.to = function (destination) {
        if (typeof destination === "string") {
            this.outputUrl = destination;
        }
        else {
            this.outputBlob = destination;
        }
        return this;
    };
    TranscodeJob.prototype.watermark = function (watermark) {
        this.transcodeWatermark = watermark;
        return this;
    };
    TranscodeJob.prototype.width = function (value) {
        this.transcodeWidth = value;
        return this;
    };
    TranscodeJob.prototype.height = function (value) {
        this.transcodeHeight = value;
        return this;
    };
    TranscodeJob.prototype.opts = function (value) {
        this.transcodeOpts = value;
        return this;
    };
    TranscodeJob.prototype.execute = function () {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var emptyInputUrl, emptyOutputUrl, body, resp, job;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (this.apiKey === null) {
                            throw new Error("Missing apiKey");
                        }
                        if (this.apiKey.trim() == "") {
                            throw new Error("Missing apiKey");
                        }
                        emptyInputUrl = !this.inputUrl || this.inputUrl.trim() === "";
                        if (!this.inputBlob && emptyInputUrl) {
                            throw new Error("Missing inputBlob or inputUrl");
                        }
                        emptyOutputUrl = !this.outputUrl || this.outputUrl.trim() == "";
                        if (!this.outputBlob && emptyOutputUrl) {
                            throw new Error("Missing outputBlob or outputUrl");
                        }
                        if (!this.transcodeOpts) {
                            throw new Error("Missing transcodeOpts");
                        }
                        body = {
                            apiKey: this.apiKey,
                            successURL: this.successUrl,
                            failureURL: this.failureUrl,
                            inputURL: this.inputUrl,
                            inputBlob: (_a = this.inputBlob) === null || _a === void 0 ? void 0 : _a.toJSON(),
                            outputURL: this.outputUrl,
                            outputBlob: (_b = this.outputBlob) === null || _b === void 0 ? void 0 : _b.toJSON(),
                            width: "" + this.transcodeWidth,
                            height: "" + this.transcodeHeight,
                            watermark: (_c = this.transcodeWatermark) === null || _c === void 0 ? void 0 : _c.toJSON(),
                            transcode: (_d = this.transcodeOpts) === null || _d === void 0 ? void 0 : _d.toJSON(),
                        };
                        return [4 /*yield*/, api_1.API.createJob("transcode", utils_1.removeUndefinedFromObj(body))];
                    case 1:
                        resp = _e.sent();
                        job = new job_1.Job(resp.data.id);
                        return [2 /*return*/, job];
                }
            });
        });
    };
    return TranscodeJob;
}());
exports.TranscodeJob = TranscodeJob;
var TranscodeOpts = /** @class */ (function () {
    function TranscodeOpts() {
        this.transcoderEncoder = "h264";
        this.transcoderBitrateKbps = "4000";
        this.transcoderContainer = Container.MP4;
    }
    TranscodeOpts.prototype.encoder = function (value) {
        this.transcoderEncoder = value;
        return this;
    };
    TranscodeOpts.prototype.bitrateKbps = function (value) {
        this.transcoderBitrateKbps = value;
        return this;
    };
    TranscodeOpts.prototype.container = function (value) {
        this.transcoderContainer = value;
        return this;
    };
    TranscodeOpts.prototype.toJSON = function () {
        return {
            encoder: this.transcoderEncoder,
            bitrateKbps: this.transcoderBitrateKbps,
            container: this.transcoderContainer,
        };
    };
    return TranscodeOpts;
}());
exports.TranscodeOpts = TranscodeOpts;