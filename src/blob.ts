export enum Store {
  S3 = "s3",
  AZURE_BLOB = "azblob",
  GOOGLE_BLOB = "gcp",
}

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

  constructor() {
  }

  static withDefaults(): Blob {
    const b = new Blob();
    return b;
  }

  static S3WithDefaults(accessKeyId: string, secretAccessKey: string, region: string): Blob {
    const b = new Blob();
    b.blobStore = Store.S3;
    b.awsCreds = {
      accessKeyId,
      secretAccessKey,
      region,
      type: Store.S3,
    }
    return b;
  }

  static AzureWithDefaults(accountName: string, accountKey: string): Blob {
    const b = new Blob();
    b.blobStore = Store.AZURE_BLOB;
    b.azureCreds = {
      accountName,
      accountKey,
      type: Store.AZURE_BLOB,
    }
    return b;
  }

  static GCPWithDefaults(json: string): Blob {
    const b = new Blob();
    b.blobStore = Store.GOOGLE_BLOB;
    b.gcpCreds = {
      json,
      type: Store.GOOGLE_BLOB,
    }
    return b;
  }

  store(store: Store): Blob {
    this.blobStore = store;
    return this;
  }

  bucket(bucket: string): Blob {
    this.blobBucket = bucket;
    return this;
  }

  key(key: string): Blob {
    this.blobKey = key;
    return this;
  }

  credentials(creds: Credentials): Blob {
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
    return this;
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
