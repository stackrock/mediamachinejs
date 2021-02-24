<img src="https://mediamachine.io/site/img/mediamachine-logo@3x.png" width="300" alt="MediaMachine" style="background-color: white; padding: 10px 5px; border-radius: 15px" />

This library will let you use [MediaMachine](https://mediamachine.io)'s api to:

- Transcode a video to a different format
- Generate a thumbnail image from a video
- Generate a summary from a video in gif or mp4 format

[![npm version](https://badge.fury.io/js/mediamachine.svg)](https://badge.fury.io/js/mediamachine) [![install size](https://packagephobia.com/badge?p=mediamachine)](https://packagephobia.com/result?p=mediamachine) [![Build Status](https://travis-ci.com/stackrock/mediamachinejs.svg?branch=master)](https://travis-ci.com/stackrock/mediamachinejs) [![Coverage Status](https://coveralls.io/repos/github/stackrock/mediamachinejs/badge.svg?branch=master)](https://coveralls.io/github/stackrock/mediamachinejs?branch=master)

## Installation

```
$ npm install mediamachine
```

## Usage

First import and create a mediamachine client: 

```javascript
import { MediaMachine } from "mediamachine";
const MEDIAMACHINE_API_KEY = "your mediamachine api key here";
const mediaMachine = new MediaMachine(MEDIAMACHINE_API_KEY);
```

Each type of request (`thumbnail()`, `transcodeToMp4()`, `transcodeToWebm()` and `summary()`) creates and returns a [Job](#job) object that you can use to query the state of that Job.

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
  * `successUrl` : a url for MediaMachine to POST to when the thumbnail has been created.
  * `failureUrl` : a url for MediaMachine to POST to when the thumbnail could not be created.

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
      watermark: mediaMachine.textWatermark("media machine!"),
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, INPUT_KEY)
    .toS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Azure and puts a thumbnail back to Azure with a full [watermark](#watermark()) configuration:  

```javascript
    const watermark = mediaMachine.textWatermark("media machine!!!", {
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

### transcodeToMp4()

The `transcodeToMp4()` method transcodes SD/HD/FHD videos from virtually any format to Mp4.

This method takes a single argument of the following optional inputs:

  * `height` : number representing the desired height of the video output.
  * `width` : number representing the desired width of the video output.
  * `watermark` : a [Watermark](#Watermarking) object to used for the image's watermark.
  * `encoder` : "h264", "h265", "vp8", "vp9" (default: "h264")
  * `successUrl` : a url for MediaMachine to POST to when the thumbnail has been created.
  * `failureUrl` : a url for MediaMachine to POST to when the thumbnail could not be created.

The simplest version might be:

```javascript
    const job = await mediaMachine.transcodeToMp4()
      .fromUrl("https://myserver.example/someVideo.avi")
      .toUrl("https://myserver.example/api/uploadFile");
```

Here's an example usage that takes a video from Azure and puts an h265 mp4 version of it back to Azure.  

```javascript
    const job = await mediaMachine.transcodeToMp4({
      width: 150,
      height: 150,
      encoder: "h265",
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, INPUT_KEY)
    .toAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Google Cloud and puts an mp4 video back to Google Cloud with a full watermark configuration:  

```javascript
    const watermark = mediaMachine.textWatermark("media machine!!!", {
      fontSize: 14,
      fontColor: "#ffffff",
      opacity: 0.9,
      position: "bottomRight",
    });

    const job = await mediaMachine.transcodeToWebm({
      watermark: watermark,
    })
    .fromGCloud(GCLOUD_CREDS, BUCKET, INPUT_KEY)
    .toGCloud(GCLOUD_CREDS, BUCKET, OUTPUT_KEY);
```


### transcodeToWebm()

The `transcodeToWebm()` method transcodes SD/HD/FHD videos from virtually any format to Webm.

This method takes a single argument of the following optional inputs:

  * `height` : number representing the desired height of the video output.
  * `width` : number representing the desired width of the video output.
  * `watermark` : a [Watermark](#Watermarking) object to used for the image's watermark.
  * `encoder` : "vp8", "vp9" (default: "vp8")
  * `successUrl` : a url for MediaMachine to POST to when the thumbnail has been created.
  * `failureUrl` : a url for MediaMachine to POST to when the thumbnail could not be created.

The simplest version might be:

```javascript
    const job = await mediaMachine.transcodeToWebm()
      .fromUrl("https://myserver.example/someVideo.avi")
      .toUrl("https://myserver.example/api/uploadFile");
```

Here's an example usage that takes a video from Azure and puts a vp9 webm version of it back to Azure.  

```javascript
    const job = await mediaMachine.transcodeToWebm({
      width: 150,
      height: 150,
      encoder: "vp9",
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, INPUT_KEY)
    .toAzure(ACCOUNT_KEY, ACCOUNT_NAME, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Google Cloud and puts a webm version back to Google Cloud with a full watermark configuration:  

```javascript
    const watermark = mediaMachine.textWatermark("media machine!!!", {
      fontSize: 14,
      fontColor: "#ffffff",
      opacity: 0.9,
      position: "bottomRight",
    });

    const job = await mediaMachine.transcodeToWebm({
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
  * `format` : "mp4", "gif" -- the output format you want (default: "gif")
  * `removeAudio` : a boolean to indicate whether to remove audio (default: false, applies only to mp4s)
  * `successUrl` : a url for MediaMachine to POST to when the thumbnail has been created.
  * `failureUrl` : a url for MediaMachine to POST to when the thumbnail could not be created.

The simplest version might be:

```javascript
    const job = await mediaMachine.summary()
      .fromUrl("https://myserver.example/someVideo.mp4")
      .toUrl("https://myserver.example/api/uploadFile");
```

Here's an example usage that takes a video from Google Cloud and puts a silent summarized mp4 version of it back to Google Cloud.  

```javascript
    const job = await mediaMachine.summary({
      width: 150,
      watermark: mediaMachine.textWatermark("media machine!"),
      format: "mp4",
      removeAudio: true,
      successUrl: "https://myserver.example/api/mediamachineSuccess",
      failureUrl: "https://myserver.example/api/mediamachineFailure",
    })
    .fromGCloud(GCLOUD_CREDS, BUCKET, INPUT_KEY)
    .toGCloud(GCLOUD_CREDS, BUCKET, OUTPUT_KEY);
```

Here's an example usage that takes a video from Amazon S3 and puts a summarized gif back to Amazon S3 with a full watermark configuration:  

```javascript
    const watermark = mediaMachine.textWatermark("media machine!!!", {
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

You can configure watermarking for any/all of your summary(), thumbnail(), transcodeToMp4(), and transcodeToWebm() calls by first creating a watermark, and then supplying it in the optional arguments to `summary()`, `thumbnail()`, `transcodeToWebm()` or `transcodeToMp4()` as the `watermark` parameter.

There are two types of watermarks:
* text watermarks where you supply and configure some text to be the watermark.  ( see [textWatermark()](#textWatermark(text, [options])) ) 
* image watermarks where you supply and configure an image to be the watermark ( see [imageWatermark()](#imageWatermark()) ).

### textWatermark(text, [options])

The `textWatermark(text, [options])` method takes a string of text to use as well as an additional argument of the following optional inputs:

  * `fontSize` : the size for the text (a number, default: 12)
  * `fontColor` : the color for the text ( default: "#000000")
  * `opacity` : number between 0 and 1 representing the desired opacity of the output.  0 is full transparent and 1 is fully opaque (default: 1)
  * `position` : "topLeft", "topRight", "bottomLeft", "bottomRight" (default: "bottomRight")

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

The imageWatermark() method takes a single argument of the following optional inputs:

  * `url` : the url of the image to be used
  * `uploaded_image_name` : the name of the uploaded image to be used
  * `width` : number representing the desired width of the video output
  * `height` : number representing the desired height of the video output
  * `opacity` : number between 0 and 1 representing the desired opacity of the output.  0 is full transparent and 1 is fully opaque (default: 1)
  * `position` : "topLeft", "topRight", "bottomLeft", "bottomRight" (default: "bottomRight")

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
