import { Executable } from "./Executable";
import { Blob, Store } from "./blob";

export class WorkerTarget<T extends Executable> {
  workerConfig: T;

  constructor (transcoder: T) {
    this.workerConfig = transcoder;
  }

  async toAzure (accountKey: string, accountName: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = new Blob({
        accountKey,
        accountName,
        type: Store.AZURE_BLOB,
      }, bucket, inputKey);

    const job = await this.workerConfig.to(outputFile).execute();
    return job;
  }

  async toGCloud (json: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = new Blob({
        json,
        type: Store.GOOGLE_BLOB,
      }, bucket, inputKey);

    const job = await this.workerConfig.to(outputFile).execute();
    return job;
  }

  async toS3 (region: string, accessKeyId: string, secretAccessKey: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = new Blob({
        region,
        accessKeyId,
        secretAccessKey,
        type: Store.S3,
      }, bucket, inputKey);

    const job = await this.workerConfig.to(outputFile).execute();
    return job;
  }
}
