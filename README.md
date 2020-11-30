# Mediamachine.js

This is the client to connect to [Stackrock](https://stackrock.io)'s services for:
* Generate a thumbnail from a video
* Generate a summary from a video
* Transcode a video

## Installation

```
$ npm install mediamachinejs
```

## Usage

Every processor (thumbnail, transcode and summary) returns a [Job](#job) object that you can use to query
the state of the Job.

Every processor can get their input from any of the following sources:

* URL
* Amazon S3
* Google GCP
* Microsoft Azure buckets

Also, every processor can store the output in any of the following:

* Amazon S3
* Google GCP
* Microsoft Azure buckets.
* URL (We `POST` to that URL when the output is ready).

Additionally, every processor accepts a success and failure endpoint, that we will call with the output of the process
once is done.

### Thumbnail

Creates a new thumbnail processor job which consumes data from S3 and put the thumbnail on S3.

```javascript
import { Blob, Store, ThumbnailJob } from "mediamachinejs";

const credentials = {
  region: "us-east-1",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  type: Store.S3,
};

const inputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_input_key").credentials(credentials);

const outputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_output_blob").credentials(credentials);

const job = await ThumbnailJob.withDefaults().apiKey("stackrock_api_key").from(inputBlob).to(outputBlob).execute();
```

#### ThumbnailJob

Thumbnail Job has the following methods:

##### withDefaults(): ThumbnailJob

This method returns a new instance of ThumbnailJob with some a default output width of 720px.

```javascript
ThumbnailJob.withDefaults()
```

##### apiKey(key: string): ThumbnailJob

This method set the API Key used to validate the transcode job. To get your API key you should have an
organization created at https://stackrock.io.

returns the ThumbnailJob instance configured with the api key.

```javascript
tumbnialJob.apiKey("my_stackrock_api_key")
```

##### webhooks(hooks: Webhooks): ThumbnailJob

This method receives a [Webhooks](#webhooks) object that describe the success and failure endpoint that 
MediaMachine will call when finishing the process of the thumbnail.

Those endpoints will be called with a `POST` with and empty body.

```javascript
const wehooks = {
  successUrl: "http://your-domain.com/successUrl",
  failureUrl: "http://your-domain.com/failureUrl",
};

thunbnailJob.webhooks(wehooks);
```

returns the ThumbnailJob instance configured with the webhooks.

##### from(source: string | Blob): ThumbnailJob

This method accepts a string representing a URL to get the video from or a [Blob](#Blob) object that represent the location
of the video in S3, Azure or Google GCP.

Using a string representing the url:
```javascript
thumbnailJob.from("http://your-domain.com/path/to/source/video.mp4");
```

Using a Blob:
```javascript
import { Blob } from "@stackrock/mediamachine";

const credentials = {
  region: "us-east-1",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  type: Store.S3,
};

const inputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_input_key").credentials(credentials);

thumbnailJob.from(inputBlob);
```

returns the ThumbnailJob instance configured with the source.

#### to(destination: string |  Blob): ThumbnailJob

This method accepts a string representing a URL to put the video to or a [Blob](#Blob) object that represent the location
of the video in S3, Azure or Google GCP.

Using a string representing the url:
```javascript
thunbnailJob.to("http://your-domain.com/path/to/destination/thumbnail.jpg");
```

Using a Blob:
```javascript
import { Blob } from "@stackrock/mediamachine";

const credentials = {
  region: "us-east-1",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  type: Store.S3,
};

const inputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_input_key").credentials(credentials);

thumbnailJob.to(inputBlob);
```
returns the ThumbnailJob instance configured with the destination.

#### watermark (watermark: Watermark): ThumbnailJob

This method accepts a [Watermark](#watermark) object and configure the instance to use the watermark.

```javascript
import { Watermark, Position } from "@stackrock/mediamachine";

const watermark = Watermark.withDefaults()
                   .fontColor("red")
                   .fontSize(48)
                   .opacity(Position.BOTTOM_LEFT)
                   .text("my watermark text");

thumbnailJob.watermark(watermark);
```
#### watermarkFromText(text: String): ThumbnailJob

This method adds a text watermark to be positioned on the bottom right section with a width of 12px.

```javascript
thumbnailJob.watermarkFromText("my watermark");
```

#### width(width: number): ThumbnailJob

This method specifies the width of the output image. If you do not specify any width the default 720px will be used.

```javascript
thumbnailJob.width(1024);
```

#### execute(): Promise<Job>

This method calls mediamachine service an return a [Job](#job) object representing the status of the job. If any of the
provided attributes is bad and mediamachine services returns an error, this method will throw.

```javascript
const job = await thumbnailJob.execute();
```

### Transcode

Creates a new transcode processor job which consumes data from S3 and put the transcoded video output on S3.

```javascript
import { Blob, Store, TranscodeJob } from "mediamachinejs";

const credentials = {
  region: "us-east-1",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  type: Store.S3,
};

const inputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_input_key").credentials(credentials);

const outputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_output_blob").credentials(credentials);

const job = await TranscodeJob.withDefaults().apiKey("stackrock_api_key").from(inputBlob).to(outputBlob).execute();
```

### Summary

Creates a new summary Gif processor job which consumes data from S3 and put the summary output on S3.

```javascript
import { Blob, Store, SummaryJob, SummaryType } from "mediamachinejs";

const credentials = {
  region: "us-east-1",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  type: Store.S3,
};

const inputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_input_key").credentials(credentials);

const outputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_output_blob").credentials(credentials);

const job = await SummaryJob.withDefaults().apiKey("stackrock_api_key").from(inputBlob).to(outputBlob).type(SummaryType.GIF).execute();
```

Creates a new summary MP4 processor job which consumes data from S3 and put the summary output on S3.

```javascript
import { Blob, Store, SummaryJob, SummaryType } from "mediamachinejs";

const credentials = {
  region: "us-east-1",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  type: Store.S3,
};

const inputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_input_key").credentials(credentials);

const outputBlob = Blob.withDefaults().bucket("s3_bucket").key("s3_output_blob").credentials(credentials);

const job = await SummaryJob.withDefaults().apiKey("stackrock_api_key").from(inputBlob).to(outputBlob).type(SummaryType.MP4).execute();
```

### Job

A Job object represent a processor job, you can query at any time the state of the job with the `status()` method.

The possible states for the job are:

* `queued` (The job is waiting to be executed).
* `done` (The job has finished successfully)
* `errored` (The job failed)

To get the status you can do:

```javascript
await job.status()
```

this method returns a `JobStatus` value that can be one of:

* `JobStatus.queued`
* `JobStatus.errored`
* `JobStatus.done`

### Blob

A Blob represents a file (image or video) located in either S3, Azure or Google GCP.

to create a new instance of a Blob you first need to call the `withDefaults` method:

```javascript
import { Blob } from "@stackrock/mediamachine";

const blob = Blob.withDefaults();
```

then you need to provide the bucket and the key of the file:

```javascript
blob.bucket("my_bucket").key("my_key");
```

finally, you need to provide the credentials to access your bucket, here we accept three different type of credentials:

#### Amazon S3

for Amazon, you need to provide the `region`, `accessKeyId` and the `secretAccessKey`.

**We highly recommend creating a specific pair of accessKey/secretAccessKey with limited access**

```javascript
import { Store } from "@stackrock/mediamachine";

const credentials = {
  region: "us-east-1",
  accessKeyId: "my-access-key",
  secretAccessKey: "secret-access-key",
  type: Store.S3
};

blob.credentials(credentials);
```

additionally, you can create a blob object from scratch with the credentials configured like:

```javascript
import { Blob } from "@stackrock/mediamachine";

const blob = Blob.S3WithDefaults("my-access-key-id", "secret-access-key", "us-east-1");

//now you need to set the bucket and key
blob.bucket("my-bucket").key("my-key");

```
#### Microsoft Azure

for Microsoft Azure you need to provide the `accountName` and the `accountKey`.

```javascript
import { Store } from "@stackrock/mediamachine";

const credentials = {
  accountName: "my-account-name",
  accountKey: "my-account-key",
  type: Store.AZURE_BLOB,
};

blob.credential(credentials);
```

additionally, you can create a blob object from scratch with the credentials configured like:

```javascript
import { Blob } from "@stackrock/mediamachine";

const blob = Blob.AzureWithDefaults("my-account-name", "my-account-key");

//now you need to set the bucket and key
blob.bucket("my-bucket").key("my-key");

```
#### Google GCP

for Google GCP you need to provide a string representation of the JSON file with the credentials.

```javascript
import { Store } from "@stackrock/mediamachine";

const credentials = {
  json: JSON.stringify(jsonWithAccessInformation),
  type: Store.GOOGLE_BLOB,
};

blob.credentials(credentials);
```

additionally, you can create a blob object from scratch with the credentials configured like:

```javascript
import { Blob } from "@stackrock/mediamachine";

const blob = Blob.GCPWithDefaults(JSON.stringify(jsonConfigurationForGCP));

//now you need to set the bucket and key
blob.bucket("my-bucket").key("my-key");

```

### Watermark

The MediaMachine API supports a configuration to apply a watermark to your video or images output. Setting this up is as
easy as provide some configuration to the Watermark object.

First, you need to create an instance of the Watermark object with the `withDefaults()` method:

```javascript
import { Watermark } from "@stackrock/mediamachine";

const watermark = Watermark.withDefaults();
```

then you can set the size of the output font, the color and the position of the text.

```javascript
import { Position } from "@stackrock/mediamachine";

watermark = watermark.fontColor("red"); // this is optional, if none provided white will be used.
watermark = watermark.fontSize(20); // this is optional, if none provided, 12 will be used.
watermark = watermark.position(Position.TOP_RIGHT); // this is optional, if none provided, Position.BOTTOM_LEFT will be used.
watermark = watermark.text("my awesome text");
```

### Webhooks

A webhook is a simple object that represents two urls, one for success and one for failure that will be used (if provided)
to inform if the job has finished successfully or not.

This object should follow the interface:
```typescript
interface Webhooks {
  successUrl?: string;
  failureUrl?: string;
}
```

you can set up this object like:

```javascript
const webhooks = {
  successUrl: "http://your-domain.com/path/to/inform/success",
  failureUrl: "http://your-domain.com/path/to/inform/failure",
}
```

any of those urls will be called with a `POST`.

## Contributing