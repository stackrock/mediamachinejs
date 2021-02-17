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
exports.SummaryJob = exports.SummaryType = void 0;
var api_1 = require("./api");
var utils_1 = require("./utils");
var watermark_1 = require("./watermark");
var job_1 = require("./job");
var SummaryType;
(function (SummaryType) {
    SummaryType["MP4"] = "mp4";
    SummaryType["GIF"] = "gif";
})(SummaryType = exports.SummaryType || (exports.SummaryType = {}));
var SummaryJob = /** @class */ (function () {
    function SummaryJob() {
    }
    SummaryJob.withDefaults = function () {
        var sj = new SummaryJob();
        sj.summaryWidth = 720;
        return sj;
    };
    SummaryJob.prototype.apiKey = function (apiKey) {
        this.apikey = apiKey;
        return this;
    };
    SummaryJob.prototype.webhooks = function (webhooks) {
        this.successUrl = webhooks.successUrl;
        this.failureUrl = webhooks.failureUrl;
        return this;
    };
    SummaryJob.prototype.from = function (source) {
        if (typeof source === "string") {
            this.inputUrl = source;
        }
        else {
            this.inputBlob = source;
        }
        return this;
    };
    SummaryJob.prototype.to = function (destination) {
        if (typeof destination === "string") {
            this.outputUrl = destination;
        }
        else {
            this.outputBlob = destination;
        }
        return this;
    };
    SummaryJob.prototype.watermark = function (watermark) {
        this.summaryWatermark = watermark;
        return this;
    };
    SummaryJob.prototype.watermarkFromText = function (text) {
        var watermark = watermark_1.Watermark.withDefaults().text(text);
        this.summaryWatermark = watermark;
        return this;
    };
    SummaryJob.prototype.type = function (type) {
        this.summaryType = type;
        return this;
    };
    SummaryJob.prototype.width = function (width) {
        this.summaryWidth = width;
        return this;
    };
    SummaryJob.prototype.removeAudio = function (value) {
        this.summaryRemoveAudio = value;
        return this;
    };
    SummaryJob.prototype.execute = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var jobType, emptyInputUrl, emptyOutputUrl, body, resp, job;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        jobType = "gif_summary";
                        if (this.summaryType === "mp4") {
                            jobType = "mp4_summary";
                        }
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
                        if (!this.summaryType) {
                            throw new Error("Missing summaryType");
                        }
                        body = {
                            apiKey: this.apikey,
                            successURL: this.successUrl,
                            failureURL: this.failureUrl,
                            width: "" + this.summaryWidth,
                            watermark: (_a = this.summaryWatermark) === null || _a === void 0 ? void 0 : _a.toJSON(),
                            inputURL: this.inputUrl,
                            inputBlob: (_b = this.inputBlob) === null || _b === void 0 ? void 0 : _b.toJSON(),
                            outputURL: this.outputUrl,
                            outputBlob: (_c = this.outputBlob) === null || _c === void 0 ? void 0 : _c.toJSON(),
                            removeAudio: this.summaryRemoveAudio,
                        };
                        return [4 /*yield*/, api_1.API.createJob(jobType, utils_1.removeUndefinedFromObj(body))];
                    case 1:
                        resp = _d.sent();
                        job = new job_1.Job(resp.data.id);
                        return [2 /*return*/, job];
                }
            });
        });
    };
    return SummaryJob;
}());
exports.SummaryJob = SummaryJob;
