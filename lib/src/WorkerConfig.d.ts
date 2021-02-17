import { Blob } from "./blob";
import { Executable } from "./Executable";
import { Newable } from "./Newable";
export declare class WorkerConfig<U> {
    apiKey: string;
    targetKlass: any;
    constructor(apiKey: string, targetKlass: Newable<U>);
    getExecutable(from: string | Blob): Executable;
    fromS3(region: string, accessKeyId: string, secretAccessKey: string, bucket: string, inputKey: string): any;
    fromAzure(accountKey: string, accountName: string, bucket: string, inputKey: string): any;
    fromGCloud(json: string, bucket: string, inputKey: string): any;
    fromUrl(url: string): any;
}
