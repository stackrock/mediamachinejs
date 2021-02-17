export declare type JobStatus = "notStarted" | "queued" | "errored" | "done";
export declare class API {
    static createJob(jobType: string, body: unknown): Promise<import("axios").AxiosResponse<any>>;
    static jobStatus(reqId: string): Promise<JobStatus>;
}
