"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerConfig = void 0;
var blob_1 = require("./blob");
var WorkerConfig = /** @class */ (function () {
    function WorkerConfig(apiKey, targetKlass) {
        this.apiKey = apiKey;
        this.targetKlass = targetKlass;
    }
    WorkerConfig.prototype.getExecutable = function (from) {
        return;
    };
    WorkerConfig.prototype.fromS3 = function (region, accessKeyId, secretAccessKey, bucket, inputKey) {
        var inputFile = new blob_1.Blob({
            region: region,
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            type: blob_1.Store.S3,
        }, bucket, inputKey);
        var Target = this.targetKlass;
        var executable = this.getExecutable(inputFile);
        return new Target(executable, inputFile);
    };
    WorkerConfig.prototype.fromAzure = function (accountKey, accountName, bucket, inputKey) {
        var inputFile = new blob_1.Blob({
            accountKey: accountKey,
            accountName: accountName,
            type: blob_1.Store.AZURE_BLOB,
        }, bucket, inputKey);
        var Target = this.targetKlass;
        var executable = this.getExecutable(inputFile);
        return new Target(executable, inputFile);
    };
    WorkerConfig.prototype.fromGCloud = function (json, bucket, inputKey) {
        var inputFile = new blob_1.Blob({
            json: json,
            type: blob_1.Store.GOOGLE_BLOB,
        }, bucket, inputKey);
        var Target = this.targetKlass;
        var executable = this.getExecutable(inputFile);
        return new Target(executable, inputFile);
    };
    WorkerConfig.prototype.fromUrl = function (url) {
        var Target = this.targetKlass;
        var executable = this.getExecutable(url);
        return new Target(executable, url);
    };
    return WorkerConfig;
}());
exports.WorkerConfig = WorkerConfig;
