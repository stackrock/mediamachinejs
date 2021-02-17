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
exports.TranscodeOpts = exports.TranscodeJob = exports.VideoSize = exports.Container = exports.Bitrate = exports.Encoder = void 0;
var api_1 = require("./api");
var utils_1 = require("./utils");
var watermark_1 = require("./watermark");
var job_1 = require("./job");
var Encoder;
(function (Encoder) {
    Encoder["H264"] = "h264";
    Encoder["H265"] = "h265";
    Encoder["VP8"] = "vp8";
})(Encoder = exports.Encoder || (exports.Encoder = {}));
var Bitrate;
(function (Bitrate) {
    Bitrate["EIGHT_MEGAKBPS"] = "8000";
    Bitrate["FOUR_MEGAKBPS"] = "4000";
    Bitrate["ONE_MEGAKBPS"] = "1000";
})(Bitrate = exports.Bitrate || (exports.Bitrate = {}));
var Container;
(function (Container) {
    Container["MP4"] = "mp4";
    Container["WEB"] = "web";
})(Container = exports.Container || (exports.Container = {}));
var VideoSize;
(function (VideoSize) {
    VideoSize["FULL_HD"] = "1080";
    VideoSize["HD"] = "720";
    VideoSize["SD"] = "480";
})(VideoSize = exports.VideoSize || (exports.VideoSize = {}));
var TranscodeJob = /** @class */ (function () {
    function TranscodeJob() {
    }
    TranscodeJob.withDefaults = function () {
        var tj = new TranscodeJob();
        tj.transcodeWidth = 720;
        return tj;
    };
    TranscodeJob.prototype.apiKey = function (apiKey) {
        this.apikey = apiKey;
        return this;
    };
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
    TranscodeJob.prototype.watermarkFromText = function (text) {
        var watermark = watermark_1.Watermark.withDefaults().text(text);
        this.transcodeWatermark = watermark;
        return this;
    };
    TranscodeJob.prototype.width = function (value) {
        this.transcodeWidth = value;
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
                        if (this.apikey === null) {
                            throw new Error("Missing apiKey");
                        }
                        if (this.apikey.trim() == "") {
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
                            apiKey: this.apikey,
                            successURL: this.successUrl,
                            failureURL: this.failureUrl,
                            inputURL: this.inputUrl,
                            inputBlob: (_a = this.inputBlob) === null || _a === void 0 ? void 0 : _a.toJSON(),
                            outputURL: this.outputUrl,
                            outputBlob: (_b = this.outputBlob) === null || _b === void 0 ? void 0 : _b.toJSON(),
                            width: "" + this.transcodeWidth,
                            watermark: (_c = this.transcodeWatermark) === null || _c === void 0 ? void 0 : _c.toJSON(),
                            transcodeOpts: (_d = this.transcodeOpts) === null || _d === void 0 ? void 0 : _d.toJSON(),
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
    }
    TranscodeOpts.withDefaults = function () {
        var to = new TranscodeOpts();
        to.transcoderEncoder = Encoder.H264;
        to.transcoderBitrateKbps = Bitrate.FOUR_MEGAKBPS;
        to.transcoderContainer = Container.MP4;
        to.transcoderVideoSize = VideoSize.HD;
        return to;
    };
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
    TranscodeOpts.prototype.videoSize = function (value) {
        this.transcoderVideoSize = value;
        return this;
    };
    TranscodeOpts.prototype.toJSON = function () {
        return {
            encoder: this.transcoderEncoder,
            bitrateKbps: this.transcoderBitrateKbps,
            container: this.transcoderContainer,
            videoSize: this.transcoderVideoSize,
        };
    };
    return TranscodeOpts;
}());
exports.TranscodeOpts = TranscodeOpts;
