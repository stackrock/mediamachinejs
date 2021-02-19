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
process.on("unhandledRejection", function (error) {
    throw error;
});
/*
 * Tracer Bullet for a transcode job.
 * We use this job internally at MediaMachine for two reasons:
 *  1) To keep the SDK in sync with API
 *  2) To Test our API is running as expected
 */
require("dotenv").config();
var src_1 = require("../src");
var utils_1 = require("./utils");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var MEDIAMACHINE_API_KEY, BUCKET, INPUT_KEY, OUTPUT_KEY, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, mediaMachine, job, status_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MEDIAMACHINE_API_KEY = process.env.MEDIAMACHINE_API_KEY;
                    BUCKET = process.env.BUCKET;
                    INPUT_KEY = process.env.INPUT_KEY;
                    OUTPUT_KEY = process.env.OUTPUT_KEY;
                    AWS_REGION = process.env.AWS_REGION;
                    AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
                    AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
                    mediaMachine = new src_1.MediaMachine(MEDIAMACHINE_API_KEY);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, mediaMachine
                            .transcodeToMp4({
                            encoder: "h264",
                            height: 300,
                            width: 150,
                            watermark: mediaMachine.textWatermark("mediamachine.io"),
                        })
                            .fromS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, INPUT_KEY)
                            .toS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, OUTPUT_KEY)];
                case 2:
                    job = _a.sent();
                    return [4 /*yield*/, job.status()];
                case 3:
                    status_1 = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(status_1 === "queued")) return [3 /*break*/, 7];
                    return [4 /*yield*/, utils_1.sleep(2)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, job.status()];
                case 6:
                    status_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 7:
                    if (status_1 === "done") {
                        console.log("Job finished successfully");
                    }
                    else {
                        console.log("Job finished with an error");
                        process.exit(1);
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.error(err_1);
                    process.exit(1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, main()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
