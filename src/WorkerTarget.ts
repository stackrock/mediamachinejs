import { Executable } from "./Executable";
import { Blob, Store } from "./blob";

export class WorkerTarget<T extends Executable> {
  workerConfig: T;

  constructor (transcoder: T) {
    this.workerConfig = transcoder;
  }

  async toAzure (accountKey: string, accountName: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        accountKey,
        accountName,
        type: Store.AZURE_BLOB,
      });

    const job = await this.workerConfig.to(outputFile).execute();
    return job;
  }

  async toGCloud (json: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        json,
        type: Store.GOOGLE_BLOB,
      });

    const job = await this.workerConfig.to(outputFile).execute();
    return job;
  }

  async toS3 (region: string, accessKeyId: string, secretAccessKey: string, bucket: string, inputKey: string) {
    
    // create the output blob
    const outputFile = Blob.withDefaults()
      .bucket(bucket)
      .key(inputKey)
      .credentials({
        region,
        accessKeyId,
        secretAccessKey,
        type: Store.S3,
      });

    const job = await this.workerConfig.to(outputFile).execute();
    return job;
  }
}
