/*
 * Tracer Bullet for a transcode job.
 * We use this job internally at MediaMachine for two reasons:
 *  1) To keep the SDK in sync with API
 *  2) To Test our API is running as expected
 */
require('dotenv').config();
import { MediaMachine } from "../src";

import { sleep } from "./utils";

async function main() {
  const MEDIAMACHINE_API_KEY = process.env.MEDIAMACHINE_API_KEY;
  const BUCKET = process.env.BUCKET;
  const INPUT_KEY = process.env.INPUT_KEY;
  const OUTPUT_KEY = process.env.OUTPUT_KEY;
  const AWS_REGION = process.env.AWS_REGION;
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

  const mediaMachine = new MediaMachine(MEDIAMACHINE_API_KEY);

  try {

    const job = await mediaMachine.transcodeToMp4({
      encoder: "h264",
      height: 300,
      width: 150,
      watermark: mediaMachine.textWatermark("mediamachine.io"),
    })
    .fromS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, INPUT_KEY)
    .toS3(AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET, OUTPUT_KEY)
    let status = await job.status();

    while (status === "queued") {
      await sleep(2);
      status = await job.status();
    }

    if (status === "done") {
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
