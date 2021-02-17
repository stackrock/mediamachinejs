"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaMachine = void 0;
var thumbnail_1 = require("./thumbnail");
var transcode_1 = require("./transcode");
var summary_1 = require("./summary");
var utils_1 = require("./utils");
var WorkerConfig_1 = require("./WorkerConfig");
var watermark_1 = require("./watermark");
var WorkerTarget_1 = require("./WorkerTarget");
// mp4 transcoding
var TranscodeMp4Target = /** @class */ (function (_super) {
    __extends(TranscodeMp4Target, _super);
    function TranscodeMp4Target(transcoder) {
        return _super.call(this, transcoder) || this;
    }
    return TranscodeMp4Target;
}(WorkerTarget_1.WorkerTarget));
var TranscoderMp4 = /** @class */ (function (_super) {
    __extends(TranscoderMp4, _super);
    function TranscoderMp4(apiKey, opts) {
        var _this = _super.call(this, apiKey, TranscodeMp4Target) || this;
        _this.options = opts;
        return _this;
    }
    TranscoderMp4.prototype.getExecutable = function (fromConfig) {
        var opts = new transcode_1.TranscodeOpts();
        var options = this.options;
        opts.container(transcode_1.Container.MP4);
        if (options.encoder) {
            opts.encoder(options.encoder);
        }
        var config = new transcode_1.TranscodeJob(this.apiKey)
            .from(fromConfig)
            .webhooks({
            successUrl: options.successUrl,
            failureUrl: options.failureUrl,
        })
            .opts(opts);
        if (options.width) {
            config = config.width(options.width);
        }
        if (options.height) {
            config = config.height(options.height);
        }
        if (options.watermark) {
            config = config.watermark(options.watermark);
        }
        return config;
    };
    return TranscoderMp4;
}(WorkerConfig_1.WorkerConfig));
// transcoding
var TranscodeWebmTarget = /** @class */ (function (_super) {
    __extends(TranscodeWebmTarget, _super);
    function TranscodeWebmTarget(transcoder) {
        return _super.call(this, transcoder) || this;
    }
    return TranscodeWebmTarget;
}(WorkerTarget_1.WorkerTarget));
var TranscoderWebm = /** @class */ (function (_super) {
    __extends(TranscoderWebm, _super);
    function TranscoderWebm(apiKey, opts) {
        var _this = _super.call(this, apiKey, TranscodeWebmTarget) || this;
        _this.options = opts;
        return _this;
    }
    TranscoderWebm.prototype.getExecutable = function (fromConfig) {
        var opts = new transcode_1.TranscodeOpts();
        opts.container(transcode_1.Container.WEBM);
        var options = this.options;
        if (options.encoder) {
            opts.encoder(options.encoder);
        }
        var config = new transcode_1.TranscodeJob(this.apiKey)
            .from(fromConfig)
            .webhooks({
            successUrl: options.successUrl,
            failureUrl: options.failureUrl,
        })
            .opts(opts);
        if (options.width) {
            config = config.width(options.width);
        }
        if (options.height) {
            config = config.height(options.height);
        }
        if (options.watermark) {
            config = config.watermark(options.watermark);
        }
        return config;
    };
    return TranscoderWebm;
}(WorkerConfig_1.WorkerConfig));
var ThumbnailTarget = /** @class */ (function (_super) {
    __extends(ThumbnailTarget, _super);
    function ThumbnailTarget(thumbnailer) {
        return _super.call(this, thumbnailer) || this;
    }
    return ThumbnailTarget;
}(WorkerTarget_1.WorkerTarget));
var Thumbnailer = /** @class */ (function (_super) {
    __extends(Thumbnailer, _super);
    function Thumbnailer(apiKey, options) {
        var _this = _super.call(this, apiKey, ThumbnailTarget) || this;
        _this.options = options;
        return _this;
    }
    Thumbnailer.prototype.getExecutable = function (fromConfig) {
        var options = this.options;
        var config = new thumbnail_1.ThumbnailJob(this.apiKey)
            .from(fromConfig)
            .webhooks({
            successUrl: options.successUrl,
            failureUrl: options.failureUrl,
        });
        if (options.width) {
            config = config.width(150);
        }
        if (options.watermark) {
            config = config.watermark(options.watermark);
        }
        return config;
    };
    return Thumbnailer;
}(WorkerConfig_1.WorkerConfig));
var SummaryTarget = /** @class */ (function (_super) {
    __extends(SummaryTarget, _super);
    function SummaryTarget(summarizer) {
        return _super.call(this, summarizer) || this;
    }
    return SummaryTarget;
}(WorkerTarget_1.WorkerTarget));
var Summarizer = /** @class */ (function (_super) {
    __extends(Summarizer, _super);
    function Summarizer(apiKey, opts) {
        var _this = _super.call(this, apiKey, SummaryTarget) || this;
        _this.options = opts;
        return _this;
    }
    Summarizer.prototype.getExecutable = function (fromConfig) {
        var options = this.options;
        var config = new summary_1.SummaryJob(this.apiKey)
            .from(fromConfig);
        if (options.width) {
            config = config.width(150);
        }
        config = config.type(options.format ? options.format : "gif");
        if (options.watermark) {
            config = config.watermark(options.watermark);
        }
        options.removeAudio = !!options.removeAudio;
        if (options.removeAudio) {
            config = config.removeAudio(options.removeAudio);
        }
        return config;
    };
    return Summarizer;
}(WorkerConfig_1.WorkerConfig));
// MediaMachine
// ==============================
var MediaMachine = /** @class */ (function () {
    function MediaMachine(apiKey) {
        utils_1.parseApiKey(apiKey);
        this.apiKey = apiKey;
    }
    MediaMachine.prototype.transcodeToWebm = function (opts) {
        return new TranscoderWebm(this.apiKey, opts);
    };
    MediaMachine.prototype.transcodeToMp4 = function (opts) {
        return new TranscoderMp4(this.apiKey, opts);
    };
    MediaMachine.prototype.thumbnail = function (opts) {
        return new Thumbnailer(this.apiKey, opts);
    };
    MediaMachine.prototype.summary = function (opts) {
        return new Summarizer(this.apiKey, opts);
    };
    MediaMachine.prototype.textWatermark = function (text, opts) {
        if (opts === void 0) { opts = {}; }
        return new watermark_1.TextWatermark(text, opts);
    };
    MediaMachine.prototype.imageWatermark = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new watermark_1.ImageWatermark(opts);
    };
    return MediaMachine;
}());
exports.MediaMachine = MediaMachine;
// Job
// =========================
var job_1 = require("./job");
Object.defineProperty(exports, "Job", { enumerable: true, get: function () { return job_1.Job; } });
