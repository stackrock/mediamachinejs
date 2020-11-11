import { API, JobStatus } from "./api";

export class Job {
  reqId: string;

  constructor(reqId: string) {
    this.reqId = reqId;
  }

  async status(): Promise<JobStatus> {
    return await API.jobStatus(this.reqId);
  }
}
