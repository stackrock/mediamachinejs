import { Store } from ".";
import { Blob } from "./blob";
import { Executable } from "./Executable";
import { Newable } from "./Newable";

export class WorkerConfig<U> {

  apiKey: string;
  targetKlass: any;

  constructor (apiKey: string, targetKlass: Newable<U>) {
    this.apiKey = apiKey;
    this.targetKlass = targetKlass;
  }

  getExecutable (from: string | Blob): Executable {
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
    const executable = this.getExecutable(inputFile);
    return new Target(executable, inputFile); 
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