import { Store } from ".";
import { Blob } from "./blob";
import { Newable } from "./Newable";

export class WorkerConfig<T, U> {

  apiKey: string;
  options: T;
  targetKlass: any;

  constructor (apiKey: string, opts: T, targetKlass: Newable<U>) {
    this.apiKey = apiKey;
    this.options = opts;
    this.targetKlass = targetKlass;
  }

  getConfig (from: string | Blob, to: string | Blob): any {
    return;
  }

  fromS3 (region: string, accessKeyId: string, secretAccessKey: string, bucket: string, inputKey: string) {
    const inputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        region,
        accessKeyId,
        secretAccessKey,
        type: Store.S3,
      });
    const Target = this.targetKlass;
    return new Target(this, inputFile); 
  }

  fromAzure (accountKey: string, accountName: string, bucket: string, inputKey: string) {
    const inputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        accountKey,
        accountName,
        type: Store.AZURE_BLOB,
      });
    const Target = this.targetKlass;
    return new Target(this, inputFile); 
  }

  fromGCloud (json: string, bucket: string, inputKey: string) {
    const inputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        json,
        type: Store.GOOGLE_BLOB
      });
    const Target = this.targetKlass;
    return new Target(this, inputFile); 
  }

  fromUrl (url: string) {
    const Target = this.targetKlass;
    return new Target(this, url); 
  }
}