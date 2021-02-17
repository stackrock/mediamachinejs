"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blob = exports.Store = void 0;
var Store;
(function (Store) {
    Store["S3"] = "s3";
    Store["AZURE_BLOB"] = "azblob";
    Store["GOOGLE_BLOB"] = "gcp";
})(Store = exports.Store || (exports.Store = {}));
var Blob = /** @class */ (function () {
    function Blob() {
    }
    Blob.withDefaults = function () {
        var b = new Blob();
        return b;
    };
    Blob.prototype.store = function (store) {
        this.blobStore = store;
        return this;
    };
    Blob.prototype.bucket = function (bucket) {
        this.blobBucket = bucket;
        return this;
    };
    Blob.prototype.key = function (key) {
        this.blobKey = key;
        return this;
    };
    Blob.prototype.credentials = function (creds) {
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
        return this;
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
