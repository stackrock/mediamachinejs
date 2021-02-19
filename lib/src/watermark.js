"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextWatermark = exports.ImageWatermark = void 0;
var utils_1 = require("./utils");
var ImageWatermark = /** @class */ (function () {
    function ImageWatermark(opts) {
        if (opts === void 0) { opts = {}; }
        this.position = opts.position || "bottomRight";
        if (opts.height) {
            this.height = opts.height;
        }
        if (opts.width) {
            this.width = opts.width;
        }
        if (opts.url) {
            this.path = opts.url;
        }
        if (opts.uploaded_image_name) {
            this.image_name = opts.uploaded_image_name;
        }
        if (opts.url) {
            this.path = opts.url;
        }
        if (opts.opacity === 0) {
            this.opacity = 0;
        }
        else {
            this.opacity = opts.opacity || 0.9;
        }
    }
    ImageWatermark.prototype.toJSON = function () {
        var ret = {
            width: this.width,
            height: this.height,
            imageName: this.image_name,
            imageUrl: this.path,
            opacity: "" + this.opacity,
            position: this.position,
        };
        return utils_1.removeUndefinedFromObj(ret);
    };
    return ImageWatermark;
}());
exports.ImageWatermark = ImageWatermark;
var TextWatermark = /** @class */ (function () {
    function TextWatermark(text, opts) {
        if (opts === void 0) { opts = {}; }
        this.text = text;
        this.fontSize = opts.fontSize || 12;
        this.fontColor = opts.fontColor || "white";
        this.position = opts.position || "bottomRight";
        if (opts.opacity === 0) {
            this.opacity = 0;
        }
        else {
            this.opacity = opts.opacity || 0.9;
        }
    }
    TextWatermark.prototype.toJSON = function () {
        var ret = {
            fontSize: "" + this.fontSize,
            text: this.text,
            fontColor: this.fontColor,
            opacity: "" + this.opacity,
            position: this.position,
        };
        return utils_1.removeUndefinedFromObj(ret);
    };
    return TextWatermark;
}());
exports.TextWatermark = TextWatermark;
