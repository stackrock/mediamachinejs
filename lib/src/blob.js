"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blob = exports.Store = void 0;
var Store;
(function (Store) {
    Store["S3"] = "s3";
    Store["AZURE_BLOB"] = "azure";
    Store["GOOGLE_BLOB"] = "gcp";
})(Store = exports.Store || (exports.Store = {})); // these are also protocol prefixes
var Blob = /** @class */ (function () {
    function Blob(creds, bucket, key) {
        if (creds.type === Store.S3) {
            this.awsCreds = creds;
            this.blobStore = creds.type;
        }
        else if (creds.type === Store.AZURE_BLOB) {
            this.azureCreds = creds;
            this.blobStore = creds.type;
        }
        else if (creds.type === Store.GOOGLE_BLOB) {
            this.gcpCreds = creds;
            this.blobStore = creds.type;
        }
        else {
            throw new Error("Invalid Credential type");
        }
        this.blobBucket = bucket;
        this.blobKey = key;
    }
    Blob.prototype.toApiCredentials = function () {
        var creds = this.awsCreds || this.azureCreds || this.gcpCreds || undefined;
        var omitSingle = function (key, _a) {
            var _b = key, _ = _a[_b], obj = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            return obj;
        };
        return omitSingle("type", creds);
    };
    Blob.prototype.toApiUrl = function () {
        var protocol = this.blobStore;
        var url = protocol + "://" + encodeURIComponent(this.blobBucket) + "/" + encodeURIComponent(this.blobKey);
        return url;
    };
    Blob.prototype.toJSON = function () {
        var json = {
            store: this.blobStore,
            bucket: this.blobBucket,
            key: this.blobKey,
        };
        if (!!this.awsCreds) {
            delete this.awsCreds.type;
            json.awsCreds = this.awsCreds;
        }
        if (!!this.azureCreds) {
            delete this.azureCreds.type;
            json.azureCreds = this.azureCreds;
        }
        if (!!this.gcpCreds) {
            delete this.gcpCreds.type;
            json.gcpCreds = this.gcpCreds;
        }
        return json;
    };
    return Blob;
}());
exports.Blob = Blob;
