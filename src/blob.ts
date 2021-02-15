export enum Store {
  S3 = "s3",
  AZURE_BLOB = "azure",
  GOOGLE_BLOB = "gcp",
}  // these are also protocol prefixes

export interface AWSCreds {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  type: Store.S3;
}

export interface AzureCreds {
  accountName: string;
  accountKey: string;
  type: Store.AZURE_BLOB;
}

export interface GCPCreds {
  json: string;
  type: Store.GOOGLE_BLOB;
}

export type Credentials = AWSCreds | AzureCreds | GCPCreds;

export class Blob {
  blobStore: Store;
  blobBucket: string;
  blobKey: string;
  awsCreds?: AWSCreds;
  azureCreds?: AzureCreds;
  gcpCreds?: GCPCreds;

  constructor(creds: Credentials, bucket: string, key:string) {
    if (creds.type === Store.S3) {
      this.awsCreds = creds;
      this.blobStore = creds.type;
    } else if (creds.type === Store.AZURE_BLOB) {
      this.azureCreds = creds;
      this.blobStore = creds.type;
    } else if (creds.type === Store.GOOGLE_BLOB) {
      this.gcpCreds = creds;
      this.blobStore = creds.type;
    } else {
      throw new Error("Invalid Credential type");
    }
    this.blobBucket = bucket;
    this.blobKey = key;
  }

  toApiCredentials() {
    const creds =  this.awsCreds || this.azureCreds || this.gcpCreds || undefined;
    const omitSingle = (key: string, { [key]: _, ...obj }) => obj;
    return omitSingle("type", creds);
  }

  toApiUrl (): string {
    const protocol = this.blobStore;
    const url = `${protocol}://${encodeURIComponent(this.blobBucket)}/${encodeURIComponent(this.blobKey)}`;
    return url;
  }

  toJSON() {
    const json: any = {
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
  }
}
