import { Blob, Store } from "./blob";
import { Executable } from "./Executable";
import { Newable } from "./Newable";

export class WorkerConfig<U> {
  apiKey: string;
  targetKlass: any;

  constructor(apiKey: string, targetKlass: Newable<U>) {
    this.apiKey = apiKey;
    this.targetKlass = targetKlass;
  }

  getExecutable(from: string | Blob): Executable {
    return;
  }

  fromS3(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucket: string,
    inputKey: string
  ) {
    const inputFile = new Blob(
      {
        region,
        accessKeyId,
        secretAccessKey,
        type: Store.S3,
      },
      bucket,
      inputKey
    );
    const Target = this.targetKlass;
    const executable = this.getExecutable(inputFile);
    return new Target(executable, inputFile);
  }

  fromAzure(
    accountKey: string,
    accountName: string,
    bucket: string,
    inputKey: string
  ) {
    const inputFile = new Blob(
      {
        accountKey,
        accountName,
        type: Store.AZURE_BLOB,
      },
      bucket,
      inputKey
    );
    const Target = this.targetKlass;
    const executable = this.getExecutable(inputFile);
    return new Target(executable, inputFile);
  }

  fromGCloud(json: string, bucket: string, inputKey: string) {
    const inputFile = new Blob(
      {
        json,
        type: Store.GOOGLE_BLOB,
      },
      bucket,
      inputKey
    );
    const Target = this.targetKlass;
    const executable = this.getExecutable(inputFile);
    return new Target(executable, inputFile);
  }

  fromUrl(url: string) {
    const Target = this.targetKlass;
    const executable = this.getExecutable(url);
    return new Target(executable, url);
  }
}
