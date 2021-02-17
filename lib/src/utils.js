"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseApiKey = exports.removeUndefinedFromObj = void 0;
function removeUndefinedFromObj(obj) {
    Object.keys(obj).forEach(function (key) { return obj[key] === undefined ? delete obj[key] : {}; });
    return obj;
}
exports.removeUndefinedFromObj = removeUndefinedFromObj;
exports.parseApiKey = function (inKey) {
    // check the LIVE- / test- prefix
    if (!/^LIVE\-|test\-/.test(inKey)) {
        throw new Error("bad key format");
    }
    // chop off the LIVE- / test- prefix
    var key = inKey.substring(5);
    var matcher = /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}$/;
    var results = key.match(matcher);
    if (!results) {
        throw new Error("bad key format");
    }
    if (!results.index) {
        throw new Error("bad key format");
    }
    var retval = {
        key: key.slice(results.index),
        name: key.slice(0, results.index - 1),
        isTesting: inKey.indexOf("LIVE-") === -1,
    };
    return retval;
};
