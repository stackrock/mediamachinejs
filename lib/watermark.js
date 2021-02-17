"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watermark = exports.Position = void 0;
var utils_1 = require("./utils");
var Position;
(function (Position) {
    Position["TOP_LEFT"] = "topLetf";
    Position["TOP_RIGHT"] = "topRight";
    Position["BOTTOM_LEFT"] = "bottomLeft";
    Position["BOTTOM_RIGHT"] = "bottomRight";
})(Position = exports.Position || (exports.Position = {}));
var Watermark = /** @class */ (function () {
    function Watermark() {
    }
    Watermark.withDefaults = function () {
        var w = new Watermark();
        w.watermarkFontSize = 12;
        w.watermarkFontColor = "white";
        w.watermarkPosition = Position.BOTTOM_RIGHT;
        w.watermarkOpacity = 0.9;
        return w;
    };
    Watermark.prototype.text = function (text) {
        this.watermarkText = text;
        return this;
    };
    Watermark.prototype.image = function (image) {
        this.watermarkImage = image;
        return this;
    };
    Watermark.prototype.fontSize = function (fontSize) {
        this.watermarkFontSize = fontSize;
        return this;
    };
    Watermark.prototype.fontColor = function (fontColor) {
        this.watermarkFontColor = fontColor;
        return this;
    };
    Watermark.prototype.opacity = function (opacity) {
        this.watermarkOpacity = opacity;
        return this;
    };
    Watermark.prototype.position = function (position) {
        this.watermarkPosition = position;
        return this;
    };
    Watermark.prototype.toJSON = function () {
        var ret = {
            fontSize: "" + this.watermarkFontSize,
            text: this.watermarkText,
            image: this.watermarkImage,
            fontColor: this.watermarkFontColor,
            opacity: "" + this.watermarkOpacity,
            position: this.watermarkPosition,
        };
        return utils_1.removeUndefinedFromObj(ret);
    };
    return Watermark;
}());
exports.Watermark = Watermark;
