import axios from "axios";

const BASE_API_PATH = "https://api.stackrock.io";

const SERVICES_TO_PATH = {
  thumbnail: "/thumbnail",
  gif_summary: "/summary/gif",
  mp4_summary: "/summary/mp4",
  transcode: "/transcode",
};

export enum JobStatus {
  notStarted,
  queued,
  errored,
  done,
}

function includes(arr, elem) {
  for (const item of arr) {
    if (item === elem) {
      return true;
    }
  }

  return false;
}

export class API {
  static async createJob(jobType: string, body: unknown) {
    if (!includes(Object.keys(SERVICES_TO_PATH), jobType)) {
      return; //throw an error
    }

    const uri = `${BASE_API_PATH}${SERVICES_TO_PATH[jobType]}`;
    const res = await axios.post(uri, body);

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(`Got ${res.status} for body: ${JSON.stringify(body)}`);
    }

    return res;
  }

  static async jobStatus(reqId: string): Promise<JobStatus> {
    const uri = `${BASE_API_PATH}/job/status?reqId=${reqId}`;
    const res = await axios.get(uri);

    if (res.status === 404) {
      return JobStatus.notStarted;
    }

    if (res.status === 200) {
      if (res.data.status === "errored") {
        return JobStatus.errored;
      } else if (res.data.status === "done") {
        return JobStatus.done;
      } else if (res.data.status === "queued") {
        return JobStatus.queued;
      }
    }

    return JobStatus.notStarted;
  }
}
