import { JobStatus } from "./api";
export declare class Job {
    reqId: string;
    constructor(reqId: string);
    status(): Promise<JobStatus>;
}
