/*
 * Tracer Bullet for a thumbnail job.
 * We use this job internally at StackRock for two reasons:
 *  1) To keep the SDK in sync with API
 *  2) To Test our API is running as expected
 */

import { ThumbnailJob, Blob, Store, JobStatus } from "../src/index";
import { sleep } from "./utils";

async function main() {
  const STACKROCK_API_KEY = process.env.STACKROCK_API_KEY;
  const BUCKET = process.env.BUCKET;
  const INPUT_KEY = process.env.INPUT_KEY;
  const OUTPUT_KEY = process.env.OUTPUT_KEY;
  const AWS_REGION = process.env.AWS_REGION;
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

  // Create the S3 Input File Blob.
  const inputFile = Blob.withDefaults()
    .bucket(BUCKET)
    .key(INPUT_KEY)
    .credentials({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      type: Store.S3,
    });

  // Create the S3 Output File Blob.
  const outputFile = Blob.withDefaults()
    .bucket(BUCKET)
    .key(OUTPUT_KEY)
    .credentials({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      type: Store.S3,
    });

  try {
    const job = await ThumbnailJob.withDefaults()
      .apiKey(STACKROCK_API_KEY)
      .from(inputFile)
      .to(outputFile)
      .width(150)
      .watermarkFromText("stackrock.io")
      .execute();

    let status = await job.status();

    while (status === JobStatus.queued) {
      await sleep(2);
      status = await job.status();
    }

    if (status === JobStatus.done) {
      console.log("Job finished successfully");
    } else {
      console.log("Job finished with an error");
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

(async () => {
  await main();
})();
