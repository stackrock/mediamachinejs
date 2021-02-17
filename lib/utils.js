"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefinedFromObj = void 0;
function removeUndefinedFromObj(obj) {
    Object.keys(obj).forEach(function (key) { return obj[key] === undefined ? delete obj[key] : {}; });
    return obj;
}
exports.removeUndefinedFromObj = removeUndefinedFromObj;
