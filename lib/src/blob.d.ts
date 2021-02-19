export declare enum Store {
    S3 = "s3",
    AZURE_BLOB = "azure",
    GOOGLE_BLOB = "gcp"
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
export declare type Credentials = AWSCreds | AzureCreds | GCPCreds;
export declare class Blob {
    blobStore: Store;
    blobBucket: string;
    blobKey: string;
    awsCreds?: AWSCreds;
    azureCreds?: AzureCreds;
    gcpCreds?: GCPCreds;
    constructor(creds: Credentials, bucket: string, key: string);
    toApiCredentials(): string | {
        [x: string]: any;
    };
    toApiUrl(): string;
    toJSON(): any;
}
