import { Executable } from "./Executable";
export declare class WorkerTarget<T extends Executable> {
    workerConfig: T;
    constructor(transcoder: T);
    toAzure(accountKey: string, accountName: string, bucket: string, inputKey: string): Promise<import("./job").Job>;
    toGCloud(json: string, bucket: string, inputKey: string): Promise<import("./job").Job>;
    toS3(region: string, accessKeyId: string, secretAccessKey: string, bucket: string, inputKey: string): Promise<import("./job").Job>;
}
