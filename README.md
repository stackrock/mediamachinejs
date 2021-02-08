# Mediamachine.js

This library will let you use [Stackrock](https://stackrock.io)'s MediaMachine api to:

- Transcode a video to a different format
- Generate a thumbnail image from a video
- Generate a summary from a video in gif or mp4 format

## Installation

```
$ npm install @stackrock/mediamachine
```

## Usage

First import and create a mediamachine client: 

```javascript
import { MediaMachine } from "../src/MediaMachine";
const STACKROCK_API_KEY = "your stackrock api key here";
const mediaMachine = new MediaMachine(STACKROCK_API_KEY);
```

Each type of request (`thumbnail()`, `transcode()` and `summary()`) creates and returns a [Job](#job) object that you can use to query the state of that Job.

Input for any of the services can come from any of the following:

- URL using `fromUrl()`
- Amazon S3 using `fromS3()` 
- Google GCP using `fromGCloud()`
- Microsoft Azure buckets using `fromAzure()`

Also, each service type can store the output in any of the following:

- Amazon S3 using `toS3()`
- Google GCP using `toGCloud()`
- Microsoft Azure buckets using `toAzure()`
- URL (We `POST` to that URL when the output is ready) using `toUrl()`

Additionally, a request to any service can accept a success and failure endpoint, that will be called with the output of the process once it’s done.

### thumbnail()

The `thumbnail()` method uses a smart algorithm to automatically choose the best frame of a video, and additionally allows you to scale and watermark it.

This method takes a single argument of the following optional inputs:

  * `width` : number representing the desired width of the thumbnail (default: 720 px).
  * `watermark` : a [Watermark](#Watermarking) object to use for the image's watermark.
  * `successUrl` : a url for StackRock to POST to when the thumbnail has been created.
  * `failureUrl` : a url for StackRock to POST to when the thumbnail has been created.

The simplest version might be:

```javascript
    const job = await mediaMachine.thumbnail()
      .fromUrl("https://myserver.example/someVideo.mp4")
      .toUrl("https://myserver.example/api/uploadFile");
```

Here's an example usage that takes a video from Amazon S3 and puts a thumbnail back to Amazon S3.  

```javascript
    const job = await mediaMachine.thumbnail({
      width: 150,
      watermarkText: "media machine!",
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, INPUT_KEY)
    .toS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Azure and puts a thumbnail back to Azure with a full [watermark](#watermark()) configuration:  

```javascript
    const watermark = mediaMachine.watermark({
      text: "media machine!!!",
      fontSize: 14,
      fontColor: "#ffffff",
      opacity: 0.9,
      position: "bottomRight",
    });

    const job = await mediaMachine.thumbnail({
      watermark: watermark,
    })
    .fromAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, INPUT_KEY)
    .toAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, OUTPUT_KEY);
```


### transcode()

The `transcode()` method transcodes SD/HD/FHD videos from virtually any format to Mp4 or Webm.

This method takes a single argument of the following optional inputs:

  * `height` : number representing the desired height of the video output.
  * `width` : number representing the desired width of the video output.
  * `watermark` : a [Watermark](#Watermarking) object to use for the image's watermark.
  * `encoder` : "h264", "h265", or "vp8"
  * `bitrateKbps` : "8000", "4000", or "1000"
  * `container` : "mp4", "webm"
  * `successUrl` : a url for StackRock to POST to when the thumbnail has been created.
  * `failureUrl` : a url for StackRock to POST to when the thumbnail has been created.

The simplest version might be:

```javascript
    const job = await mediaMachine.transcode()
      .fromUrl("https://myserver.example/someVideo.avi")
      .toUrl("https://myserver.example/api/uploadFile");
```

Here's an example usage that takes a video from Azure and puts a webm version of it back to Azure.  

```javascript
    const job = await mediaMachine.thumbnail({
      width: 150,
      height: 150,
      watermarkText: "media machine!",
      encoder: "vp8",
      bitrateKbps: "8000",
      container: "webm",
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, INPUT_KEY)
    .toAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Google Cloud and puts a thumbnail back to Google Cloud with a full watermark configuration:  

```javascript
    const watermark = mediaMachine.watermark({
      text: "media machine!!!",
      fontSize: 14,
      fontColor: "#ffffff",
      opacity: 0.9,
      position: "bottomRight",
    });

    const job = await mediaMachine.thumbnail({
      watermark: watermark,
    })
    .fromGCloud(GCLOUD_CREDS, BUCKET, INPUT_KEY)
    .toGCloud(GCLOUD_CREDS, BUCKET, OUTPUT_KEY);
```

### summary()

The `summary()` method creates a shorter summary/preview of the input video in GIF or MP4 format.

Note: For MP4 video summary, the input video should be more than 15 seconds long.

This method takes a single argument of the following optional inputs:

  * `width` : number representing the desired width of the video output.
  * `watermark` : a [Watermark](#Watermarking) object to use for the image's watermark.
  * `format` : "mp4", "gif" -- the output format you want
  * `removeAudio` : a boolean to indicate whether to remove audio (default: false, applies only to mp4s)
  * `successUrl` : a url for StackRock to POST to when the thumbnail has been created.
  * `failureUrl` : a url for StackRock to POST to when the thumbnail has been created.

The simplest version might be:

```javascript
    const job = await mediaMachine.summary()
      .fromUrl("https://myserver.example/someVideo.mp4")
      .toUrl("https://myserver.example/api/uploadFile");
```

Here's an example usage that takes a video from Google Cloud and puts a webm version of it back to Google Cloud.  

```javascript
    const job = await mediaMachine.summary({
      width: 150,
      height: 150,
      watermarkText: "media machine!",
      encoder: "vp8",
      bitrateKbps: "8000",
      container: "webm",
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromGCloud(GCLOUD_CREDS, BUCKET, INPUT_KEY)
    .toGCloud(GCLOUD_CREDS, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Amazond S3 and puts a thumbnail back to Amazon S3 with a full watermark configuration:  

```javascript
    const watermark = mediaMachine.watermark({
      text: "media machine!!!",
      fontSize: 14,
      fontColor: "#ffffff",
      opacity: 0.9,
      position: "bottomRight",
    });

    const job = await mediaMachine.summary({
      watermark: watermark,
    })
    .fromS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, INPUT_KEY)
    .toS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, OUTPUT_KEY);
```

### Job

A Job object is what's ultimately returned from your request.  You can query the job's status at any time with the `status()` method.

The possible states for the job are:

- `notStarted` (The job has not been started at all).
- `queued` (The job is waiting to be executed).
- `done` (The job has finished successfully)
- `errored` (The job failed)

To get the status you can do:

```javascript
await job.status();
```


## Watermarking

A watermark is an image that is laid over another image or video, usually to add branding to it.

You can configure watermarking for any/all of your summary(), thumbnail(), and transcode() calls by first creating a watermark, and then supplying it in the optional arguments to `summary()`, `thumbnail()` or `transcode()` as the `watermark` parameter.

There are two types of watermarks:
* text watermarks where you supply and configure some text to be the watermark.  ( see [textWatermark()](#textWatermark()) ) 
* image watermarks where you supply and configure an image to be the watermark ( see [imageWatermark()](#imageWatermark()) ).

### textWatermark()

The textWatermark method takes a single argument of the following optional inputs:

  * `text` : the string you want to display in the watermark
  * `fontSize` : the size for the text (a number)
  * `fontColor` : the color for the text ( eg "#f0f0f0")
  * `opacity` : number between 0 and 1 representing the desired opacity of the output.  0 is full transparent and 1 is fuly opaque.
  * `position` : "topLeft", "topRight", "bottomLeft", "bottomRight" 

The most simple example is probably:

```javascript
const watermark = mediaMachine.textWatermark("media machine!!!");
```

Here's a more complex example using all the options:

```javascript
    const watermark = mediaMachine.textWatermark("media machine!!!", {
      fontSize: 14,
      fontColor: "#ffffff",
      opacity: 0.9,
      position: "bottomRight",
    });
```

### imageWatermark()

An image watermark is an image that is laid over another image or video, usually to add branding to it.

You can configure watermarking for any/all of your summary(), thumbnail(), and transcode() calls by first creating a watermark, and then supplying it in the optional arguments to `summary()`, `thumbnail()` or `transcode()` as the `watermark` parameter.


The imageWatermark method takes a single argument of the following optional inputs:

  * `url` : the url of the image to be used
  * `uploaded_image_name` : the name of the uploaded image to be used
  * `width` : number representing the desired width of the video output.
  * `height` : number representing the desired height of the video output.
  * `opacity` : number between 0 and 1 representing the desired opacity of the output.  0 is full transparent and 1 is fuly opaque.
  * `position` : "topLeft", "topRight", "bottomLeft", "bottomRight" 

*NB:* You must supply `uploaded_image_name` or `url`, but not both.

Here's a simple example using a url:

```javascript
    const watermark = mediaMachine.imageWatermark({
      url: "https://myserver.example/asdf.jpg",
    });
```

Here's another simple example using a named watermark, after you upload one to our servers:

```javascript
    const watermark = mediaMachine.imageWatermark({
      uploaded_image_name: "company_watermark",
    });
```

Here's an example with all the options: 

```javascript
    const watermark = mediaMachine.imageWatermark({
      uploaded_image_name: "company_watermark",
      position: "bottomLeft",
      height: 40,
      width: 90,
      opacity: 0.9,
    });
```